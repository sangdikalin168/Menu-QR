// Sidebar.tsx (Tailwind + Role Based Navigation)
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { menuItems } from '../constants/menu';
import { useAuth } from '@/hooks/useAuth';

interface MenuItem {
    label: string;
    icon?: React.ReactNode;
    path?: string;
    roles: string[];
    children?: MenuItem[];
}

const Sidebar: React.FC<{ role: string; toggle: () => void }> = ({ role, toggle }) => {
    const location = useLocation();
    const [expanded, setExpanded] = useState<string | null>(null);

    const toggleExpand = (label: string) => {
        setExpanded(prev => (prev === label ? null : label));
    };

    const isParentActive = (children: MenuItem[]): boolean =>
        children.some(child =>
            location.pathname === child.path || (child.children && isParentActive(child.children))
        );

    const { user, logout } = useAuth(); // Get logout from useAuth
    const handleMenuClick = (item: MenuItem) => {
        if (item.path === '/logout') {
            logout(); // Call logout function
        } else {
            //toggle(); // Close sidebar for other items
        }
    };


    const renderMenu = (items: MenuItem[], parentKey = '') => {
        return items.map(item => {
            if (!item.roles.includes(role)) return null;

            const key = `${parentKey}/${item.label}`;
            const isSelected = location.pathname === item.path;

            if (item.children) {
                const isOpen = expanded === item.label;
                const active = isParentActive(item.children);

                return (
                    <div key={key}>
                        <button
                            onClick={() => toggleExpand(item.label)}
                            className={`flex w-full items-center justify-between px-4 py-2 text-left hover:bg-gray-100 ${active ? 'bg-blue-100 text-blue-700' : ''
                                }`}
                        >
                            <div className="flex items-center gap-2">
                                {item.icon}
                                <span>{item.label}</span>
                            </div>
                            {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                        </button>
                        {isOpen && (
                            <div className="ml-4 border-l pl-4">
                                {renderMenu(item.children, key)}
                            </div>
                        )}
                    </div>
                );
            }

            return (
                <Link
                    key={key}
                    to={item.path!}
                    onClick={() => handleMenuClick(item)} // Handle click
                    className={`block px-4 py-2 hover:bg-gray-100 ${isSelected ? 'bg-blue-600 text-white' : ''
                        }`}
                >
                    <div className="flex items-center gap-2">
                        {item.icon}
                        <span>{item.label}</span>
                    </div>
                </Link>
            );
        });
    };

    return (
        <nav className="h-full overflow-y-auto py-4">
            <div className="px-4 text-lg font-semibold">{user?.display_name}</div>
            <div className="px-4 pb-2 text-xs text-gray-500">Role: {role}</div>
            {renderMenu(menuItems)}
        </nav>
    );
};

export default Sidebar;