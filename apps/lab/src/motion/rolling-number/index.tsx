"use client";

import { cn } from "cn";
import { RollingDigit } from "./rolling-digit";
import type { RollingNumberProps } from "./types";

export function RollingNumber({
  value,
  decimalPlaces = 0,
  useGrouping = false,
  prefix,
  suffix,
  className,
  digitClassName,
  duration = 0.3,
}: RollingNumberProps) {
  const formatted = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces,
    useGrouping,
  }).format(value);
  const [integerPart, fractionalPart] = formatted.split(".");

  return (
    <span className={cn("inline-flex items-center tabular-nums", className)}>
      {prefix ? <span className="tabular-nums font-normal">{prefix}</span> : null}
      {integerPart
        .split("")
        .map((digit, index) =>
          /^\d$/.test(digit) ? (
            <RollingDigit
              key={`integer-${integerPart.length - 1 - index}`}
              digit={digit}
              duration={duration}
              className={digitClassName}
            />
          ) : (
            <span key={`integer-separator-${index}`}>{digit}</span>
          ),
        )}
      {fractionalPart !== undefined ? (
        <>
          <span className="px-[0.02em]">.</span>
          {fractionalPart.split("").map((digit, index) => (
            <RollingDigit
              key={`fraction-${fractionalPart.length - 1 - index}`}
              digit={digit}
              duration={duration}
              className={digitClassName}
            />
          ))}
        </>
      ) : null}
      {suffix ? <span>{suffix}</span> : null}
    </span>
  );
}
