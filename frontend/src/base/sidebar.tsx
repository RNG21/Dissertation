interface SidebarProps {
    sidebarOpen: boolean;
    content: React.ReactNode;
}

const Sidebar = ({ sidebarOpen, content }: SidebarProps) => {
    return (        
        <aside className={`dark:bg-zinc-900 dark:text-white w-64 p-4 space-y-4 transition-transform duration-300 
            fixed top-0 left-0 h-full z-40 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:relative`}>
            <nav className="flex flex-col gap-2">
                {content}
            </nav>
        </aside>
    );
}

export default Sidebar;
