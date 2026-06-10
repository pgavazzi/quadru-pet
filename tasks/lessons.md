# Lessons

- **A product configuration option means different hardware, not disabled
  hardware.** For "hind-assist" I first built powered-vs-passive actuators;
  Paolo's intent was a cheaper SKU with the front rigs physically absent.
  In configurator UIs, default to omitting the component (geometry, tree,
  controls) rather than graying it out — and when a toggle could mean either
  "off" or "not installed", check which one before building.

- **Scaffolders can write late.** `npm create vite` (run non-interactively)
  finished materializing template files after custom source files had already
  been written over them — App.tsx got clobbered back to boilerplate. After any
  scaffold command, verify the template is fully settled (`git status` / file
  contents) before writing custom files, or scaffold first and commit before
  editing.
