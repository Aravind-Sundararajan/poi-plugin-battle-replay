# POI Plugin - Sunny's Battle Replay

A POI plugin for Kantai Collection that converts battle-detail files to KC3Kai's battle replayer format.

## Features

- Converts POI battle-detail files to KC3Kai replay format
- Displays battle replays using KC3Kai's battle replayer
- Generates battle images for sharing
- Supports multiple battle file formats
- Multi-language support (English, Japanese, Chinese)

## Installation

### Method 1: Through POI Plugin Manager (Recommended)
1. Open POI-viewer
2. Go to Settings → Plugin
3. Search for "poi-plugin-sunny-replay"
4. Click Install

### Method 2: Manual Installation
1. Clone this repository:
   ```bash
   git clone git@github.com:Aravind-Sundararajan/poi-plugin-battle-replay.git
   ```
2. Navigate to POI's plugin directory:
   - Windows: `%APPDATA%/poi/plugins/`
   - macOS: `~/Library/Application Support/poi/plugins/`
   - Linux: `~/.config/poi/plugins/`
3. Copy the plugin folder to the plugins directory
4. Restart POI-viewer

### Method 3: NPM Installation
```bash
npm install poi-plugin-sunny-replay
```

## Usage

1. **Start POI-viewer** and ensure the plugin is enabled
2. **Navigate to the plugin** in POI's plugin menu
3. **Select a battle file** from the dropdown (files are automatically loaded from your battle-detail directory)
4. **Click "Copy to Battle Player"** to load the battle data
5. **View the battle replay** in the embedded player
6. **Download battle images** using the download button

## Requirements

- POI-viewer (latest version recommended)
- Internet connection (for KC3Kai battle replayer)
- Battle-detail files in POI's data directory

## Troubleshooting

### Plugin Not Loading
- Ensure POI-viewer is up to date
- Check that all dependencies are installed
- Verify the plugin is in the correct directory

### No Battle Files Found
- Check that POI is recording battle data
- Verify the battle-detail directory exists in your POI data folder
- Ensure you have recent battle files (`.json.gz` format)

### Battle Replay Not Working
- Check your internet connection (replayer loads from KC3Kai's servers)
- Try reloading the battle player
- Verify the battle data format is correct

### Error Messages
- **"APPDATA_PATH not found"**: POI environment not properly configured
- **"No battle files found"**: No battle data in the expected directory
- **"Error reading battle-detail directory"**: Permission or path issues

## File Structure

```
poi-plugin-sunny-replay/
├── index.js              # Plugin entry point
├── index.html            # Main interface
├── main.css              # Styling
├── env-loader.js         # Environment initialization
├── converter.js          # Battle data converter
├── preload.js           # Battle replayer preload script
├── preload2.js          # Converter preload script
├── constants/           # Plugin constants
│   ├── poi-fleets.js
│   └── ship-images.js
├── i18n/               # Internationalization
│   ├── en-US.json
│   └── zh-CN.json
└── package.json        # Plugin metadata
```

## Dependencies

- `lodash`: Utility functions
- `i18n-2`: Internationalization
- `zlib`: File compression handling

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details

## Credits

- Uses [KC3Kai's kancolle-replay](https://github.com/KC3Kai/kancolle-replay) (external web application)
- Uses [poi-to-kc3-battle-replay-converter](https://kazenorin.github.io/poi-to-kc3-battle-replay-converter/)
- Ship images from [WhoCallsTheFleet](http://fleet.diablohu.com/)

## Technical Details

### Battle Replayer Integration

This plugin uses KC3Kai's battle replayer web application hosted at:
`https://kc3kai.github.io/kancolle-replay/battleplayer.html`

The replayer is embedded in a webview and receives battle data via IPC messages. This approach:
- ✅ **Always up-to-date**: Uses the latest version from KC3Kai's servers
- ✅ **Lightweight**: No need to package the replayer with the plugin
- ✅ **Maintained**: KC3Kai team handles updates and maintenance
- ✅ **Reliable**: Hosted on GitHub Pages with good uptime

### Data Flow

1. **Battle File Selection**: User selects a battle file from POI's battle-detail directory
2. **Data Conversion**: POI battle format is converted to KC3Kai format using the converter
3. **IPC Communication**: Converted data is sent to the embedded webview
4. **Battle Replay**: KC3Kai replayer displays the battle animation

## Support

If you encounter issues:
1. Check the troubleshooting section above
2. Search existing issues on GitHub
3. Create a new issue with detailed information about your problem