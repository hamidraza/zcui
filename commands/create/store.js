const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const shell = require('shelljs');
const {evalTemplate} = require('../../helpers/template');
const logSymbols = require('../../helpers/log-symbols.js');
const {getProjectRoot, getCases} = require('../../helpers');

const PWD = getProjectRoot();

const AppConfig = require(path.join(PWD, '.zcui/config.js'));

exports.command  = 'store <name>';
exports.desc     = 'create new store';

exports.builder = yargs => {
  return yargs.example('$0 create store User');
};

exports.handler = argv => {
  const name = getCases(argv.name);

  const storeDir = path.join(PWD, AppConfig.path.store);
  const moduleDir = path.join(storeDir, 'modules');
  if(!shell.test('-d', moduleDir)) shell.mkdir('-p', moduleDir);

  const specDir = path.join(moduleDir, '__tests__');
  if(!shell.test('-d', specDir)) shell.mkdir('-p', specDir);

  const filePath = path.join(moduleDir, `${name.param}.js`);
  const specPath = path.join(specDir, `${name.param}.spec.js`);
  if (shell.test('-e', filePath)) {
    console.log(`${logSymbols.error} ${name.param} store already exits! Please choose some another name!!!`);
    shell.exit(1);
  }

  const zcuiDir = path.join(PWD, '.zcui');
  const tplDir = path.resolve(zcuiDir, 'templates/create/store');
  const tplFilePath = path.resolve(tplDir, 'module.js.tpl');
  const tplSpecPath = path.resolve(tplDir, 'module.spec.js.tpl');

  const tplFileContent = fs.readFileSync(tplFilePath, 'utf8');
  const tplSpecContent = fs.readFileSync(tplSpecPath, 'utf8');

  fs.writeFileSync(filePath, evalTemplate(`\`${tplFileContent}\``, {name}));
  fs.writeFileSync(specPath, evalTemplate(`\`${tplSpecContent}\``, {name}));

  /**
   * Update store/modules/index.js with
   * all modules import and export
   **/
  const jsFileRegx = /(\.js)$/;
  const modulesToImport = shell.ls(moduleDir).filter(moduleFile => {
    return !(moduleFile == 'index.js' || !jsFileRegx.test(moduleFile));
  }).map(moduleFile => {
    return moduleFile.replace(jsFileRegx, '');
  });

  const importStr = modulesToImport.map(m => {
    return `import ${getCases(m).pascal} from './${m}';`;
  }).join("\n");
  const exportStr = modulesToImport.map(m => {
    return `\n  ${getCases(m).pascal}`;
  }).join(",");

  const indexPath = path.resolve(moduleDir, `index.js`);
  const indexContent = `${importStr}\n\nexport default {${exportStr}\n};\n\n`;
  fs.writeFileSync(indexPath, indexContent);

  console.log(logSymbols.success, `${chalk.bold(name.param)} Store module created`);
};

