"use client";

import { ChevronDown } from "lucide-react";
import { Button } from "@/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/ui/dropdown-menu";
import { StudioField } from "./studio-field";
import type { StudioSelectFieldProps } from "./types";

export function StudioSelectField({ label, value, options, onChange }: StudioSelectFieldProps) {
  const selected = options.find((option) => option.value === value) ?? options[0];

  return (
    <StudioField label={label}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="lg"
            className="mt-2 w-full justify-between border border-white/8 bg-white/1.5 font-normal hover:bg-white/3.5"
          >
            <span className="flex min-w-0 items-center gap-2">
              {selected?.icon}
              <span className="truncate">{selected?.label}</span>
            </span>
            <ChevronDown className="size-3.5 text-muted-foreground/70" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="p-1">
          <DropdownMenuRadioGroup value={value} onValueChange={onChange}>
            {options.map((option) => (
              <DropdownMenuRadioItem key={option.value} value={option.value} className="items-start gap-2">
                {option.icon ? <span className="mt-px">{option.icon}</span> : null}
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-1.5 font-medium">{option.label}</span>
                  {option.hint ? <span className="mt-0.5 block text-muted-foreground">{option.hint}</span> : null}
                </span>
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </StudioField>
  );
}
