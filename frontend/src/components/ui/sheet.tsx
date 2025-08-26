// src/components/ui/sheet.tsx

import * as React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';

type SheetSide = 'top' | 'bottom' | 'left' | 'right';

type SheetContentProps = {
    children: React.ReactNode;
    className?: string;
    side?: SheetSide;
} & React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>;

const Sheet = DialogPrimitive.Root;
const SheetTrigger = DialogPrimitive.Trigger;

const SheetContent = React.forwardRef<
    React.ElementRef<typeof DialogPrimitive.Content>,
    SheetContentProps
>(({ children, className = '', side = 'left', ...props }, ref) => {
    return (
        <DialogPrimitive.Portal>
            <DialogPrimitive.Overlay className="fixed inset-0 z-40 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
            <DialogPrimitive.Content
                ref={ref}
                className={`fixed z-50 gap-4 p-6 shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500 flex flex-col ${getPositionClasses(
                    side
                )} ${className}`}
                {...props}
            >
                {children}
            </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
    );
});

function getPositionClasses(side: SheetSide): string {
    switch (side) {
        case 'top':
            return 'inset-x-0 top-0 h-auto border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top';
        case 'bottom':
            return 'inset-x-0 bottom-0 h-auto border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom';
        case 'left':
            return 'inset-y-0 left-0 h-full w-64 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left';
        case 'right':
        default:
            return 'inset-y-0 right-0 h-full w-64 border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right';
    }
}

SheetContent.displayName = DialogPrimitive.Content.displayName;

export { Sheet, SheetTrigger, SheetContent };