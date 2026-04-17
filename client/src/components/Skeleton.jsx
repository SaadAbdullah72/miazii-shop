import React from 'react';

const Skeleton = ({ className }) => {
  return (
    <div className={`animate-pulse bg-slate-200 rounded-lg ${className}`}></div>
  );
};

export const ProductSkeleton = () => {
  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-4 space-y-4">
      <Skeleton className="aspect-square w-full rounded-xl" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-3 w-1/3" />
        <div className="flex justify-between items-center pt-2">
          <Skeleton className="h-6 w-1/4" />
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
      </div>
    </div>
  );
};

export default Skeleton;
