import { DroppedComponent as DroppedComponent_ } from "../types"

interface DroppedComponentProps {
    comp: DroppedComponent_;
    onMouseDown: () => void;
};

const DroppedComponent = ({ comp, onMouseDown }: DroppedComponentProps) => {
    return (
        <div
            key={`${comp.id}`}
            className="bg-white rounded shadow absolute cursor-move"
            style={{ left: comp.x, top: comp.y, transform: 'translate(-50%, -50%)' }}
            onMouseDown={onMouseDown}
        >
            <div className="relative">
                <div className="absolute left-[-8px] top-1/2 transform -translate-y-1/2 w-3 h-3 bg-gray-400 rounded-full"></div>
                <div className="absolute right-[-8px] top-1/2 transform -translate-y-1/2 w-3 h-3 bg-gray-400 rounded-full"></div>
                <div className="px-4 py-2 rounded">
                    {comp.label}
                </div>
            </div>
        </div>
    )
}

export default DroppedComponent;