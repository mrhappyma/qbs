# Quizbowl Score

##### (qbs)

A match scoring system based on [Lancaster-Lebanon Quiz Bowl League](https://www.qbwiki.com/wiki/Lancaster-Lebanon_League) format, but could probably be used for quite a bit more too.

## Screenshots

![scoring a match (dark mode)](demo-images/dark/score.png#gh-dark-mode-only)
![scoring a match (light mode)](demo-images/light/score.png#gh-light-mode-only)

![presenting scores](demo-images/present.png)
_gradients are customized per team_

![configuring match settings (dark mode)](demo-images/dark/match-settings.png#gh-dark-mode-only)
![configuring match settings (light mode)](demo-images/light/match-settings.png#gh-light-mode-only)

![configuring team settings (dark mode)](demo-images/dark/team-settings.png#gh-dark-mode-only)
![configuring team settings (light mode)](demo-images/light/team-settings.png#gh-light-mode-only)

## Development

This project uses the [t3 stack](https://create.t3.gg): next.js, tailwindcss, prisma, and trpc (all with typescript of course).

- Get started by cloning the repo
- `cd` into it and run `pnpm install`, or the similar command of some other package manager
- Create your `.env` file, and fill in the values following `.env.example` as an example. You'll need a google account and a postgresql server.
- Run `pnpm dev` (or again a similar command for your package manager) to start the development server
- Open `localhost:3000`
- Get to work!

### Adding a scoreboard ("present") layout

##### thank you for making things look nicer than i could ever make them :)

- Create a folder in [`/src/pages/match/[id]/present`](/src/pages/match/[id]/present). Create your `index.tsx` file based off an existing page.
- Add your page to [`/src/utils/present-list.ts`](/src/utils/present-list.ts). The "slug" is the name of the folder you created.
- Once you're done, take a screenshot and add it as [`/public/present-screenshots/[slug].png`](/public/present-screenshots/). Screenshots should be consistent! Please make sure it
  - Shows the entire screen
  - If the match title shows on the screen, it should be the same as the layout name
  - Team 1:
    - Called "Team 1"
    - Color 1: `#2e393a`
    - Color 2: `#459587`
  - Team 2:
    - Called "Team 2"
    - Color 1: `#f8ba2d`
    - Color 2: `#e23a45`
  - Each team should have a +5 +10 +15 and +5 event shown (total score of 25)
- Create a PR and wait for me to merge!
