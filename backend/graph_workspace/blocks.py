import inspect, json, pathlib
from types import NoneType

def block(label: str | None = None):
    def _wrap(fn):
        fn.__block_label__ = label or fn.__name__
        return fn
    return _wrap

def _py_type_to_ts(t, *, is_return: bool = False) -> str:
    """
    Translate a Python type object to the corresponding TypeScript type
    (`None` → `null`, except for return positions where it should become `void`).
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

def build_components_json(module) -> list[dict]:
    comps = []
    for name, fn in inspect.getmembers(module, inspect.isfunction):
        if not hasattr(fn, "__block_label__"):
            continue

        spec = inspect.getfullargspec(fn)

        inputs = [
            {
                "name": arg,
                "type": _py_type_to_ts(spec.annotations.get(arg, str)),
            }
            for arg in spec.args
        ]

        ret_ann = spec.annotations.get("return", None)
        outputs = [
            {
                "name": "result",
                "type": _py_type_to_ts(ret_ann, is_return=True),
            }
        ]

        comps.append(
            {
                "code_id": name,
                "label": getattr(fn, "__block_label__", name),
                "inputs": inputs,
                "outputs": outputs,
            }
        )
    return comps

if __name__ == "__main__":
    import components as blocks
    comps = build_components_json(blocks)
    outfile = pathlib.Path(__file__).with_name("components.json")
    outfile.write_text(json.dumps(comps, indent=2))
    print(f"Wrote {outfile}")
