# PopKizV2

A soft & pastel themed webapp to wish your favourite ones a happy birthday. Built with Vite + GSAP, Sequel to [PopKiz](https://github.com/FireHead90544/PopKiz)

## Demo
A live static demo can be found [here](https://firehead90544.github.io/PopKizV2).

## Installation

- Clone the repository & cd into it
```bash
git clone https://github.com/FireHead90544/PopKizV2
cd PopKizV2
```
- Run the development server
```bash
npm run start
```
- Open [http://localhost:5173](http://localhost:5173) to view it in the browser.

## Configuration

Edit `public/customize.json` to customize everything from name to messages to images. A sample template has been provided. Once done, the static build can be generated using `npm run build` which can be served directly using gh-pages or any other static hosting.

## Deployment

Run `npm run build` to generate a static build in `dist/` directory. Deploy it on any static hosting service. To deploy on `gh-pages`:

- Update the `homepage` url to `https://yourusername.github.io/RepoName/` in `package.json`.
- Create a `vite.config.js` with the following content
```js
import { defineConfig } from 'vite'

export default defineConfig({
  base: "/RepoName/"
})
```
- Update all the paths in `public/customize.json` file accordingly, if required.
- Run `npm run deploy`
- Configure the [deployment settings](https://github.com/gitname/react-gh-pages?tab=readme-ov-file#8-configure-github-pages), if needed.

## Inspiration

Dedicated to my super-cool friend Kizzy :3, that's where it got the name xD

Do check out [faahim/happy-birthday](https://github.com/faahim/happy-birthday), that's where the GSAP magic comes from.
