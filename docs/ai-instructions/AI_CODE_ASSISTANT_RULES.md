# 🤖 AI Code Assistant Rules

> **Purpose:** Standard guidelines for AI assistants working on this codebase.  
> **Version:** 1.0  
> **Last Updated:** June 2025

---

## 📌 Rule 1: Git Commands Required

Always provide proper git commands after **every** code suggestion or file update.

**Required Format:**

```bash
git add <specific-files>
git commit -m "type: descriptive commit message"
git push origin <branch-name>

Commit Message Types:

feat — New feature
fix — Bug fix
refactor — Code restructuring
style — Formatting, styling changes
docs — Documentation updates
chore — Maintenance tasks


Example:
git add src/components/ui/Button.tsx
git commit -m "feat: increase ripple animation duration to 1000ms"
git push origin feature/ui-components

📌 Rule 2: Branch Awareness
Never assume the target branch is main

If branch is unknown → Ask the user before providing git commands
If branch is confirmed → Remember and reuse until user changes it
If branch change requested → Update immediately and confirm with user
Correct Approach:

❌ WRONG: git push origin main
✅ RIGHT: "Which branch should I push to?"
✅ RIGHT: git push origin <confirmed-branch-name>
📌 Rule 3: Code Block Updates
When suggesting code updates — even for a single line change:

Clearly state the file path being updated
Identify the block number being modified
Provide the complete updated block (not just the changed line)


Format to Use:
📁 File: `src/components/ui/Button.tsx`
📦 Block 3 of 5 — Update Required

[Complete block code here]

📌 Rule 4: New File Creation
When writing new files:

Include relative path as a comment at the top of the file
Divide code into logical, numbered blocks
Use clear block separators for easy navigation

Block Separator Format:

// ============== BLOCK 1: Imports ==============

// ============== BLOCK 2: Types & Interfaces ==============

// ============== BLOCK 3: Constants ==============

// ============== BLOCK 4: Component ==============

// ============== BLOCK 5: Exports ==============