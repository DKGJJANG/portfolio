import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Calendar, ChevronRight } from 'lucide-react';

const NEWS = [
  {
    id: 1,
    title: '2026년 업무추진계획',
    date: '2026.03.15',
    category: 'News',
    image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=800',
    link: '/news/1'
  },
  {
    id: 2,
    title: '다빈그룹 공식 네이버 블로그에서\n다양한 소식을 확인하세요',
    date: '2026.03.10',
    category: 'Blog',
    image: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&q=80&w=800',
    link: 'https://blog.naver.com/dabin_0408'
  },
  {
    id: 3,
    title: '다빈그룹 인스타그램 팔로우하고\n최신 소식을 만나보세요',
    date: '2026.03.05',
    category: 'Instagram',
    image: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&q=80&w=800',
    link: 'https://www.instagram.com/sejong____dabin/'
  }
];

export const NewsBlog = () => {
  return (
    <section className="py-24 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-block mb-12">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-[#004225] mb-4 uppercase tracking-tighter">NEWS&SNS</h2>
            <div className="w-full h-1 bg-[#004225]" />
          </div>
          
          <div className="flex justify-center space-x-4">
            <a 
              href="https://blog.naver.com/dabin_0408" 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-8 py-3 bg-[#03cf5d] text-white rounded-full font-bold text-sm hover:shadow-lg transition-all flex items-center space-x-2"
            >
              <span className="text-lg font-black">N</span>
              <span>네이버 블로그</span>
            </a>
            <a 
              href="https://www.instagram.com/sejong____dabin/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-8 py-3 bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] text-white rounded-full font-bold text-sm hover:shadow-lg transition-all flex items-center space-x-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              <span>인스타그램</span>
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {NEWS.map((item, idx) => {
            const isExternal = item.link.startsWith('http');
            const Content = (
              <motion.article
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all group cursor-pointer h-full flex flex-col"
              >
                <div className="aspect-video overflow-hidden">
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="p-8 flex-1 flex flex-col">
                  <div className="flex items-center space-x-2 mb-4">
                    <span className="text-[10px] font-bold text-[#004225] bg-green-50 px-2 py-0.5 rounded uppercase tracking-widest">
                      {item.category}
                    </span>
                    <div className="flex items-center text-gray-400 text-xs">
                      <Calendar className="w-3 h-3 mr-1" />
                      {item.date}
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4 line-clamp-2 group-hover:text-[#004225] transition-colors whitespace-pre-line">
                    {item.title}
                  </h3>
                </div>
              </motion.article>
            );

            return isExternal ? (
              <a key={item.id} href={item.link} target="_blank" rel="noopener noreferrer">
                {Content}
              </a>
            ) : (
              <Link key={item.id} to={item.link}>
                {Content}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};
