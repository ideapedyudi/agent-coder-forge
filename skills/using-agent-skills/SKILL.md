---
name: using-agent-skills
description: Selects the most suitable project-local skill or combination of skills for a task by matching its intent, technology, and workflow needs. Use before implementing tasks that may benefit from specialized guidance or when it is unclear which skill should be activated.
---

# Using Agent Skills

Act as the routing layer for the skills available in this project. Choose the smallest set of relevant skills before planning or implementing work.

## Routing Process

1. Identify the task's intent, technology, risk, and scope.
2. Read `skills/README.md` to discover the project-local skill catalog.
3. Read the `SKILL.md` file for each likely candidate before selecting it.
4. Choose one primary skill and only the supporting skills that add necessary guidance.
5. Load the selected skills before starting the work they govern.
6. If no specialized skill matches, continue with the standard engineering workflow.

## Selection Rules

- Prefer the most specific skill over a broad skill.
- Combine skills when the task spans distinct concerns, such as a full-stack feature with database changes and UI work.
- Do not load every potentially related skill; avoid overlapping guidance that does not affect the task.
- Treat prerequisite skills as mandatory when their descriptions require them, especially for Figma operations.
- Use `interview-me` when the request is underspecified before choosing implementation skills.
- Use `spec-driven-development` when a new feature or significant change needs a specification first.
- Use `incremental-implementation` for multi-file changes or work that should be delivered in thin, testable slices.
- Use `code-simplification` after behavior is working when the implementation needs clarity or reduced complexity.
- Use `code-reviewer` when the primary goal is a broad review; add `security-reviewer` when security is a specific concern.

## Skill Routing Guide

### Workflow And Quality

- Commit or push changes: `git-commit`
- Tests fail, builds break, or unexpected errors need root-cause analysis: `debugging-and-error-recovery`
- Review code, diffs, or pull requests: `code-reviewer`
- Security audit or vulnerability remediation: `security-reviewer`
- Reverse-engineer an undocumented codebase: `spec-miner`
- Challenge a plan or decision: `the-fool`
- Design or evaluate prompts: `prompt-engineer`
- Transcribe or summarize YouTube: `transkrip-youtube`
- Build real-time WebSocket or Socket.IO systems: `websocket-engineer`

### Languages And Frameworks

- Express or Node.js backend: `express-nodejs-expert`
- NestJS modules, controllers, services, guards, or DTOs: `nestjs-expert`
- Next.js App Router or server components: `nextjs-developer`
- React web application: `react-expert`
- React Native or Expo mobile application: `react-native-expert`
- Vue, Nuxt, Pinia, or Vite: `vue-expert`
- JavaScript or browser APIs without a framework: `javascript-pro`
- Advanced TypeScript types or type-safe APIs: `typescript-pro`
- Python application or typed async Python: `python-pro`
- Go concurrency, microservices, or gRPC: `golang-pro`
- Rust ownership, async, or systems programming: `rust-engineer`
- SQL query, schema, indexing, or optimization: `sql-pro`
- shadcn/ui components, registries, presets, or `components.json`: `shadcn`

### Databases And APIs

- MongoDB connection pools, timeouts, or client configuration: `mongodb-connection`
- MongoDB MCP credentials or server setup: `mongodb-mcp-setup`
- MongoDB natural-language queries or aggregations: `mongodb-natural-language-querying`
- MongoDB schema modeling or migrations: `mongodb-schema-design`
- MongoDB slow queries or index optimization: `mongodb-query-optimizer`
- MongoDB Atlas Search, Vector Search, or hybrid search: `mongodb-search-and-ai`
- MongoDB Atlas Stream Processing: `mongodb-atlas-stream-processing`
- REST, GraphQL, resource modeling, or OpenAPI design: `api-designer`
- Postman collections, mocks, SDKs, or API lifecycle workflows: `postman`
- API readiness for AI agents: `postman-api-readiness`

### Documentation And Testing

- Current library, framework, SDK, CLI, or cloud-service documentation: `context7-mcp`
- Broad developer documentation and API reference lookup: `find-docs`
- Playwright E2E tests, browser automation, fixtures, or visual regression: `playwright-expert`

### Figma

- Figma Code Connect mappings: `figma-code-connect`
- Create a new Figma, FigJam, or Slides file: `figma-create-new-file`
- Translate Figma designs into application code: `figma-design-to-code`
- Translate application screens into Figma: `figma-generate-design`
- Generate diagrams in FigJam: `figma-generate-diagram`
- Build Figma design-system libraries or components: `figma-generate-library`
- Implement Figma motion in application code: `figma-implement-motion`
- Translate between Figma and SwiftUI: `figma-swiftui`
- Execute Figma Plugin API operations: `figma-use`
- Execute FigJam-specific Figma operations: `figma-use-figjam`
- Inspect or implement Figma motion through Plugin API: `figma-use-motion`
- Execute Slides-specific Figma operations: `figma-use-slides`

## Output Before Work

State the routing decision briefly:

```text
Primary skill: <skill>
Supporting skills: <skill or none>
Reason: <one sentence>
```

Then load the selected skills and continue with the task. Do not present a long catalog unless the user asks for the reasoning or available options.
