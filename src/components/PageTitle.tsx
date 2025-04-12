import { IconType } from 'react-icons';

interface PageTitleProps {
  title: string;
  description: string;
  icon: IconType;
  iconColor?: string;
}

export default function PageTitle({ 
  title, 
  description, 
  icon: Icon,
  iconColor = "text-blue-200"
}: PageTitleProps) {
  return (
    <div className="mb-8">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <Icon className={`h-8 w-8 ${iconColor} opacity-80`} />
          <h1 className="text-2xl font-bold text-white">{title}</h1>
        </div>
        <p className="text-gray-300">{description}</p>
      </div>
      <div className="mt-6 h-[1px] bg-purple-300/30" />
    </div>
  );
} 