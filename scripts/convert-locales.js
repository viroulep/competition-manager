const YAML = require('yamljs');
const fs = require('fs');

function flattenMessages(nestedMessages, prefix = '') {
  return Object.keys(nestedMessages).reduce((messages, key) => {
    let value       = nestedMessages[key];
    let prefixedKey = prefix ? `${prefix}.${key}` : key;

    if (typeof value === 'string') {
      messages[prefixedKey] = value;
    } else {
      Object.assign(messages, flattenMessages(value, prefixedKey));
    }

    return messages;
  }, {});
}

const dirPath = './locales/';

fs.readdir(dirPath, function(err, list) {
  list.forEach(file => {
    // File format is locale.yml
    const localeName = file.split('.')[0];
    const filePath = `./src/lang/${localeName}.json`;

    // Load yaml file using YAML.load
    const nativeObject = YAML.load(dirPath + file);

    // use localeName to remove the first level of nesting in the yml
    let messages = JSON.stringify(flattenMessages(nativeObject[localeName]));

    fs.writeFile(filePath, messages, function(err) {
      if(err) {
        return console.log(err);
      }

      console.log(`Done with ${filePath}!`);
    });
  });

});
