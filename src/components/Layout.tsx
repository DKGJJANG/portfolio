import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Phone, Mail, MessageCircle, Menu, X, ChevronDown, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/src/lib/utils';

export const TopBar = () => (
  <div className="fixed top-0 left-0 w-full bg-[#004225] text-white py-1.5 overflow-hidden whitespace-nowrap z-[60]">
    <div className="flex animate-marquee w-max">
      {[1, 2].map((i) => (
        <div key={i} className="flex items-center space-x-4 px-4 text-[10px] font-bold tracking-widest uppercase">
          <span className="text-yellow-400">공공기관 우선구매대상</span>
          <span>장애인기업인증업체 | 여성기업인증업체 | 직접생산등록업체 | 산업디자인전문회사 | 전문건설업 | 옥외광고업등록업체 | ISO 9001 인증 | ISO 14001 인증 | 나라장터 | 이음장터</span>
          <span className="text-yellow-400">공공기관 우선구매대상</span>
          <span>장애인기업인증업체 | 여성기업인증업체 | 직접생산등록업체 | 산업디자인전문회사 | 전문건설업 | 옥외광고업등록업체 | ISO 9001 인증 | ISO 14001 인증 | 나라장터 | 이음장터</span>
        </div>
      ))}
    </div>
  </div>
);

const NAV_ITEMS = [
  {
    title: '그룹소개',
    links: [
      { name: '인사말', href: '/greetings' },
      { name: '경영이념', href: '/philosophy' },
      { name: '인증 및 특허', href: '/#certifications' },
      { name: '사업영역', href: '/#business' },
      { name: '주요 파트너사', href: '/#clients' },
    ],
  },
  {
    title: '계열사',
    links: [
      { name: '다빈기획', href: '/#affiliates' },
      { name: '미도', href: '/#affiliates' },
      { name: '이든컴퍼니', href: '/#affiliates' },
      { name: '세종스러움', href: '/#affiliates' },
      { name: '다빈판촉물', href: '/#affiliates' },
      { name: '다빈ECO', href: '/#affiliates' },
    ],
  },
  {
    title: '포트폴리오',
    links: [
      { name: '공공디자인', href: '/#portfolio' },
      { name: '브랜딩디자인', href: '/#portfolio' },
      { name: '시각디자인', href: '/#portfolio' },
      { name: '인테리어', href: '/#portfolio' },
      { name: '행사기획', href: '/#portfolio' },
    ],
  },
  {
    title: 'NEWS&SNS',
    links: [
      { name: 'NEWS&SNS', href: '/news' },
      { name: '인스타그램', href: 'https://www.instagram.com/sejong____dabin/', external: true },
      { name: '블로그', href: 'https://blog.naver.com/dabin_0408', external: true },
    ],
  },
  {
    title: '문의하기',
    href: 'https://pf.kakao.com/_YGjgb',
    isButton: true,
  },
];

export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileAccordion, setMobileAccordion] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLinkClick = (href: string, external?: boolean) => {
    setIsMobileMenuOpen(false);
    setActiveDropdown(null);
    setMobileAccordion(null);
    
    if (external) return;

    if (href === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (href.startsWith('/#')) {
      const sectionId = href.split('#')[1];
      if (location.pathname === '/') {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
      } else {
        navigate('/');
        setTimeout(() => {
          document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  };

  return (
    <header className={cn(
      "fixed top-0 left-0 w-full z-50 transition-all duration-500",
      "bg-white/90 backdrop-blur-md",
      isScrolled ? "py-2 shadow-sm" : "py-5",
      "mt-[28px]" // Height of TopBar
    )}>
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2" onClick={() => handleLinkClick('/')}>
          <span className="text-2xl font-black tracking-tighter text-[#004225]">
            DABIN GROUP
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-8">
          {NAV_ITEMS.map((item) => (
            <div 
              key={item.title} 
              className="relative group"
              onMouseEnter={() => setActiveDropdown(item.title)}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              {item.links ? (
                <button className="flex items-center space-x-1 text-sm font-bold text-gray-700 hover:text-[#004225] transition-colors">
                  <span>{item.title}</span>
                  <ChevronDown className={cn("w-4 h-4 transition-transform", activeDropdown === item.title && "rotate-180")} />
                </button>
              ) : (
        <Link 
          to={item.href || '#'} 
          className={cn(
            "text-sm font-bold transition-colors flex items-center space-x-2",
            item.isButton ? "bg-[#FEE500] text-[#3C1E1E] px-5 py-2 rounded-full hover:bg-[#F7E600] shadow-lg shadow-black/5" : 
            "text-gray-700 hover:text-[#004225]"
          )}
        >
          {item.isButton && <MessageCircle className="w-4 h-4 fill-current" />}
          <span>{item.title}</span>
        </Link>
              )}

              {item.links && (
                <AnimatePresence>
                  {activeDropdown === item.title && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-48 bg-white shadow-2xl rounded-2xl py-3 overflow-hidden border border-gray-100"
                    >
                      {item.links.map((link) => (
                        link.external ? (
                          <a
                            key={link.name}
                            href={link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block px-6 py-2.5 text-sm font-medium text-gray-600 hover:bg-green-50 hover:text-[#004225] transition-colors"
                          >
                            {link.name}
                          </a>
                        ) : (
                          <Link
                            key={link.name}
                            to={link.href}
                            onClick={() => handleLinkClick(link.href)}
                            className="block px-6 py-2.5 text-sm font-medium text-gray-600 hover:bg-green-50 hover:text-[#004225] transition-colors"
                          >
                            {link.name}
                          </Link>
                        )
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              )}
            </div>
          ))}
        </nav>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden p-2 text-gray-900"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-gray-100 overflow-hidden"
          >
            <div className="px-4 py-6 space-y-4">
              {NAV_ITEMS.map((item) => (
                <div key={item.title} className="border-b border-gray-50 pb-4 last:border-0">
                  {item.links ? (
                    <>
                      <button 
                        onClick={() => setMobileAccordion(mobileAccordion === item.title ? null : item.title)}
                        className="flex items-center justify-between w-full text-sm font-bold text-gray-900"
                      >
                        <span>{item.title}</span>
                        <ChevronDown className={cn("w-4 h-4 transition-transform", mobileAccordion === item.title && "rotate-180")} />
                      </button>
                      <AnimatePresence>
                        {mobileAccordion === item.title && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="grid grid-cols-2 gap-2 pt-4 pl-2">
                              {item.links.map((link) => (
                                link.external ? (
                                  <a
                                    key={link.name}
                                    href={link.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-gray-500 py-1"
                                  >
                                    {link.name}
                                  </a>
                                ) : (
                                  <Link
                                    key={link.name}
                                    to={link.href}
                                    onClick={() => handleLinkClick(link.href)}
                                    className="text-sm text-gray-500 py-1"
                                  >
                                    {link.name}
                                  </Link>
                                )
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </>
                  ) : (
                    <Link
                      to={item.href || '#'}
                      onClick={() => handleLinkClick(item.href || '#')}
                      className={cn(
                        "flex items-center space-x-2 text-sm font-bold",
                        item.isButton ? "bg-[#FEE500] text-[#3C1E1E] px-4 py-2 rounded-xl inline-flex" : "text-gray-900"
                      )}
                    >
                      {item.isButton && <MessageCircle className="w-4 h-4 fill-current" />}
                      <span>{item.title}</span>
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export const Footer = () => (
  <footer className="bg-[#004225] text-gray-200 py-12 px-4">
    <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-16">
      <div className="space-y-8 max-w-md">
        <h2 className="text-white text-2xl font-black tracking-tighter">DABIN GROUP</h2>
        <p className="text-sm leading-relaxed break-keep">
          다빈그룹은 광고, 행사기획, 인쇄편집 분야에서 <br />
          최고의 전문성을 바탕으로 고객사의 가치를 <br />
          극대화하는 결과 중심의 파트너 입니다.
        </p>
        <div className="flex space-x-4">
          <a href="https://www.instagram.com/sejong____dabin/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#004225] hover:text-white transition-all">
            <span className="sr-only">Instagram</span>
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
          </a>
          <a href="https://blog.naver.com/dabin_0408" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#03cf5d] hover:text-white transition-all font-black text-xs">
            N
          </a>
          <a href="https://pf.kakao.com/_YGjgb" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-[#FEE500] flex items-center justify-center hover:bg-[#F7E600] text-[#3C1E1E] transition-all">
            <MessageCircle className="w-5 h-5 fill-current" />
          </a>
        </div>
      </div>

      <div className="space-y-8">
        <h3 className="text-white font-bold uppercase tracking-widest text-xs">Contact</h3>
        <div className="space-y-4 text-sm">
          <p className="flex items-center"><Phone className="w-4 h-4 mr-3 text-white/40" /> 044-715-5636</p>
          <p className="flex items-center"><Mail className="w-4 h-4 mr-3 text-white/40" /> dabin_0408@naver.com</p>
          <a href="https://pf.kakao.com/_YGjgb" target="_blank" rel="noopener noreferrer" className="flex items-center hover:text-white transition-colors">
            <MessageCircle className="w-4 h-4 mr-3 text-white/40" /> 카카오톡 문의하기
          </a>
        </div>
      </div>

      <div className="space-y-8">
        <h3 className="text-white font-bold uppercase tracking-widest text-xs">찾아오시는 길</h3>
        <div className="space-y-4 text-sm">
          <div className="space-y-4">
            <div className="flex items-start">
              <MapPin className="w-4 h-4 mr-3 mt-1 text-white/40 shrink-0" />
              <div>
                <p className="text-white font-bold text-xs mb-1">세종본사</p>
                <p className="text-xs leading-relaxed">세종특별자치시 금남면 용포로 110 2층</p>
                <p className="text-xs leading-relaxed">세종특별자치시 집현중앙7로 6 801호(지식산업센터)</p>
              </div>
            </div>
            <div className="flex items-start">
              <MapPin className="w-4 h-4 mr-3 mt-1 text-white/40 shrink-0" />
              <div>
                <p className="text-white font-bold text-xs mb-1">대전지사</p>
                <p className="text-xs leading-relaxed">대전광역시 서구 둔산로 45, 엠빌딩 3층</p>
              </div>
            </div>
            <div className="flex items-start">
              <MapPin className="w-4 h-4 mr-3 mt-1 text-white/40 shrink-0" />
              <div>
                <p className="text-white font-bold text-xs mb-1">충남지사</p>
                <p className="text-xs leading-relaxed">충청남도 천안시 서북구 불당동 789</p>
              </div>
            </div>
            <div className="flex items-start">
              <MapPin className="w-4 h-4 mr-3 mt-1 text-white/40 shrink-0" />
              <div>
                <p className="text-white font-bold text-xs mb-1">충북지사</p>
                <p className="text-xs leading-relaxed">충청북도 청주시 흥덕구 가경동 456</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center text-[10px] font-bold uppercase tracking-widest">
      <p>© 2026 DABIN GROUP. ALL RIGHTS RESERVED.</p>
      <div className="flex space-x-8 mt-4 md:mt-0">
        <Link to="/admin/news" className="hover:text-white transition-colors">Admin Login</Link>
        <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
      </div>
    </div>
  </footer>
);
