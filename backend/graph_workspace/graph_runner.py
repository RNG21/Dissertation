from __future__ import annotations

import asyncio
import importlib
import inspect
import json
from types import MappingProxyType
from typing import Any, Dict, Iterable, List, Mapping, MutableMapping, Tuple, Union

# A value in the cache is uniquely identified by *component‑id* & *port‑name*
PortKey = Tuple[str, str]  # (componentId, portName)


# ---------------------------------------------------------------------------
# Public API
# ---------------------------------------------------------------------------
async def run_graph(
    graph: Union[str, Mapping[str, Any]],
    module_name: str,
    **extra_ctx: Any,
) -> Dict[PortKey, Any]:
    """Execute *graph* and return a mapping of ``(nodeId, port) → value``.

    Parameters
    ----------
    graph:
        Either the raw ``dict`` exported by the React canvas *or* its JSON
        representation.
    module_name:
        Name of the Python module that contains the user's *block* functions.
    **extra_ctx:
        Variables that should be *implicitly* available to every block - e.g.
        the active Discord ``bot`` instance, the current ``interaction``, etc.
    """

    # --------------------  normalise input --------------------
    if isinstance(graph, str):  # JSON string → dict
        graph_dict: Mapping[str, Any] = json.loads(graph)
    else:
        graph_dict = graph  # already a mapping

    nodes: Dict[str, Mapping[str, Any]] = {n["id"]: n for n in graph_dict["nodes"]}
    edges: List[Mapping[str, Any]] = list(graph_dict["edges"])
    consts: Mapping[str, Any] = graph_dict.get("constants", {})

    # Cache starts pre‑filled with constants ("component.port" → value)
    cache: Dict[PortKey, Any] = {
        tuple(k.split(".", 1)): v for k, v in consts.items()
    }

    # --------------------  edge helpers -----------------------
    def _src(e: Mapping[str, Any]) -> str:  # type: ignore[override]
        return e.get("sourceId") or e.get("sourceComponentId")  # type: ignore[index]

    def _tgt(e: Mapping[str, Any]) -> str:  # type: ignore[override]
        return e.get("targetId") or e.get("targetComponentId")  # type: ignore[index]

    # ------------------------------------------------------------------
    # Build adjacency lists for a *Kahn* topological sort
    # ------------------------------------------------------------------
    incoming: Dict[str, int] = {nid: 0 for nid in nodes}
    adj: Dict[str, List[str]] = {nid: [] for nid in nodes}

    for e in edges:
        s, t = _src(e), _tgt(e)
        if s not in nodes or t not in nodes:
            continue  # ignore dangling edges
        adj[s].append(t)
        incoming[t] += 1

    queue: List[str] = [nid for nid, deg in incoming.items() if deg == 0]

    # -------- import user module once ---------------------------------
    mod = importlib.import_module(module_name)

    # --------------------  node execution ------------------------------
    async def exec_node(node_id: str) -> None:
        node = nodes[node_id]
        code_id = node["code_id"]

        # *Placeholder* nodes (e.g. "__slash__") have no backing function.
        if not hasattr(mod, code_id):
            return  # nothing to execute – their outputs come from constants

        fn = getattr(mod, code_id)
        sig = inspect.signature(fn)

        # -------- build **kwargs for the call ---------------------
        kwargs: Dict[str, Any] = {}
        for port in node.get("inputs", []):
            pname: str = port["name"]
            key: PortKey = (node_id, pname)

            # 1️⃣ constant / previously‑computed value ------------------
            if key in cache:
                kwargs[pname] = cache[key]
                continue

            # 2️⃣ connected edge ---------------------------------------
            edge = next(
                (
                    e
                    for e in edges
                    if _tgt(e) == node_id and e["targetPort"] == pname
                ),
                None,
            )
            if edge is not None:
                val_key = (_src(edge), edge["sourcePort"])
                kwargs[pname] = cache[val_key]
                continue

            # 3️⃣ default specified in function signature --------------
            param = sig.parameters.get(pname)
            if param and param.default is not inspect._empty:  # type: ignore[attr-defined]
                kwargs[pname] = param.default
                continue

            # 4️⃣ total failure → explicit error -----------------------
            raise ValueError(
                f"Input port '{pname}' on node '{node['label']}' (id={node_id}) "
                "is unconnected and has no default or constant value."
            )

        # -------- inject **extra_ctx if accepted -------------------
        if any(p.kind == inspect.Parameter.VAR_KEYWORD for p in sig.parameters.values()):
            # function has a **kwargs – give it everything
            kwargs.update(extra_ctx)
        else:
            # only pass named extra vars the function explicitly wants
            for name, val in extra_ctx.items():
                if name in sig.parameters and name not in kwargs:
                    kwargs[name] = val

        # -------- call (and await if needed) ----------------------
        result = fn(**kwargs)
        if inspect.isawaitable(result):
            result = await result

        # -------- fan‑out result to cache -------------------------
        outs = node.get("outputs", [])
        if not outs:
            return  # nothing declared → nothing stored

        if len(outs) == 1:
            cache[(node_id, outs[0]["name"])] = result
        else:
            # Multiple declared outputs – expect a mapping from fn
            if not isinstance(result, Mapping):
                raise TypeError(
                    f"Block '{code_id}' declares {len(outs)} outputs but returned a "
                    f"{type(result).__name__}; expected a dict port→value."
                )
            for port_meta in outs:
                pname = port_meta["name"]
                if pname not in result:
                    raise KeyError(
                        f"Block '{code_id}' did not return a value for output port '{pname}'."
                    )
                cache[(node_id, pname)] = result[pname]

    # ------------------------------------------------------------------
    # Topological execution (Kahn)
    # ------------------------------------------------------------------
    while queue:
        nid = queue.pop(0)
        await exec_node(nid)
        for m in adj[nid]:
            incoming[m] -= 1
            if incoming[m] == 0:
                queue.append(m)

    return cache
