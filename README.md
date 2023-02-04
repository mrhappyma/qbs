# Quizbowl Score

##### (qbs)

A match scoring system based on [Lancaster-Lebanon Quiz Bowl League](https://www.qbwiki.com/wiki/Lancaster-Lebanon_League) format, but could probably be used for quite a bit more too.

## Screenshots

![scoring a match (dark mode)](demo-images/dark/score.png#gh-dark-mode-only)
![scoring a match (light mode)](demo-images/light/score.png#gh-light-mode-only)

![presenting scores](demo-images/present.png)
*gradients are customized per team*

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
