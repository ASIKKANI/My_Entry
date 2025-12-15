import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Book, Image as ImageIcon, PlusCircle } from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion } from 'framer-motion';

const Sidebar = () => {
    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
        { icon: Book, label: 'Journal', path: '/entries' },
        { icon: ImageIcon, label: 'Gallery', path: '/gallery' },
    ];

    return (
        <aside className="fixed left-0 top-0 h-full w-64 glass border-r border-white/10 p-6 flex flex-col z-50">
            <div className="mb-10 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                    <Book className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
                    Journal
                </h1>
            </div>

            <nav className="flex-1 space-y-2">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            cn(
                                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group relative overflow-hidden",
                                isActive
                                    ? "bg-primary/20 text-white shadow-lg shadow-primary/10"
                                    : "text-muted-foreground hover:text-white hover:bg-white/5"
                            )
                        }
                    >
                        {({ isActive }) => (
                            <>
                                {isActive && (
                                    <motion.div
                                        layoutId="activeNav"
                                        className="absolute inset-0 bg-primary/10 rounded-xl"
                                        initial={false}
                                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    />
                                )}
                                <item.icon className={cn("w-5 h-5 relative z-10 transition-transform duration-300 group-hover:scale-110", isActive && "text-primary-foreground")} />
                                <span className="font-medium relative z-10">{item.label}</span>
                            </>
                        )}
                    </NavLink>
                ))}
            </nav>

            <div className="mt-auto pt-6 border-t border-white/10">
                <button className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-primary-hover text-white py-3 px-4 rounded-xl font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0">
                    <PlusCircle className="w-5 h-5" />
                    <span>New Entry</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
