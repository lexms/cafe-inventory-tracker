/**
 * This script completely removes the service worker and clears all caches
 * Useful for testing and debugging offline functionality
 * Run with: node clean-sw.js
 */

const fs = require('fs');
const path = require('path');

console.log('Cleaning service worker and cache files for testing...');

// Service worker files to remove
const swFiles = [
  path.join(process.cwd(), 'public', 'sw.js'),
  path.join(process.cwd(), 'public', 'sw.js.map'),
  path.join(process.cwd(), 'public', 'workbox-*.js'),
  path.join(process.cwd(), 'public', 'workbox-*.js.map'),
  path.join(process.cwd(), 'public', 'worker-*.js'),
  path.join(process.cwd(), 'public', 'worker-*.js.map')
];

// Find and delete all matching files
const findAndDeleteFiles = (pattern) => {
  const dir = path.dirname(pattern);
  const basename = path.basename(pattern);
  
  if (!fs.existsSync(dir)) {
    return;
  }
  
  const files = fs.readdirSync(dir);
  const regex = new RegExp(basename.replace('*', '.*'));
  
  files.forEach(file => {
    if (regex.test(file)) {
      const filePath = path.join(dir, file);
      try {
        fs.unlinkSync(filePath);
        console.log(`Deleted: ${filePath}`);
      } catch (error) {
        console.error(`Failed to delete ${filePath}:`, error);
      }
    }
  });
};

// Delete each service worker file
swFiles.forEach(file => {
  if (file.includes('*')) {
    findAndDeleteFiles(file);
  } else if (fs.existsSync(file)) {
    try {
      fs.unlinkSync(file);
      console.log(`Deleted: ${file}`);
    } catch (error) {
      console.error(`Failed to delete ${file}:`, error);
    }
  }
});

console.log('\nService worker files removed.');
console.log('\nTo completely reset service worker:');
console.log('1. Open your browser Developer Tools');
console.log('2. Navigate to Application > Service Workers');
console.log('3. Click "Unregister" for any service workers');
console.log('4. Go to Application > Storage > Clear site data');
console.log('5. Reload the page and test offline functionality from scratch');
console.log('\nRebuild the app with: pnpm build:pwa'); 