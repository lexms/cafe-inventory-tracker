# Cafe Inventory Tracker

An offline-first web application built for a church coffee team to track inventory. The app is built with Next.js, TailwindCSS, and works offline with local storage.

## Features

- Secure access with a shared password
- Add and manage inventory items
- Offline support for using the app without internet
- Mobile-first responsive design
- PWA support for installing on devices

## Tech Stack

- Next.js (App Router)
- TailwindCSS
- ShadcnUI for UI components
- Local storage for offline data persistence
- PWA support with next-pwa

## Getting Started

First, install the dependencies:

```bash
pnpm install
```

Then, run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Password

The shared password for accessing the app is: `hillsongcoffee`

## Building for Production

To build the application for production:

```bash
pnpm build
```

Then you can start the production server:

```bash
pnpm start
```

## Deployment

This application is ready to be deployed to Vercel or any other hosting provider that supports Next.js.

## Progressive Web App (PWA)

This application is configured as a Progressive Web App which means it can be installed on mobile devices and desktop computers for offline use. When offline, the app will store all data locally and will sync when the connection is restored.

## Icon Attribution

The application uses placeholder icons that should be replaced with actual branding before production use.

## License

This project is meant for internal use only.
