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

export function doesExists(filePath) {
  return fs.existsSync(filePath);
}

export async function readFileLineByLine(filePath) {
  const fileStreamRead = fs.createReadStream(filePath);

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

export function writeFileLineByLine(filePath, lines) {
  const fileStreamWrite = fs.createWriteStream(filePath,);
  lines.map(l => {
    fileStreamWrite.write(l + '\n');
  });
  fileStreamWrite.end();
}

export function getLineNumbers(lines, moduleName) {
  let updateRequired = true;
  let lastImportLineNumber = -1;
  let lastSpredLineNumber = -1;
  let lastEndOfArrayLineNumber = -1;
  lines.map((l, index) => {
    if (l.indexOf(`${moduleName}`) > -1) {
      updateRequired = false;
    }
    if (l.indexOf('import') > -1) {
      lastImportLineNumber = index;
    }
    if (l.indexOf('...') > -1) {
      lastSpredLineNumber = index;
    }
    if (l.indexOf(']') > -1) {
      lastEndOfArrayLineNumber = index;
    }
  }
  );
  return {
    updateRequired,
    lastImportLineNumber,
    lastSpredLineNumber,
    lastEndOfArrayLineNumber,
  }
}

export function updateLineArray(lines, importStatement, spreadStatement, lineInformation) {

  let disableArrayModification = false;
  if (lineInformation.updateRequired) {
    lineInformation.lastImportLineNumber++;
    if (lineInformation.lastSpredLineNumber > -1) {
      lineInformation.lastSpredLineNumber++;
      disableArrayModification = true;
    }
    if (lineInformation.lastEndOfArrayLineNumber > -1) {
      lineInformation.lastEndOfArrayLineNumber++;
    }
    lines = insertAt(lines, lineInformation.lastImportLineNumber, importStatement);
    if (lineInformation.lastSpredLineNumber > -1) {
      lineInformation.lastSpredLineNumber++;
      lines = insertAt(lines, lineInformation.lastSpredLineNumber, spreadStatement);
    }
    if (!disableArrayModification && lineInformation.lastEndOfArrayLineNumber > -1) {
      // update the line
      let lineToBeUpdated = lines[lineInformation.lastEndOfArrayLineNumber];
      console.log('>> Line with ] : ', lineToBeUpdated);
      console.log(">> Spread Text : ", spreadStatement);
      const splittedText = lineToBeUpdated.split(']');
      console.log(">> Splitted Text : ", splittedText);

      splittedText[0] = splittedText[0] + spreadStatement;
      console.log("Modified text : ", splittedText[0]);
      lines[lineInformation.lastEndOfArrayLineNumber] = splittedText.join("]");
      // lines = insertAt(lines, lineInformation.lastSpredLineNumber, spreadStatement);

    }
  }

  return lines;
}

export function insertAt(array, index, ...elements) {
  array.splice(index, 0, ...elements);
  return array;
}