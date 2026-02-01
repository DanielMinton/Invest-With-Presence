#!/bin/bash
# ======================
# GitHub Project Setup
# ======================
# Run this after installing GitHub CLI: brew install gh
# Then authenticate: gh auth login

REPO="DanielMinton/Invest-With-Presence"

echo "Creating milestones..."

# Phase 1: Hub Foundation
gh api repos/$REPO/milestones -f title="Phase 1: Hub Foundation" \
  -f description="Core hub infrastructure, authentication, and base components" \
  -f state="open"

# Phase 2: Hub Features
gh api repos/$REPO/milestones -f title="Phase 2: Hub Features" \
  -f description="Dashboard, briefings, document management, risk console" \
  -f state="open"

# Phase 3: Members Vault
gh api repos/$REPO/milestones -f title="Phase 3: Members Vault" \
  -f description="Client portal with secure document access and account views" \
  -f state="open"

# Phase 4: Public Site
gh api repos/$REPO/milestones -f title="Phase 4: Public Site" \
  -f description="Marketing site with parallax effects and contact forms" \
  -f state="open"

echo "Creating labels..."

# Layer labels
gh label create "layer:hub" --color "5319E7" --description "Internal operations hub" -R $REPO 2>/dev/null
gh label create "layer:members" --color "0E8A16" --description "Client members portal" -R $REPO 2>/dev/null
gh label create "layer:public" --color "1D76DB" --description "Public marketing site" -R $REPO 2>/dev/null
gh label create "layer:backend" --color "D93F0B" --description "API and backend services" -R $REPO 2>/dev/null

# Priority labels
gh label create "priority:critical" --color "B60205" --description "Must fix immediately" -R $REPO 2>/dev/null
gh label create "priority:high" --color "D93F0B" --description "Important, fix soon" -R $REPO 2>/dev/null
gh label create "priority:medium" --color "FBCA04" --description "Normal priority" -R $REPO 2>/dev/null
gh label create "priority:low" --color "0E8A16" --description "Nice to have" -R $REPO 2>/dev/null

# Type labels
gh label create "type:security" --color "B60205" --description "Security-related" -R $REPO 2>/dev/null
gh label create "type:performance" --color "5319E7" --description "Performance improvement" -R $REPO 2>/dev/null
gh label create "type:ux" --color "1D76DB" --description "User experience" -R $REPO 2>/dev/null

echo "Creating project board..."
gh project create --owner DanielMinton --title "Bastion Development" --format board 2>/dev/null

echo "Done! Visit https://github.com/$REPO/milestones to see milestones"
echo "Visit https://github.com/users/DanielMinton/projects to see project board"
