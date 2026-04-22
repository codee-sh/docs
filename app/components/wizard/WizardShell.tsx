"use client";

import { useState } from "react";
import { WIZARD_STEPS, type WizardState } from "../../types/wizard";
import { StepUseCases } from "./StepUseCases";

const INITIAL_STATE: WizardState = {
  useCases: [],
  selectedCategoryIds: [],
};

function StepIndicator({ currentIndex }: { currentIndex: number }) {
  return (
    <div className="flex items-center gap-2">
      {WIZARD_STEPS.map((step, i) => (
        <div key={step.id} className="flex items-center gap-2">
          <div
            className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold transition-colors
              ${i < currentIndex
                ? "bg-blue-500 text-white"
                : i === currentIndex
                  ? "border-2 border-blue-500 text-blue-500"
                  : "border-2 border-gray-200 text-gray-400 dark:border-gray-700"
              }`}
          >
            {i < currentIndex ? "✓" : i + 1}
          </div>
          <span
            className={`text-sm ${i === currentIndex ? "font-semibold" : "text-gray-400 dark:text-gray-500"}`}
          >
            {step.label}
          </span>
          {i < WIZARD_STEPS.length - 1 && (
            <div className={`h-px w-8 ${i < currentIndex ? "bg-blue-500" : "bg-gray-200 dark:bg-gray-700"}`} />
          )}
        </div>
      ))}
    </div>
  );
}

function canProceed(step: number, state: WizardState): boolean {
  if (step === 0) return state.useCases.length > 0;
  if (step === 1) return state.selectedCategoryIds.length > 0;
  return true;
}

export function WizardShell() {
  const [step, setStep] = useState(0);
  const [state, setState] = useState<WizardState>(INITIAL_STATE);

  function update(partial: Partial<WizardState>) {
    setState((prev) => ({ ...prev, ...partial }));
  }

  function renderStep() {
    switch (step) {
      case 0:
        return <StepUseCases state={state} onChange={update} />;
      default:
        return (
          <div className="text-center text-gray-400">
            Step {step + 1} - coming soon
          </div>
        );
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-var(--nextra-navbar-height)-var(--nextra-footer-height,80px))] flex-col">
      {/* Step indicator */}
      <div className="flex justify-center border-b border-gray-200 py-4 dark:border-gray-800">
        <StepIndicator currentIndex={step} />
      </div>

      {/* Content */}
      <div className="flex flex-1 items-center justify-center px-6 py-16">
        {renderStep()}
      </div>

      {/* Fixed bottom bar */}
      <div className="sticky bottom-0 border-t border-gray-200 bg-white px-8 py-4 dark:border-gray-800 dark:bg-gray-950">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <button
            onClick={() => setStep((s) => s - 1)}
            disabled={step === 0}
            className="rounded-lg border border-gray-200 px-6 py-2 text-sm font-medium transition-colors hover:bg-gray-50 disabled:opacity-30 dark:border-gray-700 dark:hover:bg-gray-900"
          >
            ← Back
          </button>
          <span className="text-sm text-gray-400">
            {step + 1} / {WIZARD_STEPS.length}
          </span>
          <button
            onClick={() => setStep((s) => s + 1)}
            disabled={!canProceed(step, state) || step === WIZARD_STEPS.length - 1}
            className="rounded-lg bg-blue-500 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-600 disabled:opacity-30"
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
}
