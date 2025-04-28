/* Shared type definitions for the flow‑programming canvas */

export interface Module {
    title: string;
    description: string;
    icon: string;
    url: string;
  }
  
  /** Single input/output port on a block */
  export interface Port {
    name: string;
    type: string; // "number" | "string" | "boolean" | "any" | ...
  }
  
  /** Palette entry that comes straight out of components.json */
  export interface Component {
    code_id: string;
    label: string;
    inputs: Port[];
    outputs: Port[];
  }
  
  /** Instance of a component that has been dropped on the canvas */
  export interface DroppedComponent extends Component {
    id: string;  // "component-3" etc.
    x: number;
    y: number;
  }
  
  /** Simple Bézier rendered by <CurvedLine/> – optional metadata lets us
   *  store source/target info when we need it elsewhere. */
  export interface ConnectingLine {
    startX: number;
    startY: number;
    endX: number;
    endY: number;
  
    // the following are optional so CurvedLine consumers don’t have to fill them
    sourceComponentId?: string;
    sourcePort?: string;
    targetComponentId?: string;
    targetPort?: string;
  }
  