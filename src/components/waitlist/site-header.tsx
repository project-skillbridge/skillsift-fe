import Link from "next/link";
import Image from "next/image";

const SiteHeader = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#DBDBDB] bg-[#f5f5f5]/70 backdrop-blur-lg supports-backdrop-filter:bg-[#f5f5f5]/60">
      <div className="mx-auto flex h-18 w-full items-center justify-between px-6 sm:px-15">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/assets/logo/logo-with-text.svg"
            alt="SkillSift"
            width={168}
            height={56}
            className="h-10 w-auto sm:h-14"
            priority
          />
        </Link>
      </div>
    </header>
  );
};

export default SiteHeader;
