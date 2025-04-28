/* Shared type definitions for the flow‑programming canvas */

export interface Module {
    title: string;
    description: string;
    icon: string;
    url: string;
}
  
/** Represents a param */
export interface Port {
    name: string;
    type: string;
    desc?: string;  // param description from docstring
}

export interface Component {
    code_id: string;
    label: string;
    doc?: string;  // python docstring
    inputs: Port[];
    outputs: Port[];
}
  
  
/** Instance of a component that has been dropped on the canvas */
export interface DroppedComponent extends Component {
    id: string;  // "component-3" etc.
    x: number;
    y: number;
}
  
/** Simple Bézier rendered by <CurvedLine/> */
export interface ConnectingLine {
    startX: number;
    startY: number;
    endX: number;
    endY: number;

    sourceId?: string;
    sourcePort?: string;
    targetId?: string;
    targetPort?: string;
}

export interface SlashOption {
    name: string;       // alpha-numeric, max 32 chars (Discord rule)
    type: 'string' | 'integer' | 'boolean';   // keep it simple for now
    desc?: string;
  }
  
export interface SlashCommandNode extends DroppedComponent {
    code_id: '__slash__';          // magic discriminator
    command: string;               // “/hello”
    description: string;
    options: SlashOption[];
}


  