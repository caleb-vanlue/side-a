"use client";

import { PageLayout } from "../../components/layout";
import {
  Hero,
  WhatIDo,
  Experience,
  TechnicalSkills,
  FeaturedProjects,
  AreasOfFocus,
  SideProjects,
  ContactSection,
} from "../../components/portfolio";

export default function PortfolioPage() {
  return (
    <PageLayout containerClassName="max-w-4xl">
      <div className="mt-16 sm:mt-8">
        <Hero />
        <WhatIDo />
        <TechnicalSkills />
        <Experience />
        <FeaturedProjects />
        <AreasOfFocus />
        <SideProjects />
        <ContactSection />
      </div>
    </PageLayout>
  );
}
