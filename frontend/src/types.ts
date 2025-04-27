export interface Module {
    title: string;
    description: string;
    icon: string;
    url: string;
};

export interface Component {
    code_id: string;
    label: string
};

export interface DroppedComponent extends Component {
    id: string;
    x: number;
    y: number;
};

