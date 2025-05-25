"use client";

import AreasOfFocus from "../../components/AreasOfFocus";
import ContactSection from "../../components/ContactSection";
import FeaturedProjects from "../../components/FeaturedProjects";
import Hero from "../../components/Hero";
import PageLayout from "../../components/PageLayout";
import SideProjects from "../../components/SideProjects";
import TechnicalSkills from "../../components/TechnicalSkills";
import WhatIDo from "../../components/WhatIDo";

export default function PortfolioPage() {
  return (
    <PageLayout containerClassName="max-w-4xl">
      <div className="mt-16 sm:mt-8">
        <Hero />
        <WhatIDo />
        <TechnicalSkills />
        <FeaturedProjects />
        <AreasOfFocus />
        <SideProjects />
        <ContactSection />
      </div>
    </PageLayout>
  );
}
