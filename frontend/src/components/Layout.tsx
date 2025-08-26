import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button'; // Assuming your button component path
import { useAuthStore } from '@/store/authStore';

const Layout: React.FC = () => {
    // State to control sidebar visibility globally.
    // Initialize to true if on desktop (lg breakpoint), false otherwise.
    const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 1024);

    // Effect to handle window resizing and update sidebar's default state
    useEffect(() => {
        const handleResize = () => {
            // Set sidebar open by default on desktop, closed on mobile when window resizes
            // This ensures consistent behavior when transitioning between views
            setIsSidebarOpen(window.innerWidth >= 1024);
        };

        // Add event listener for window resize
        window.addEventListener('resize', handleResize);

        // Clean up the event listener on component unmount
        return () => window.removeEventListener('resize', handleResize);
    }, []); // Empty dependency array means this effect runs once on mount and cleans up on unmount


    const { user } = useAuthStore();
    const role = user?.role.name || 'guest'; // Fallback to 'guest' if no role


    // This function now simply toggles the sidebar's state, regardless of screen size
    const handleDrawerToggle = () => {
        setIsSidebarOpen(prev => !prev);
    };

    return (
        <div className="flex h-screen overflow-hidden">
            {/* Sidebar Overlay for Mobile View (only visible on mobile when sidebar is open) */}
            <div
                className={`fixed inset-0 z-20 bg-black/30 transition-opacity duration-300 lg:hidden ${isSidebarOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
                    }`}
                onClick={handleDrawerToggle} // Click overlay to close sidebar
            />

            {/* Sidebar */}
            {/* The key changes are in these Tailwind classes:
                - Mobile: It remains 'fixed' and slides in/out using 'translate-x'.
                - Desktop: It becomes 'relative' (takes up space), and its width changes
                  between 200px (open) and 0px (closed), hiding overflow.
            */}
            <aside
                className={`fixed inset-y-0 left-0 z-30 min-w-[300px] bg-white border-r shadow-md transition-all duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} ${isSidebarOpen ? 'lg:w-[300px]' : 'lg:w-0 lg:overflow-hidden'} lg:flex-shrink-0`}
            >
                {/* Pass handleDrawerToggle to Sidebar so clicking links can close it on mobile */}
                <Sidebar role={role} toggle={handleDrawerToggle} />
            </aside>

            {/* Main Content Area */}
            <div
                className={`flex-1 flex flex-col w-full transition-all duration-300 ease-in-out ${isSidebarOpen ? 'lg:ml-[300px]' : 'lg:ml-0'}`}
            >
                <header className="fixed top-0 z-20 flex h-[50px] w-full items-center justify-between bg-blue-600 px-2 text-white shadow">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="inline-flex" // The toggle button is now always visible
                        onClick={handleDrawerToggle}
                    >
                        <Menu className="h-5 w-5" />
                    </Button>
                    <Header />
                </header>

                <main className="flex-1 overflow-y-auto pt-[50px]">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default Layout;