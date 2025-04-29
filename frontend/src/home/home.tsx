
import Base from '../base/base';

import { Module } from '../types';

import modules_ from "../modules.json";
import ModulesGrid from './ModulesGrid';
import TokenInput from './TokenInput';
const modules: Module[] = modules_;

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
        mainContent={
            <div className="py-10 px-6">
                <h1 className="text-2xl font-bold text-black dark:text-white mb-6">Run Bot</h1>
                <TokenInput/>
                <h1 className="text-2xl font-bold text-black dark:text-white mb-6">My Commands</h1>
                <ModulesGrid />
            </div>
        }
        sidebarContent={sidebarContent}
    />;
}

export default Home;
