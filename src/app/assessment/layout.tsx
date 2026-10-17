import Image from "next/image";

function ExternalNavbar() {
  return (
    <header className="sticky top-0 z-50 bg-[#05060F]">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-6 py-4">
        <div className="relative h-9 w-32 shrink-0 md:h-10 md:w-40">
          <Image
            src="/assets/logo/logo-with-text-white.svg"
            alt="SkillSift"
            fill
            className="object-contain object-left"
            priority
            sizes="(max-width: 768px) 128px, 160px"
          />
        </div>
      </div>
    </header>
  );
}

export default function AssessmentLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-1 flex-col bg-[#F9FAFB]">
      <ExternalNavbar />
      <div className="flex-1 p-6">{children}</div>
    </div>
  );
}
