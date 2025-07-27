// Environment loader for POI plugin
const { ipcRenderer } = require('electron');
const path = require('path');
const os = require('os');
const fs = require('fs');

// Function to read POI config file
function readPOIConfig(poiPath) {
    try {
        const configPath = path.join(poiPath, 'config.cson');
        if (fs.existsSync(configPath)) {
            const configContent = fs.readFileSync(configPath, 'utf8');
            // Simple parsing for language setting
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

// Function to find POI directory
function findPOIDirectory() {
    const platform = os.platform();
    const possiblePaths = [];
    
    if (platform === 'win32') {
        // Windows paths
        possiblePaths.push(
            path.join(process.env.APPDATA || '', 'poi'),
            path.join(os.homedir(), 'AppData', 'Roaming', 'poi'),
            path.join(os.homedir(), 'AppData', 'Local', 'poi')
        );
    } else if (platform === 'darwin') {
        // macOS paths
        possiblePaths.push(
            path.join(os.homedir(), 'Library', 'Application Support', 'poi'),
            path.join(os.homedir(), '.config', 'poi')
        );
    } else {
        // Linux paths
        possiblePaths.push(
            path.join(os.homedir(), '.config', 'poi'),
            path.join(os.homedir(), '.local', 'share', 'poi')
        );
    }
    
    // Check each possible path
    for (const poiPath of possiblePaths) {
        if (fs.existsSync(poiPath)) {
            console.log('Found POI directory:', poiPath);
            return poiPath;
        }
    }
    
    // If no POI directory found, return the most likely one
    console.log('POI directory not found, using default path');
    return possiblePaths[0] || '';
}

// Initialize POI environment variables
function initializePOIEnvironment() {
    // Try to get environment variables from POI
    try {
        // Set default values
        window.ROOT = process.env.ROOT || '';
        window.APPDATA_PATH = process.env.APPDATA_PATH || '';
        window.POI_VERSION = process.env.POI_VERSION || '';
        window.SERVER_HOSTNAME = process.env.SERVER_HOSTNAME || '';
        window.MODULE_PATH = process.env.MODULE_PATH || '';
        // Try to get language from POI environment, with better fallback logic
        let detectedLanguage = process.env.LANGUAGE || process.env.LANG || 'en-US';
        
        // If APPDATA_PATH is set, try to read POI config for language
        if (window.APPDATA_PATH) {
            const poiLanguage = readPOIConfig(window.APPDATA_PATH);
            if (poiLanguage) {
                detectedLanguage = poiLanguage;
                console.log('Found language in POI config:', poiLanguage);
            }
        }
        
        // Fallback to browser language if no POI language found
        if (detectedLanguage === 'en-US' && typeof navigator !== 'undefined' && navigator.language) {
            detectedLanguage = navigator.language;
            console.log('Using browser language as fallback:', navigator.language);
        }
        
        // Normalize language codes
        if (detectedLanguage.startsWith('zh')) {
            // Handle Chinese variants
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
            // Default to English for unknown languages
            detectedLanguage = 'en-US';
        }
        
        window.language = detectedLanguage;
        
        // If APPDATA_PATH is not set, try to find POI directory
        if (!window.APPDATA_PATH) {
            window.APPDATA_PATH = findPOIDirectory();
            console.log('APPDATA_PATH not found in environment, using detected path:', window.APPDATA_PATH);
        }
        
        console.log('POI Environment initialized:');
        console.log('APPDATA_PATH:', window.APPDATA_PATH);
        console.log('POI_VERSION:', window.POI_VERSION);
        console.log('Detected language:', window.language);
        console.log('Environment LANGUAGE:', process.env.LANGUAGE);
        console.log('Environment LANG:', process.env.LANG);
        
        // Add module path to global paths if available
        if (window.MODULE_PATH) {
            require('module').globalPaths.push(window.MODULE_PATH);
        }
        
        // Try to get additional POI globals if available
        if (typeof window.require === 'function') {
            try {
                const poiConfig = window.require('poi-plugin-utils');
                if (poiConfig && poiConfig.config) {
                    window.POI_CONFIG = poiConfig.config;
                }
            } catch (e) {
                console.log('POI config not available:', e.message);
            }
        }
        
    } catch (error) {
        console.error('Error initializing POI environment:', error);
        // Set fallback values
        window.ROOT = '';
        window.APPDATA_PATH = findPOIDirectory();
        window.POI_VERSION = '';
        window.SERVER_HOSTNAME = '';
        window.MODULE_PATH = '';
        window.language = 'en-US';
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializePOIEnvironment);
} else {
    initializePOIEnvironment();
}
