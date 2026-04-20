import React from 'react';
import { motion } from 'motion/react';

export const Clients = () => {
  return (
    <section id="clients" className="py-24 bg-white">
      <div className="max-w-[1600px] mx-auto px-4">
        <div className="flex flex-col items-center mb-16">
          <div className="inline-block">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-[#004225] mb-4 uppercase tracking-tighter">Our Clients</h2>
            <div className="w-full h-1 bg-[#004225]" />
          </div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex justify-center"
        >
          <img 
            src="./images/CC.jpg" 
            alt="Dabin Group Partners" 
            referrerPolicy="no-referrer"
            className="max-w-full h-auto shadow-sm rounded-2xl"
          />
        </motion.div>
      </div>
    </section>
  );
};
