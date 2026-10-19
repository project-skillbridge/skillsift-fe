"use client";

import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import AssessmentContainer from "./assessment-container";
import NextUpCard from "./next-up-card";

const AdvancedAssessmentSummary = () => {
  return (
    <AssessmentContainer>
      <Image
        alt="Assessment icon"
        src="/assets/icons/portfolio-icon.svg"
        height={56}
        width={56}
      />
      <section className="mt-4 mb-7 flex flex-col gap-y-4 md:mb-12">
        <h2 className="text-xl leading-[150%] font-bold md:text-3xl">
          Job Readiness Evaluation summary
        </h2>
        <div className="space-y-3 text-base font-light md:text-lg">
          <p>
            Congratulations! <span aria-hidden>🎉</span> You&apos;ve completed
            the Job Readiness Evaluation.
          </p>
          <p>
            Your answers are being scored. When they are ready, you will get a
            notification here and a detailed report by email with your validated
            skill level, strengths, and recommended growth areas.
          </p>
        </div>
      </section>
      <div className="flex flex-col items-center">
        <Image
          height={120}
          width={100}
          alt="Achievement illustration"
          src={"/assets/icons/achievement-icon.svg"}
        />
        <p className="md:mt-4 md:mb-10 mt-2 mb-5 text-base font-semibold max-md:text-center md:text-lg">
          Your results will be ready in a few minutes. We&apos;ll notify you
          here and by email.
        </p>
      </div>
      <NextUpCard
        assessement="advanced"
        duration="30 minutes"
        title="AI mock interview"
      />
      <div className="mt-6 flex justify-center">
        <Button
          asChild
          variant="ghost"
          className="text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground"
        >
          <Link href="/t/dashboard">Back to Home</Link>
        </Button>
      </div>
    </AssessmentContainer>
  );
};

export default AdvancedAssessmentSummary;
