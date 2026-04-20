import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Plus, Trash2, Edit, Save, X } from 'lucide-react';

export default function AdminNews() {
  const [news, setNews] = useState([
    { id: 1, title: '다빈그룹, 2025 대한민국 디자인 대상 수상', date: '2026.03.15', category: 'News' },
    { id: 2, title: '스마트 시티 공공디자인 세미나 개최 안내', date: '2026.02.28', category: 'Event' },
  ]);

  return (
    <div className="pt-32 pb-24 px-4 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-3xl font-black text-gray-900">뉴스 관리자</h1>
            <p className="text-gray-500 text-sm mt-1">홈페이지에 노출되는 뉴스를 관리합니다.</p>
          </div>
          <button className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold flex items-center shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all">
            <Plus className="w-5 h-5 mr-2" /> 새 뉴스 작성
          </button>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">카테고리</th>
                <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">제목</th>
                <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">작성일</th>
                <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">관리</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {news.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-8 py-6">
                    <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded uppercase tracking-widest">
                      {item.category}
                    </span>
                  </td>
                  <td className="px-8 py-6 font-bold text-gray-900">{item.title}</td>
                  <td className="px-8 py-6 text-sm text-gray-500">{item.date}</td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end space-x-2">
                      <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                        <Edit className="w-5 h-5" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
