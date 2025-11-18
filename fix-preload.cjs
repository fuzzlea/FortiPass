#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const preloadPath = path.join(__dirname, 'dist-electron', 'preload.js');
const preloadCjsPath = path.join(__dirname, 'dist-electron', 'preload.cjs');

if (fs.existsSync(preloadPath)) {
    try {
        // Copy preload.js to preload.cjs
        fs.copyFileSync(preloadPath, preloadCjsPath);
        console.log('✓ Created preload.cjs');
    } catch (err) {
        console.error('Error creating preload.cjs:', err);
        process.exit(1);
    }
}
