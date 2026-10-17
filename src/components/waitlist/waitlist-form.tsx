"use client";

import { useState, useTransition, SubmitEvent } from "react";
import AudienceOption from "./audience-option";
import Field from "./field";
import SelectInput from "./select-input";
import TextInput from "./text-input";
import { addToWaitlistSchema } from "@/types/waitlist";
import { roles, sources } from "./data";
import { addToWaitlist } from "@/actions/waitlist.actions";
import WaitlistFormCTA from "./waitlist-form-cta";
import { appToast } from "@/lib/toast";
import Link from "next/link";

type Props = {
  onCancel: () => void;
  onSubmit: () => void;
};

const WaitlistForm = ({ onCancel, onSubmit }: Props) => {
  const [joiningAs, setJoiningAs] = useState<"talent" | "employer">("talent");
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const parsed = addToWaitlistSchema.safeParse({
      joiningAs,
      fullName: formData.get("fullName"),
      email: formData.get("email"),
      preferredRole: formData.get("preferredRole"),
      referralSource: formData.get("referralSource"),
    });

    if (!parsed.success) {
      appToast.error(
        parsed.error.issues[0]?.message ?? "Please fill all fields",
      );
      return;
    }

    startTransition(async () => {
      const result = await addToWaitlist(parsed.data);
      if (!result.ok) {
        appToast.error(result.error);
        return;
      }
      onSubmit();
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-6 flex flex-col gap-5.5 sm:mt-7 sm:gap-7"
    >
      <fieldset className="flex flex-col gap-1.25" disabled={isPending}>
        <legend className="text-base font-semibold leading-5 tracking-[0.017em] text-[#151515]">
          I am joining SkillSift as
        </legend>
        <div className="mt-1.25 flex gap-1.25">
          <AudienceOption
            label="Talent"
            checked={joiningAs === "talent"}
            onChange={() => setJoiningAs("talent")}
          />
          <AudienceOption
            label="Employer"
            checked={joiningAs === "employer"}
            onChange={() => setJoiningAs("employer")}
          />
        </div>
      </fieldset>

      <Field label="Full name" htmlFor="full-name">
        <TextInput
          id="full-name"
          name="fullName"
          placeholder="Enter your full name"
          autoComplete="name"
          disabled={isPending}
        />
      </Field>

      <Field label="Email" htmlFor="email">
        <TextInput
          id="email"
          name="email"
          type="email"
          placeholder="Enter your email"
          autoComplete="email"
          disabled={isPending}
        />
      </Field>

      <Field label="What is your preferred role" htmlFor="preferredRole">
        <SelectInput
          id="preferredRole"
          name="preferredRole"
          defaultValue="Frontend Developer"
          disabled={isPending}
        >
          {roles.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </SelectInput>
      </Field>

      <Field label="How did you hear about us?" htmlFor="referralSource">
        <SelectInput
          id="referralSource"
          name="referralSource"
          defaultValue="Facebook"
          disabled={isPending}
        >
          {sources.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </SelectInput>
      </Field>
      <p className="text-xs font-normal leading-3.75 tracking-[0.017em] text-[#64748B] sm:text-base sm:font-semibold sm:leading-5 sm:text-center">
        By joining, you agree to SkillSift data{" "}
        <Link href={"terms-of-use"} className="font-semibold underline">
          Terms of Use
        </Link>{" "}
        and{" "}
        <Link href={"privacy-policy"} className="font-semibold underline">
          Privacy Policy.
        </Link>
      </p>
      <WaitlistFormCTA onCancel={onCancel} isPending={isPending} />
    </form>
  );
};

export default WaitlistForm;
