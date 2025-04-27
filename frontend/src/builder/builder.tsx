import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

interface DraggableComponent {
    id: string;
    label: string;
    x: number;
    y: number;
}

const componentsList = [
    { id: 'comp1', label: 'Button' },
    { id: 'comp2', label: 'Input' },
    { id: 'comp3', label: 'Text' },
];

const DragDropArea: React.FC = () => {
    const [droppedComponents, setDroppedComponents] = useState<DraggableComponent[]>([]);
    const [draggingId, setDraggingId] = useState<string | null>(null);

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, component: any) => {
        e.dataTransfer.setData('component', JSON.stringify(component));
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const componentData = e.dataTransfer.getData('component');
        const component = JSON.parse(componentData);
        const rect = (e.target as HTMLDivElement).getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        setDroppedComponents(prev => [...prev, { ...component, id: uuidv4(), x, y }]);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    const handleMouseDown = (id: string) => {
        setDraggingId(id);
    };

    const handleMouseUp = () => {
        setDraggingId(null);
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (draggingId) {
        const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        setDroppedComponents(prev =>
            prev.map(comp =>
            comp.id === draggingId ? { ...comp, x, y } : comp
            )
        );
        }
    };

    return (
        <div className="flex h-screen p-4 gap-4">
        {/* Left Sidebar */}
        <div className="w-1/4 bg-gray-100 p-4 rounded">
            <h2 className="text-lg font-bold mb-4">Components</h2>
            {componentsList.map((comp) => (
            <div
                key={comp.id}
                className="p-2 mb-2 bg-white rounded shadow cursor-pointer"
                draggable
                onDragStart={(e) => handleDragStart(e, comp)}
            >
                {comp.label}
            </div>
            ))}
        </div>

        {/* Drop Area */}
        <div
            className="flex-1 bg-blue-50 p-4 rounded relative overflow-hidden"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
        >
            <h2 className="text-lg font-bold mb-4">Canvas</h2>
            {droppedComponents.map((comp, index) => (
            <div
                key={`${comp.id}-${index}`}
                className="p-2 bg-white rounded shadow absolute cursor-move"
                style={{ left: comp.x, top: comp.y, transform: 'translate(-50%, -50%)' }}
                onMouseDown={() => handleMouseDown(comp.id)}
            >
                {comp.label}
            </div>
            ))}
        </div>
        </div>
    );
};

export default DragDropArea;
