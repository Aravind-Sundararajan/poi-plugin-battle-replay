module.exports = {
    windowOptions: {
        x: config.get('poi.window.x', 0),
        y: config.get('poi.window.y', 0),
        width: 1600,
        height: 900
    },
    windowURL: `file://${__dirname}/index.html`,
    useEnv: true  
}