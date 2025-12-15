import React from 'react';
import { cn } from '../../lib/utils';

const Button = ({ children, className, variant = 'primary', size = 'md', ...props }) => {
    const variants = {
        primary: "bg-gradient-to-r from-primary to-primary-hover text-white shadow-lg shadow-primary/25 hover:shadow-primary/40",
        secondary: "bg-surfaceHighlight text-white hover:bg-surfaceHighlight/80 border border-white/5",
        ghost: "bg-transparent text-muted-foreground hover:text-white hover:bg-white/5",
        outline: "bg-transparent border border-white/20 text-white hover:bg-white/5",
    };

    const sizes = {
        sm: "px-3 py-1.5 text-sm",
        md: "px-5 py-2.5",
        lg: "px-6 py-3 text-lg",
        icon: "p-2.5",
    };

    return (
        <button
            className={cn(
                "inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:pointer-events-none",
                variants[variant],
                sizes[size],
                className
            )}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;
