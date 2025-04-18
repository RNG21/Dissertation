import React from 'react';

interface SidebarProps {
    sidebarOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ sidebarOpen }) => {
    return (
        <aside className={`bg-zinc-800 text-white w-64 p-4 space-y-4 transition-transform duration-300 
            fixed top-0 left-0 h-full z-40 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:relative`}>
            <h2 className="text-2xl font-bold mb-4">My App</h2>
            <nav className="flex flex-col gap-2">
                <a href="#" className="hover:bg-zinc-700 p-2 rounded">Dashboard</a>
                <a href="#" className="hover:bg-zinc-700 p-2 rounded">Settings</a>
                <a href="#" className="hover:bg-zinc-700 p-2 rounded">Profile</a>
                <a href="#" className="hover:bg-zinc-700 p-2 rounded">Logout</a>
            </nav>
        </aside>
    );
};

export default Sidebar;
