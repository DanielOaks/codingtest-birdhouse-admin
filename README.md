# Shockbyte BirdHouses Admin Panel

Move aside game servers, we've got a new task! This dashboard shows the status of all birdhouses using Shockbyte's innovative technology.

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

---

Having more of a think about the pagination in the footer, there's not any reason to include it on the birdhouse overview page unless it does paginate days and the like there as well. For now I'm going to have it be an element of the main content bit, and have the sidebar take up the entire left of the screen instead.

---

Alrighty, I've now got a very basic js lib ready, which is being made accessible via the birdhouseApi Nuxt plugin here. I'm a bit unsure of how to best integrate Pinia stores into the site, since with the pagination arbitrary pages can be grabbed... Perhaps I could store everything as a map/dict where the key is the page number and the value are the list of entries on that page, but that feels a bit naïve. I'm gonna do some sketches to see if I can work out how I want this to function.

After some sketching I've come to this as a rough layout:

- Birdhouses: Map, each page to a list of UBIDs.
- BhRegistration: Map, each UBID to the reg info (birdhouse if it exists).
- BhOccupancy: Map, each UBID to a map of paginated occupancy details.

I've asked for feedback on the footer pagination item, to see if we are paginating the occupancy details or not. If we are, the above would work!

---

So the footer on the single birdhouse page does paginate the occupancy numbers, hmm. I can make this work, but it may be a bit strange using it on the overview vs on the graph.

On the upside, we are now successfully grabbing occupancy data on the list page. However, it does add a lot of waiting (I'm guessing the API isn't hosted in Australia). Because of that I've had to add a loading modal, and I've also added a way to disable those extra API calls via an environment variable. Ideally we'd be returning the current occupancy figures in the registration API response. With this I think the list page is now feature complete, hooray!

It is time to do a decent cleanup though. Things are a bit messy, especially in the Birdhouses store. I'll try to do that, and allow paginating the occupancy details (right now it's a simple list and doesn't take paging into account), before diving into any other tasks.
