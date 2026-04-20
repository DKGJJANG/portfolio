import React from 'react';
import { motion } from 'motion/react';
import { Layout, Palette, FileText, Home, Calendar } from 'lucide-react';

const AREAS = [
  {
    title: '공공디자인',
    icon: Layout,
    items: ['친환경 디자인', '도시 경관 디자인', '공공 시설물 기획'],
    image: './images/ab0m.jpg'
  },
  {
    title: '브랜딩디자인',
    icon: Palette,
    items: ['CI / BI 개발', '브랜드 가이드라인', '통합 마케팅 전략'],
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&q=80&w=1000'
  },
  {
    title: '시각디자인',
    icon: FileText,
    items: ['편집 & 인쇄 매체 제작', '그래픽 디자인', '패키지 디자인'],
    image: 'https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&q=80&w=1000'
  },
  {
    title: '인테리어',
    icon: Home,
    items: ['관공서, 학교, 공기업 인테리어', '오피스 리모델링', '공간 컨설팅 및 상업공간 디자인'],
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=1000'
  },
  {
    title: '행사기획',
    icon: Calendar,
    items: ['준·착공식, 시상식, 포럼', '전시기획, 행사 & 이벤트 기획', '기업 체육대회, 마을 축제'],
    image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=80&w=1000'
  }
];

export const BusinessAreas = () => {
  return (
    <section id="business" className="py-24 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col items-center mb-16">
          <div className="inline-block">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-[#004225] mb-4 uppercase tracking-tighter">Business Areas</h2>
            <div className="w-full h-1 bg-[#004225]" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {AREAS.map((area, idx) => (
            <motion.div
              key={area.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all flex flex-col"
            >
              <div className="h-48 overflow-hidden">
                <img 
                  src={area.image} 
                  alt={area.title} 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
              
              <div className="p-8 flex-1 flex flex-col">
                <div className="bg-green-50 w-10 h-10 rounded-xl flex items-center justify-center mb-6 text-[#004225] group-hover:bg-[#004225] group-hover:text-white transition-colors">
                  <area.icon className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-[#004225] mb-4">{area.title}</h3>
                <ul className="space-y-2 mt-auto">
                  {area.items.map(item => (
                    <li key={item} className="text-xs text-gray-400 flex items-center">
                      <span className="w-1 h-1 bg-[#004225] rounded-full mr-2" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
