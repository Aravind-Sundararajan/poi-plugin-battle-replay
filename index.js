"use strict";

// Plugin metadata
const pluginName = 'poi-plugin-sunny-replay';

// Plugin configuration
const pluginConfig = {
    title: "Show battle replay",
    description: "Show battle replay, based on [kancolle-replay](https://github.com/KC3Kai/kancolle-replay)",
    icon: "fa/video-camera",
    priority: 12
};

// Plugin window configuration
const windowConfig = {
    windowOptions: {
        x: 0,
        y: 0,
        width: 1800,
        height: 1200
    },
    windowURL: `file://${__dirname}/index.html`,
    useEnv: true
};

// Plugin lifecycle methods
const pluginDidLoad = () => {
    console.log(`${pluginName} plugin loaded`);
};

const pluginWillUnload = () => {
    console.log(`${pluginName} plugin unloading`);
};

// Export plugin interface
module.exports = {
    ...windowConfig,
    pluginDidLoad,
    pluginWillUnload,
    name: pluginName,
    config: pluginConfig
};