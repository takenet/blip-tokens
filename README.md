# blip-tokens
Blip Design Tokens (BETA), refers to the attributes of the User Interface (UI) elements such as color, spacing, typeface, etc.

## 📚 Documentation

For comprehensive project documentation, including architecture decisions, guides, and technical reports, see:

**[📖 Documentation Hub](./docs/README.md)**

Quick Links:
- [🚀 SVG Optimization Quick Start](./docs/guides/svg-optimization-quickstart.md)
- [📊 Optimization Results](./docs/reports/svg-optimization-summary.md)
- [🏛️ Architecture Decisions (ADRs)](./docs/adr/)

## Icons
Icons are generated in svg, and in this process we convert to base64 keeping them all within a single JSON file.

### How to insert some icon
First you must place the icon inside assets/icons/outline || solid, this last depends on the icon you are going to use.
.After that just go to properties/assets/icons.json and map.

If you find it easier, you can use a script to insert all the files in icons.json. How to run this script:

First, go to folder 'scripts'
`cd scripts`
Then, run command:
`node generate_icons.js`

TYPE: outline / solid

```json
"NAME_ICON-TYPE": {
  "value": "assets/icons/TYPE/NAME_ICON.svg"
}
```

The list is organized by alphabetical order and type.
