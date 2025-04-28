import { DroppedComponent as DroppedComponent_ } from "../types";

interface DroppedComponentProps {
    comp: DroppedComponent_;
    isSelected: boolean;
    selectComponent: () => void;
    startDragging: () => void;
    startConnecting: (e: React.MouseEvent) => void;
    endConnecting: (e: React.MouseEvent) => void;
}

const DroppedComponent = ({
    comp,
    isSelected,
    selectComponent,
    startDragging,
    startConnecting,
    endConnecting,
}: DroppedComponentProps) => {
    return (
        <div
            className={`bg-white absolute rounded shadow cursor-move transition
                        ${isSelected ? "ring-2 ring-blue-500" : ""}`}    /* blue outline when selected */
            style={{ left: comp.x, top: comp.y, transform: "translate(-50%, -50%)" }}
            onMouseDown={startDragging}
            onClick={e => { e.stopPropagation(); selectComponent(); }}    /* select on click */
        >
            {/* Connecting dots */}
            <div className="relative">
                <div
                    className="absolute left-[-8px] top-1/2 -translate-y-1/2 w-3 h-3 bg-gray-400 rounded-full cursor-crosshair"
                    onMouseUp={e => { e.stopPropagation(); endConnecting(e); }}
                    onMouseDown={e => e.stopPropagation()}
                />
                <div
                    className="absolute right-[-8px] top-1/2 -translate-y-1/2 w-3 h-3 bg-gray-400 rounded-full cursor-crosshair"
                    onMouseDown={e => { e.stopPropagation(); startConnecting(e); }}
                />
                <div className="px-4 py-2 rounded">{comp.label}</div>
            </div>
        </div>
    );
};

export default DroppedComponent;
