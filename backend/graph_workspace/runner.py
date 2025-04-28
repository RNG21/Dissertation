# runner.py
import asyncio, importlib, inspect, json, types
from typing import Any, Dict, Tuple

PortKey = Tuple[str, str]              # (componentId, portName)

async def run_graph(graph_json: str, module_name: str, **extra_ctx) -> Dict[PortKey, Any]:
    mod = importlib.import_module(module_name)
    graph = json.loads(graph_json)
    nodes = {n["id"]: n for n in graph["nodes"]}
    edges = graph["edges"]
    consts = graph.get("constants", {})

    # Where computed values are stored
    cache: Dict[PortKey, Any] = {tuple(k.split(".", 1)): v for k, v in consts.items()}

    # Build adjacency + indegree for Kahn topo-sort
    incoming = {n["id"]: 0 for n in nodes.values()}
    adj: Dict[str, list[str]] = {n["id"]: [] for n in nodes.values()}
    for e in edges:
        adj[e["sourceComponentId"]].append(e["targetComponentId"])
        incoming[e["targetComponentId"]] += 1

    queue = [nid for nid, deg in incoming.items() if deg == 0]

    async def _exec(node_id: str):
        node = nodes[node_id]
        fn = getattr(mod, node["code_id"])
        sig = inspect.signature(fn)

        kwargs: Dict[str, Any] = {}

        for port in node["inputs"]:
            pname = port["name"]
            key = (node_id, pname)

            if key in cache:
                kwargs[pname] = cache[key]
                continue

            edge = next(
                (e for e in edges
                if e["targetComponentId"] == node_id
                and e["targetPort"] == pname),
                None,
            )
            if edge:
                val_key = (edge["sourceComponentId"], edge["sourcePort"])
                kwargs[pname] = cache[val_key]
                continue

            # ---- 3️⃣ default value? -------------------------------------
            param = sig.parameters.get(pname)
            if param and param.default is not inspect._empty:
                kwargs[pname] = param.default
                continue

            # ---- 4️⃣ still nothing → explicit error ---------------------
            raise ValueError(
                f"Input port '{pname}' on node '{node['label']}' "
                f"(componentId={node_id}) is unconnected and has no default or constant."
            )

        # ---------- inject extra_ctx only if accepted ----------
        accepts_kwargs = any(p.kind == inspect.Parameter.VAR_KEYWORD
                            for p in sig.parameters.values())

        if accepts_kwargs:
            kwargs.update(extra_ctx)
        else:
            for name in sig.parameters:
                if name in extra_ctx and name not in kwargs:
                    kwargs[name] = extra_ctx[name]

        # ---------- call & await ----------
        result = fn(**kwargs)
        if inspect.isawaitable(result):
            result = await result
        cache[(node_id, "result")] = result


    # topo-sorted execution
    while queue:
        nid = queue.pop(0)
        await _exec(nid)
        for m in adj[nid]:
            incoming[m] -= 1
            if incoming[m] == 0:
                queue.append(m)

    return cache
