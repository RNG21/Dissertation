import { useState } from 'react';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
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

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <header className="bg-white shadow px-4 py-3 flex items-center justify-between md:justify-end md:pl-64">
          {/* Hamburger menu */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden text-zinc-800"
          >
            ☰
          </button>
          <h1 className="text-lg font-semibold hidden md:block">Welcome</h1>
        </header>

        {/* Page content */}
        <main className="p-6 bg-zinc-100 flex-1 md:pl-64">
          <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
          <p>This is your main content area. Add anything you want here!</p>
        </main>
      </div>
    </div>
  );
}

export default App;
