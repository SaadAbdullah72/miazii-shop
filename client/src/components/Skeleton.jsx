import React from 'react';

const Skeleton = ({ className, width, height, circle }) => {
    const style = {
        width: width || '100%',
        height: height || '1rem',
        borderRadius: circle ? '50%' : '0.75rem',
    };

    return (
        <div 
            className={`animate-pulse bg-slate-100 relative overflow-hidden ${className}`}
            style={style}
        >
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/50 to-transparent" />
            <style dangerouslySetInnerHTML={{ __html: `
                @keyframes shimmer {
                    100% {
                        transform: translateX(100%);
                    }
                }
            `}} />
        </div>
    );
};

export const ProductSkeleton = () => (
    <div className="bg-white border border-slate-100 rounded-3xl p-4 space-y-4">
        <Skeleton height="200px" className="rounded-2xl" />
        <Skeleton width="40%" height="10px" />
        <Skeleton width="80%" height="14px" />
        <div className="flex justify-between items-center pt-2">
            <Skeleton width="30%" height="20px" />
            <Skeleton width="40px" height="40px" circle />
        </div>
    </div>
);

export const CategorySkeleton = () => (
    <div className="flex flex-col items-center gap-2">
        <Skeleton width="64px" height="64px" circle />
        <Skeleton width="50px" height="10px" />
    </div>
);

export default Skeleton;
