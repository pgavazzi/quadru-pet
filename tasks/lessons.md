# Lessons

- **Scaffolders can write late.** `npm create vite` (run non-interactively)
  finished materializing template files after custom source files had already
  been written over them — App.tsx got clobbered back to boilerplate. After any
  scaffold command, verify the template is fully settled (`git status` / file
  contents) before writing custom files, or scaffold first and commit before
  editing.
