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
const apiConfigPath = cliUtil.getCurrentDirectory() + cliUtil.getSeparator() + "src" + cliUtil.getSeparator() + "config" + cliUtil.getSeparator() + "apiConfig.js";
const routeConfigPath = cliUtil.getCurrentDirectory() + cliUtil.getSeparator() + "src" + cliUtil.getSeparator() + "config" + cliUtil.getSeparator() + "routeConfig.js";
const menuConfigPath = cliUtil.getCurrentDirectory() + cliUtil.getSeparator() + "src" + cliUtil.getSeparator() + "config" + cliUtil.getSeparator() + "menuConfig.js";

const mobileMenuConfigPath = cliUtil.getCurrentDirectory() + cliUtil.getSeparator() + "src" + cliUtil.getSeparator() + "config" + cliUtil.getSeparator() + "mobileMenuConfig.js";

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
          destPath + cliUtil.getSeparator() + "config" + cliUtil.getSeparator() + "apiConfig.js",
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
      // update API config
      await updateConfiguration(
        apiConfigPath,
        `import { ${argv.name}API } from '../app/modules/${argv.name}';`,
        `  ...${argv.name}API,`,
      );
      // update route config
      await updateConfiguration(
        routeConfigPath,
        `import { ${argv.name}Routes } from '../app/modules/${argv.name}';`,
        `  ...${argv.name}Routes,`);
      // update menu config
      await updateConfiguration(
        menuConfigPath,
        `import { ${argv.name}Menus } from '../app/modules/${argv.name}';`,
        `  ...${argv.name}Menus,`);

      await updateConfiguration(
        mobileMenuConfigPath,
        `import { ${argv.name}MobileMenus } from '../app/modules/${argv.name}';`,
        `  ...${argv.name}MobileMenus,`);

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

async function updateConfiguration(configPath, importStatement, spreadStatement) {
  log();
  log(chalk.green('Updating Configuartion : '), chalk.blue(configPath));
  let updatedLines = await cliUtil.readFileLineByLine(configPath);

  const basicInformation = cliUtil.getLineNumbers(updatedLines, argv.name);
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
    log(chalk.yellow(`Warning: ${configPath} already configured for the module ${args.name}`));
  }

  log();
}