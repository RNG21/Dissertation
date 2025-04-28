import Base from './base/base';

import { Module } from './types';

import modules_ from "./modules.json";
const modules: Module[] = modules_;

const ModuleCard = ({ title, description, icon }: Module) => (
    <div className="bg-[#2e2e38] hover:bg-[#3b3b47] transition-colors duration-200 text-white p-4 rounded-md w-64 h-52 flex flex-col justify-between">
        <div className="flex items-center justify-center text-4xl">{icon}</div>
        <div className="text-lg font-bold mt-2">{title}</div>
        <div className="text-sm text-gray-300 mt-1">{description}</div>
    </div>
);

const ModulesGrid = () => {
    return (
        <div className="py-10 px-6">
            <h1 className="text-2xl font-bold text-black dark:text-white mb-6">Quick Access</h1>
            <div className="flex flex-wrap gap-6">
                {modules.map((module: Module, index) => (
                    <a href={module.url} key={index}>
                        <div className="relative cursor-pointer">
                            <ModuleCard {...module} />
                        </div>
                    </a>
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
