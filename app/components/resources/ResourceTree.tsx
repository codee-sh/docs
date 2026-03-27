"use client";

import { useState } from "react";
import type { ResourceCategory, Status } from "./resource-tree-types";

const STATUS_CONFIG: Record<Status, { label: string; classes: string }> = {
  "built-in": {
    label: "Built-in",
    classes:
      "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  },
  plugin: {
    label: "Plugin",
    classes: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  },
};

function StatusBadge({ status }: { status: Status }) {
  const config = STATUS_CONFIG[status];
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${config.classes}`}
    >
      {config.label}
    </span>
  );
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{
        transition: "transform 0.2s",
        transform: open ? "rotate(90deg)" : "rotate(0deg)",
      }}
    >
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

export function ResourceTree({ data }: { data: ResourceCategory[] }) {
  const [openCategories, setOpenCategories] = useState<Set<string>>(
    () => new Set()
  );

  function toggle(category: string) {
    setOpenCategories((prev) => {
      const next = new Set(prev);
      if (next.has(category)) {
        next.delete(category);
      } else {
        next.add(category);
      }
      return next;
    });
  }

  return (
    <div className="my-6">
      <div className="mb-4 flex flex-wrap gap-3 text-sm">
        {Object.values(STATUS_CONFIG).map(({ label, classes }) => (
          <span key={label} className="flex items-center gap-1.5">
            <span
              className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${classes}`}
            >
              {label}
            </span>
          </span>
        ))}
      </div>

      <div className="divide-y divide-gray-200 dark:divide-gray-700 rounded-lg border border-gray-200 dark:border-gray-700">
        {data.map(({ category, items }) => {
          const isOpen = openCategories.has(category);
          return (
            <div key={category}>
              <button
                onClick={() => toggle(category)}
                className="flex w-full items-center justify-between px-4 py-3 text-left font-semibold bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <ChevronIcon open={isOpen} />
                  <span>{category}</span>
                </span>
                <span className="text-xs font-normal text-gray-400">
                  {items.length}
                </span>
              </button>

              {isOpen && (
                <ul className="divide-y divide-gray-100 dark:divide-gray-800">
                  {items.map(({ name, status, href }) => (
                    <li
                      key={name}
                      className="flex items-center justify-between pl-10 pr-4 py-2 text-sm text-gray-700 dark:text-gray-300"
                    >
                      {href ? (
                        <a
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline text-inherit"
                        >
                          {name}
                        </a>
                      ) : (
                        <span>{name}</span>
                      )}
                      <StatusBadge status={status} />
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
