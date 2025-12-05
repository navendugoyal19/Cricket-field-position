# 🏏 Cricket Field Planner

A professional, interactive cricket field position planning tool built with React and TypeScript. Visualize and customize field placements for different match scenarios.

## Features

- **Interactive Field Visualization**: Drag and drop fielders on a realistic cricket field
- **Field Presets**: Choose from 6 pre-configured field setups:
  - Standard (balanced field)
  - Attacking (aggressive wicket-taking)
  - Defensive (run-saving)
  - Powerplay (limited overs)
  - Death Overs (boundary protection)
  - Spin Attack (spin bowling optimized)
- **Left/Right Handed Batsman**: Toggle between batsman orientations with automatic field mirroring
- **Undo/Redo**: Full history support with keyboard shortcuts (Ctrl+Z/Y)
- **Save & Load**: Save custom field setups to localStorage
- **Export**: Export field layouts as high-quality PNG images
- **Fielder Management**: Rename fielders, see categorized positions with color coding
- **Mobile Support**: Touch-friendly interface for mobile devices

## Tech Stack

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **html2canvas** - Image export functionality
- **CSS3** - Modern styling with CSS variables

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The production build will be in the `dist` folder.

## Usage

1. **Select a Preset**: Choose a field preset from the dropdown
2. **Drag Fielders**: Click and drag fielders to reposition them
3. **Toggle Batsman**: Switch between left and right-handed batsman
4. **Rename Fielders**: Double-click a fielder in the panel to rename
5. **Save Setup**: Click "Save" to store your custom field configuration
6. **Export**: Click "Export" to download the field as a PNG image

## Keyboard Shortcuts

- `Ctrl/Cmd + Z` - Undo
- `Ctrl/Cmd + Y` or `Ctrl/Cmd + Shift + Z` - Redo
- `Escape` - Deselect fielder

## Project Structure

```
src/
├── components/          # React components
│   ├── CricketField.tsx      # Main field visualization
│   ├── ControlPanel.tsx      # Preset and action controls
│   ├── FielderPanel.tsx      # Fielder list and management
│   └── SavedSetupsModal.tsx  # Save/load modal
├── utils/              # Utility functions
│   ├── fieldPositions.ts     # Position definitions and presets
│   ├── storage.ts           # localStorage operations
│   └── exportImage.ts       # Image export functionality
├── types.ts            # TypeScript type definitions
├── App.tsx             # Main application component
├── App.css             # Component styles
├── index.css           # Global styles
└── main.tsx            # Application entry point
```

## Field Position Categories

Fielders are color-coded by category:

- 🟠 **Keeper** - Wicketkeeper
- 🔴 **Bowler** - Bowler
- 🟣 **Slip** - Slip cordon positions
- 🩷 **Close** - Close catching positions
- 🔵 **Ring** - 30-yard circle fielders
- 🟢 **Boundary** - Deep field positions

## License

MIT


