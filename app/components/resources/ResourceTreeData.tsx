import { ResourceTree } from "./ResourceTree";
import type { ResourceCategory } from "./resource-tree-types";

const DOCS_BASE = "https://docs.medusajs.com";
const MODULES_URL = `${DOCS_BASE}/resources/commerce-modules/index.html.md`;
const INTEGRATIONS_URL = `${DOCS_BASE}/resources/integrations/index.html.md`;

function fixDocsUrl(href: string): string {
  return href.replace(DOCS_BASE + "/", DOCS_BASE + "/resources/");
}

async function fetchModules(): Promise<ResourceCategory> {
  try {
    const res = await fetch(MODULES_URL, { next: { revalidate: 86400 } });
    if (!res.ok) throw new Error(`Fetch error: ${res.status}`);
    const text = await res.text();
    return {
      category: "Commerce Modules",
      items: parseMarkdownLinks(text).map((item) => ({
        ...item,
        status: "built-in" as const,
      })),
    };
  } catch {
    return { category: "Commerce Modules", items: [] };
  }
}

async function fetchIntegrations(): Promise<ResourceCategory[]> {
  try {
    const res = await fetch(INTEGRATIONS_URL, { next: { revalidate: 86400 } });
    if (!res.ok) throw new Error(`Fetch error: ${res.status}`);
    const text = await res.text();
    return parseMarkdownByCategory(text);
  } catch {
    return [];
  }
}

function parseMarkdownLinks(text: string): { name: string; href: string }[] {
  const items: { name: string; href: string }[] = [];
  for (const line of text.split("\n")) {
    const match = line.match(/^-\s+\[([^\]]+)\]\(([^)]+)\)/);
    if (match) {
      items.push({ name: match[1].trim(), href: fixDocsUrl(match[2].trim()) });
    }
  }
  return items;
}

function parseMarkdownByCategory(text: string): ResourceCategory[] {
  const categories: ResourceCategory[] = [];
  let current: ResourceCategory | null = null;

  for (const line of text.split("\n")) {
    const heading = line.match(/^##\s+(.+)/);
    if (heading) {
      current = { category: heading[1].trim(), items: [] };
      categories.push(current);
      continue;
    }

    if (!current) continue;

    const link = line.match(/^-\s+\[([^\]]+)\]\(([^)]+)\)/);
    if (link) {
      current.items.push({
        name: link[1].trim(),
        status: "plugin",
        href: fixDocsUrl(link[2].trim()),
      });
    }
  }

  return categories.filter((c) => c.items.length > 0);
}

export default async function ResourceTreeData() {
  const [modulesCategory, integrationCategories] = await Promise.all([
    fetchModules(),
    fetchIntegrations(),
  ]);

  const data = [modulesCategory, ...integrationCategories];

  return <ResourceTree data={data} />;
}
