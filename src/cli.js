const yargs = require('yargs');
const path = require('path');
const { hideBin } = require('yargs/helpers');

const createAppHandler = require('./command-handler/createApp').createAppHandler;
const createModuleHandler = require('./command-handler/createModule').createModule;


export async function cli(args) {
  // console.log('Arguments passed >>> : ', args);
  yargs.default("cliHome", path.resolve(args[1], '../../'));
  const options = yargs
    .command({
      command: 'create-app',
      desc: 'Create a react app',
      builder: (yargs) => {
        return yargs.option('n', {
          alias: 'name',
          describe: 'name of the application',
          demandOption: true
        })
        // yargs.default('value', 'true');
      },
      handler: (argv) => {
        console.log(argv);
        createAppHandler(argv);
      }
    })
    .command({
      command: 'create-module',
      desc: 'Create a new module',
      builder: (yargs) => {
        return yargs.option('n', {
          alias: 'name',
          describe: 'name of the module',
          demandOption: true
        })
        // yargs.default('value', 'true');
      },
      handler: (argv) => {
        console.log(argv);
        createModuleHandler(argv);
      }
    })
    // provide a minimum demand and a minimum demand message
    .demandCommand(1, 1, 'You need at least one command before moving on', 'Only one command can be used')
    .argv;

}