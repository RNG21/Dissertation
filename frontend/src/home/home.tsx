
import Base from '../base/base';

import { Module } from '../types';

import modules_ from "../modules.json";
import ModulesGrid from './grid';
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
        mainContent={<ModulesGrid/>}
        sidebarContent={sidebarContent}
    />;
}

export default Home;
