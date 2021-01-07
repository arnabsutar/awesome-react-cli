
// stderr is sent to stdout of parent process
// you can set options.stdio if you want it to go elsewhere
const chalk = require('chalk');
const cliUtil = require('../util');
const commandExecutioner = require("./commandExecutioner").execute;
const log = console.log;
// check for a file package.json
const existingPackageFile = cliUtil.checkIfExistingProject();

export async function createAppHandler(argv) {
  const commandName = argv._;
  const appName = argv.name;
  let templateName = argv.template;
  log()
  log(chalk.blueBright(`Executing command : ${commandName}`));
  log();
  log();
  log(chalk.greenBright(`Application Name : ${appName}`));
  if (templateName) {
    log(chalk.greenBright(`Template : ${templateName}`));
    log();
  }
  else {
    templateName = "awesome-react-template";
  }
  let args = ["npx", "create-react-app", appName];
  let proceed = false;
  if (templateName) {
    args = [...args, "--template", templateName];
  }

  if (!existingPackageFile) {
    proceed = true;
  }
  let child = null;
  if (proceed) {
    child = await commandExecutioner(args);
  }
  else {
    log()
    log(chalk.bgRed("FAILURE"), chalk.red("package.json"), "file exists. Please select a different folder");
  }
}