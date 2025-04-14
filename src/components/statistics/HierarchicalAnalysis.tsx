import React from 'react';
import { useTransactionStore } from '@/store/transactionStore';
import { FaChartBar } from 'react-icons/fa';

interface CategoryData {
  amount: number;
  percentage: number;
  subCategories?: { [key: string]: CategoryData };
}

interface CategoryGroupProps {
  name: string;
  data: CategoryData;
  depth?: number;
}

const CategoryGroup: React.FC<CategoryGroupProps> = ({ name, data, depth = 0 }) => {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const paddingLeft = `${depth * 1.5}rem`;

  return (
    <div className="mb-4">
      <div 
        className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg cursor-pointer hover:bg-gray-700/50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
        style={{ paddingLeft: `calc(1rem + ${paddingLeft})` }}
      >
        <div className="flex items-center gap-2">
          <span className="text-gray-200">{isExpanded ? '▼' : '▶'}</span>
          <span className="font-medium text-white">{name}</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-gray-300">{data.amount.toLocaleString()}원</span>
          <span className="text-sm text-gray-400">{data.percentage.toFixed(1)}%</span>
        </div>
      </div>

      {isExpanded && data.subCategories && (
        <div className="mt-2 space-y-2">
          {Object.entries(data.subCategories).map(([subName, subData]) => (
            <div key={subName} className="pl-4">
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between p-2">
                  <span className="text-gray-300">{subName}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-gray-400">{subData.amount.toLocaleString()}원</span>
                    <span className="text-sm text-gray-500">{subData.percentage.toFixed(1)}%</span>
                  </div>
                </div>
                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-500 transition-all duration-500"
                    style={{ width: `${subData.percentage}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export const HierarchicalAnalysis: React.FC = () => {
  const { transactions } = useTransactionStore();
  
  const calculateHierarchicalData = () => {
    const totalAmount = transactions.reduce((sum, t) => sum + (t.금액 || 0), 0);
    const categories: { [key: string]: CategoryData } = {};

    transactions.forEach(transaction => {
      const mainCategory = transaction.관 || '미분류';
      const subCategory = transaction.항 || '기타';
      const amount = transaction.금액 || 0;

      if (!categories[mainCategory]) {
        categories[mainCategory] = {
          amount: 0,
          percentage: 0,
          subCategories: {}
        };
      }

      categories[mainCategory].amount += amount;
      
      if (!categories[mainCategory].subCategories![subCategory]) {
        categories[mainCategory].subCategories![subCategory] = {
          amount: 0,
          percentage: 0
        };
      }
      
      categories[mainCategory].subCategories![subCategory].amount += amount;
    });

    // Calculate percentages
    Object.values(categories).forEach(category => {
      category.percentage = (category.amount / totalAmount) * 100;
      Object.values(category.subCategories || {}).forEach(subCategory => {
        subCategory.percentage = (subCategory.amount / category.amount) * 100;
      });
    });

    return categories;
  };

  const hierarchicalData = calculateHierarchicalData();

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-500/10">
          <FaChartBar className="w-6 h-6 text-blue-400" />
        </div>
        <h3 className="text-xl font-semibold text-white">카테고리별 심층분석</h3>
      </div>
      <div className="space-y-2">
        {Object.entries(hierarchicalData).map(([category, data]) => (
          <CategoryGroup key={category} name={category} data={data} />
        ))}
      </div>
    </div>
  );
}; 