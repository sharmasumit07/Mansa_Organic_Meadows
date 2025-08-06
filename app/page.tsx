'use client';

import { useState, useEffect } from 'react';
import { ChevronDown, MapPin, Phone, Mail, Clock, Leaf, Heart, Users, Award } from 'lucide-react';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Products from '@/components/Highlights';
import Gallery from '@/components/Gallery';
import Services from '@/components/Services';
import Contact from '@/components/Contact';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main className="min-h-screen bg-stone-50">
      <Navigation />
      <Hero />
      <About />
      <Products />
      <Gallery />
      <Services />
      <Contact />
      <Footer />
    </main>
  );
}