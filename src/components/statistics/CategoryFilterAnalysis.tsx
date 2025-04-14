"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { useTransactionStore } from '@/store/transactionStore';
import { formatAmount } from '@/utils/formatters';
import { FaLayerGroup } from 'react-icons/fa6';

interface CategoryAmount {
  amount: number;
  percentage: number;
}

export const CategoryFilterAnalysis = () => {
  const transactions = useTransactionStore((state) => state.transactions);
  const [selectedType, setSelectedType] = useState<'수입' | '지출'>('지출');
  const [selectedGwan, setSelectedGwan] = useState<string>('');
  const [selectedHang, setSelectedHang] = useState<string>('');
  const [selectedMok, setSelectedMok] = useState<string>('');

  // 유형별 총액 계산
  const typeTotal = useMemo(() => {
    return transactions
      .filter(t => t.유형 === selectedType)
      .reduce((sum, t) => sum + (typeof t.금액 === 'string' ? parseInt(t.금액.replace(/,/g, '')) : t.금액), 0);
  }, [transactions, selectedType]);

  // 관 목록 및 금액 계산
  const gwanData = useMemo(() => {
    const gwanList = Array.from(new Set(
      transactions
        .filter(t => t.유형 === selectedType)
        .map(t => t.관)
    )).sort();

    const amounts: Record<string, CategoryAmount> = {};
    gwanList.forEach(gwan => {
      const gwanAmount = transactions
        .filter(t => t.유형 === selectedType && t.관 === gwan)
        .reduce((sum, t) => sum + (typeof t.금액 === 'string' ? parseInt(t.금액.replace(/,/g, '')) : t.금액), 0);
      amounts[gwan] = {
        amount: gwanAmount,
        percentage: (gwanAmount / typeTotal) * 100
      };
    });

    return { list: gwanList, amounts };
  }, [transactions, selectedType, typeTotal]);

  // 항 목록 및 금액 계산
  const hangData = useMemo(() => {
    if (!selectedGwan) return { list: [], amounts: {} };

    const hangList = Array.from(new Set(
      transactions
        .filter(t => t.유형 === selectedType && t.관 === selectedGwan)
        .map(t => t.항)
    )).sort();

    const gwanAmount = gwanData.amounts[selectedGwan].amount;
    const amounts: Record<string, CategoryAmount> = {};
    hangList.forEach(hang => {
      const hangAmount = transactions
        .filter(t => t.유형 === selectedType && t.관 === selectedGwan && t.항 === hang)
        .reduce((sum, t) => sum + (typeof t.금액 === 'string' ? parseInt(t.금액.replace(/,/g, '')) : t.금액), 0);
      amounts[hang] = {
        amount: hangAmount,
        percentage: (hangAmount / gwanAmount) * 100
      };
    });

    return { list: hangList, amounts };
  }, [transactions, selectedType, selectedGwan, gwanData.amounts]);

  // 목 목록 및 금액 계산
  const mokData = useMemo(() => {
    if (!selectedGwan || !selectedHang) return { list: [], amounts: {} };

    const mokList = Array.from(new Set(
      transactions
        .filter(t => t.유형 === selectedType && t.관 === selectedGwan && t.항 === selectedHang)
        .map(t => t.목)
    )).sort();

    const hangAmount = hangData.amounts[selectedHang].amount;
    const amounts: Record<string, CategoryAmount> = {};
    mokList.forEach(mok => {
      const mokAmount = transactions
        .filter(t => t.유형 === selectedType && t.관 === selectedGwan && t.항 === selectedHang && t.목 === mok)
        .reduce((sum, t) => sum + (typeof t.금액 === 'string' ? parseInt(t.금액.replace(/,/g, '')) : t.금액), 0);
      amounts[mok] = {
        amount: mokAmount,
        percentage: (mokAmount / hangAmount) * 100
      };
    });

    return { list: mokList, amounts };
  }, [transactions, selectedType, selectedGwan, selectedHang, hangData.amounts]);

  // 선택 변경 핸들러
  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedType(e.target.value as '수입' | '지출');
    setSelectedGwan('');
    setSelectedHang('');
    setSelectedMok('');
  };

  const handleGwanChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedGwan(e.target.value);
    setSelectedHang('');
    setSelectedMok('');
  };

  const handleHangChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedHang(e.target.value);
    setSelectedMok('');
  };

  const handleMokChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedMok(e.target.value);
  };

  // 드롭다운 공통 스타일
  const selectStyle = "w-full rounded-[10px] bg-gray-700 border-2 border-gray-400 text-white px-3 py-2 focus:outline-none focus:border-blue-500";

  return (
    <div className="bg-gray-900/50 rounded-lg p-6">
      <div className="flex items-center gap-2 mb-6">
        <FaLayerGroup className="text-blue-400 text-xl" />
        <h2 className="text-xl font-semibold text-gray-200">카테고리별 계층분석</h2>
      </div>
      <div className="space-y-4">
        {/* 유형 선택 */}
        <div>
          <select
            value={selectedType}
            onChange={handleTypeChange}
            className={selectStyle}
          >
            <option value="수입">수입</option>
            <option value="지출">지출</option>
          </select>
          {typeTotal > 0 && (
            <div className="mt-2 text-gray-300">
              {selectedType} 총액: {formatAmount(typeTotal)}원
            </div>
          )}
        </div>

        {/* 관 선택 */}
        <div>
          <select
            value={selectedGwan}
            onChange={handleGwanChange}
            className={selectStyle}
            disabled={!typeTotal}
          >
            <option value="">관 선택</option>
            {gwanData.list.map(gwan => (
              <option key={gwan} value={gwan}>{gwan}</option>
            ))}
          </select>
          {selectedGwan && gwanData.amounts[selectedGwan] && (
            <div className="mt-2">
              <div className="text-gray-300">
                {selectedGwan}: {formatAmount(gwanData.amounts[selectedGwan].amount)}원 
                ({gwanData.amounts[selectedGwan].percentage.toFixed(1)}%)
              </div>
              <div className="w-full bg-gray-600 rounded-full h-2 mt-1">
                <div
                  className="bg-blue-500 rounded-full h-2"
                  style={{ width: `${gwanData.amounts[selectedGwan].percentage}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* 항 선택 */}
        {selectedGwan && (
          <div>
            <select
              value={selectedHang}
              onChange={handleHangChange}
              className={selectStyle}
            >
              <option value="">항 선택</option>
              {hangData.list.map(hang => (
                <option key={hang} value={hang}>{hang}</option>
              ))}
            </select>
            {selectedHang && hangData.amounts[selectedHang] && (
              <div className="mt-2">
                <div className="text-gray-300">
                  {selectedHang}: {formatAmount(hangData.amounts[selectedHang].amount)}원 
                  ({hangData.amounts[selectedHang].percentage.toFixed(1)}%)
                </div>
                <div className="w-full bg-gray-600 rounded-full h-2 mt-1">
                  <div
                    className="bg-blue-500 rounded-full h-2"
                    style={{ width: `${hangData.amounts[selectedHang].percentage}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* 목 선택 */}
        {selectedHang && (
          <div>
            <select
              value={selectedMok}
              onChange={handleMokChange}
              className={selectStyle}
            >
              <option value="">목 선택</option>
              {mokData.list.map(mok => (
                <option key={mok} value={mok}>{mok}</option>
              ))}
            </select>
            {selectedMok && mokData.amounts[selectedMok] && (
              <div className="mt-2">
                <div className="text-gray-300">
                  {selectedMok}: {formatAmount(mokData.amounts[selectedMok].amount)}원 
                  ({mokData.amounts[selectedMok].percentage.toFixed(1)}%)
                </div>
                <div className="w-full bg-gray-600 rounded-full h-2 mt-1">
                  <div
                    className="bg-blue-500 rounded-full h-2"
                    style={{ width: `${mokData.amounts[selectedMok].percentage}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}; 