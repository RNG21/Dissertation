import React from "react";
import { ConnectingLine } from "../types";

interface CurvedLineProps {
    line: ConnectingLine;
    isSelected?: boolean;
    selectLine?: () => void;
}

const CurvedLine: React.FC<CurvedLineProps> = ({ line, isSelected = false, selectLine = ()=>{} }) => {
    const { startX, startY, endX, endY } = line;
    const offset = 100; // Control how far it stretches horizontally

    const pathData = `
        M ${startX} ${startY}
        C ${startX + offset} ${startY},
          ${endX - offset} ${endY},
          ${endX} ${endY}
    `;

    return (
        <svg style={{ position:'absolute', top:0, left:0, width:'100%', height:'100%', zIndex:1, pointerEvents:'none' }}>
            <path
                className="cursor-pointer"
                d={pathData}
                stroke={isSelected ? 'royalblue' : 'gray'}
                strokeWidth={isSelected ? 4 : 3}
                fill="transparent"
                pointerEvents="visibleStroke"
                onClick={(e) => { e.stopPropagation(); selectLine(); }}
            />
        </svg>
      );
};

export default CurvedLine;
