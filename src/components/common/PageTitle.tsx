"use client";

import React from 'react';
import { IconType } from 'react-icons';

interface PageTitleProps {
  title: string;
  description: string;
  icon: IconType;
  iconColor?: string;
}

export default function PageTitle({ title, description, icon: Icon, iconColor = 'text-gray-500' }: PageTitleProps) {
  return (
    <div className="border-2 border-gray-600/30 rounded-[10px] p-6 text-center mb-8">
      <div className="flex flex-col items-center justify-center gap-2">
        <Icon className={`h-8 w-8 ${iconColor}`} />
        <h1 className="text-2xl font-bold text-gray-100">{title}</h1>
        <p className="text-gray-400 text-sm">{description}</p>
      </div>
    </div>
  );
} 