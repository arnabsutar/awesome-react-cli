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
      await updateConfiguration(
        apiConfigPath,
        `import { ${argv.name}API } from '../app/modules/${argv.name}';`,
        `  ...${argv.name}API,`,
      );
      // update route config
      await updateConfiguration(argv,
        routeConfigPath,
        `import { ${argv.name}Route } from '../app/modules/${argv.name}';`,
        `  ...${argv.name}Route,`);
      // update menu config
      await updateConfiguration(argv,
        routeConfigPath,
        `import { ${argv.name}Menus } from '../app/modules/${argv.name}';`,
        `  ...${argv.name}Menus,`);
      await updateConfiguration(argv,
        routeConfigPath,
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
  log('Configuration Path : ', chalk.bgBlue(configPath));
  log('Configuration exists : ', cliUtil.doesExists(configPath));

  let updatedLines = await cliUtil.readFileLineByLine(configPath);
  log(updatedLines);

  const basicInformation = cliUtil.getLineNumbers(updatedLines, argv.name);
  log(basicInformation);
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