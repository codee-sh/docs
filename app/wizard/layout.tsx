import type { ReactNode } from "react";
import "./wizard.css";

export default function WizardLayout({ children }: { children: ReactNode }) {
  return <div className="wizard-layout">{children}</div>;
}
