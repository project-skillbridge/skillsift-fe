import type { ReactNode } from "react";

type Props = {
  title: string;
  description?: string;
  /** Buttons or links shown at the right on wide screens, below the text on narrow ones. */
  actions?: ReactNode;
};

/** The same title block on every employer page, so they read as one product. */
export function PageHeader({ title, description, actions }: Props) {
  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="flex flex-col gap-1.5">
        <h1 className="font-sans text-2xl font-bold tracking-tight text-[#0D2025] sm:text-3xl">
          {title}
        </h1>
        {description ? (
          <p className="max-w-2xl font-sans text-sm text-[#667085] sm:text-base">
            {description}
          </p>
        ) : null}
      </div>
      {actions ? (
        <div className="flex flex-wrap items-center gap-3">{actions}</div>
      ) : null}
    </header>
  );
}
