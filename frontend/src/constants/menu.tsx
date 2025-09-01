// src/constants/menu.tsx
import {
    Home,
    BarChart3,
    LogOut
} from 'lucide-react';

export const menuItems = [
    {
        label: 'Home',
        icon: <Home className="h-5 w-5" />,
        path: '/',
        roles: ['ADMIN', 'HR', 'employee'],
    },
    {
        label: 'Menu',
        icon: <BarChart3 className="h-5 w-5" />,
        path: '/menu-management',
        roles: ['ADMIN', 'HR', 'employee'],
    },
    {
        label: 'Product',
        icon: <BarChart3 className="h-5 w-5" />,
        path: '/product',
        roles: ['ADMIN', 'HR', 'employee'],
    },
    {
        label: 'Category',
        icon: <BarChart3 className="h-5 w-5" />,
        path: '/category',
        roles: ['ADMIN', 'HR', 'employee'],
    },
    {
        label: 'Logout',
        icon: <LogOut className="h-5 w-5" />,
        path: '/logout',
        roles: ['ADMIN', 'HR', 'employee'],
    },
];