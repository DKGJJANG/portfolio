import React from 'react';
import { motion } from 'motion/react';
import { Award, ShieldCheck, FileText, Zap } from 'lucide-react';

const CERTS = [
  { title: 'ISO 9001 인증', icon: ShieldCheck, desc: '품질경영시스템 국제 표준 인증' },
  { title: '디자인 전문회사 인증', icon: Palette, desc: '한국디자인진흥원 공인 전문회사' },
  { title: '공공디자인 특허', icon: FileText, desc: '스마트 쉘터 조립식 구조 특허' },
  { title: '벤처기업 인증', icon: Zap, desc: '혁신 성장형 벤처기업 선정' },
];

import { Palette } from 'lucide-react';

export const Certifications = () => {
  return (
    <section id="certifications" className="py-24 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col items-center mb-16">
          <div className="inline-block">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-[#004225] mb-4 uppercase tracking-tighter">Certifications</h2>
            <div className="w-full h-1 bg-[#004225]" />
          </div>
        </div>

        <div className="flex flex-col space-y-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl overflow-hidden shadow-2xl border border-gray-100"
          >
            <img src="./images/CE1.jpg" alt="Certification 1" referrerPolicy="no-referrer" className="w-full h-auto" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl overflow-hidden shadow-2xl border border-gray-100"
          >
            <img src="./images/CE2.jpg" alt="Certification 2" referrerPolicy="no-referrer" className="w-full h-auto" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};
