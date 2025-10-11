import type { Action } from "@/types/Action";
import { buttonVariants } from "@/components/ui/button";
import type { VariantProps } from "class-variance-authority";

type ButtonVariant = VariantProps<typeof buttonVariants>["variant"];

export type CommandParam = {
  name: string;
  label: string;
  type: "number" | "string";
  defaultValue?: string | number;
};

export type CommandItem = {
  label: string;
  action: Action;
  params?: CommandParam[];
  fixedParams?: Record<string, string | number>;
  classname?: string;
  variant?: ButtonVariant;
};

export const COMMANDS: readonly CommandItem[] = [
  {
    label: "Start",
    action: "start",
    classname:
      "bg-primary/10 text-primary border-primary/20 hover:bg-primary/20",
  },
  {
    label: "Stop",
    action: "stop",
    classname:
      "bg-primary/10 text-primary border-primary/20 hover:bg-primary/20",
  },
  {
    label: "Accelerate",
    action: "accelerate",
    params: [
      {
        name: "acceleration",
        label: "Acceleration",
        type: "number",
        defaultValue: 10,
      },
    ],
    classname:
      "bg-primary/10 text-primary border-primary/20 hover:bg-primary/20",
  },
  {
    label: "Mode Eco",
    action: "mode",
    fixedParams: { mode: "eco" },
    variant: "destructive",
  },
  {
    label: "Mode Normal",
    action: "mode",
    fixedParams: { mode: "normal" },
    variant: "destructive",
  },
  {
    label: "Mode Speed",
    action: "mode",
    fixedParams: { mode: "speed" },
    variant: "destructive",
  },
];
