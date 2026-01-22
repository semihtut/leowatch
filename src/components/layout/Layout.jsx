import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Menu } from 'lucide-react';
import Sidebar from './Sidebar';

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] transition-colors duration-300">
      {/* Sidebar - Desktop (fixed) */}
      <div className="hidden lg:block fixed inset-y-0 left-0 w-64 z-50">
        <div className="h-full glass-sidebar">
          <Sidebar />
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* Mobile Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 w-64 z-50 lg:hidden transform transition-transform duration-300 ease-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-full glass-sidebar">
          <Sidebar onClose={() => setSidebarOpen(false)} />
        </div>
      </div>

      {/* Main Content - offset by sidebar width on desktop */}
      <div className="lg:pl-64">
        {/* Mobile Header */}
        <header className="lg:hidden sticky top-0 z-30 glass-card rounded-none border-x-0 border-t-0">
          <div className="px-4 py-3 flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card)] rounded-lg transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
            <span className="text-lg font-semibold text-[var(--text-primary)]">Intelleo</span>
          </div>
        </header>

        {/* Page Content */}
        <main className="min-h-screen">
          <div className="p-4 md:p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
