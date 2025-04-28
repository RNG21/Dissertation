import React, { useState, useRef, useEffect } from 'react';

import { DroppedComponent as DroppedComponent_ } from '../types';
import componentsList from '../components.json';
import Component from './Component';
import DroppedComponent from './DroppedComponent';
import CurvedLine from './CurvedLine';
import Base from '../base/base';

interface DragDropAreaProps {
    pageName: string;
}

/** A permanent connection that keeps its endpoints stuck to the
 *  components they were drawn between.
 */
interface StickyLine {
    sourceId: string;
    targetId: string;
    sourceOffsetX: number;
    sourceOffsetY: number;
    targetOffsetX: number;
    targetOffsetY: number;
}

/** A line that is being drawn right now (mouse is still held down). */
interface TempLine {
    sourceId: string;
    sourceOffsetX: number;
    sourceOffsetY: number;
    endX: number;
    endY: number;
}

const DragDropArea: React.FC<DragDropAreaProps> = ({ pageName }) => {
    const [droppedComponents, setDroppedComponents] = useState<DroppedComponent_[]>([]);
    const [draggingId, setDraggingId] = useState<string | null>(null);
    const [selectedId, setSelectedId] = useState<string | null>(null);

    const [tempLine, setTempLine] = useState<TempLine | null>(null);
    const [lines, setLines] = useState<StickyLine[]>([]);
    const canvasRef = useRef<HTMLDivElement>(null);

    /* ---------- selection / deletion helpers ---------- */

    const selectComponent = (id: string | null) => setSelectedId(id);

    const deleteSelected = () => {
        if (selectedId === null) return;
        setDroppedComponents(prev =>
            prev.filter(comp => comp.id !== selectedId),
        );
        // remove any connections involving that component
        setLines(prev =>
            prev.filter(l => l.sourceId !== selectedId && l.targetId !== selectedId),
        );
        setSelectedId(null);
    };

    // hit Delete or Backspace to remove the selection
    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if ((e.key === 'Delete' || e.key === 'Backspace') && selectedId !== null) {
                e.preventDefault();
                deleteSelected();
            }
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [selectedId]); 

    /* --------------------  Helpers -------------------- */

    const getCanvasCoords = (e: React.MouseEvent) => {
        const rect = canvasRef.current!.getBoundingClientRect();
        return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };

    /* --------------------  Dragging helpers -------------------- */

    const startDragging = (id: string) => {
        // Don’t begin dragging while drawing a connection
        if (tempLine) return;
        setDraggingId(id);
    };

    const endDragging = () => {
        setDraggingId(null);
    };

    const dragComponent = (e: React.MouseEvent) => {
        if (draggingId === null) return;
        const { x, y } = getCanvasCoords(e);
        setDroppedComponents(prev =>
            prev.map(comp => (comp.id === draggingId ? { ...comp, x, y } : comp)),
        );
    };

    /* --------------------  Connecting helpers -------------------- */

    const startConnecting = (e: React.MouseEvent, compId: string) => {
        e.stopPropagation();
        // Do not start a connection while dragging
        if (draggingId !== null) return;

        const { x: startX, y: startY } = getCanvasCoords(e);
        const sourceComp = droppedComponents.find(c => c.id === compId);
        if (!sourceComp) return;

        setTempLine({
            sourceId: compId,
            sourceOffsetX: startX - sourceComp.x,
            sourceOffsetY: startY - sourceComp.y,
            endX: startX,
            endY: startY,
        });
    };

    const updateTempLine = (e: React.MouseEvent) => {
        if (!tempLine) return;
        const { x: endX, y: endY } = getCanvasCoords(e);
        setTempLine({ ...tempLine, endX, endY });
    };

    const endConnecting = (e: React.MouseEvent, targetId: string) => {
        if (!tempLine) return;
        e.stopPropagation();

        const { x: endX, y: endY } = getCanvasCoords(e);
        const targetComp = droppedComponents.find(c => c.id === targetId);
        if (!targetComp || lines.find(line => line.targetId === targetId)) {
            // released somewhere else – cancel connection
            setTempLine(null);
            return;
        }

        setLines(prev => [
            ...prev,
            {
                sourceId: tempLine.sourceId,
                targetId,
                sourceOffsetX: tempLine.sourceOffsetX,
                sourceOffsetY: tempLine.sourceOffsetY,
                targetOffsetX: endX - targetComp.x,
                targetOffsetY: endY - targetComp.y,
            },
        ]);

        setTempLine(null);
    };

    /* --------------------  Canvas event handlers -------------------- */

    const handleMouseMove = (e: React.MouseEvent) => {
        // They should never both run on the same mouse move
        if (draggingId !== null) {
            dragComponent(e);
        } else if (tempLine) {
            updateTempLine(e);
        }
    };

    const handleMouseUp = (e: React.MouseEvent) => {
        if (draggingId !== null) {
            endDragging();
        } else if (tempLine !== null) {
            endConnecting(e, "");
        }
    };

    /* --------------------  Drag & Drop for component palette -------------------- */

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, component: any) => {
        e.dataTransfer.setData('component', JSON.stringify(component));
    };

    const handleDrop = (e: React.DragEvent) => {
        const componentData = e.dataTransfer.getData('component');
        if (!componentData) return;
        const component = JSON.parse(componentData);
        // place component at mouse position within canvas
        const rect = (e.target as HTMLDivElement).getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        setDroppedComponents(prev => [...prev, { ...component, id: prev.length, x, y }]);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    /* --------------------  Helpers for rendering lines -------------------- */

    const renderStickyLines = () =>
        lines.map((line, idx) => {
            const source = droppedComponents.find(c => c.id === line.sourceId);
            const target = droppedComponents.find(c => c.id === line.targetId);
            if (!source || !target) return null;

            const startX = source.x + line.sourceOffsetX;
            const startY = source.y + line.sourceOffsetY;
            const endX = target.x + line.targetOffsetX;
            const endY = target.y + line.targetOffsetY;

            return <CurvedLine key={idx} line={{ startX, startY, endX, endY }} />;
        });

    /* --------------------  Sidebar / Canvas layout -------------------- */

    const sidebarContent = (<>
        <h2 className="text-lg font-bold mb-4">Components</h2>
        {componentsList.map(comp => (
            <Component key={comp.code_id} comp={comp} onDragStart={e => handleDragStart(e, comp)} />
        ))}
    </>);
    
    const mainContent = (
        <div
            ref={canvasRef}
            className="flex-1 min-h-screen p-4 rounded relative overflow-hidden"
            style={{ userSelect: 'none' }}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onMouseMove={handleMouseMove}
            onMouseUp={e => handleMouseUp(e)}
            onMouseDown={() => selectComponent(null)}
        >
            <h2 className="dark:text-white text-lg font-bold mb-4">Canvas</h2>

            {/* Render placed components */}
            {droppedComponents.map(comp => (
                <DroppedComponent
                    key={comp.id}
                    comp={comp}
                    isSelected={selectedId === comp.id}
                    selectComponent={() => selectComponent(comp.id)}
                    startDragging={() => startDragging(comp.id)}
                    startConnecting={e => startConnecting(e, comp.id)}
                    endConnecting={e => endConnecting(e, comp.id)}
                />
            ))}

            {renderStickyLines()}

            {/* Render the temporary line while connecting */}
            {tempLine && (
                <CurvedLine
                    line={{
                        startX:
                            droppedComponents.find(c => c.id === tempLine.sourceId)!.x +
                            tempLine.sourceOffsetX,
                        startY:
                            droppedComponents.find(c => c.id === tempLine.sourceId)!.y +
                            tempLine.sourceOffsetY,
                        endX: tempLine.endX,
                        endY: tempLine.endY,
                    }}
                />
            )}
        </div>
    );

    return <Base pageName={pageName} mainContent={mainContent} sidebarContent={sidebarContent} />;
};

export default DragDropArea;