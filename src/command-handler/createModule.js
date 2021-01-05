const chalk = require('chalk');
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
  log(flagFile);
  if (cliUtil.doesExists(flagFile) && cliUtil.checkIfExistingProject()) {
    log(chalk.blue('Going to create module ' + moduleName));
    let destPath = moduleDestination + cliUtil.getSeparator() + moduleName;
    fse.copySync(moduleTemplatePath, destPath);
    log(chalk.greenBright("Module structure has been created"));
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
  }
  else {
    log(chalk.redBright('Please use a project which has been created using awesome-react-template'));
  }

}