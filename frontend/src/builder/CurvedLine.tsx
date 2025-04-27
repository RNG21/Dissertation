import React from "react";
import { ConnectingLine } from "../types";

interface CurvedLineProps {
    line: ConnectingLine
}

const CurvedLine: React.FC<CurvedLineProps> = ({ line }) => {
    const { startX, startY, endX, endY } = line;
    const offset = 100; // Control how far it stretches horizontally

    const pathData = `
        M ${startX} ${startY}
        C ${startX + offset} ${startY},
          ${endX - offset} ${endY},
          ${endX} ${endY}
    `;

    return (
        <svg style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none" }}>
            <path d={pathData} stroke="gray" fill="transparent" strokeWidth={2} />
        </svg>
    );
};

export default CurvedLine;
