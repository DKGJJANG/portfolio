import React from 'react';

export const LogoDabin = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 200 60" className={className} fill="currentColor">
    <text x="0" y="45" fontSize="40" fontWeight="bold" fontFamily="sans-serif">DABIN</text>
    <rect x="140" y="10" width="40" height="40" rx="4" fill="currentColor" opacity="0.8" />
  </svg>
);

export const LogoMido = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 200 60" className={className} fill="currentColor">
    <text x="0" y="45" fontSize="35" fontWeight="bold" fontFamily="sans-serif">MIDO</text>
    <circle cx="150" cy="30" r="20" fill="currentColor" opacity="0.8" />
  </svg>
);

export const LogoEden = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 200 60" className={className} fill="currentColor">
    <text x="0" y="45" fontSize="35" fontWeight="bold" fontFamily="sans-serif">EDEN</text>
    <path d="M140 10 L180 10 L160 50 Z" fill="currentColor" opacity="0.8" />
  </svg>
);

export const LogoSejong = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 200 60" className={className} fill="currentColor">
    <text x="0" y="45" fontSize="30" fontWeight="bold" fontFamily="sans-serif">SEJONG</text>
    <rect x="140" y="15" width="30" height="30" transform="rotate(45 155 30)" fill="currentColor" opacity="0.8" />
  </svg>
);

export const LogoA0 = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 200 60" className={className} fill="currentColor">
    <text x="0" y="45" fontSize="40" fontWeight="bold" fontFamily="sans-serif">A0</text>
    <rect x="80" y="10" width="100" height="40" rx="20" fill="currentColor" opacity="0.8" />
  </svg>
);

export const LogoEco = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 200 60" className={className} fill="currentColor">
    <text x="0" y="45" fontSize="35" fontWeight="bold" fontFamily="sans-serif">ECO</text>
    <path d="M140 30 Q160 10 180 30 Q160 50 140 30" fill="currentColor" opacity="0.8" />
  </svg>
);
