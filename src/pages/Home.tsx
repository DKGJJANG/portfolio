import React from 'react';
import { Hero } from '../components/sections/Hero';
import { Affiliates } from '../components/sections/Affiliates';
import { BusinessAreas } from '../components/sections/BusinessAreas';
import { Certifications } from '../components/sections/Certifications';
import { Portfolio } from '../components/sections/Portfolio';
import { Clients } from '../components/sections/Clients';
import { NewsBlog } from '../components/sections/NewsBlog';

export default function Home() {
  return (
    <main>
      <Hero />
      <Affiliates />
      <BusinessAreas />
      <Certifications />
      <Clients />
      <Portfolio />
      <NewsBlog />
    </main>
  );
}
