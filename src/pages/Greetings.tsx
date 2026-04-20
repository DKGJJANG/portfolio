import React from 'react';
import { motion } from 'motion/react';

export default function Greetings() {
  return (
    <div className="pt-48 pb-24 px-4">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-16 items-start"
        >
          {/* Left: Logo Image (Increased size and shifted left) */}
          <div className="flex justify-center lg:justify-start lg:-translate-x-[120px]">
            <div className="w-[280px] h-[360px] bg-gray-50 rounded-2xl overflow-hidden shadow-xl border border-gray-100">
              <img 
                src="./images/a0.jpg" 
                alt="다빈기획 로고" 
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Right: Content */}
          <div>
            <div className="inline-block mb-12">
              <h1 className="text-4xl md:text-5xl font-black text-[#004225] mb-4">인사말</h1>
              <div className="w-full h-1.5 bg-[#004225]" />
            </div>
            
            <div className="space-y-8 text-gray-600 leading-relaxed text-lg break-keep">
              <p>
                도시는 단순한 공간이 아니라 사람의 삶과 이야기가 쌓이는 곳입니다. 다빈그룹은 “공간을 디자인하고, 도시의 이야기를 만든다”는 생각에서 시작되었습니다. 광고물 하나, 공간 하나, 행사 하나에도 사람들이 기억할 메시지와 가치가 담겨야 한다는 믿음으로 시작되었습니다. 도시는 단순한 공간이 아니라 사람의 삶과 이야기가 쌓이는 곳입니다. 공공디자인은 단순한 결과물이 아니라 사람과 사회를 연결하는 공공의 언어라고 믿습니다.
              </p>
              <p>
                다빈그룹은 단순히 만들고 설치하는 일을 하지 않습니다. 프로젝트의 목적을 이해하고, 전달해야 할 가치를 고민하며 기획부터 디자인, 제작, 시공까지 전 과정을 책임 있게 수행합니다. 산업디자인, 공공디자인, 광고기획, 행사기획, 전문건설업(실내건축*금속창호)까지 다양한 분야의 전문성을 바탕으로 공공기관과 기업, 도시 환경 속에서 사람들이 경험하고 기억하는 결과물을 만들어 갑니다.
              </p>
              <p>
                또한 환경과 미래를 고려한 지속가능한 결과물을 통해 사회와 도시가 함께 성장할 수 있는 가치를 고민합니다. 우리는 믿습니다. 좋은 디자인은 단순히 보이는 것이 아니라 사람의 경험을 바꾸고 도시의 이미지를 만들어 간다는 것을. 그래서 다빈그룹은 사람과 도시, 그리고 공공의 가치를 연결하는 디자인으로 더 나은 환경과 더 의미 있는 미래를 만들어가고 있습니다.
              </p>
              <p>
                앞으로도 각 프로젝트마다 책임감 있는 실행과 진정성 있는 접근으로 고객과 사회에 신뢰받는 파트너가 되겠습니다. 함께하는 모든 공간과 순간이 더 나은 방향으로 이어질 수 있도록 끊임없이 고민하고 실천하겠습니다.
              </p>
              <p>
                감사합니다.
              </p>
            </div>
            
            <div className="mt-16 text-right">
              <p className="text-xl font-bold text-gray-900">다빈그룹 대표</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
