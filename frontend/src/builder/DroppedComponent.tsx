import { DroppedComponent as DroppedComponent_ } from "../types";

interface DroppedComponentProps {
    comp: DroppedComponent_;
    startDragging: () => void;
    startConnecting: (e: React.MouseEvent) => void;
    endConnecting: (e: React.MouseEvent) => void;
}

const DroppedComponent = ({ comp, startDragging, startConnecting, endConnecting }: DroppedComponentProps) => {
    return (
        <div
            key={`${comp.id}`}
            className="bg-white rounded shadow absolute cursor-move"
            style={{ left: comp.x, top: comp.y, transform: 'translate(-50%, -50%)' }}
            onMouseDown={startDragging}
        >
            {/* Connecting dots */}
            <div className="relative">
                {/* Input dot */}
                <div
                    className="absolute left-[-8px] top-1/2 transform -translate-y-1/2 w-3 h-3 bg-gray-400 rounded-full cursor-crosshair"
                    onMouseUp={e => {
                        e.stopPropagation();
                        endConnecting(e);
                    }}
                    onMouseDown={e=>e.stopPropagation()}
                />
                {/* Output dot */}
                <div
                    className="absolute right-[-8px] top-1/2 transform -translate-y-1/2 w-3 h-3 bg-gray-400 rounded-full cursor-crosshair"
                    onMouseDown={e => {
                        e.stopPropagation();
                        startConnecting(e);
                    }}
                />
                <div className="px-4 py-2 rounded">{comp.label}</div>
            </div>
        </div>
    );
};

export default DroppedComponent;