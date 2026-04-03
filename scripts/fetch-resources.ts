#!/usr/bin/env tsx

import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";
import { config } from "dotenv";

config({ path: [".env.local", ".env"] });

const GITHUB_RAW =
  "https://api.github.com/repos/medusajs/medusa/contents/www/apps/resources/app";
const DOCS_BASE = "https://docs.medusajs.com/resources";

type Author = "medusa" | "community";
type Status = "built-in" | "module" | "plugin" | "guide";

interface GeneratedResource {
  id: string;
  name: string;
  href: string;
  type: Status;
  author: Author;
  sourceCategory: string;
  useCases: [];
}

function githubHeaders(): Record<string, string> {
  const token = process.env.GITHUB_TOKEN;
  return {
    Accept: "application/vnd.github+json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function fetchMdx(path: string): Promise<string> {
  const res = await fetch(`${GITHUB_RAW}/${path}`, {
    headers: githubHeaders(),
  });
  if (!res.ok) throw new Error(`GitHub API error: ${res.status} ${path}`);
  const data = (await res.json()) as { content: string };
  return Buffer.from(data.content, "base64").toString("utf-8");
}

function slugFromHref(href: string): string {
  return href.split("/").filter(Boolean).pop() ?? href;
}

function parseCardListItems(mdx: string): { title: string; href: string }[] {
  const items: { title: string; href: string }[] = [];
  const itemRegex =
    /\{\s*\n?\s*href:\s*"([^"]+)"[^}]*title:\s*"([^"]+)"|title:\s*"([^"]+)"[^}]*href:\s*"([^"]+)"/g;
  let match: RegExpExecArray | null;
  while ((match = itemRegex.exec(mdx)) !== null) {
    const href = match[1] ?? match[4];
    const title = match[2] ?? match[3];
    if (href && title) {
      items.push({ href, title });
    }
  }
  return items;
}

function parseByCategory(
  mdx: string,
  type: Status,
  author: Author
): { sourceCategory: string; items: Omit<GeneratedResource, "sourceCategory">[] }[] {
  const sections = mdx.split(/\n##\s+/);
  const result: { sourceCategory: string; items: Omit<GeneratedResource, "sourceCategory">[] }[] = [];

  for (const section of sections.slice(1)) {
    const sourceCategory = section.split("\n")[0].trim();
    const items = parseCardListItems(section).map(({ title, href }) => ({
      id: slugFromHref(href),
      name: title,
      href: `${DOCS_BASE}${href}`,
      type,
      author,
      useCases: [] as [],
    }));
    if (items.length > 0) {
      result.push({ sourceCategory, items });
    }
  }

  return result;
}

async function fetchModules(): Promise<GeneratedResource[]> {
  console.log("Fetching commerce modules...");
  const mdx = await fetchMdx("commerce-modules/page.mdx");
  const items = parseCardListItems(mdx).map(({ title, href }) => ({
    id: slugFromHref(href),
    name: title,
    href: `${DOCS_BASE}${href}`,
    type: "built-in" as const,
    author: "medusa" as const,
    sourceCategory: "Commerce Modules",
    useCases: [] as [],
  }));
  console.log(`  Found ${items.length} modules`);
  return items;
}

async function fetchIntegrations(): Promise<GeneratedResource[]> {
  console.log("Fetching integrations...");
  const mdx = await fetchMdx("integrations/page.mdx");
  const sections = parseByCategory(mdx, "guide", "medusa");
  const items: GeneratedResource[] = sections.flatMap(({ sourceCategory, items }) =>
    items.map((item) => ({ ...item, sourceCategory }))
  );
  const total = items.length;
  console.log(`  Found ${sections.length} categories, ${total} integrations`);
  return items;
}

async function main() {
  const [modules, integrations] = await Promise.all([
    fetchModules(),
    fetchIntegrations(),
  ]);

  const data: GeneratedResource[] = [...modules, ...integrations];

  const outputPath = join(process.cwd(), "data", "resources-generated.json");
  mkdirSync(join(process.cwd(), "data"), { recursive: true });
  writeFileSync(outputPath, JSON.stringify(data, null, 2));
  console.log(`\nSaved ${data.length} resources to ${outputPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
