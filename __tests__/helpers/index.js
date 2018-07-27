const tap = require('tap');
const path = require('path');

const test = tap.test;
const helper = require('../../helpers');
const testProjPath = path.resolve(__dirname, '../../temp/test-proj');

test('HELPER', t => {

  test('getProjectRoot', t => {
    test('null on no parent zcui project', t => {
      const appRoot = helper.getProjectRoot(testProjPath);
      t.notOk(appRoot);
      t.end();
    });

    test('path of parent zcui project', t => {
      const projPath = path.join(testProjPath, 'hello-world');
      const appRoot = helper.getProjectRoot(path.join(projPath, 'src'));
      t.equal(appRoot, projPath);
      t.end();
    });

    t.end();
  });

  test('getCases', t => {
    test('empty on empty string', t => {
      t.same(helper.getCases(''), {
        camel: '',
        constant: '',
        default: '',
        lower: '',
        param: '',
        pascal: '',
        snake: '',
        upper: '',
      });
      t.end();
    });

    test('cases for HellWorld', t => {
      t.same(helper.getCases('HelloWorld'), {
        camel: 'helloWorld',
        constant: 'HELLO_WORLD',
        default: 'HelloWorld',
        lower: 'helloworld',
        param: 'hello-world',
        pascal: 'HelloWorld',
        snake: 'hello_world',
        upper: 'HELLOWORLD',
      });
      t.end();
    });

    t.end();
  });

  t.end();
});
