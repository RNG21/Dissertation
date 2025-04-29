import { useNavigate } from 'react-router-dom';
import { Flow } from '../types';

type ModuleCardProps = {
    flow: Flow;
    onDelete: (flowId: string) => void;
};

const ModuleCard: React.FC<ModuleCardProps> = ({ flow, onDelete }) => {
    const navigate = useNavigate();
  
    const handleClick = () => {
        navigate('/command_builder', { state: { flow } });
    };

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation(); // prevent triggering navigate
        onDelete(flow.flowId!);
    };
  
    return (
        <div
            onClick={handleClick}
            className="relative bg-[#2e2e38] hover:bg-[#3b3b47] transition-colors duration-200 text-white p-4 rounded-md w-64 h-52 flex flex-col justify-between"
        >
            <div className="text-lg font-bold mt-2">{flow.name}</div>
            <button
            onClick={handleDelete}
            className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white text-xs px-2 py-1 rounded cursor-pointer"
            >
            Delete
            </button>
        </div>
    );
};

export default ModuleCard;
