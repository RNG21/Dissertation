import { ReactElement, ElementType, useState, useRef, useEffect } from 'react';

import Navbar from './navbar';
import Sidebar from './sidebar';

interface BaseProps {
    mainContent?: ElementType;
}

function Base({ mainContent: MainContent }: BaseProps): ReactElement {
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
        <div className="flex h-screen relative">
            <div ref={sidebarRef} className="z-20">
                <Sidebar sidebarOpen={sidebarOpen} />
            </div>


            {/* Overlay to block clicks when sidebar is open */}
            <div
                className={`fixed inset-0 bg-black z-10 transition-opacity duration-600 ${
                    sidebarOpen ? 'opacity-30' : 'opacity-0 pointer-events-none'
                }`}
                onClick={toggleSidebar}
            />

            <div className="flex-1 flex flex-col dark:bg-zinc-800 z-0">
                <Navbar toggleSidebar={toggleSidebar} />
                {MainContent && <MainContent />}
            </div>
        </div>
    );
}

export default Base;
