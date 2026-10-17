import Image from "next/image";

function AuthNavigationLoading() {
  return (
    <div
      role="status"
      aria-label="Preparing your dashboard..."
      className="fixed inset-0 z-[100] flex min-h-dvh flex-col items-center justify-center bg-background/80 backdrop-blur-sm p-6"
    >
      <div className="flex flex-col items-center justify-center space-y-8 animate-in fade-in duration-500">
        <div className="relative flex h-28 w-28 items-center justify-center">
          {/* Smooth SVG Spinner in Accent Color */}
          <svg
            aria-hidden="true"
            className="absolute inset-0 h-full w-full animate-spin text-primary-500"
            viewBox="0 0 100 100"
            style={{ animationDuration: "1.5s" }}
          >
            <circle
              className="opacity-20"
              cx="50"
              cy="50"
              r="46"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <circle
              className="opacity-100"
              cx="50"
              cy="50"
              r="46"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
              strokeDasharray="144"
              strokeDashoffset="72"
              strokeLinecap="round"
            />
          </svg>

          {/* Inner circle with logo */}
          <div className="absolute inset-2 rounded-full bg-background flex items-center justify-center shadow-lg">
            <Image
              src="/assets/logo/logo.svg"
              alt="SkillSift Logo"
              width={48}
              height={48}
              className="h-12 w-12"
              priority
            />
          </div>
        </div>

        <div className="flex flex-col items-center space-y-2">
          <h3 className="text-xl font-medium tracking-tight text-foreground animate-pulse">
            Preparing your dashboard...
          </h3>
        </div>
      </div>
    </div>
  );
}

export { AuthNavigationLoading };
