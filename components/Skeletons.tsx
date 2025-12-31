
import React from 'react';

export const JobCardSkeleton = () => (
  <div className="bg-white rounded-3xl border border-gray-100 p-8">
    <div className="flex flex-col md:flex-row gap-6">
      <div className="flex-1">
        <div className="flex gap-2 mb-5">
          <div className="skeleton h-6 w-20 rounded-full"></div>
          <div className="skeleton h-6 w-24 rounded-full"></div>
          <div className="skeleton h-6 w-32 rounded-full"></div>
        </div>
        <div className="skeleton h-8 w-3/4 mb-3 rounded-lg"></div>
        <div className="skeleton h-5 w-1/4 mb-6 rounded-lg"></div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="skeleton h-4 w-full rounded"></div>
          <div className="skeleton h-4 w-full rounded"></div>
          <div className="skeleton h-4 w-full rounded"></div>
          <div className="skeleton h-4 w-full rounded"></div>
        </div>
      </div>
      <div className="flex flex-col gap-3 shrink-0">
        <div className="skeleton h-12 w-32 rounded-2xl"></div>
        <div className="skeleton h-14 w-32 rounded-2xl"></div>
      </div>
    </div>
  </div>
);

export const CompanyCardSkeleton = () => (
  <div className="bg-white rounded-[2rem] border border-gray-100 p-8 h-full">
    <div className="skeleton w-20 h-20 rounded-2xl mb-8"></div>
    <div className="skeleton h-7 w-3/4 mb-3 rounded-lg"></div>
    <div className="skeleton h-4 w-1/2 mb-6 rounded-lg"></div>
    <div className="skeleton h-16 w-full mb-6 rounded-lg"></div>
    <div className="flex justify-between items-center pt-6 border-t border-gray-50">
      <div className="skeleton h-4 w-20 rounded"></div>
      <div className="skeleton h-8 w-8 rounded-full"></div>
    </div>
  </div>
);

export const DetailPageSkeleton = () => (
  <div className="space-y-8 animate-slide-up">
    <div className="flex justify-between items-center">
      <div className="skeleton h-6 w-32 rounded"></div>
      <div className="skeleton h-10 w-10 rounded-2xl"></div>
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
      <div className="lg:col-span-2 space-y-10">
        <div className="bg-white rounded-[2.5rem] border border-gray-100 p-10">
          <div className="flex gap-3 mb-8">
            <div className="skeleton h-8 w-24 rounded-full"></div>
            <div className="skeleton h-8 w-24 rounded-full"></div>
          </div>
          <div className="skeleton h-12 w-3/4 mb-8 rounded-xl"></div>
          <div className="grid grid-cols-2 gap-6 p-8 bg-gray-50 rounded-[2rem] mb-10">
            <div className="skeleton h-16 w-full rounded-2xl"></div>
            <div className="skeleton h-16 w-full rounded-2xl"></div>
            <div className="skeleton h-16 w-full rounded-2xl"></div>
            <div className="skeleton h-16 w-full rounded-2xl"></div>
          </div>
          <div className="space-y-6">
            <div className="skeleton h-8 w-1/3 rounded-lg"></div>
            <div className="skeleton h-4 w-full rounded"></div>
            <div className="skeleton h-4 w-full rounded"></div>
            <div className="skeleton h-4 w-2/3 rounded"></div>
          </div>
        </div>
      </div>
      <div className="lg:col-span-1">
        <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 space-y-8">
           <div className="skeleton h-4 w-1/2 mx-auto rounded"></div>
           <div className="skeleton h-28 w-28 mx-auto rounded-[2rem]"></div>
           <div className="skeleton h-8 w-3/4 mx-auto rounded-lg"></div>
           <div className="skeleton h-14 w-full rounded-2xl"></div>
           <div className="skeleton h-14 w-full rounded-2xl"></div>
        </div>
      </div>
    </div>
  </div>
);
