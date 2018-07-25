const path     = require('path');
const fs       = require('fs');
const shell    = require('shelljs');
const findRoot = require('find-root');
const changeCase = require('change-case');


const getProjectRoot = (pwd = null) => {
  let projectRoot = null;
  try{
    projectRoot = findRoot(pwd || shell.pwd().toString());
  } catch(e) {
    // TODO: handle exception
    return null;
  }

  if(!projectRoot) return null;

  /*
   * Check if project has .zcui dir and
   * contains config file
   */
  try{
    const configFile = path.resolve(projectRoot, '.zcui/config.js');
    return fs.existsSync(configFile) ? projectRoot : null;
  } catch(e) {
    // TODO: handle exception
    return null;
  }
};


const getCases = (str = '') => {
  return {
    default  : str,
    param    : changeCase.paramCase(str),
    pascal   : changeCase.pascalCase(str),
    camel    : changeCase.camelCase(str),
    constant : changeCase.constantCase(str),
    lower    : changeCase.lowerCase(str),
    upper    : changeCase.upperCase(str),
    snake    : changeCase.snakeCase(str),
  };
};


module.exports = {
  getProjectRoot,
  getCases,
};
