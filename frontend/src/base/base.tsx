import { ReactElement, ElementType, useState, useRef, useEffect } from 'react';

import Navbar from './navbar';
import Sidebar from './sidebar';
import { Module } from '../types';

import modules_ from "../modules.json";
const modules: Module[] = modules_;

interface BaseProps {
    pageName: string;
    mainContent?: ElementType;
}

const Base = ({ pageName, mainContent: MainContent }: BaseProps): ReactElement => {
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
                        content={modules?.map((module, index) => (
                            <a key={index} href={module.url} className="hover:bg-[#3b3b47] transition-colors duration-200 p-2 rounded">
                                {module.icon} {module.title}
                            </a>
                        ))}
                    />
                </div>

                {/* Dim background when sidebar open */}
                <div
                    className={`fixed inset-0 bg-black transition-opacity duration-500
                        ${sidebarOpen ? 'opacity-50 z-20' : 'opacity-0 pointer-events-none'}`}
                    onClick={toggleSidebar}
                />

                {/* Main page area */}
                <div className="flex-1 flex flex-col bg-gray-100 dark:bg-zinc-800 z-10">
                    {MainContent && <MainContent />}
                </div>
            </div>
        </div>
    );
}


export default Base;
