import Base from './base/base';
import modules from "./modules.json";

import { Module } from './types';

const ModuleCard = ({ title, description, icon }: Module) => (
    <div className="bg-[#2e2e38] text-white p-4 rounded-md w-64 h-52 flex flex-col justify-between">
        <div className="flex items-center justify-center text-4xl">{icon}</div>
        <div className="text-lg font-bold mt-2">{title}</div>
        <div className="text-sm text-gray-300 mt-1">{description}</div>
    </div>
);

const ModulesGrid = () => {
    return (
        <div className="min-h-screen bg-[#1e1e26] py-10 px-6">
            <h1 className="text-2xl font-bold text-white mb-6">Featured &amp; Favourited</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {modules.map((module: Module, index) => (
                <div key={index} className="relative">
                    <ModuleCard {...module}/>
                </div>
                ))}
            </div>
        </div>
    );
};

function Home() {
    return <Base mainContent={ModulesGrid} />;
}

export default Home;
