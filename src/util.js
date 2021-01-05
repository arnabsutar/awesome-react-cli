const fs = require('fs');
const path = require('path');

export function getCurrentDirectory() {
  return process.cwd();
}

export function getSeparator() {
  return path.sep;
}

export function checkIfExistingProject() {
  return fs.existsSync(getCurrentDirectory() + path.sep + 'package.json');
}

export function doesExists(path) {
  return fs.existsSync(path);
}