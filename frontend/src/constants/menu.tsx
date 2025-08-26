// src/constants/menu.tsx
import {
    Home,
    BarChart3,
    UserCog,
    LogOut
} from 'lucide-react';

export const menuItems = [
    {
        label: 'Dashboard',
        icon: <Home className="h-5 w-5" />,
        path: '/',
        roles: ['ADMIN', 'HR', 'employee'],
    },
    {
        label: 'Organization',
        icon: <BarChart3 className="h-5 w-5" />,
        roles: ['ADMIN', 'HR'],
        children: [
            {
                label: 'Employees',
                icon: <UserCog className="h-5 w-5" />,
                path: '/employees',
                roles: ['ADMIN', 'HR'],
            },
            {
                label: 'Departments',
                icon: <UserCog className="h-5 w-5" />,
                path: '/departments',
                roles: ['ADMIN', 'HR'],
            },
            {
                label: 'Positions',
                icon: <UserCog className="h-5 w-5" />,
                path: '/positions',
                roles: ['ADMIN', 'HR'],
            },
        ],
    },
    {
        label: 'Leave',
        icon: <BarChart3 className="h-5 w-5" />,
        path: '/leave',
        roles: ['ADMIN', 'HR', 'employee'],
    },
    {
        label: 'Payroll',
        icon: <BarChart3 className="h-5 w-5" />,
        path: '/payroll',
        roles: ['ADMIN', 'HR'],
    },
    {
        label: 'Shifts & Schedules',
        icon: <BarChart3 className="h-5 w-5" />,
        path: '/shifts',
        roles: ['ADMIN', 'HR'],
    },
    {
        label: 'Roles & Permissions',
        icon: <UserCog className="h-5 w-5" />,
        path: '/admin/roles',
        roles: ['ADMIN'],
    },
    {
        label: 'Reports',
        icon: <BarChart3 className="h-5 w-5" />,
        roles: ['ADMIN', 'HR'],
        children: [
            {
                label: 'Attendance Report',
                icon: <BarChart3 className="h-5 w-5" />,
                path: '/attendance-report',
                roles: ['ADMIN', 'HR'],
            },
            {
                label: 'Employee Report',
                icon: <UserCog className="h-5 w-5" />,
                path: '/employee-report',
                roles: ['ADMIN', 'HR'],
            },
            {
                label: 'Payroll Report',
                icon: <BarChart3 className="h-5 w-5" />,
                path: '/payroll-report',
                roles: ['ADMIN', 'HR'],
            },
            {
                label: 'Leave Report',
                icon: <BarChart3 className="h-5 w-5" />,
                path: '/leave-report',
                roles: ['ADMIN', 'HR'],
            },
        ],
    },
    {
        label: 'Performance',
        icon: <BarChart3 className="h-5 w-5" />,
        path: '/performance',
        roles: ['ADMIN', 'HR'],
    },
    {
        label: 'Announcements',
        icon: <BarChart3 className="h-5 w-5" />,
        path: '/announcements',
        roles: ['ADMIN', 'HR', 'employee'],
    },
    {
        label: 'Benefits',
        icon: <BarChart3 className="h-5 w-5" />,
        path: '/benefits',
        roles: ['ADMIN', 'HR'],
    },
    {
        label: 'Compliance',
        icon: <BarChart3 className="h-5 w-5" />,
        path: '/compliance',
        roles: ['ADMIN', 'HR'],
    },
    {
        label: 'Recruitment',
        icon: <BarChart3 className="h-5 w-5" />,
        path: '/recruitment',
        roles: ['ADMIN', 'HR'],
    },
    {
        label: 'Assets',
        icon: <BarChart3 className="h-5 w-5" />,
        path: '/assets',
        roles: ['ADMIN', 'HR'],
    },
    {
        label: 'Organization Chart',
        icon: <BarChart3 className="h-5 w-5" />,
        path: '/org-chart',
        roles: ['ADMIN', 'HR'],
    },
    {
        label: 'Logout',
        icon: <LogOut className="h-5 w-5" />,
        path: '/logout',
        roles: ['ADMIN', 'HR', 'employee'],
    },
];