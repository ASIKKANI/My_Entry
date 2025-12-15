import React from 'react';
import { format } from 'date-fns';
import { Calendar, Image as ImageIcon, MoreVertical } from 'lucide-react';
import { cn } from '../../lib/utils';

const JournalEntryCard = ({ entry, className }) => {
    return (
        <div className={cn("glass p-5 rounded-2xl group hover:bg-white/10 transition-all duration-300 border border-white/5 hover:border-white/20 cursor-pointer", className)}>
            <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>{format(new Date(entry.createdAt), 'MMM d, yyyy')}</span>
                </div>
                <button className="p-1.5 rounded-lg hover:bg-white/10 text-muted-foreground hover:text-white transition-colors opacity-0 group-hover:opacity-100">
                    <MoreVertical className="w-4 h-4" />
                </button>
            </div>

            <h3 className="text-xl font-semibold mb-2 line-clamp-1 group-hover:text-primary-foreground transition-colors">
                {entry.title || 'Untitled Entry'}
            </h3>

            <p className="text-muted-foreground line-clamp-3 mb-4 text-sm leading-relaxed">
                {entry.content}
            </p>

            {entry.media && entry.media.length > 0 && (
                <div className="flex gap-2 mt-auto pt-4 border-t border-white/5">
                    {entry.media.slice(0, 3).map((item, index) => (
                        <div key={index} className="w-12 h-12 rounded-lg overflow-hidden relative bg-surfaceHighlight">
                            {item.type === 'image' ? (
                                <img src={item.url} alt="" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <ImageIcon className="w-5 h-5 text-muted-foreground" />
                                </div>
                            )}
                        </div>
                    ))}
                    {entry.media.length > 3 && (
                        <div className="w-12 h-12 rounded-lg bg-surfaceHighlight flex items-center justify-center text-xs font-medium text-muted-foreground">
                            +{entry.media.length - 3}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default JournalEntryCard;
