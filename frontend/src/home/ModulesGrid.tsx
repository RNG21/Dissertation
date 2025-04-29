import { useState, useEffect } from 'react';
import { Flow } from '../types';
import ModuleCard from './ModuleCard';
import LoadingSpinner from './Loading';
import EmptyState from './EmptyState';

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
  
    if (loading) return <LoadingSpinner/>;
    if (error) return <div>Error: {error}</div>;
    if (flows.length == 0) {
        return <EmptyState/>;
    }
  
    return (
        <div className="flex flex-wrap gap-6">
            {flows.map((flow) => (
                <ModuleCard key={flow.flowId} flow={flow} onDelete={handleDelete} />
            ))}
        </div>
    );
};
  

export default ModulesGrid