"use client";

import type { UseCase, WizardState } from "../../types/wizard";

const USE_CASES: { id: UseCase; label: string; description: string }[] = [
  {
    id: "b2c",
    label: "B2C",
    description: "Store for individual customers",
  },
  {
    id: "b2b",
    label: "B2B",
    description: "Platform for business customers",
  },
];

interface Props {
  state: WizardState;
  onChange: (state: Partial<WizardState>) => void;
}

export function StepUseCases({ state, onChange }: Props) {
  function toggle(id: UseCase) {
    const current = state.useCases;
    const next = current.includes(id)
      ? current.filter((u) => u !== id)
      : [...current, id];
    onChange({ useCases: next });
  }

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold">What kind of store do you want to build?</h2>
        <p className="mt-2 text-gray-500 dark:text-gray-400">
          You can choose both
        </p>
      </div>

      <div className="flex gap-6">
        {USE_CASES.map(({ id, label, description }) => {
          const selected = state.useCases.includes(id);
          return (
            <button
              key={id}
              onClick={() => toggle(id)}
              className={`w-48 rounded-xl border-2 p-8 text-center transition-all cursor-pointer
                ${selected
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-950"
                  : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                }`}
            >
              <div className="text-3xl font-bold">{label}</div>
              <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                {description}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
