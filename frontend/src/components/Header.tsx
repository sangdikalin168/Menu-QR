// Header.tsx (Tailwind + ShadCN Buttons + Active Highlight)
import React from 'react';
import { useAuth } from '../hooks/useAuth';

const Header: React.FC = () => {
    const { logout, user } = useAuth();

    return (
        <div className="flex items-center h-full gap-2">
            {user && (
                <button
                    className="px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700 transition"
                    onClick={logout}
                >
                    Logout
                </button>
            )}
        </div>
    );
};

export default Header;