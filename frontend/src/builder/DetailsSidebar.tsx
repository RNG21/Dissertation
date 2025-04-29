import React from "react";
import { Component as Comp, DroppedComponent, ConnectingLine } from "../types";

interface DetailsSidebarProps {
  comp: DroppedComponent;
  meta: Comp;
  edges: ConnectingLine[];
  onClose: () => void;
  updateField: (field: string, value: any) => void;
}



const DetailsSidebar: React.FC<DetailsSidebarProps> = ({ comp, meta, edges, onClose, updateField }) => {
  const isSlash = comp.code_id === "__slash__";

  /** Convenience helper: fetch possible default from the meta‑schema. */
  const getDefault = (argName: string) => {
    // meta.inputs may or may not include a `default` key – treat defensively
    const entry: any | undefined = meta.inputs.find(i => i.name === argName);
    return entry?.default ?? "";
  };

  return (
    <aside className="fixed right-0 top-0 w-96 h-full bg-zinc-800 text-white shadow-xl z-50 overflow-y-auto">
      <button
        onClick={onClose}
        className="absolute right-4 top-3 text-2xl leading-none"
      >
        x
      </button>

      <header className="px-6 py-4 border-b border-zinc-700">
        <h2 className="font-semibold text-lg">{meta.label}</h2>
        <p className="text-sm text-zinc-400">{comp.id}</p>
      </header>

      <section className="p-6 space-y-4">
        {meta.doc && (
          <p className="text-sm text-zinc-300 whitespace-pre-line">{meta.doc}</p>
        )}

        {/* ---------- special UI for the slash-command startpoint ---------- */}
        {isSlash ? (
          <>
            <h3 className="font-medium">Slash Command</h3>

            {/* command & description */}
            <label className="block text-sm mt-2">Command name (without “/”)</label>
            <input
              className="w-full bg-zinc-700 px-2 py-1 mt-1"
              value={(comp as any).command}
              onChange={e => updateField("command", e.target.value)}
            />

            <label className="block text-sm mt-4">Description</label>
            <input
              className="w-full bg-zinc-700 px-2 py-1 mt-1"
              value={(comp as any).description}
              onChange={e => updateField("description", e.target.value)}
            />

            {/* option list */}
            <h3 className="font-medium mt-6">Options</h3>
            {(comp as any).options?.map((opt: any, i: number) => (
              <div key={i} className="flex gap-2 items-center mt-2">
                <input
                  className="flex-1 bg-zinc-700 px-2 py-1"
                  placeholder="name"
                  value={opt.name}
                  onChange={e => {
                    const copy = [...(comp as any).options];
                    copy[i] = { ...opt, name: e.target.value };
                    updateField("options", copy);
                  }}
                />
                <select
                  className="bg-zinc-700 px-1 py-1"
                  value={opt.type}
                  onChange={e => {
                    const copy = [...(comp as any).options];
                    copy[i] = { ...opt, type: e.target.value };
                    updateField("options", copy);
                  }}
                >
                  <option value="string">string</option>
                  <option value="integer">integer</option>
                  <option value="boolean">boolean</option>
                </select>
                <button
                  className="text-red-400"
                  onClick={() => {
                    const copy = (comp as any).options.filter((_: any, j: number) => j !== i);
                    updateField("options", copy);
                  }}
                >
                  ×
                </button>
              </div>
            ))}

            <button
              className="mt-3 text-emerald-400 text-sm"
              onClick={() =>
                updateField("options", [...((comp as any).options ?? []), { name: "", type: "string" }])
              }
            >
              + Add option
            </button>
          </>
        ) : (
          /* ---------- generic UI ---------- */
          <>
            <h3 className="font-medium">Arguments</h3>
            <ul className="space-y-2">
              {meta.inputs.map(inp => {
                return (
                  <li key={inp.name}>
                    <p>
                      <span className="font-mono">{inp.name}</span>{" "}
                      <span className="text-xs text-zinc-400">({inp.type})</span>
                    </p>
                    {inp.desc && <p className="text-xs text-zinc-400">{inp.desc}</p>}
                    {edges.some(e => e.targetId === comp.id && e.targetPort === inp.name) ? (
                      <p className="text-green-400 text-xs">
                        ⇐ {edges.find(e => e.targetId === comp.id && e.targetPort === inp.name)!.sourceId}.{edges.find(e => e.targetId === comp.id && e.targetPort === inp.name)!.sourcePort}
                      </p>
                    ) : (
                      <input
                        type="text"
                        className="mt-1 w-full rounded bg-zinc-700 text-xs px-2 py-1 placeholder-zinc-500 focus:outline-none"
                        placeholder={String(getDefault(inp.name))}
                        //@ts-ignore
                        value={comp[inp.name] ?? ""}
                        onChange={e => updateField(inp.name, e.target.value)}
                      />
                    )}
                  </li>
                );
              })}
            </ul>

            {/* output description */}
            {meta.outputs?.[0] && meta.outputs[0].desc && (
              <>
                <h3 className="font-medium pt-4">Output</h3>
                <p className="text-xs text-zinc-300 whitespace-pre-line">
                  {`(${meta.outputs[0].type}) ${meta.outputs[0].desc}`}
                </p>
              </>
            )}
          </>
        )}
      </section>
    </aside>
  );
};

export default DetailsSidebar;
