import React from 'react';
import { motion } from 'motion/react';

const AFFILIATES = [
  { 
    name: '다빈기획', 
    image: './images/a0.jpg',
    description: '시각디자인, 행사기획/대행, 친환경 사인물, 홍보·판촉물'
  },
  { 
    name: '미도', 
    image: './images/b0.jpg',
    description: '실내 · 외 건축, 옥내·외 사인물, 금속창호, 인테리어 전문'
  },
  { 
    name: '이든컴퍼니', 
    image: './images/d0.jpg',
    description: '건물 위생관리, 입주·준공청소, 시설물유지보수, 사무용품 · 가구 전문'
  },
  { 
    name: '세종스러움', 
    image: './images/c0.jpg',
    description: '종합광고기획, 인쇄·편집·출판, 간판·시트지, 상패·감사패·명패 전문'
  },
  { 
    name: '다빈판촉물', 
    image: './images/e0.jpg',
    description: '문구 인쇄, 정성스런 포장, 선물용품 전문 판촉물 쇼핑몰',
    link: 'http://www.다빈판촉물.kr/main/'
  },
  { 
    name: '다빈ECO', 
    image: './images/f0.jpg',
    description: '친환경 에너지 솔루션, 신재생 에너지 설비, 탄소중립 컨설팅 전문'
  },
];

export const Affiliates = () => {
  return (
    <section id="affiliates" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col items-center mb-16">
          <div className="inline-block">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-[#004225] mb-4 uppercase tracking-tighter">Affiliates</h2>
            <div className="w-full h-1 bg-[#004225]" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-0">
        {AFFILIATES.map((item, idx) => {
          const Content = (
            <>
              <img 
                src={item.image} 
                alt={item.name} 
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-[#004225]/60 group-hover:bg-black/20 transition-colors duration-500" />
              
              <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-end">
                <div className="transform transition-all duration-700 ease-out group-hover:-translate-y-[100%]">
                  <h3 className="text-white font-black text-xl md:text-2xl lg:text-3xl tracking-tighter leading-tight mb-2">
                    {item.name}
                  </h3>
                  <div className="h-0 overflow-hidden opacity-0 group-hover:h-auto group-hover:opacity-100 transition-all duration-700 delay-100">
                    <div className="text-white/90 text-xs md:text-sm leading-relaxed font-medium">
                      {item.description.split(',').map((text, i) => (
                        <div key={i} className="mb-1 last:mb-0">
                          {text.trim()}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </>
          );

          return (
            <motion.div
              key={item.name}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="relative aspect-[1/2.2] overflow-hidden group cursor-pointer"
            >
              {item.link ? (
                <a href={item.link} target="_blank" rel="noopener noreferrer" className="block w-full h-full">
                  {Content}
                </a>
              ) : (
                Content
              )}
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};
