import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ExternalLink } from 'lucide-react';

const PORTFOLIO_ITEMS = [
  { 
    id: '01', 
    title: '공공디자인', 
    images: [
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800',
      'https://images.unsplash.com/photo-1449156059431-787c5d7139b8?q=80&w=800',
      'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=800',
      'https://images.unsplash.com/photo-1497366811353-6870744d04b2?q=80&w=800'
    ] 
  },
  { 
    id: '02', 
    title: '브랜딩디자인', 
    images: [
      'https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=800',
      'https://images.unsplash.com/photo-1626785774573-4b799315345d?q=80&w=800',
      'https://images.unsplash.com/photo-1586717791821-3f44a563eb4c?q=80&w=800',
      'https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=800'
    ] 
  },
  { 
    id: '03', 
    title: '시각디자인', 
    images: [
      'https://images.unsplash.com/photo-1572044162444-ad60f128bde2?q=80&w=800',
      'https://images.unsplash.com/photo-1558655146-9f40138edfeb?q=80&w=800',
      'https://images.unsplash.com/photo-1542744094-24638eff58bb?q=80&w=800',
      'https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=800'
    ] 
  },
  { 
    id: '04', 
    title: '인테리어', 
    images: [
      'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=800',
      'https://images.unsplash.com/photo-1497366811353-6870744d04b2?q=80&w=800',
      'https://images.unsplash.com/photo-1503387762-592dee58c460?q=80&w=800',
      'https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=800'
    ] 
  },
  { 
    id: '05', 
    title: '행사기획', 
    images: [
      'https://images.unsplash.com/photo-1505373633560-22829d489447?q=80&w=800',
      'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=800',
      'https://images.unsplash.com/photo-1540575861501-7cf05a4b125a?q=80&w=800',
      'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?q=80&w=800'
    ] 
  },
];

export const Portfolio = () => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <section id="portfolio" className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col items-center mb-16">
          <div className="inline-block">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-[#004225] mb-4 uppercase tracking-tighter">Portfolio</h2>
            <div className="w-full h-1 bg-[#004225]" />
          </div>
        </div>

        <div className="divide-y divide-gray-100">
          {PORTFOLIO_ITEMS.map((item) => (
            <a
              key={item.id}
              href="https://dabinportfolio.netlify.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative block py-12 md:py-16 transition-all"
              onMouseEnter={() => setHoveredId(item.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center space-x-8 md:space-x-16">
                  <span className="text-sm md:text-base font-bold text-[#004225] font-mono">
                    {item.id}
                  </span>
                  <h3 className="text-4xl md:text-7xl font-black text-gray-900 tracking-tighter group-hover:translate-x-4 transition-transform duration-500">
                    {item.title}
                  </h3>
                </div>
                <div className="hidden md:block opacity-0 group-hover:opacity-100 transition-opacity">
                  <ExternalLink className="w-8 h-8 text-[#004225]" />
                </div>
              </div>

              {/* Hover Marquee Background */}
              <AnimatePresence>
                {hoveredId === item.id && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 -z-10 flex items-center overflow-hidden pointer-events-none"
                  >
                    <div className="flex animate-marquee whitespace-nowrap">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="flex space-x-4 px-2">
                          {item.images.map((img, imgIdx) => (
                            <div key={imgIdx} className="w-[300px] aspect-video rounded-2xl overflow-hidden shadow-2xl">
                              <img src={img} alt="" referrerPolicy="no-referrer" className="w-full h-full object-cover opacity-40" />
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};
