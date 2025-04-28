import inspect
import json
import pathlib
import re
from types import NoneType
from typing import Any, Dict, List


# ------------------------ Decorator -------------------------

def block(label: str | None = None):
    """Mark a function as a *block* and optionally override the label shown in
    the visual editor."""

    def _wrap(fn):
        fn.__block_label__ = label or fn.__name__
        return fn

    return _wrap


# ----------------- Python to TypeScript mapping ---------------

def _py_type_to_ts(t: Any, *, is_return: bool = False) -> str:
    """Translate a Python type object to the corresponding TypeScript type.

    ``None`` becomes ``null`` (or ``void`` when in return position).
    Primitive built-ins map to their obvious counterparts; everything else
    falls back to ``any``.
    """

    if t in (None, NoneType):
        return "void" if is_return else "null"

    basic = {
        int: "number",
        float: "number",
        str: "string",
        bool: "boolean",
    }
    return basic.get(t, "any")


# ---------------  Docstring helpers -------------------------

_PARAM_RE = re.compile(r":param\s+(?P<name>\w+)\s*:\s*(?P<desc>.+)")
_RETURN_RE = re.compile(r":return\s*:\s*(?P<desc>.+)")


def _parse_docstring(doc: str) -> Dict[str, Any]:
    """Parse docstring to extract argument descriptions and return description."""

    arg_descs: Dict[str, str] = {}
    return_desc = ""

    for line in doc.splitlines():
        line = line.strip()
        param_match = _PARAM_RE.match(line)
        if param_match:
            arg_descs[param_match["name"]] = param_match["desc"].strip()
            continue

        return_match = _RETURN_RE.match(line)
        if return_match:
            return_desc = return_match["desc"].strip()

    return {"args": arg_descs, "return": return_desc}


# ---------------  Introspection -> schema -------------------

def build_components_json(module) -> List[Dict[str, Any]]:
    """Introspect *module* and build the list consumed by the React UI."""

    comps: List[Dict[str, Any]] = []

    for name, fn in inspect.getmembers(module, inspect.isfunction):
        if not hasattr(fn, "__block_label__"):
            continue  # skip helpers / non-blocks

        spec = inspect.getfullargspec(fn)
        doc = inspect.getdoc(fn) or ""
        parsed_doc = _parse_docstring(doc)

        # Build a *arg -> default* mapping -------------------------------------------------
        defaults: Dict[str, Any] = {}
        if spec.defaults:
            for arg_name, default in zip(spec.args[-len(spec.defaults) :], spec.defaults):
                defaults[arg_name] = default

        # Inputs ---------------------------------------------------------------------------
        inputs = [
            {
                "name": arg,
                "type": _py_type_to_ts(spec.annotations.get(arg, str)),
                "desc": parsed_doc["args"].get(arg, ""),
                **({"default": defaults[arg]} if arg in defaults else {}),
            }
            for arg in spec.args
        ]

        # Outputs (only a single *result* port for now) ------------------------------------
        ret_ann = spec.annotations.get("return", None)
        outputs = [{
            "name": "output",
            "type": _py_type_to_ts(ret_ann, is_return=True),
            "desc": parsed_doc["return"],
        }]

        comps.append(
            {
                "code_id": name,
                "label": getattr(fn, "__block_label__", name),
                "doc": doc.split("\n")[0],
                "inputs": inputs,
                "outputs": outputs,
            }
        )

    return comps


# ------------------------- CLI ------------------------------

if __name__ == "__main__":
    import components as blocks

    comps = build_components_json(blocks)

    outfile = pathlib.Path(__file__).with_name("components.json")
    with open(outfile, "w", encoding="utf-8") as fp:
        json.dump(comps, fp, indent=2)
    print(f"Wrote {outfile}\nGenerated {len(comps)} components.")
