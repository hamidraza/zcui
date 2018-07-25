const shell = require('shelljs');
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const {evalTemplate} = require('../../helpers/template');
const logSymbols = require('../../helpers/log-symbols.js');
const {getProjectRoot, getCases} = require('../../helpers');

const PWD = getProjectRoot();

const AppConfig = require(path.join(PWD, '.zcui/config.js'));

exports.command  = 'page <name>';
exports.desc     = 'create new page';

exports.builder = yargs => {
  const layoutDir = path.join(PWD, AppConfig.path.layouts);
  const availableLayouts = shell.test('-d', layoutDir) ? shell.ls('-l', layoutDir)
    .filter(l => shell.test('-d', path.join(layoutDir, l.name)) )
    .map(l => l.name) : [];

  return yargs
    .example(`$0 create page Home --layout default ${chalk.dim('# for page with layout')} ${chalk.underline.dim.bold('default')}`)
    .example(`$0 create page Home --no-layout      ${chalk.dim('# for page without any layout')}`)
    .options({
      'layout': {
        alias        : 'l',
        demandOption : true,
        describe     : 'layout for the page',
        type         : 'string',
        choices      : [false, ...availableLayouts]
      }
    });
};

exports.handler = argv => {
  const zcuiDir = path.join(PWD, '.zcui');
  const componentsDir = path.join(PWD, AppConfig.path.pages);

  if (!shell.test('-d', componentsDir)) {
    shell.mkdir('-p', componentsDir);
  }

  const name = getCases(argv.name);
  const layout = argv.layout === false ? null : getCases(argv.layout);

  const componentPath = path.join(componentsDir, name.param);
  if (shell.test('-d', componentPath)) {
    console.log(`${logSymbols.error} ${name.param} page already exits! Please choose some another name!!!`);
    shell.exit(1);
  }
  shell.mkdir('-p', componentPath);

  const templateDir = path.resolve(zcuiDir, 'templates/create/page');
  shell.ls(templateDir).forEach(tpl => {
    const fileName = tpl.replace(/^(page)/, name.param).replace(/(\.tpl)$/, '');
    const tplPath = path.resolve(templateDir, tpl);
    const filePath = path.join(componentPath, fileName);

    const tplContent = fs.readFileSync(tplPath, 'utf8');
    const fileContent = evalTemplate(`\`${tplContent}\``, {name, layout});

    fs.writeFileSync(filePath, fileContent);
  });

  console.log(logSymbols.success, `${chalk.bold(name.param)} Page created`);
  console.log(`
  ${chalk.underline.dim('Use:')}
  import ${chalk.bold(name.pascal)} from '${chalk.bold(`~/pages/${name.param}`)}';
  `);
};

