import { Component as Component_ } from "../types";

interface ComponentProps {
    comp: Component_;
    onDragStart: (e: React.DragEvent<HTMLDivElement>) => void;
}

const Component = ({ comp, onDragStart }: ComponentProps) => {
    return (
        <div
            className="p-2 mb-2 bg-white rounded shadow cursor-move"
            draggable
            onDragStart={onDragStart}
        >
            {comp.label}
        </div>
    )
};

export default Component;