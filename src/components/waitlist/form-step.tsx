"use client";

import SocialFooter from "./social-footer";
import WaitlistForm from "./waitlist-form";

const FormStep = ({
  onSubmit,
  onCancel,
}: {
  onSubmit: () => void;
  onCancel: () => void;
}) => {
  return (
    <div className="flex flex-1 flex-col px-5 py-6 sm:px-5 sm:py-5">
      <header className="text-left sm:text-left">
        <h2 className="text-2xl font-bold leading-7.5 text-[#151515] sm:text-[28px] sm:leading-8.75">
          Join the SkillSift waitlist
        </h2>
        <p className="mt-2.25 text-sm font-normal leading-4.5 tracking-[0.016em] text-[#151515]">
          Tell us a little about yourself so we can notify you when early access
          opens.
        </p>
      </header>
      <WaitlistForm onCancel={onCancel} onSubmit={onSubmit} />
      <SocialFooter />
    </div>
  );
};

export default FormStep;
