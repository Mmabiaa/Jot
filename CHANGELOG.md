# Changelog

All notable changes to the Jot project will be documented in this file.

## [Unreleased] - 2026-05-21

### Added
- **Recent Thought List**: A permanent grid view on the desk for captured thoughts, replacing the previous popup-only interface.
- **Visual Hierarchy**: Subtle visual distinctions for cards based on activity:
  - **Active Cards**: Recently touched cards (last 12 hours) now have a warmer glow and "Active" pulse.
  - **Stuck Cards**: Cards untouched for over 7 days appear slightly faded with soft time metadata.
- **Sacred "Today" Panel**: Redesigned the Focus Panel with a warmer, paper-like background and inset shadows to feel more intentional.
- **Designed Emptiness**: Improved the "Add Card" button with a dotted circular icon and "Place something on the desk" copy to make it feel like a physical spot on the desk.

### Fixed
- **Import Analysis Error**: Fixed broken imports in `src/routes/index.tsx` where components were incorrectly referenced from `@/components/Jot/` instead of `@/components/mesa/`.
- **UI Consistency**: Standardized spacing and typography across the dashboard to maintain the "quiet desk" atmosphere.

### Changed
- **Brain Dump Interaction**: Simplified the capture bar by removing the popup toggle, as thoughts are now always visible on the desk.
- **Branding**: Renamed component directory to `mesa` (Spanish for desk/table) to align with the project's grounded philosophy.
