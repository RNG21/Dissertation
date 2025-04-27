import React, { useState, useEffect } from 'react';

import { DroppedComponent as DroppedComponent_ } from '../types';
import componentsList from '../components.json';
import Component from './Component';
import DroppedComponent from './DroppedComponent';

const DragDropArea: React.FC = () => {
    const [droppedComponents, setDroppedComponents] = useState<DroppedComponent_[]>([]);
    const [draggingId, setDraggingId] = useState<string | null>(null);

    // useEffect(() => {
    //     console.log('dragid:', draggingId);
    //     console.log('droppedComponents:', droppedComponents);
    // }, [draggingId, droppedComponents]);

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
        setDroppedComponents(prev => [...prev, { ...component, id: prev.length, x, y }]);
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
        if (draggingId !== null) {
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
                    <Component key={comp.code_id} comp={comp} onDragStart={(e) => handleDragStart(e, comp)}></Component>
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
                {droppedComponents.map((comp) => (
                    <DroppedComponent comp={comp} onMouseDown={() => handleMouseDown(comp.id)}></DroppedComponent>
                ))}
            </div>
        </div>
    );
};

export default DragDropArea;
