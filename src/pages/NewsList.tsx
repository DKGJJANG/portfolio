import React from 'react';
import { motion } from 'motion/react';
import { Calendar, ChevronRight, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

const NEWS_LIST = [
  { id: 1, title: '다빈그룹, 2025 대한민국 디자인 대상 수상', date: '2026.03.15', category: 'News', desc: '다빈그룹이 공공디자인 분야의 혁신적인 성과를 인정받아 2025 대한민국 디자인 대상을 수상하였습니다.' },
  { id: 2, title: '스마트 시티 공공디자인 세미나 개최 안내', date: '2026.02.28', category: 'Event', desc: '미래 도시를 위한 스마트 시티 공공디자인의 방향성을 논의하는 세미나를 개최합니다.' },
  { id: 3, title: '신규 계열사 다빈ECO 설립 및 사업 개시', date: '2026.01.10', category: 'Notice', desc: '친환경 소재와 시공을 전문으로 하는 다빈ECO가 새롭게 출범하였습니다.' },
  { id: 4, title: '강남구청 로비 인테리어 리뉴얼 공사 완료', date: '2025.12.20', category: 'Project', desc: '강남구청 본관 로비의 인테리어 리뉴얼 프로젝트가 성공적으로 마무리되었습니다.' },
  { id: 5, title: '2026년 상반기 신입 및 경력 사원 채용 공고', date: '2025.12.01', category: 'Notice', desc: '다빈그룹과 함께 도시의 이야기를 만들어갈 인재를 찾습니다.' },
];

export default function NewsList() {
  return (
    <div className="pt-32 pb-24 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-black text-gray-900 mb-4 uppercase">NEWS&SNS</h1>
          <p className="text-gray-500">다빈그룹의 다양한 소식을 전해드립니다.</p>
        </div>

        <div className="mb-12 flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="flex space-x-2 overflow-x-auto pb-2 w-full md:w-auto">
            {['전체', 'News', 'Notice', 'Event', 'Project'].map(cat => (
              <button key={cat} className="px-4 py-1.5 rounded-full text-sm font-bold bg-gray-100 text-gray-500 whitespace-nowrap hover:bg-gray-200">
                {cat}
              </button>
            ))}
          </div>
          <div className="relative w-full md:w-64">
            <input 
              type="text" 
              placeholder="검색어를 입력하세요" 
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>
        </div>

        <div className="space-y-6">
          {NEWS_LIST.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="group bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-3">
                  <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded uppercase tracking-widest">
                    {item.category}
                  </span>
                  <span className="text-xs text-gray-400 flex items-center">
                    <Calendar className="w-3 h-3 mr-1" />
                    {item.date}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {item.title}
                </h3>
                <p className="text-gray-500 text-sm line-clamp-1">
                  {item.desc}
                </p>
              </div>
              <Link to={`/news/${item.id}`} className="flex items-center text-gray-400 group-hover:text-blue-600 transition-colors">
                <ChevronRight className="w-6 h-6" />
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 flex justify-center space-x-2">
          {[1, 2, 3].map(p => (
            <button key={p} className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm ${p === 1 ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
              {p}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
