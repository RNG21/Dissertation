import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Base from './base/base';

import { Module, Flow } from './types';

import modules_ from "./modules.json";
const modules: Module[] = modules_;


type ModuleCardProps = {
    flow: Flow;
};

const ModuleCard: React.FC<ModuleCardProps> = ({ flow }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate('/command_builder', { state: { flow } });
    };

    return (
        <div
        onClick={handleClick}
        className="cursor-pointer bg-[#2e2e38] hover:bg-[#3b3b47] transition-colors duration-200 text-white p-4 rounded-md w-64 h-52 flex flex-col justify-between"
        >
        <div className="text-lg font-bold mt-2">{flow.name}</div>
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
  
    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="py-10 px-6">
            <h1 className="text-2xl font-bold text-black dark:text-white mb-6">Quick Access</h1>
            <div className="flex flex-wrap gap-6">
                {flows.map((flow) => (
                    <ModuleCard key={flow.flowId} flow={flow} />
                ))}
            </div>
        </div>
    );
};

function Home() {

    const sidebarContent = modules.map(
        (module, index) => (
            <a key={index} href={module.url} className="hover:bg-[#3b3b47] transition-colors duration-200 p-2 rounded">
                {module.icon} {module.title}
            </a>
        )
    )
    return <Base 
        pageName={"Dashboard"}
        mainContent={<ModulesGrid/>}
        sidebarContent={sidebarContent}
    />;
}

export default Home;
