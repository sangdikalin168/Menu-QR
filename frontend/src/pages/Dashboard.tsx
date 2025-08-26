// src/pages/Home.tsx
"use client"
import React from 'react';
import { SectionCards } from '@/components/ui/section-cards';


const Dasboard: React.FC = () => {
    return (
        <div className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-2">
                <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                    <SectionCards />
                </div>
            </div>
        </div>
    );
};

export default Dasboard;