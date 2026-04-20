import React from 'react';
import { MessageCircle, ArrowUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const FloatingButtons = () => {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col space-y-4">
      <motion.a
        href="https://pf.kakao.com/_YGjgb"
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="bg-[#FAE100] text-[#3C1E1E] px-6 py-4 rounded-full shadow-2xl flex items-center space-x-3"
      >
        <MessageCircle className="w-6 h-6 fill-current" />
        <span className="font-black text-sm tracking-tighter">카카오톡 문의하기</span>
      </motion.a>
    </div>
  );
};
