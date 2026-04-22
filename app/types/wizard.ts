export type UseCase = "b2c" | "b2b";

export type SolutionStatus = "ready" | "configurable" | "plugin" | "buildable" | "missing";

export interface Solution {
  id: string;
  name: string;
  useCases: UseCase[];
  status?: SolutionStatus;
  description?: string;
  resourceIds?: string[];
  notes?: string;
  children?: Solution[];
}

export interface WizardState {
  useCases: UseCase[];
  selectedCategoryIds: string[];
}

export const WIZARD_STEPS = [
  { id: "use-cases", label: "Use Case" },
  { id: "categories", label: "Categories" },
  { id: "features", label: "Features" },
  { id: "summary", label: "Summary" },
] as const;

export type WizardStepId = (typeof WIZARD_STEPS)[number]["id"];
