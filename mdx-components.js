import { useMDXComponents as getDocsMDXComponents } from 'nextra-theme-docs'
import { StarterVersion } from './app/components/StarterVersion'

const docsComponents = getDocsMDXComponents()

export function useMDXComponents(components) {
  return {
    ...docsComponents,
    StarterVersion,
    ...components
  }
}