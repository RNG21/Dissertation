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
  /**
   * Returns a human‑readable description of what feeds *argName*:
   *   • "⇐ component‑7.result" when connected.
   *   • The constant stored directly on the node (e.g. "42").
   *   • 𝙪𝙣𝙙𝙚𝙛𝙞𝙣𝙚𝙙 → means the socket is still free.
   */
  const getArgSource = (argName: string): string | undefined => {
    const edge = edges.find(e => e.targetId === comp.id && e.targetPort === argName);
    if (edge) return `⇐ ${edge.sourceId}.${edge.sourcePort}`;

    // constant value stored on the node itself (if you support that)
    // @ts‑ignore – we allow arbitrary extra props on DroppedComponent
    // eslint‑disable‑next‑line  @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (comp[argName] !== undefined) return JSON.stringify(comp[argName]);

    // not wired and no constant – leave undefined so the caller can render an <input>
    return undefined;
  };

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
        ×
      </button>

      <header className="px-6 py-4 border-b border-zinc-700">
        <h2 className="font-semibold text-lg">{meta.label}</h2>
        <p className="text-sm text-zinc-400">{comp.id}</p>
      </header>

      <section className="p-6 space-y-4">
        {meta.doc && (
          <p className="text-sm text-zinc-300 whitespace-pre-line">{meta.doc}</p>
        )}

        <h3 className="font-medium">Arguments</h3>
        <ul className="space-y-2">
          {meta.inputs.map(inp => {
            const src = getArgSource(inp.name);
            return (
              <li key={inp.name}>
                <p>
                  <span className="font-mono">{inp.name}</span>{" "}
                  <span className="text-xs text-zinc-400">({inp.type})</span>
                </p>
                {inp.desc && <p className="text-xs text-zinc-400">{inp.desc}</p>}
                {src ? (
                  <p className="text-green-400 text-xs">{src}</p>
                ) : (
                  <input
                    type="text"
                    className="mt-1 w-full rounded bg-zinc-700 text-xs px-2 py-1 placeholder-zinc-500 focus:outline-none"
                    placeholder={String(getDefault(inp.name))}
                    value={comp[inp.name] ?? ""}
                    onChange={(e) => updateField(inp.name, e.target.value)}
                  />
                )}
              </li>
            );
          })}
        </ul>
        {/* ----------------  Return value  ---------------- */}
        {meta.outputs?.[0] && meta.outputs[0].desc && (
          <>
            <h3 className="font-medium pt-4">Output</h3>
            <p className="text-xs text-zinc-300 whitespace-pre-line">
              {`(${meta.outputs[0].type}) ${meta.outputs[0].desc}`}
            </p>
          </>
        )}
      </section>
    </aside>
  );
};

export default DetailsSidebar;
