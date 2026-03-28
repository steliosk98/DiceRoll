# DiceRoll

A simple dice roller built with React and Vite.

You can choose how many dice to roll, select how many sides each die has, and click the table to animate the roll. Each die displays all of its faces and then settles into a clear 2D result so the final value is easy to read.

## Live Demo

GitHub Pages: https://steliosk98.github.io/DiceRoll/

## Features

- Choose between `1` and `6` dice
- Select dice with `4`, `6`, `8`, `10`, `12`, or `20` sides
- Click-to-roll interaction with a smooth animation
- Clear final result view for each die
- Static build that works well on GitHub Pages

## Tech Stack

- React
- Vite
- CSS
- SVG

## Run Locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

The production files are generated in `dist/`.

## Deploy To GitHub Pages

This project is configured for the repository:

- GitHub user: `steliosk98`
- Repository: `DiceRoll`
- Pages URL: `https://steliosk98.github.io/DiceRoll/`

The Vite base path is already set for GitHub Pages, and the repo now includes a GitHub Actions workflow for automatic deployment.

### One-time setup

1. Push this project to the `DiceRoll` GitHub repository.
2. Push your changes to the `main` branch.

### GitHub Pages settings

In your GitHub repository:

1. Go to `Settings`
2. Open `Pages`
3. Under `Build and deployment`, set:
   Source: `GitHub Actions`
4. Save

After that, GitHub Pages should serve the site at:

`https://steliosk98.github.io/DiceRoll/`

### How deployment works

- Every push to `main` triggers the workflow in `.github/workflows/deploy.yml`
- GitHub Actions installs dependencies, builds the Vite app, and publishes `dist/` to GitHub Pages
- You can also run the workflow manually from the `Actions` tab using `workflow_dispatch`
