#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const os = require('os');

console.log('=== Plugin Test ===');

// Test environment variables
console.log('Environment variables:');
console.log('APPDATA:', process.env.APPDATA);
console.log('ROOT:', process.env.ROOT);
console.log('POI_VERSION:', process.env.POI_VERSION);
console.log('LANGUAGE:', process.env.LANGUAGE);

// Test POI directory detection
function findPOIDirectory() {
    const platform = os.platform();
    const possiblePaths = [];
    
    if (platform === 'win32') {
        possiblePaths.push(
            path.join(process.env.APPDATA || '', 'poi'),
            path.join(os.homedir(), 'AppData', 'Roaming', 'poi'),
            path.join(os.homedir(), 'AppData', 'Local', 'poi')
        );
    } else if (platform === 'darwin') {
        possiblePaths.push(
            path.join(os.homedir(), 'Library', 'Application Support', 'poi'),
            path.join(os.homedir(), '.config', 'poi')
        );
    } else {
        possiblePaths.push(
            path.join(os.homedir(), '.config', 'poi'),
            path.join(os.homedir(), '.local', 'share', 'poi')
        );
    }
    
    for (const poiPath of possiblePaths) {
        if (fs.existsSync(poiPath)) {
            return poiPath;
        }
    }
    return possiblePaths[0] || '';
}

const poiPath = findPOIDirectory();
console.log('\nPOI directory:', poiPath);
console.log('POI directory exists:', fs.existsSync(poiPath));

// Test battle-detail directory
const battleDetailPath = path.join(poiPath, 'battle-detail');
console.log('\nBattle-detail path:', battleDetailPath);
console.log('Battle-detail exists:', fs.existsSync(battleDetailPath));

if (fs.existsSync(battleDetailPath)) {
    try {
        const files = fs.readdirSync(battleDetailPath);
        console.log('Battle files found:', files.length);
        console.log('Sample files:', files.slice(0, 3));
    } catch (err) {
        console.log('Error reading battle-detail:', err.message);
    }
}

// Test webview files
console.log('\n=== Webview Files ===');
const submodulePath = path.join(__dirname, 'kc3kai-replayer', 'battleplayer.html');
const distPath = path.join(__dirname, 'kc3kai-replayer-dist', 'battleplayer.html');

console.log('Submodule battleplayer.html exists:', fs.existsSync(submodulePath));
console.log('Dist battleplayer.html exists:', fs.existsSync(distPath));

if (fs.existsSync(submodulePath)) {
    console.log('Submodule path:', submodulePath);
} else if (fs.existsSync(distPath)) {
    console.log('Dist path:', distPath);
} else {
    console.log('No local replayer found, will use external URL');
} 