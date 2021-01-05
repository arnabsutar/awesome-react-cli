const cp = require('child_process');
const isWin = process.platform === "win32";
const defaultArgs = [isWin ? '/c' : '-c'];
const chalk = require('chalk');

export async function execute(args) {
  console.log();
  console.log(chalk.blueBright(args.join(" ")));
  args = [...defaultArgs, ...args];
  return cp.spawn(isWin ? 'cmd' : 'sh', args,
    {
      stdio: 'inherit',
      // shell: true,
    });
}