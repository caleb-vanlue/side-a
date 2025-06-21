"use client";

import { PageLayout } from "../layout";
import {
  Hero,
  WhatIDo,
  Experience,
  Education,
  TechnicalSkills,
  FeaturedProjects,
  AreasOfFocus,
  SideProjects,
  ContactSection,
} from "./index";

export default function PortfolioPageContent() {
  return (
    <PageLayout containerClassName="max-w-4xl">
      <div className="mt-16 sm:mt-8">
        <Hero />
        <WhatIDo />
        <TechnicalSkills />
        <Experience />
        <Education />
        <FeaturedProjects />
        <AreasOfFocus />
        <SideProjects />
        <ContactSection />
      </div>
    </PageLayout>
  );
}