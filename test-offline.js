/**
 * This script helps test offline functionality
 * Run it after building your app with `node test-offline.js`
 */

const fs = require('fs');
const path = require('path');

// Check if the service worker is being generated correctly
console.log('Checking for service worker...');
const swPath = path.join(process.cwd(), 'public', 'sw.js');

if (fs.existsSync(swPath)) {
  console.log('✅ Service worker exists');
  
  // Check size to ensure it's not empty
  const stats = fs.statSync(swPath);
  if (stats.size > 100) {
    console.log(`✅ Service worker size looks good (${stats.size} bytes)`);
  } else {
    console.log(`❌ Service worker file is too small (${stats.size} bytes). It might be empty or incomplete.`);
  }
  
  // Check if it contains expected content
  const content = fs.readFileSync(swPath, 'utf8');
  if (content.includes('precacheAndRoute') && content.includes('registerRoute')) {
    console.log('✅ Service worker contains expected caching code');
  } else {
    console.log('❌ Service worker is missing expected caching code');
  }
} else {
  console.log('❌ Service worker file not found! Build may have failed.');
}

// Check fallback HTML
const fallbackPath = path.join(process.cwd(), 'public', 'fallback.html');
if (fs.existsSync(fallbackPath)) {
  console.log('✅ Fallback HTML exists');
} else {
  console.log('❌ Fallback HTML not found!');
}

// Check for workbox files
const workboxFile = fs.readdirSync(path.join(process.cwd(), 'public'))
  .find(file => file.startsWith('workbox-'));

if (workboxFile) {
  console.log(`✅ Workbox runtime file found: ${workboxFile}`);
} else {
  console.log('❌ Workbox runtime file not found!');
}

console.log('\n--- HOW TO TEST OFFLINE MODE ---');
console.log('1. Build your app with `pnpm build`');
console.log('2. Start your app with `pnpm start`');
console.log('3. Open your browser and navigate to your app');
console.log('4. Open DevTools (F12) and go to Application > Service Workers');
console.log('5. Verify the service worker is registered');
console.log('6. Go to Network tab and check "Offline" to simulate offline mode');
console.log('7. Refresh the page - it should still work!');
console.log('\nTIP: If not working, try navigating to each page while online first.');
console.log('     Then go offline and test each page again.'); 