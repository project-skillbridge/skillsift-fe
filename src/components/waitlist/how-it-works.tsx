import Image from "next/image";
import { steps } from "./data";

const HowItWorks = () => {
  return (
    <section className="bg-background py-16 font-sans sm:py-15.5 md:pb-32">
      <div className="mx-auto w-full max-w-330 px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-medium leading-tight text-primary-900 sm:hidden">
            Tools, guidance, and opportunities designed to help you get hired
            faster.
          </h2>
          <h2 className="hidden text-[32px] font-bold leading-10 text-primary-900 sm:block">
            How SkillSift works
          </h2>

          <p className="mx-auto mt-3 max-w-xl text-primary-900/70 sm:hidden">
            Everything you need to grow your career in one platform, from
            discovering jobs to connecting with opportunities, and standing out
            to employers.
          </p>
          <p className="mx-auto mt-1 hidden max-w-109.75 text-base font-light leading-[160%] tracking-[0.017em] text-[#334155] sm:block">
            A simpler way to prove skill and make better hiring decitions.
          </p>
        </div>

        <div className="mt-10 grid gap-5 sm:mt-14 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => (
            <article
              key={step.eyebrow}
              className="flex flex-col overflow-hidden rounded-2xl border-[0.5px] border-[#CBD5E1] bg-[#F2F2F2]"
            >
              <Image
                src={step.image}
                alt={step.imageAlt}
                width={640}
                height={640}
                className="aspect-square w-full object-cover"
              />
              <div className="flex flex-col gap-7.5 px-3.5 pt-10 pb-12">
                <p className="text-[10px] font-medium uppercase leading-3.25 tracking-widest text-[#64748B]">
                  {step.eyebrow}
                </p>

                <div className="flex flex-col gap-2">
                  <h3 className="text-base font-medium leading-5 tracking-[0.016em] text-primary-900 sm:hidden">
                    {step.mobileTitle}
                  </h3>
                  <h3 className="hidden text-base font-medium leading-5 tracking-[0.016em] text-primary-900 sm:block">
                    {step.desktopTitle}
                  </h3>

                  <p className="text-base font-light leading-[160%] tracking-[0.016em] text-[#334155] sm:hidden">
                    {step.mobileBody}
                  </p>
                  <p className="hidden text-base font-light leading-[160%] tracking-[0.016em] text-[#334155] sm:block">
                    {step.desktopBody}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
