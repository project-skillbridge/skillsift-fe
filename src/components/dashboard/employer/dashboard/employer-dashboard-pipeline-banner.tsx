import Image from "next/image";

const MOBILE_LOGO = "/assets/logo/logo.svg";

export function EmployerDashboardPipelineBanner() {
  return (
    <section className="border-x border-[#dbdbdb] bg-[#fafafa] px-6 py-6">
      <div className="flex items-center gap-2">
        <Image
          src={MOBILE_LOGO}
          alt=""
          width={18}
          height={18}
          className="size-4.5 shrink-0"
          aria-hidden
        />
        <p className="text-base leading-normal tracking-[0.017em] text-[#151515]">
          <span className="font-semibold">SkillSift Talent pipeline </span>
          <span className="font-normal">based on 200+ employer reviews</span>
        </p>
      </div>
    </section>
  );
}
