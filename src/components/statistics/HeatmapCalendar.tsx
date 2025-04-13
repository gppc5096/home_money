import React from 'react';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import { useTransactionStore } from '@/store/transactionStore';
import { subDays, format, parseISO, isValid } from 'date-fns';
import { ko } from 'date-fns/locale';
import { Tooltip } from 'react-tooltip';

interface HeatmapValue {
  date: string;
  count: number;
  amount: number;
  details: {
    category: string;
    amount: number;
  }[];
}

export const HeatmapCalendar: React.FC = () => {
  const { transactions } = useTransactionStore();
  const today = new Date();
  const startDate = subDays(today, 365); // 1년치 데이터

  // 날짜별 데이터 계산
  const calculateDailyData = () => {
    const dailyData: { [key: string]: HeatmapValue } = {};
    
    transactions.forEach(transaction => {
      const date = transaction.날짜;
      if (!date || !isValid(parseISO(date))) return;
      
      const formattedDate = format(parseISO(date), 'yyyy-MM-dd');
      
      if (!dailyData[formattedDate]) {
        dailyData[formattedDate] = {
          date: formattedDate,
          count: 0,
          amount: 0,
          details: []
        };
      }
      
      dailyData[formattedDate].count += 1;
      dailyData[formattedDate].amount += transaction.금액 || 0;
      dailyData[formattedDate].details.push({
        category: transaction.관 || '미분류',
        amount: transaction.금액 || 0
      });
    });

    return Object.values(dailyData);
  };

  const values = calculateDailyData();

  // 금액 범위에 따른 색상 강도 계산
  const getColorClass = (amount: number) => {
    if (amount === 0) return 'color-empty';
    if (amount < 10000) return 'color-scale-1';
    if (amount < 50000) return 'color-scale-2';
    if (amount < 100000) return 'color-scale-3';
    if (amount < 500000) return 'color-scale-4';
    return 'color-scale-5';
  };

  // 툴크 내용 생성
  const getTooltipContent = (value: HeatmapValue) => {
    if (!value || !value.count) return '거래 없음';
    
    const date = format(parseISO(value.date), 'yyyy년 MM월 dd일', { locale: ko });
    const totalAmount = value.amount.toLocaleString();
    const transactions = value.count;
    
    return `${date}\n거래 수: ${transactions}건\n총액: ${totalAmount}원`;
  };

  return (
    <div className="space-y-4">
      <style jsx global>{`
        .react-calendar-heatmap {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }
        .react-calendar-heatmap text {
          font-size: 12px;
          fill: #9CA3AF;
        }
        .react-calendar-heatmap rect {
          rx: 2;
          ry: 2;
        }
        .react-calendar-heatmap .color-empty {
          fill: #374151;
        }
        .react-calendar-heatmap .color-scale-1 {
          fill: #3B82F6;
        }
        .react-calendar-heatmap .color-scale-2 {
          fill: #2563EB;
        }
        .react-calendar-heatmap .color-scale-3 {
          fill: #1D4ED8;
        }
        .react-calendar-heatmap .color-scale-4 {
          fill: #1E40AF;
        }
        .react-calendar-heatmap .color-scale-5 {
          fill: #1E3A8A;
        }
      `}</style>

      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-6">일별 지출 현황</h3>
        <div className="text-sm text-gray-400 mb-4">
          <div className="flex items-center justify-end gap-2">
            <span>적음</span>
            <div className="flex gap-1">
              <div className="w-3 h-3 bg-[#3B82F6] rounded-sm"></div>
              <div className="w-3 h-3 bg-[#2563EB] rounded-sm"></div>
              <div className="w-3 h-3 bg-[#1D4ED8] rounded-sm"></div>
              <div className="w-3 h-3 bg-[#1E40AF] rounded-sm"></div>
              <div className="w-3 h-3 bg-[#1E3A8A] rounded-sm"></div>
            </div>
            <span>많음</span>
          </div>
        </div>
        <div className="transform scale-y-110">
          <CalendarHeatmap
            startDate={startDate}
            endDate={today}
            values={values}
            classForValue={(value) => {
              if (!value || !value.count) {
                return 'color-empty';
              }
              return getColorClass(value.amount);
            }}
            tooltipDataAttrs={(value: any) => {
              return {
                'data-tooltip-id': 'heatmap-tooltip',
                'data-tooltip-content': getTooltipContent(value),
              };
            }}
            showWeekdayLabels={true}
            weekdayLabels={['', '월', '', '수', '', '금', '']}
            gutterSize={4}
            horizontal={true}
          />
        </div>
        <Tooltip 
          id="heatmap-tooltip" 
          style={{
            backgroundColor: '#1F2937',
            color: '#F3F4F6',
            border: '1px solid #374151',
            borderRadius: '0.5rem',
            padding: '0.5rem 0.75rem',
            fontSize: '0.875rem',
            whiteSpace: 'pre-line'
          }}
        />
      </div>
    </div>
  );
}; 