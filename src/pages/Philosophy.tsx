import React from 'react';
import { motion } from 'motion/react';
import { Quote } from 'lucide-react';

const VALUES = [
  { 
    title: '실행 가능성', 
    desc: '이론에 그치지 않는, 현장에 최적화된 실질적인 솔루션을 제안합니다.',
    label: 'FEASIBILITY'
  },
  { 
    title: '존중', 
    desc: '공간을 이용하는 사람과 주변 환경에 대한 깊은 이해와 존중을 바탕으로 합니다.',
    label: 'RESPECT'
  },
  { 
    title: '체계', 
    desc: '기획부터 사후 관리까지 투명하고 체계적인 프로세스를 준수합니다.',
    label: 'SYSTEM'
  },
  { 
    title: '원칙', 
    desc: '안전과 품질에 있어서는 어떠한 경우에도 타협하지 않는 원칙을 지킵니다.',
    label: 'PRINCIPLE'
  },
];

export default function Philosophy() {
  return (
    <div className="bg-white min-h-screen pb-32 pt-48">
      <div className="max-w-7xl mx-auto px-4">
        {/* Hero Section with Split Layout - Swapped to match Greetings page */}
        <section className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-16 items-start mb-32">
          {/* Left: Symbolic Image (Positioned like Greetings page) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="flex justify-center lg:justify-start lg:-translate-x-[120px]"
          >
            <div className="w-[280px] h-[360px] bg-gray-50 rounded-2xl overflow-hidden shadow-xl border border-gray-100">
              <img 
                src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200" 
                alt="Dabin Group Philosophy Symbolic"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-[#004225]/10" />
            </div>
          </motion.div>

          {/* Right: Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block text-[#004225] font-black tracking-[0.4em] text-[10px] mb-6 uppercase">
              Management Philosophy
            </span>
            <div className="inline-block mb-12">
              <h1 className="text-6xl md:text-8xl font-black text-[#004225] mb-4 tracking-tighter">
                경영이념
              </h1>
              <div className="w-full h-2 bg-[#004225]" />
            </div>
            
            <div className="relative mb-12">
              <Quote className="absolute -top-10 -left-10 w-20 h-20 text-[#004225]/5" />
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight break-keep">
                기획은 전략으로 <br /> 시공은 책임으로
              </h2>
            </div>
            
            <div className="text-gray-600 text-lg md:text-xl leading-relaxed font-medium break-keep max-w-lg space-y-6">
              <p>
                다빈그룹은 단순히 디자인을 수행하는 회사가 아닙니다.<br />
                우리는 공간의 목적을 해석하고, 브랜드의 방향을 설계하며, 현장에서 완성도로 신뢰를 증명하는 기업입니다.
              </p>
              <p>
                기획은 전략으로,<br />
                시공은 책임으로.
              </p>
              <p>
                보이지 않는 구조까지 고민하고,<br />
                완공 이후까지 신뢰를 관리하는 것이<br />
                다빈그룹의 방식입니다.
              </p>
              <div className="pt-4">
                <p className="font-black text-gray-900 mb-4">우리의 약속</p>
                <ul className="space-y-2">
                  <li>-실행 가능한 기획만 제안합니다.</li>
                  <li>-일정과 예산을 존중합니다.</li>
                  <li>-기록과 공유를 통해 체계적으로 움직입니다.</li>
                  <li>-현장은 원칙과 안전을 최우선으로 합니다.</li>
                </ul>
              </div>
            </div>
          </motion.div>
        </section>
      </div>
    </div>
  );
}
