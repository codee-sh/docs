import { useMDXComponents as getDocsMDXComponents } from "nextra-theme-docs";
import { StarterVersion } from "./app/components/StarterVersion";
import ResourceTreeData from "./app/components/resources/ResourceTreeData";

const docsComponents = getDocsMDXComponents();

export function useMDXComponents(components) {
  return {
    ...docsComponents,
    StarterVersion,
    ResourceTreeData,
    ...components,
  };
}
