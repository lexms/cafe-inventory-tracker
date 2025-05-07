# Offline Mode Guide for Cafe Inventory Tracker

This guide explains how to properly test and use the offline functionality of the Cafe Inventory Tracker app.

## How Offline Mode Works

The Cafe Inventory Tracker is designed as a Progressive Web App (PWA) that works offline after your first visit. Here's how it works:

1. When you first visit the app online, a service worker is installed that caches key resources.
2. Data is stored in your browser's localStorage, so you can view and edit inventory even without an internet connection.
3. If you go offline, the app will continue to function, showing a small notification that you're in offline mode.
4. When you reconnect, any changes made offline will be preserved.

## Requirements for Offline Mode

- You must visit the app at least once while online before it will work offline.
- You must log in at least once while online (entering the password: `hillsongcoffee`).
- Modern browser with service worker support (Chrome, Firefox, Safari, Edge).

## Testing the Offline Functionality

### Development Testing

1. Build the PWA:
   ```
   pnpm build:pwa
   ```

2. Start the server:
   ```
   pnpm start:pwa
   ```

3. Open your browser and visit `http://localhost:3000`

4. Log in with the password: `hillsongcoffee` (this is important to do while online)

5. Visit the inventory page

6. Simulate offline mode in your browser:
   - Chrome/Edge: Open DevTools (F12) → Network tab → Check "Offline"
   - Firefox: Open DevTools (F12) → Network tab → Check "Offline"
   - Safari: Developer menu → Network conditions → Check "Offline"

7. Refresh the page - the app should still work!

8. Try adding/removing inventory items - changes should persist even when offline.

### Real-World Testing

1. Visit the app on your device with an internet connection.
2. Log in and visit all the main pages (home, inventory).
3. Turn off your device's internet connection (airplane mode or disable Wi-Fi/cellular data).
4. Reopen the app - it should load and function properly.

## Troubleshooting

If offline mode isn't working:

1. **Clear browser cache and reload**: Sometimes you need to refresh the service worker.
   - Go to DevTools → Application → Storage → Clear site data
   - Reload the page while online and try again

2. **Check service worker status**: 
   - Go to DevTools → Application → Service Workers
   - Make sure there's an active service worker for the site

3. **Install as PWA**: For the best offline experience, install the app to your device:
   - Chrome/Edge: Click the install icon in the address bar
   - Safari iOS: Tap the share button, then "Add to Home Screen"

4. **Run verification script**:
   ```
   pnpm check:offline
   ```
   This will check if all required files for offline functionality are present.

## How to Use While Offline

- Add inventory items as usual - they'll be stored locally
- When you come back online, the items will still be there
- The "Offline" indicator will appear when you're working without a connection
- For best results, consider installing the app to your home screen

## Common Issues

- **"App not working offline"**: Make sure you've visited and logged in while online first
- **"Data not saving"**: Check if you're in private/incognito mode, which may block local storage
- **"Can't log in offline"**: First-time authentication requires an internet connection

## Technical Details

The offline functionality is implemented using:

- Service Worker for caching static assets
- localStorage for data persistence
- React state management for UI updates
- Network status detection for offline indicators 