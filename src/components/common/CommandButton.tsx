import { useState, useCallback, memo } from "react";
import { Button } from "../ui/button";
import { ChevronDown, ChevronRight } from "lucide-react";
import type { Action } from "@/types/Action";
import type { CommandParam } from "@/constants/commands";
import type Command from "@/types/Command";

interface CommandButtonProps {
  label: string;
  action: Action;
  params?: CommandParam[];
  fixedParams?: Record<string, string | number>;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link"
    | null;
  classname?: string;
  onSendCommand: (command: Command) => void;
}

const CommandButton = memo(
  ({
    label,
    action,
    params,
    fixedParams,
    variant,
    classname,
    onSendCommand,
  }: CommandButtonProps) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [paramValues, setParamValues] = useState<
      Record<string, string | number>
    >(() => {
      // Initialize with default values
      const initial: Record<string, string | number> = {};
      params?.forEach((param) => {
        if (param.defaultValue !== undefined) {
          initial[param.name] = param.defaultValue;
        }
      });
      return initial;
    });

    const hasParams = params && params.length > 0;

    const toggleExpanded = useCallback(() => {
      setIsExpanded((prev) => !prev);
    }, []);

    const handleParamChange = useCallback(
      (paramName: string, value: string | number) => {
        setParamValues((prev) => ({
          ...prev,
          [paramName]: value,
        }));
      },
      []
    );

    const buildCommand = useCallback((): Command => {
      // Start with an empty object to accumulate all params
      let allParams: Record<string, string | number> = {};

      // Add fixed params first (if any)
      if (fixedParams) {
        allParams = { ...fixedParams };
      }

      // Add configurable params from user input (if any)
      if (params && params.length > 0) {
        params.forEach((param) => {
          const value =
            paramValues[param.name] ??
            param.defaultValue ??
            (param.type === "number" ? 0 : "");
          allParams[param.name] =
            param.type === "number" ? Number(value) : String(value);
        });
      }

      // Determine how to return params based on what we have
      const totalParamCount = Object.keys(allParams).length;

      if (totalParamCount === 0) {
        // No params at all
        return { action, params: null };
      } else if (totalParamCount === 1) {
        // Single param - return just the value (not an object)
        const singleValue = allParams[Object.keys(allParams)[0]];
        return { action, params: singleValue };
      } else {
        // Multiple params - return as object
        return { action, params: allParams };
      }
    }, [action, params, fixedParams, paramValues]);

    const handleClick = useCallback(() => {
      onSendCommand(buildCommand());
    }, [buildCommand, onSendCommand]);

    // Simple button for commands without params
    if (!hasParams) {
      return (
        <Button
          variant={variant}
          onClick={handleClick}
          aria-label={`Send ${action} command`}
          className={`w-full transition-all ${classname ?? ""}`}
        >
          {label}
        </Button>
      );
    }

    // Expandable command with params
    return (
      <div className="flex flex-col gap-2">
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={toggleExpanded}
            aria-label={`${
              isExpanded ? "Collapse" : "Expand"
            } ${label} parameters`}
            className="w-10 h-10 shrink-0"
          >
            {isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>
          <Button
            variant={variant}
            onClick={handleClick}
            aria-label={`Send ${action} command`}
            className={`flex-1 transition-all ${classname ?? ""}`}
          >
            {label}
          </Button>
        </div>

        {isExpanded && (
          <div className="ml-12 space-y-2 animate-in slide-in-from-top-2">
            {params.map((param) => (
              <div key={param.name} className="flex flex-col gap-1">
                <label
                  htmlFor={`${action}-${label}-${param.name}`}
                  className="text-xs text-muted-foreground"
                >
                  {param.label}
                </label>
                <input
                  id={`${action}-${label}-${param.name}`}
                  type={param.type}
                  value={paramValues[param.name] ?? param.defaultValue ?? ""}
                  onChange={(e) =>
                    handleParamChange(
                      param.name,
                      param.type === "number"
                        ? Number(e.target.value)
                        : e.target.value
                    )
                  }
                  className="px-3 py-2 text-sm border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder={`Enter ${param.label.toLowerCase()}`}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
);

CommandButton.displayName = "CommandButton";

export default CommandButton;
