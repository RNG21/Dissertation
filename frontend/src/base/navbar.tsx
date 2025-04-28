interface NavbarProps {
    pageName: string;
    toggleSidebar: () => void;
}

const Navbar = ({ pageName, toggleSidebar }: NavbarProps) => {
    return (
        <header className="bg-white dark:bg-[#1e1e26] px-4 py-3 flex items-center justify-between md:justify-end md:pl-6">
            <button
                onClick={toggleSidebar}
                className="md:hidden text-white"
            >
                ☰
            </button>
            
            <div className="flex-1 flex items-center justify-center md:justify-start">
                <h2 className="text-black dark:text-white text-2xl font-bold">{pageName}</h2>
            </div>
        </header>
    );
}


export default Navbar;
