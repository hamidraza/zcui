const shell = require('shelljs');
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const {evalTemplate} = require('../../helpers/template');
const logSymbols = require('../../helpers/log-symbols.js');
const {getProjectRoot, getCases} = require('../../helpers');

const PWD = getProjectRoot();

const AppConfig = require(path.join(PWD, '.zcui/config.js'));

exports.command  = 'component <name>';
exports.desc     = 'create new component';

exports.builder = yargs => {
  return yargs.example('$0 create component zc-calendar');
};

exports.handler = argv => {
  const zcuiDir = path.join(PWD, '.zcui');
  const templateDir = path.resolve(zcuiDir, 'templates/create/component');
  const componentsDir = path.join(PWD, AppConfig.path.components);

  if (!shell.test('-d', componentsDir)) {
    shell.mkdir('-p', componentsDir);
  }

  const name = getCases(argv.name);

  const componentPath = path.join(componentsDir, name.param);
  if (shell.test('-d', componentPath)) {
    console.log(`${logSymbols.error} ${name.param} component already exits! Please choose some another name!!!`);
    shell.exit(1);
  }
  shell.mkdir('-p', componentPath);

  shell.ls(templateDir).forEach(tpl => {
    const fileName = tpl.replace(/^(component)/, name.param).replace(/(\.tpl)$/, '');
    const tplPath = path.resolve(templateDir, tpl);
    const filePath = path.join(componentPath, fileName);

    const tplContent = fs.readFileSync(tplPath, 'utf8');
    const fileContent = evalTemplate(`\`${tplContent}\``, {name});

    fs.writeFileSync(filePath, fileContent);
  });

  console.log(logSymbols.success, `${chalk.bold(name.param)} Component created`);
  console.log(`
  ${chalk.underline.dim('Use:')}
  import ${chalk.bold(name.pascal)} from '${chalk.bold(`~/components/${name.param}`)}';
  `);
};

