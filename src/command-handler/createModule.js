import { argv } from 'yargs';

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
const sagaConfigPath = cliUtil.getCurrentDirectory() + cliUtil.getSeparator() + "src" + cliUtil.getSeparator() + "stateManagement" + cliUtil.getSeparator() + "appRootSaga.js";
const routeConfigPath = cliUtil.getCurrentDirectory() + cliUtil.getSeparator() + "src" + cliUtil.getSeparator() + "config" + cliUtil.getSeparator() + "routeConfig.js";
const menuConfigPath = cliUtil.getCurrentDirectory() + cliUtil.getSeparator() + "src" + cliUtil.getSeparator() + "config" + cliUtil.getSeparator() + "menuConfig.js";

const mobileMenuConfigPath = cliUtil.getCurrentDirectory() + cliUtil.getSeparator() + "src" + cliUtil.getSeparator() + "config" + cliUtil.getSeparator() + "mobileMenuConfig.js";
const englishConfigPath = cliUtil.getCurrentDirectory() + cliUtil.getSeparator() + "src" + cliUtil.getSeparator() + "app" + cliUtil.getSeparator() + "common" + cliUtil.getSeparator() + "i18n" + cliUtil.getSeparator() + "languages" + cliUtil.getSeparator() + "english.js";
const frenchConfigPath = cliUtil.getCurrentDirectory() + cliUtil.getSeparator() + "src" + cliUtil.getSeparator() + "app" + cliUtil.getSeparator() + "common" + cliUtil.getSeparator() + "i18n" + cliUtil.getSeparator() + "languages" + cliUtil.getSeparator() + "french.js";

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
      log(destPath + cliUtil.getSeparator() + "config" + cliUtil.getSeparator() + "apiConfig.js");
      // update the content of the index.js file
      const moduleReplaceOption = {
        files: [
          destPath + cliUtil.getSeparator() + "index.js",
          destPath + cliUtil.getSeparator() + "moduleConstants.js",
          destPath + cliUtil.getSeparator() + "i18n" + cliUtil.getSeparator() + "english.js",
          destPath + cliUtil.getSeparator() + "i18n" + cliUtil.getSeparator() + "french.js",
          destPath + cliUtil.getSeparator() + "config" + cliUtil.getSeparator() + "apiConfig.js",
          destPath + cliUtil.getSeparator() + "config" + cliUtil.getSeparator() + "menuConfig.js",
          destPath + cliUtil.getSeparator() + "config" + cliUtil.getSeparator() + "routeConfig.js",
          destPath + cliUtil.getSeparator() + "redux" + cliUtil.getSeparator() + "index.js",
          destPath + cliUtil.getSeparator() + "redux" + cliUtil.getSeparator() + "actions" + cliUtil.getSeparator() + "actionTypes.js",
          destPath + cliUtil.getSeparator() + "redux" + cliUtil.getSeparator() + "effects" + cliUtil.getSeparator() + "moduleWatcher.js",
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
      log(chalk.green(`Module Structure for ${argv.name} has been created`));
      // update english localization
      await updateConfiguration(
        argv.name,
        englishConfigPath,
        `import ${argv.name}Resources from '../../../modules/${argv.name}/i18n/english';`,
        `    ...${argv.name}Resources,`,
      );
      // update french localization
      await updateConfiguration(
        argv.name,
        frenchConfigPath,
        `import ${argv.name}Resources from '../../../modules/${argv.name}/i18n/french';`,
        `    ...${argv.name}Resources,`,
      );

      // update API config
      await updateConfiguration(
        argv.name,
        sagaConfigPath,
        `import { ${argv.name}Watcher } from '../app/modules/${argv.name}';`,
        `, ${argv.name}Watcher()`,
      );

      // update route config
      await updateConfiguration(
        argv.name,
        routeConfigPath,
        `import { ${argv.name}Routes } from '../app/modules/${argv.name}';`,
        `  ...${argv.name}Routes,`);
      // update menu config
      await updateConfiguration(
        argv.name,
        menuConfigPath,
        `import { ${argv.name}Menus } from '../app/modules/${argv.name}';`,
        `  ...${argv.name}Menus(),`);

      await updateConfiguration(
        argv.name,
        mobileMenuConfigPath,
        `import { ${argv.name}MobileMenus } from '../app/modules/${argv.name}';`,
        `  ...${argv.name}MobileMenus(),`);

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

async function updateConfiguration(moduleName, configPath, importStatement, spreadStatement) {
  log();
  log(chalk.green('Updating Configuartion : '), chalk.blue(configPath));
  let updatedLines = await cliUtil.readFileLineByLine(configPath);

  const basicInformation = cliUtil.getLineNumbers(updatedLines, moduleName);
  log(chalk.green('Update Required : '), basicInformation.updateRequired);
  //check for pre-configured module
  if (basicInformation.updateRequired) {
    const linesForFile = cliUtil.updateLineArray(updatedLines,
      importStatement,
      spreadStatement,
      basicInformation
    );
    // write to file and replace all
    cliUtil.writeFileLineByLine(configPath, linesForFile);
  }
  else {
    log(chalk.keyword('orange')(`Warning: ${configPath} already configured for the module ${moduleName}`));
  }

  log();
}