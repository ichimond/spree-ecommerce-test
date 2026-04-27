# Spree Commerce E2E Testing

End-to-end testing for the [Spree](https://spreecommerce.org/) open-source e-commerce platform using Playwright. This repo contains two separate approaches, each in its own folder, to compare manual test authoring against AI-assisted development.

---

## Folders

### `manualCoding/`

Manual build of E2E tests for the Spree e-commerce storefront.

All test logic was written by hand. GitHub Copilot was available in the editor but was only used for auto-complete suggestions — no logic was generated or guided by AI.

### `withClaudeCode/`

E2E tests built with the assistance of [Claude Code](https://claude.ai/code) and the Playwright MCP server.

Claude Code drove test scenario creation through natural-language prompts. A `project-log.md` is maintained in this folder as a running summary of the prompt exchanges and decisions made throughout the session.
