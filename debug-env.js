// Debug script to check POI environment variables
const path = require('path');
const os = require('os');
const fs = require('fs');

console.log('=== POI Environment Debug ===');
console.log('Platform:', os.platform());
console.log('Home directory:', os.homedir());

// Check common POI paths
const possiblePaths = [
    path.join(process.env.APPDATA || '', 'poi'),
    path.join(os.homedir(), 'AppData', 'Roaming', 'poi'),
    path.join(os.homedir(), 'Library', 'Application Support', 'poi'),
    path.join(os.homedir(), '.config', 'poi')
];

console.log('\n=== Checking POI paths ===');
possiblePaths.forEach((poiPath, index) => {
    const exists = fs.existsSync(poiPath);
    const battleDetailPath = path.join(poiPath, 'battle-detail');
    const battleDetailExists = fs.existsSync(battleDetailPath);
    
    console.log(`${index + 1}. ${poiPath}`);
    console.log(`   POI directory exists: ${exists}`);
    if (exists) {
        console.log(`   Battle-detail exists: ${battleDetailExists}`);
        if (battleDetailExists) {
            try {
                const files = fs.readdirSync(battleDetailPath);
                console.log(`   Battle files: ${files.length}`);
                if (files.length > 0) {
                    console.log(`   Sample files: ${files.slice(0, 3).join(', ')}`);
                }
            } catch (err) {
                console.log(`   Error reading battle-detail: ${err.message}`);
            }
        }
    }
    console.log('');
});

// Check environment variables
console.log('=== Environment Variables ===');
console.log('APPDATA:', process.env.APPDATA);
console.log('ROOT:', process.env.ROOT);
console.log('POI_VERSION:', process.env.POI_VERSION);
console.log('SERVER_HOSTNAME:', process.env.SERVER_HOSTNAME);
console.log('MODULE_PATH:', process.env.MODULE_PATH);
console.log('LANGUAGE:', process.env.LANGUAGE);

// Test the new language detection
console.log('\n=== Language Detection Test ===');

function readPOIConfig(poiPath) {
    try {
        const configPath = path.join(poiPath, 'config.cson');
        if (fs.existsSync(configPath)) {
            const configContent = fs.readFileSync(configPath, 'utf8');
            const languageMatch = configContent.match(/language:\s*['"`]([^'"`]+)['"`]/);
            if (languageMatch) {
                return languageMatch[1];
            }
        }
    } catch (error) {
        console.log('Error reading POI config:', error.message);
    }
    return null;
}

const poiPath = 'C:\\Users\\asundar4\\AppData\\Roaming\\poi';
const poiLanguage = readPOIConfig(poiPath);
console.log('POI Config Language:', poiLanguage);

let detectedLanguage = process.env.LANGUAGE || process.env.LANG || 'en-US';
if (poiLanguage) {
    detectedLanguage = poiLanguage;
    console.log('Using POI config language:', poiLanguage);
}

// Normalize language codes
if (detectedLanguage.startsWith('zh')) {
    if (detectedLanguage.includes('TW') || detectedLanguage.includes('HK')) {
        detectedLanguage = 'zh-TW';
    } else {
        detectedLanguage = 'zh-CN';
    }
} else if (detectedLanguage.startsWith('ja')) {
    detectedLanguage = 'ja-JP';
} else if (detectedLanguage.startsWith('en')) {
    detectedLanguage = 'en-US';
} else {
    detectedLanguage = 'en-US';
}

console.log('Final detected language:', detectedLanguage);

// Expected APPDATA_PATH for Windows
const expectedAppDataPath = path.join(process.env.APPDATA || '', 'poi');
console.log('\n=== Expected APPDATA_PATH ===');
console.log('Expected:', expectedAppDataPath);
console.log('Exists:', fs.existsSync(expectedAppDataPath)); 