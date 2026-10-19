import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { cn, formatOptionLabel } from "@/lib/utils";
import type { Question } from "@/types/questionnaire";

const MULTI_PICK_PILL_THRESHOLD = 8;
/** Used when the question doesn't declare its own `maxLength`. */
const TEXT_ANSWER_FALLBACK_MAX_LENGTH = 2000;

function optionLabel(question: Question, option: string): string {
  return question.rawOptions ? option : formatOptionLabel(option);
}

export function isOtherReveal(question: Question, value: string): boolean {
  return question.conditional?.trigger_option === value;
}

export function hasOtherReveal(
  question: Question,
  value: string | string[] | undefined,
): boolean {
  // Legacy pattern: conditional.trigger_option (demo questions)
  if (question.conditional) {
    if (typeof value === "string") return isOtherReveal(question, value);
    if (Array.isArray(value))
      return value.some((v) => isOtherReveal(question, v));
  }
  // API pattern: otherTextKey present and "other" selected
  if (question.otherTextKey) {
    if (typeof value === "string") return value === "other";
    if (Array.isArray(value)) return value.includes("other");
  }
  return false;
}

type QuestionnaireQuestionFieldBodyProps = {
  question: Question;
  value: string | string[] | undefined;
  onChange: (value: string | string[]) => void;
};

export function QuestionnaireQuestionFieldBody({
  question,
  value,
  onChange,
}: QuestionnaireQuestionFieldBodyProps) {
  switch (question.inputType) {
    case "text_required": {
      const text = typeof value === "string" ? value : "";
      const trimmedLength = text.trim().length;
      const maxLen = question.maxLength ?? TEXT_ANSWER_FALLBACK_MAX_LENGTH;
      const minLen = question.minLength;
      // `isAnswerValid` checks the trimmed length, so display the same number
      // here — otherwise a user typing whitespace sees a "satisfied" counter
      // while Next stays disabled.
      const belowMin =
        minLen != null && trimmedLength > 0 && trimmedLength < minLen;
      return (
        <div className="relative">
          <Textarea
            value={text}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Type your response here"
            rows={5}
            maxLength={maxLen}
            className="pb-8"
          />
          <span
            className={cn(
              "pointer-events-none absolute right-3 bottom-3 font-sans text-xs tabular-nums",
              belowMin ? "text-destructive" : "text-muted-foreground",
            )}
            aria-hidden
          >
            {trimmedLength}/{maxLen}
            {minLen != null ? ` (min ${minLen})` : ""}
          </span>
        </div>
      );
    }

    case "single": {
      const options = question.options ?? [];
      const selected = typeof value === "string" ? value : "";
      return (
        <RadioGroup
          value={selected}
          onValueChange={(v) => onChange(v)}
          className="flex flex-col gap-3"
        >
          {options.map((option) => {
            const id = `${question.id}-${option}`;
            const isSelected = selected === option;
            return (
              <label
                key={option}
                htmlFor={id}
                className={cn(
                  "flex cursor-pointer items-center gap-3 rounded-lg border bg-muted/40 px-4 py-3 font-sans text-sm transition-colors",
                  isSelected
                    ? "border-foreground/30 bg-muted/70"
                    : "border-transparent hover:bg-muted/60",
                )}
              >
                <RadioGroupItem id={id} value={option} />
                <span>{optionLabel(question, option)}</span>
                {isOtherReveal(question, option) && isSelected && (
                  <span className="sr-only"> — additional input required</span>
                )}
              </label>
            );
          })}
        </RadioGroup>
      );
    }

    case "multi": {
      const options = question.options ?? [];
      const selected = Array.isArray(value) ? value : [];
      const toggle = (option: string, checked: boolean) => {
        const next = checked
          ? Array.from(new Set([...selected, option]))
          : selected.filter((v) => v !== option);
        onChange(next);
      };
      const asPills = options.length > MULTI_PICK_PILL_THRESHOLD;
      return (
        <div
          className={cn(
            asPills ? "flex flex-wrap gap-3" : "flex flex-col gap-3",
          )}
        >
          {options.map((option) => {
            const id = `${question.id}-${option}`;
            const isSelected = selected.includes(option);
            return (
              <label
                key={option}
                htmlFor={id}
                className={cn(
                  "flex cursor-pointer items-center gap-2.5 border bg-muted/40 font-sans text-sm transition-colors",
                  asPills ? "rounded-full px-4 py-2" : "rounded-lg px-4 py-3",
                  isSelected
                    ? "border-foreground/30 bg-muted/70"
                    : "border-transparent hover:bg-muted/60",
                )}
              >
                <Checkbox
                  id={id}
                  checked={isSelected}
                  onCheckedChange={(c) => toggle(option, c === true)}
                />
                <span>{optionLabel(question, option)}</span>
              </label>
            );
          })}
        </div>
      );
    }

    default:
      return null;
  }
}
