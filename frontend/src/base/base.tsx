import { ReactElement, ElementType, useState } from 'react';

import Navbar from './navbar';
import Sidebar from './sidebar';

interface BaseProps {
    mainContent?: ElementType;
}

function Base({ mainContent: MainContent }: BaseProps): ReactElement {
    const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

    const toggleSidebar = () => setSidebarOpen(prev => !prev);

    return (
        <div className="flex h-screen">
            <Sidebar sidebarOpen={sidebarOpen} />

            {/* Main content */}
            <div className="flex-1 flex flex-col">
                <Navbar toggleSidebar={toggleSidebar}/>
                {MainContent && <MainContent />}
            </div>
        </div>
    );
}

export default Base;

