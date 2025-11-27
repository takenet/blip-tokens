const { asset: _asset } = require("./properties/assets/illustrations.json");
const { execFileSync } = require('child_process');

const buildIllustrations = () => {
  const asset = _asset;

  let response = [
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
    {
      destination: "theme-high-contrast.json",
      format: "json/flat",
      filter: {
        attributes: {
          category: "color-high-contrast",
        },
      },
    },
    {
      destination: "extended-color.json",
      format: "json/flat",
      filter: {
        attributes: {
          category: "color-extended",
        },
      },
    },
  ];

  Object.keys(asset).forEach((key) => {
    response.push({
      destination: `illustrations/${key.split("_")[0]}/${key.split("_")[1]}.json`,
      format: "json/flat",
      filter: {
        attributes: {
          category: "asset",
          type: key,
        },
      },
    });
  });

  return response;
};

const StyleDictionary = require("style-dictionary").extend({
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
          destination: "theme-light.scss",
          format: "scss/variables",
          filter: {
            attributes: {
              category: "color-light",
            },
          },
        },
        {
          destination: "theme-dark.scss",
          format: "scss/variables",
          filter: {
            attributes: {
              category: "color-dark",
            },
          },
        },
        {
          destination: "theme-high-contrast.scss",
          format: "scss/variables",
          filter: {
            attributes: {
              category: "color-high-contrast",
            },
          },
        },
        {
          destination: "extended-color.scss",
          format: "scss/variables",
          filter: {
            attributes: {
              category: "color-extended",
            },
          },
        },
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
      files: buildIllustrations(),
    },
  },
});
// Script register
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

// Generate icon type definitions after build
console.log('\nGenerating icon type definitions...');
try {
  execFileSync('node', [require('path').join(__dirname, 'scripts', 'generate_icon_types.js')], { stdio: 'inherit' });
} catch (error) {
  console.error('Failed to generate icon types:', error);
  process.exit(1);
}
