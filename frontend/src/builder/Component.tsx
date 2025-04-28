import { Component as Component_ } from "../types";

interface ComponentProps {
    comp: Component_;
    onDragStart: (e: React.DragEvent<HTMLDivElement>) => void;
}

const Component = ({ comp, onDragStart }: ComponentProps) => {
    return (
        <div
            className="hover:bg-[#3b3b47] transition-colors duration-200 p-2 rounded cursor-move"
            draggable
            onDragStart={onDragStart}
        >
            {comp.label}
        </div>
    )
};

export default Component;