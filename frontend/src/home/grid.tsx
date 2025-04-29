import { useState, useEffect } from 'react';
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


const ModulesGrid: React.FC = () => {
    const [flows, setFlows] = useState<Flow[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
  
    useEffect(() => {
        const fetchFlows = async () => {
            try {
                const response = await fetch('/api/flows');
                if (!response.ok) {
                    throw new Error(`Error fetching flows: ${response.statusText}`);
                }
                const data: Flow[] = await response.json();
                setFlows(data);
            } catch (err) {
                setError((err as Error).message);
            } finally {
                setLoading(false);
            }
        };
  
        fetchFlows();
    }, []);
  
    const handleDelete = async (flowId: string) => {
        if (!confirm("Are you sure you want to delete this flow?")) return;
    
        try {
            const response = await fetch('/api/flows/', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ flowId: flowId })
            });
    
            if (response.ok) {
                setFlows(prev => prev.filter(f => f.flowId !== flowId));
            } else {
                alert('Failed to delete.');
            }
        } catch (err) {
            console.error(err);
            alert('Error deleting.');
        }
    };
  
    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
  
    return (
        <div className="py-10 px-6">
            <h1 className="text-2xl font-bold text-black dark:text-white mb-6">Quick Access</h1>
            <div className="flex flex-wrap gap-6">
            {flows.map((flow) => (
                <ModuleCard key={flow.flowId} flow={flow} onDelete={handleDelete} />
            ))}
            </div>
        </div>
    );
};
  

export default ModulesGrid