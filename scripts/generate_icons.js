const fs = require('fs');
const readline = require('readline');
const iconsFolder = '../assets/icons';
const iconsJsonFileName = '../properties/assets/icons.json';
let iconsJson

try {
  iconsJson = require(iconsJsonFileName);
} catch (e) {
  throw 'Invalid Icons Json File';
}



function getFilesFromFolder(path) {
  let filesJson = [];

  const files = fs.readdirSync(path);

  files.forEach(file => {
    if (fs.lstatSync(`${path}/${file}`).isDirectory()) {
      filesJson = [...filesJson, ...getFilesFromFolder(`${path}/${file}`)]
    } else {
      if (file.endsWith('.svg')) {
        const newFile = {
          name: file.replace('.svg', ''),
          path: `${path.replace('../', '')}/${file}`
        }
        filesJson.push(newFile);
      }
    }
  });

  return filesJson;

}

function getFilesNotIncluded(files) {
  let notIncluded = [];

  files.forEach((file) => {

    const result = keys.filter((iconName) => {
      return file.path === iconsJson.asset.icon[iconName].value;
    });
  
    if (result.length === 0) {
      notIncluded.push(file.name);
      console.log(file.path);
    }
  
  })
  return notIncluded;
}

function includeIconsIntoFile(files) {
  files.forEach((file) => {

    const result = keys.filter((iconName) => {
      return file.path === iconsJson.asset.icon[iconName].value
    });
  
    if (result.length === 0) {

      let keyName = '';

      if (file.path.toLowerCase().includes('outline')) {
        keyName = file.name.toLowerCase() + '-outline';
      } else if (file.path.toLowerCase().includes('solid')) {
        keyName = file.name.toLowerCase() + '-solid';
      }
      
      iconsJson['asset']['icon'][keyName] = {
        value: file.path
      }

      iconsJson['asset']['icon'] = orderFile()

      fs.writeFile(iconsJsonFileName, JSON.stringify(iconsJson, null, 2), function writeJSON(err) {
        if (err) return console.log(err);
      });
    }
  
  })
}

function orderFile() {

  const keys = Object.keys(iconsJson.asset.icon);

  let solidIcons = keys.filter((icon) => {
    return icon.includes('-solid')
  })

  let outlineIcons = keys.filter((icon) => {
    return icon.includes('-outline')
  })

  solidIcons.sort();
  outlineIcons.sort();
  const sortedArray = outlineIcons.concat(solidIcons);
  let sortedObject = {}

  sortedArray.forEach((item) => {
    sortedObject[item] = iconsJson.asset.icon[item]
  }) 

  return sortedObject;
}

const files = getFilesFromFolder(iconsFolder);
const keys = Object.keys(iconsJson.asset.icon);

let notExists = [];
let fileExists = [];
let notIncluded = getFilesNotIncluded(files);

keys.forEach((iconName) => {
  const result = files.filter((file) => {
    return file.path === iconsJson.asset.icon[iconName].value
  })

  if (result.length > 0) {
    fileExists.push(iconName);
  } else {
    notExists.push(iconName);
  }
})

console.log('\x1b[34m[#] %s\x1b[0m', `${files.length} files was found.`); 
console.log('\x1b[36m[#] %s\x1b[0m', `There are ${fileExists.length} icons installed correctly.`); 
console.log('\x1b[31m[#] %s\x1b[0m', `There are ${notExists.length} files not found.`); 
console.log('\x1b[33m[#] %s\x1b[0m', `There are ${notIncluded.length} files not included in icons.json.`); 

if (notIncluded.length > 0) {
  const read  = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  read.question("Would you like to include these files into icons.json? Type Y or N \n", function(answer) {
    if (answer.toLowerCase() === 'y') {
      includeIconsIntoFile(files)
    }
    console.log('\x1b[42m%s\x1b[0m', `Done.`); 
    read.close();
  });
}

