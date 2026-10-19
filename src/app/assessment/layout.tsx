import { BrandLogo } from "@/components/brand/brand-logo";

function ExternalNavbar() {
  return (
    <header className="sticky top-0 z-50 bg-[#05060F]">
      <div className="mx-auto flex w-full max-w-360 items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="relative h-9 w-32 shrink-0 md:h-10 md:w-40">
          <BrandLogo tone="light" />
        </div>
      </div>
    </header>
  );
}

/** Same page surface and width as the talent dashboard, so tests look alike. */
export default function AssessmentLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-1 flex-col bg-[#FCFCFC]">
      <ExternalNavbar />
      <main className="flex-1">
        <div className="mx-auto max-w-360 px-4 sm:px-6 lg:px-8">{children}</div>
      </main>
    </div>
  );
}
