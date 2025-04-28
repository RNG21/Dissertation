import React from "react";
import { Component as Comp, DroppedComponent, ConnectingLine } from "../types";

interface DetailsSidebarProps {
  comp: DroppedComponent;
  meta: Comp;                      // entry from componentsList
  edges: ConnectingLine[];
  onClose: () => void;
}

const DetailsSidebar: React.FC<DetailsSidebarProps> = ({
  comp,
  meta,
  edges,
  onClose,
}) => {
  const getArgSource = (argName: string) => {

    const edge = edges.find(
      e => e.targetId === comp.id && e.targetPort === argName
    );
    if (edge) return `⇐ ${edge.sourceId}.${edge.sourcePort}`;
    // look for constant the canvas stored on the node itself
    // (adapt if you persist constants differently)
    //@ts-ignore
    if (comp[argName] !== undefined) return JSON.stringify(comp[argName]);
    return "— unconnected —";
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
          {meta.inputs.map(inp => (
            <li key={inp.name}>
              <p>
                <span className="font-mono">{inp.name}</span>{" "}
                <span className="text-xs text-zinc-400">({inp.type})</span>
              </p>
              {inp.desc && (
                <p className="text-xs text-zinc-400">{inp.desc}</p>
              )}
              <p className="text-green-400 text-xs">{getArgSource(inp.name)}</p>
            </li>
          ))}
        </ul>
      </section>
    </aside>
  );
};

export default DetailsSidebar;
