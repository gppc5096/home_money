"use client";

import React from 'react';
import { IconType } from 'react-icons';

interface PageTitleProps {
  title: string;
  description?: string;
  icon?: IconType;
  iconColor?: string;
}

const PageTitle: React.FC<PageTitleProps> = ({
  title,
  description,
  icon: Icon,
  iconColor = 'text-blue-500'
}) => {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-2">
        {Icon && <Icon className={`h-8 w-8 ${iconColor}`} />}
        <h1 className="text-2xl font-bold text-white">{title}</h1>
      </div>
      {description && (
        <p className="text-gray-400">{description}</p>
      )}
    </div>
  );
};

export default PageTitle; 