import { Module } from '../types';

interface SidebarProps {
    sidebarOpen: boolean;
    moduleList?: Module[];
}

function Sidebar({ sidebarOpen, moduleList }: SidebarProps) {
    return (        
        <aside className={`dark:bg-zinc-900 dark:text-white w-64 p-4 space-y-4 transition-transform duration-300 
            fixed top-0 left-0 h-full z-40 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:relative`}>
            <nav className="flex flex-col gap-2">
                {moduleList?.map((module, index) => (
                    <a key={index} href={module.url} className="hover:bg-[#3b3b47] transition-colors duration-200 p-2 rounded">
                        {module.icon} {module.title}
                    </a>
                ))}
            </nav>
        </aside>
    );
}

export default Sidebar;
