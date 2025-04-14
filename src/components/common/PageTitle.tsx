"use client";

import React from 'react';
import { IconType } from 'react-icons';

interface PageTitleProps {
  title: string;
  description: string;
  icon: IconType;
  iconColor?: string;
  className?: string;
}

export default function PageTitle({ title, description, icon: Icon, iconColor = 'text-gray-500', className }: PageTitleProps) {
  return (
    <div className={`border-2 border-gray-400 rounded-[45px] p-6 mb-8 ${className}`}>
      <div className="flex flex-col items-center justify-center gap-3">
        <Icon className={`h-8 w-8 ${iconColor}`} />
        <h1 className="text-2xl font-bold text-gray-100 text-center">{title}</h1>
        <p className="text-gray-400 text-sm text-center">{description}</p>
      </div>
    </div>
  );
} 