const fs = require('fs');
const readline = require('readline');
const path = require('path');
const chalk = require('chalk');
const log = console.log;

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

export async function readFileLineByLine(path) {
  const fileStreamRead = fs.createReadStream(path);

  const rl = readline.createInterface({
    input: fileStreamRead,
    crlfDelay: Infinity
  });
  // Note: we use the crlfDelay option to recognize all instances of CR LF
  // ('\r\n') in input.txt as a single line break.
  const fileLines = [];

  for await (const line of rl) {
    fileLines.push(line);
  }
  fileStreamRead.close();
  return fileLines;
}

export function writeFileLineByLine(path, lines) {
  const fileStreamWrite = fs.createWriteStream(path,);
  lines.map(l => {
    fileStreamWrite.write(l + '\n');
    log(chalk.bgGray(l));
  });
  fileStreamWrite.end();
}