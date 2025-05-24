"use client";

import { useState } from "react";
import HamburgerButton from "../../components/HamburgerButton";
import SideDrawer from "../../components/SideDrawer";
import AreasOfFocus from "../../components/AreasOfFocus";
import ContactSection from "../../components/ContactSection";
import FeaturedProjects from "../../components/FeaturedProjects";
import Hero from "../../components/Hero";
import SideProjects from "../../components/SideProjects";
import TechnicalSkills from "../../components/TechnicalSkills";
import WhatIDo from "../../components/WhatIDo";

export default function Portfolio() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <main className="min-h-screen bg-white">
      <HamburgerButton
        isOpen={menuOpen}
        onClick={() => setMenuOpen(!menuOpen)}
      />
      <SideDrawer isOpen={menuOpen} onClose={() => setMenuOpen(false)} />

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mt-16 sm:mt-8">
          <Hero />
          <WhatIDo />
          <TechnicalSkills />
          <AreasOfFocus />
          <FeaturedProjects />
          <SideProjects />
          <ContactSection />
        </div>
      </div>
    </main>
  );
}
