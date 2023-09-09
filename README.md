# Nuxt 3 Minimal Starter

Look at the [Nuxt 3 documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install the dependencies:

```bash
yarn install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
yarn dev
```

## Production

Build the application for production:

```bash
yarn build
```

Locally preview production build:

```bash
yarn preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.

## Project log

This section outlines my thoughts while developing this project. It should give insight into my development progress and thoughts.

---

On first look this seems to be a pretty simple dashboard, with easy-to-follow designs and an API that suits this use case. My initial thoughts are to create a fairly standard Nuxt site with three pages – Landing, List of birdhouses, and Single birdhouse.

I've put together [This MVP issue](https://github.com/DanielOaks/shockbyte-birdhouse-admin/issues/1) which outlines all the features this site **must** contain. And this [Map mode issue](https://github.com/DanielOaks/shockbyte-birdhouse-admin/issues/2) describing a fancy 'map display' that I think would really suit this project once I've got the base functionality.

---

I've created the Nuxt base and landing page, and now I'm thinking about how and when to load the data from the API. I might make a separate JS module that only handles comms with the API, that makes sense.

There's also an issue around the navbar in the footer. It could paginate just the list of birdhouses, but could also paginate different elements on each page (e.g. on the Birdhouse Overview tab it paginates the dates, on the Graph tab it paginates the time). The footer stretches underneath the sidebar+wrapper, and it doesn't make a lot of sense for it to be there if it paginates different elements inside the content box – normally I'd want to clarify this with design. I'll tackle this element a bit later and see what makes the most sense.

---

Importing the icons has been a bit annoying. I've ended up with [nuxt-svgo](https://nuxt.com/modules/nuxt-svgo) to handle loading svgs as inline elements, as it's by far the easiest way to get things up and running.
