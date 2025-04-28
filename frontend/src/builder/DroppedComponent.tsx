import React from "react";
import { DroppedComponent as DroppedComponent_ } from "../types";

interface DroppedComponentProps {
    comp: DroppedComponent_;  // Runtime instance of a component on the canvas
    isSelected: boolean;  // True if this node is selected (to show blue outline)
    selectComponent: () => void;  // Called when user clicks anywhere on the node
    startDragging: () => void;  // Start dragging the whole block
    startConnecting: (e: React.MouseEvent, port: string) => void;  // User begins a connection from an output port
    endConnecting: (e: React.MouseEvent, port: string) => void;  // User releases mouse over an input port
    openDetails: () => void;  // Open up details when double clicked
    
}

const PORT_SIZE = 10;          // diameter in px of the yellow socket
const PORT_COLOR = "#eab308";
const ROW_HEIGHT = 22;         // vertical distance between successive ports

/**
 * Visual representation of a dropped node, styled roughly like an
 * Unreal‑blueprint function node:
 *  ┌────────────────────────────┐
 *  │  Get Unit Direction […]    │ 
 *  ├─────────────┬──────────────┤
 *  │ ●  From     │  Return Val ●│
 *  │ ●  To       │              │
 *  └─────────────┴──────────────┘
 */
const DroppedComponent: React.FC<DroppedComponentProps> = ({
    comp,
    isSelected,
    selectComponent,
    startDragging,
    startConnecting,
    endConnecting,
    openDetails
}) => {
    const inputs = comp.inputs ?? [];
    const outputs = (comp.outputs ?? []).filter(p => p.type !== "void" && p.type !== "null");
    const rows = Math.max(inputs.length, outputs.length, 1);

    /**
     * Utility render helpers ---------------------------------------------------
     */
    const renderInput = (name: string, index: number) => (
        <div
        key={`in-${name}`}
        className="absolute left-[-16px] flex items-center text-xs text-white"
        style={{ top: index * ROW_HEIGHT + 4 }}
        >
        {/* socket */}
        <div
            className="rounded-full cursor-crosshair"
            style={{ width: PORT_SIZE, height: PORT_SIZE, background: PORT_COLOR }}
            onMouseUp={(e) => {
            e.stopPropagation();
            endConnecting(e, name);
            }}
            onMouseDown={(e) => e.stopPropagation()}
        />
        <span className="ml-2 select-none pointer-events-none">{name}</span>
        </div>
    );

    const renderOutput = (name: string, index: number) => (
        <div
        key={`out-${name}`}
        className="absolute right-[-16px] flex items-center text-xs text-white"
        style={{ top: index * ROW_HEIGHT + 4 }}
        >
        <span className="mr-2 select-none pointer-events-none">{name}</span>
        <div
            className="rounded-full cursor-crosshair"
            style={{ width: PORT_SIZE, height: PORT_SIZE, background: PORT_COLOR }}
            onMouseDown={(e) => {
            e.stopPropagation();
            startConnecting(e, name);
            }}
        />
        </div>
    );

    return (
        <div
        className={`absolute select-none rounded shadow cursor-move z-10 ${
            isSelected ? "ring-2 ring-blue-500" : ""
        }`}
        style={{ left: comp.x, top: comp.y, transform: "translate(-50%, -50%)" }}
        onMouseDown={startDragging}
        onClick={(e) => {
            e.stopPropagation();
            selectComponent();
            openDetails();
        }}
        >
            {/* HEADER */}
            <div className="rounded-t px-3 py-1 text-xs font-semibold text-white bg-gradient-to-r from-emerald-700 to-emerald-600">
                {comp.label}
            </div>

            {/* BODY (black background) */}
            <div
                className="relative px-4 py-2 bg-[#1e1e1e] rounded-b"
                style={{ minWidth: 160, height: rows * ROW_HEIGHT + 4 }}
            >
                {/* Draw all ports via absolute positioning */}
                {inputs.map((p, index) => renderInput(p.name, index))}
                {outputs.map((p, index) => renderOutput(p.name, index))}
            </div>
        </div>
    );
};

export default DroppedComponent;
