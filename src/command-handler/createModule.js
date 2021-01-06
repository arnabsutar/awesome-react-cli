const chalk = require('chalk');
// const fs = require('fs');
// const readline = require('readline');
const fse = require('fs-extra');
const replace = require('replace-in-file');
const cliUtil = require('../util');
const log = console.log;
const templateFlagFile = ".asrt";
const moduleDestination = cliUtil.getCurrentDirectory()
  + cliUtil.getSeparator()
  + "src"
  + cliUtil.getSeparator()
  + "app"
  + cliUtil.getSeparator()
  + "modules";
const apiConfigPath = cliUtil.getCurrentDirectory() + cliUtil.getSeparator() + "src" + cliUtil.getSeparator() + "config" + cliUtil.getSeparator() + "apiConfig.js";
const routeConfigPath = cliUtil.getCurrentDirectory() + cliUtil.getSeparator() + "src" + cliUtil.getSeparator() + "config" + cliUtil.getSeparator() + "routeConfig.js";
const menuConfigPath = cliUtil.getCurrentDirectory() + cliUtil.getSeparator() + "src" + cliUtil.getSeparator() + "config" + cliUtil.getSeparator() + "menuConfig.js";

export async function createModule(argv) {
  const commandName = argv._;
  const moduleName = argv.name;
  const cliHome = argv.cliHome;
  const moduleTemplatePath = cliHome + cliUtil.getSeparator() + "src" + cliUtil.getSeparator() + "template" + cliUtil.getSeparator() + "module";
  log()
  log(chalk.blueBright(`Executing command : ${commandName}`));
  log();
  log();
  // check whether it has been created with awesome-react-template
  const flagFile = cliUtil.getCurrentDirectory() + cliUtil.getSeparator() + templateFlagFile;
  if (cliUtil.doesExists(flagFile) && cliUtil.checkIfExistingProject()) {
    log(chalk.blue('Going to create module ' + moduleName));
    let destPath = moduleDestination + cliUtil.getSeparator() + moduleName;
    if (!cliUtil.doesExists(destPath)) {
      fse.copySync(moduleTemplatePath, destPath);

      // update the content of the index.js file
      const moduleReplaceOption = {
        files: [
          destPath + cliUtil.getSeparator() + "index.js"
        ],
        from: /__moduleName__/g,
        to: moduleName,
      }

      try {
        let changedFiles = replace.sync(moduleReplaceOption);
      }
      catch (error) {
        console.error('Error occurred:', error);
      }

      // update API config
      await updateApiConfiguration(argv, apiConfigPath);
      // update route config
      await updateRouteConfiguration(argv, routeConfigPath);
      // update menu config
      await updateMenuConfiguration(argv, menuConfigPath);

      log(chalk.bgGreen("Success"), chalk.greenBright("Module structure has been created"));
    }
    else {
      log(chalk.redBright(`Error : Module ${argv.name} already exists. Please try with a different name.`));
    }

  }
  else {
    log(chalk.redBright('Please use a project which has been created using awesome-react-template'));
  }

}

async function updateApiConfiguration(args, configPath) {
  log();
  log('API Configuration Path : ', chalk.bgBlue(configPath));
  log('API Configuration exists : ', cliUtil.doesExists(configPath));


  let importStatementStarted = false;
  let importStatementIncluded = false;
  let apiParsingStarted = false;
  let updateRequired = true;
  let updatedLines = await cliUtil.readFileLineByLine(configPath);
  log(updatedLines);
  updatedLines.map(l => {
    if (l.indexOf(`${args.name}API`) > -1) {
      updateRequired = false;
    }
  }
  );
  //check for pre-configured module
  if (updateRequired) {

    const linesForFile = [];
    updatedLines.map(line => {

      // update the import statement
      if (line.indexOf('import') > -1) {
        importStatementStarted = true;
      }
      if (importStatementStarted
        && line.indexOf("import") < 0
        && !importStatementIncluded) {
        // Add the module import as line
        linesForFile.push(`import { ${args.name}API } from '../app/modules/${args.name}';`);
        linesForFile.push('');
        importStatementStarted = false;
        importStatementIncluded = true;
        return;
      }

      // update API spreading
      if (line.replace(" ", "").indexOf("constAPI") > -1) {
        log("Got the api line");
        apiParsingStarted = true;
        linesForFile.push(`// Updated for module ${args.name} and config object is ${args.name}API`);
      }

      if (apiParsingStarted && line.indexOf("}") > -1) {
        apiParsingStarted = false;
        linesForFile.push(`  ...${args.name}API,`);
        linesForFile.push(line);
        return;
      }
      linesForFile.push(line);
    })


    // write to file and replace all
    cliUtil.writeFileLineByLine(configPath, linesForFile);
  }
  else {
    log(chalk.yellow(`Warning: API already configured for the module ${args.name}`));
  }

  log();
}

function updateRouteConfiguration(args, configPath) {
  log();
  log('Route Configuration Path : ', chalk.bgBlue(configPath));
  log('Route Configuration exists : ', cliUtil.doesExists(configPath));
  log();
}

function updateMenuConfiguration(args, configPath) {
  log();
  log('Menu Configuration Path : ', chalk.bgBlue(configPath));
  log('Menu Configuration exists : ', cliUtil.doesExists(configPath));
  log();
}