const StyleDictionary = require("style-dictionary").extend(
  {
    source: ["properties/**/*.json"],
    platforms: {
      json: {
        transformGroup: "web",
        buildPath: "build/json/",
        files: [
          {
            destination: "variables.json",
            format: "json/flat",
          },
        ],
      },
      scss: {
        transformGroup: "scss",
        buildPath: "build/scss/",
        files: [
          {
            destination: "variables.scss",
            format: "scss/variables",
            filter: {
              attributes: {
                category: "color",
              },
            },
          },
        ],
      },
      css: {
        buildPath: "build/css/",
        files: [
          {
            destination: "classes.css",
            format: "css/variables",
          },
        ],
      },
      "assets/embed/json": {
        transforms: ["attribute/cti", "name/cti/kebab", "asset/base64"],
        buildPath: "build/json/",
        files: [
          {
            destination: "assets_icons.json",
            format: "json/flat",
            filter: {
              attributes: {
                category: "asset",
                type: "icon",
              },
            },
          },
          {
            destination: "assets_emojis.json",
            format: "json/flat",
            filter: {
              attributes: {
                category: "asset",
                type: "emoji",
              },
            },
          },
          {
            destination: "assets_logos.json",
            format: "json/flat",
            filter: {
              attributes: {
                category: "asset",
                type: "logo",
              },
            },
          },
          {
            destination: "assets_illustrations.json",
            format: "json/flat",
            filter: {
              attributes: {
                category: "asset",
                type: "illustration",
              },
            },
          },
          {
            destination: "colors.json",
            format: "json/flat",
            filter: {
              attributes: {
                category: "color",
              },
            },
          },
          {
            destination: "theme-light.json",
            format: "json/flat",
            filter: {
              attributes: {
                category: "color-light",
              },
            },
          },
          {
            destination: "theme-dark.json",
            format: "json/flat",
            filter: {
              attributes: {
                category: "color-dark",
              },
            },
          },
        ],
      },
    },
  },
  {
    source: ["properties/**/*.json"],
    platforms: {
      json: {
        transformGroup: "web",
        buildPath: "build/json/",
        files: [
          {
            destination: "variables.json",
            format: "json/flat",
          },
        ],
      },
    },
  }
);

StyleDictionary.registerFormat({
  name: "css/variables",
  formatter: function (dictionary) {
    const properties = dictionary.properties.color;

    const colors = Object.keys(properties)
      .map((prop) => `.color-${prop} { color: ${properties[prop].value}; }`)
      .join("\n");
    const backgrounds = Object.keys(properties)
      .map((prop) => `.bg-${prop} { background: ${properties[prop].value}; }`)
      .join("\n");

    return colors.concat(backgrounds);
  },
});

StyleDictionary.buildAllPlatforms();
