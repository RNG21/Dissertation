import { ReactElement, useState, useRef, useEffect, ReactNode } from 'react';

import Navbar from './navbar';
import Sidebar from './sidebar';


interface BaseProps {
    pageName: string;
    mainContent: ReactNode;
    sidebarContent: ReactNode;
}

const Base = ({ pageName, mainContent: MainContent, sidebarContent: SidebarContent }: BaseProps): ReactElement => {
    const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
    const sidebarRef = useRef<HTMLDivElement>(null);

    const toggleSidebar = () => setSidebarOpen(prev => !prev);

    {/* Close sidebar when md: and clicked outside sidebar */}
    const handleClickOutside = (event: MouseEvent) => {
        if (
            sidebarRef.current &&
            !sidebarRef.current.contains(event.target as Node)
        ) {
            setSidebarOpen(false);
        }
    };
    useEffect(() => {
        if (sidebarOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [sidebarOpen]);

    return (
        <div className="min-h-screen flex flex-col bg-[#1e1e26]">
            <Navbar pageName={pageName} toggleSidebar={toggleSidebar} />

            <div className="flex flex-1 relative">
                {/* Sidebar */}
                <div ref={sidebarRef} className="z-30">
                    <Sidebar
                        sidebarOpen={sidebarOpen}
                        content={SidebarContent}
                    />
                </div>

                {/* Dim background when sidebar open */}
                <div
                    className={`fixed inset-0 bg-black transition-opacity duration-500
                        ${sidebarOpen ? 'opacity-50 z-20' : 'opacity-0 pointer-events-none'}`}
                    onClick={toggleSidebar}
                />

                {/* Main page area */}
                <div className="flex-1 bg-gray-100 dark:bg-zinc-800">
                    {MainContent}
                </div>
            </div>
        </div>
    );
}


export default Base;
