import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, pick } from "@/shared/i18n";
import { getDictionary } from "@/i18n/dictionary";
import { getPortfolioRepository } from "@/composition/public-portfolio";
import { buildLocaleMetadata } from "@/lib/seo";
import { SITE } from "@/config/site";
import { JsonLd } from "@/components/public/json-ld";
import { HeroSection } from "@/components/public/sections/hero-section";
import { AboutSection } from "@/components/public/sections/about-section";
import { JourneySection } from "@/components/public/sections/journey-section";
import { HorizontalTimelineSection } from "@/components/public/sections/horizontal-timeline-section";
import { FeaturedProjectsSection } from "@/components/public/sections/featured-projects-section";
import { ShowreelSection } from "@/components/public/sections/showreel-section";
import { ExperienceSection } from "@/components/public/sections/experience-section";
import { TechMarqueeSection } from "@/components/public/sections/tech-marquee-section";
import { TechMatrixSection } from "@/components/public/sections/tech-matrix-section";
import { CapabilitiesSection } from "@/components/public/sections/capabilities-section";
import { AchievementsSection } from "@/components/public/sections/achievements-section";
import { WritingSection } from "@/components/public/sections/writing-section";
import { ContactCtaSection } from "@/components/public/sections/contact-cta-section";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = getDictionary(locale);
  return buildLocaleMetadata({
    locale,
    path: "",
    title: dict.meta.homeTitle,
    description: dict.meta.homeDescription,
  });
}

/**
 * SINGLE LANDING PAGE — Ariyana V3 Canonical Experience (§80).
 *
 * Section rhythm and narrative flow:
 * 1. Identity & Value (Hero)
 * 2. Profile & Summary (About)
 * 3. Architecture & Methodology (Journey / Process)
 * 4. Production Proof & Case Studies (Featured Projects)
 * 5. Continuous Tech Marquee (Verified Logos)
 * 6. Career & Verified Education (Experience)
 * 7. Technology Architecture Matrix (Skills)
 * 8. Services / Capabilities (Conditional: hidden if 0 rows)
 * 9. Honors & Certifications (Conditional: hidden if 0 rows)
 * 10. Technical Writing (Conditional: hidden if 0 rows)
 * 11. Conversion & Direct Inquiry (Contact CTA)
 */
export default async function LandingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const dict = getDictionary(locale);
  const repo = getPortfolioRepository();
  const [profile, groups, projects, experience, education] = await Promise.all([
    repo.getProfile(),
    repo.getTechGroups(),
    repo.listProjects(),
    repo.listExperience(),
    repo.listEducation(),
  ]);

  const heroName = profile.name.trim() || SITE.owner;
  const heroRole = pick(profile.role, locale).trim() || dict.meta.homeTitle;
  const heroHeadline = pick(profile.headline, locale).trim() || dict.meta.homeDescription;

  // Contact emails & channels
  const emailSocial = profile.socials.find((s) => s.kind === "email");
  const contactEmail = emailSocial ? { address: emailSocial.label, href: emailSocial.href } : null;
  const contactChannels = profile.socials.filter((s) => s.kind !== "email" && s.kind !== "resume");
  if (!contactChannels.some((s) => s.kind === "github" || s.kind === "source")) {
    contactChannels.push({ kind: "github", label: "GitHub", href: SITE.repositoryUrl });
  }
  if (SITE.linkedinUrl && !contactChannels.some((s) => s.kind === "linkedin")) {
    contactChannels.push({
      kind: "linkedin",
      label: "LinkedIn",
      href: SITE.linkedinUrl,
    });
  }

  // Hero social links
  const heroSocials = profile.socials.filter((s) => s.kind !== "resume");
  if (!heroSocials.some((s) => s.kind === "github" || s.kind === "source")) {
    heroSocials.push({ kind: "github", label: "GitHub", href: SITE.repositoryUrl });
  }
  if (SITE.linkedinUrl && !heroSocials.some((s) => s.kind === "linkedin")) {
    heroSocials.push({
      kind: "linkedin",
      label: "LinkedIn",
      href: SITE.linkedinUrl,
    });
  }

  const personLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    jobTitle: pick(profile.role, locale),
    address: { "@type": "PostalAddress", addressLocality: pick(profile.location, locale) },
    url: `${SITE.url}/${locale}`,
    sameAs: profile.socials.filter((s) => s.kind !== "email").map((s) => s.href),
  };
  const websiteLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE.name,
    url: SITE.url,
    inLanguage: locale,
  };

  return (
    <>
      <JsonLd data={personLd} />
      <JsonLd data={websiteLd} />

      {/* 1. Identity & Value (Hero) */}
      <HeroSection
        name={heroName}
        role={heroRole}
        headline={heroHeadline}
        availability={dict.hero.availability}
        intro={dict.hero.intro}
        focusLabel={dict.hero.focus}
        scrollLabel={dict.hero.scroll}
        primary={{ label: dict.actions.viewProjects, href: `/${locale}#projects` }}
        secondary={{ label: dict.actions.contactMe, href: `/${locale}#contact` }}
        socials={heroSocials}
      />

      {/* 2. Profile & Summary (About) */}
      <AboutSection profile={profile} locale={locale} dict={dict} />

      {/* 3. Architecture & Methodology (Process Steps) */}
      <JourneySection dict={dict} />

      {/* 4. Evolution & Milestones (Ariyana Horizontal Scrub Timeline) */}
      <HorizontalTimelineSection dict={dict} />

      {/* 5. Production Proof & Case Studies (Featured Projects) */}
      <FeaturedProjectsSection projects={projects} locale={locale} dict={dict} />

      {/* 6. Continuous Tech Marquee (Verified Logos) */}
      <TechMarqueeSection />

      {/* 7. Cinematic Showreel Environment (GEMINI Motion Protocol) */}
      <ShowreelSection />

      {/* 8. Career & Verified Education (Experience) */}
      <ExperienceSection experience={experience} education={education} locale={locale} t={dict.career} />

      {/* 7. Technology Architecture Matrix (Skills) */}
      <div id="skills" className="scroll-mt-20">
        <TechMatrixSection groups={groups} locale={locale} dict={dict} />
      </div>

      {/* 8. Capabilities / Services (Conditional: hidden if 0 real rows) */}
      <CapabilitiesSection />

      {/* 9. Honors & Certifications (Conditional: hidden if 0 real rows) */}
      <AchievementsSection />

      {/* 10. Technical Writing (Conditional: hidden if 0 real rows) */}
      <WritingSection locale={locale} />

      {/* 11. Conversion & Direct Inquiry (Contact CTA) */}
      <ContactCtaSection email={contactEmail} channels={contactChannels} t={dict.contact} />
    </>
  );
}
