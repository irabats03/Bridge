# Bridge

Bridge is a demo parenting guidance website for caregivers of children aged 4–18 in India. It includes an animated scroll story, light and dark themes, a parenting chat, sample insights, a psychologist directory, and demo checkout and booking flows.

## Run locally

Use Node.js 22.12 or later and npm.

```sh
npm ci
npm run dev
```

Chat uses sample replies by default. To enable live Gemini replies locally, copy `.env.example` to `.env.local`, set `GEMINI_API_KEY`, and restart the development server. The key is read on the server and stays out of the browser bundle.

Demo login: `parent@bridge.demo` / `Bridge@2026`. Profiles, payments, appointments, and calls in the demo are simulated.

## Verify and build

```sh
npm run check
npm run build
```

The build creates browser assets in `dist/client` and a Worker entry point in `dist/server/index.js`. For static hosting, serve `dist/client` and route application URLs to `index.html`. The Worker serves those routes and supports live chat when `GEMINI_API_KEY` is configured as a runtime secret.

Bridge offers general guidance. Its chat prioritizes the emergency response for serious breathing symptoms, and the site displays India's emergency number, 112.
