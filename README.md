# BudgetFlow — Budget & Time Tracker

A full-featured personal finance and time tracking app built with Vue 3, TypeScript, and Bun.

## Tech Stack

- **Vue 3** — Composition API with `<script setup>`
- **TypeScript** — Strict mode throughout
- **Bun** — Package manager & dev server
- **Vite** — Lightning-fast bundler
- **Pinia** — State management with localStorage persistence
- **Vue Router** — Client-side navigation
- **Chart.js + vue-chartjs** — Interactive charts
- **VueUse** — Composable utilities

## Features

### Dashboard
- Animated summary cards (income, expenses, balance, hours)
- Expense breakdown doughnut chart
- Monthly income vs expenses bar chart
- Recent transactions and time entries

### Budget Tracker
- Add/edit/delete transactions with validation
- Filter by type, category, and search
- Running balance with income/expense breakdown
- Color-coded: green for income, red for expenses

### Time Tracker
- Live stopwatch with Start / Pause / Stop
- Project tagging before starting
- Inline description editing after stopping
- Weekly hours bar chart
- Daily hours summary

### Reports
- Date range picker (this week / month / last month / custom)
- Expense pie chart by category
- Income vs expenses by month
- Time by project breakdown
- Export to CSV (budget + time data)
- Print to PDF via browser print

## Setup

```bash
# Install dependencies
bun install

# Start dev server
bun dev

# Type check
bun type-check

# Build for production
bun build

# Preview production build
bun preview
```

## Project Structure

```
src/
  assets/         # CSS: variables, reset, typography, main
  components/     # Reusable UI components
  composables/    # useLocalStorage, useTimer, useCurrency, useExport
  router/         # Vue Router config
  stores/         # Pinia: budgetStore, timeStore, toastStore
  types/          # TypeScript interfaces
  utils/          # formatters, dateHelpers
  views/          # Dashboard, Budget, TimeTracker, Reports
```

## Deployment

Deployed automatically to Netlify via `netlify.toml`. Single-page app redirects are handled for client-side routing.

## Screenshots

<!-- Add screenshots here after deployment -->

## License

MIT
