interface NavbarProps {
    toggleSidebar: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ toggleSidebar }) => {

    return (
        <header className="bg-white shadow px-4 py-3 flex items-center justify-between md:justify-end md:pl-64">
            {/* Hamburger menu */}
            <button
                onClick={toggleSidebar}
                className="md:hidden text-zinc-800"
            >
                ☰
            </button>
        </header>
    );
}

export default Navbar;

