import React, { useState, useRef, useEffect } from "react";

import {
  DroppedComponent as DroppedComponent_,
  Component as Component_
} from "../types";
import componentsList from "./components.json" with { type: "json" };
import Component from "./Component";
import DroppedComponent from "./DroppedComponent";
import CurvedLine from "./CurvedLine";
import DetailsSidebar from "./DetailsSidebar";
import Base from "../base/base";


interface DragDropAreaProps {
  pageName: string;
}

/** A permanent connection that keeps its endpoints stuck to the
 *  components they were drawn between.
 */
interface StickyLine {
  id: string;
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

// 🗂️  The palette – imported statically so the bundler includes it in the build
const palette: Component_[] = componentsList as unknown as Component_[];

const DragDropArea: React.FC<DragDropAreaProps> = ({ pageName }) => {
  /* ---------- canvas state ---------- */
  const [droppedComponents, setDroppedComponents] = useState<DroppedComponent_[]>([]);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const [tempLine, setTempLine] = useState<TempLine | null>(null);
  const [lines, setLines] = useState<StickyLine[]>([]);
  const canvasRef = useRef<HTMLDivElement>(null);

  const [detailsId, setDetailsId] = useState<string | null>(null);


  /* ---------- selection / deletion helpers ---------- */

  const selectComponent = (id: string | null) => setSelectedId(id);

  const deleteComponent = () => {
    setDroppedComponents(prev => prev.filter(c => c.id !== selectedId));
    setLines(prev => prev.filter(l => l.sourceId !== selectedId && l.targetId !== selectedId));
  };

  const deleteLine = () => setLines(prev => prev.filter(l => l.id !== selectedId));

  const deleteSelected = () => {
    if (!selectedId) return;
    if (selectedId.startsWith("line-")) deleteLine();
    else if (selectedId.startsWith("component-")) deleteComponent();
    setSelectedId(null);
  };

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.key === "Delete" || e.key === "Backspace") && selectedId) {
        e.preventDefault();
        deleteSelected();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [selectedId]);

  /* --------------------  Helpers -------------------- */

  const getCanvasCoords = (e: React.MouseEvent) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  /* --------------------  Dragging helpers -------------------- */

  const startDragging = (id: string) => {
    if (tempLine) return; // don’t drag while drawing
    setDraggingId(id);
  };
  const endDragging = () => setDraggingId(null);

  const dragComponent = (e: React.MouseEvent) => {
    if (!draggingId) return;
    const { x, y } = getCanvasCoords(e);
    setDroppedComponents(prev => prev.map(c => (c.id === draggingId ? { ...c, x, y } : c)));
  };

  /* --------------------  Connecting helpers -------------------- */

  const startConnecting = (e: React.MouseEvent, compId: string) => {
    e.stopPropagation();
    if (draggingId) return;

    const { x: startX, y: startY } = getCanvasCoords(e);
    const source = droppedComponents.find(c => c.id === compId);
    if (!source) return;

    setTempLine({
      sourceId: compId,
      sourceOffsetX: startX - source.x,
      sourceOffsetY: startY - source.y,
      endX: startX,
      endY: startY
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
    const target = droppedComponents.find(c => c.id === targetId);
    if (!target || lines.find(l => l.targetId === targetId)) {
      setTempLine(null);
      return;
    }

    setLines(prev => [
      ...prev,
      {
        id: `line-${prev.length}`,
        sourceId: tempLine.sourceId,
        targetId: targetId,
        sourceOffsetX: tempLine.sourceOffsetX,
        sourceOffsetY: tempLine.sourceOffsetY,
        targetOffsetX: endX - target.x,
        targetOffsetY: endY - target.y
      }
    ]);

    setTempLine(null);
  };

  /* --------------------  Canvas event handlers -------------------- */

  const handleMouseMove = (e: React.MouseEvent) => {
    if (draggingId) dragComponent(e);
    else if (tempLine) updateTempLine(e);
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (draggingId) endDragging();
    else if (tempLine) endConnecting(e, "non-connection");
  };

  /* --------------------  Drag & Drop for component palette -------------------- */

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, component: Component_) => {
    e.dataTransfer.setData("component", JSON.stringify(component));
  };

  const handleDrop = (e: React.DragEvent) => {
    const raw = e.dataTransfer.getData("component");
    if (!raw) return;
    const component: Component_ = JSON.parse(raw);
    const rect = (e.target as HTMLDivElement).getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setDroppedComponents(prev => [...prev, { ...component, id: `component-${prev.length}`, x, y }]);
  };

  const handleDragOver = (e: React.DragEvent) => e.preventDefault();

  /* --------------------  Helpers for rendering lines -------------------- */

  const renderStickyLines = () =>
    lines.map(line => {
      const source = droppedComponents.find(c => c.id === line.sourceId);
      const target = droppedComponents.find(c => c.id === line.targetId);
      if (!source || !target) return null;

      const startX = source.x + line.sourceOffsetX;
      const startY = source.y + line.sourceOffsetY;
      const endX = target.x + line.targetOffsetX;
      const endY = target.y + line.targetOffsetY;

      return (
        <CurvedLine
          key={line.id}
          line={{ startX, startY, endX, endY }}
          isSelected={selectedId === line.id}
          selectLine={() => selectComponent(line.id)}
        />
      );
    });

  /* --------------------  Sidebar / Canvas layout -------------------- */

  const sidebarContent = (
    <>
      <h2 className="text-lg font-bold mb-4">Components</h2>
      {palette.map(comp => (
        <Component key={comp.code_id} comp={comp} onDragStart={e => handleDragStart(e, comp)} />
      ))}
    </>
  );

  const mainContent = (
    <div
      ref={canvasRef}
      className="flex-1 min-h-screen p-4 rounded relative overflow-hidden"
      style={{ userSelect: "none" }}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseDown={() => selectComponent(null)}
    >
      <h2 className="dark:text-white text-lg font-bold mb-4">Canvas</h2>

      {droppedComponents.map(comp => (
        <DroppedComponent
          key={comp.id}
          comp={comp}
          isSelected={selectedId === comp.id}
          selectComponent={() => selectComponent(comp.id)}
          startDragging={() => startDragging(comp.id)}
          startConnecting={e => startConnecting(e, comp.id)}
          endConnecting={e => endConnecting(e, comp.id)}
          openDetails={() => setDetailsId(comp.id)}
        />
      ))}

      {renderStickyLines()}

      {tempLine && (
        <CurvedLine
          line={{
            startX: droppedComponents.find(c => c.id === tempLine.sourceId)!.x + tempLine.sourceOffsetX,
            startY: droppedComponents.find(c => c.id === tempLine.sourceId)!.y + tempLine.sourceOffsetY,
            endX: tempLine.endX,
            endY: tempLine.endY
          }}
        />
      )}

      {detailsId && (() => {
        const node   = droppedComponents.find(c => c.id === detailsId)!;
        const schema = componentsList.find(c => c.code_id === node.code_id)!;
        return (
          <DetailsSidebar
            comp={node}
            meta={schema}
            edges={lines}
            onClose={() => setDetailsId(null)}
          />
        );
      })()}
    </div>
  );

  return <Base pageName={pageName} mainContent={mainContent} sidebarContent={sidebarContent} />;
};

export default DragDropArea;
