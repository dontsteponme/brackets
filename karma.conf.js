
module.exports = function(config) {
  config.set({
    basePath: './ts',
    preprocessors: {
      '**/*.ts': ['typescript']
    },
    typescriptPreprocessor: {
      options: {
        // project: './tsconfig.json',  // tried and failed :(
        "module": "amd",
        "noImplicitAny": false,
        "removeComments": true,
        "preserveConstEnums": true,
        "outDir": "../js",
        "sourceMap": false,
        "target": "es5",
        "rootDir": "./"
      }
    },
    reporters: ['progress'],
    loggers: [{type: 'console'}],
    files: [
      { pattern: './main.ts', included: false },
      { pattern: './**/*.ts', included: false },
      { pattern: '../ts/tests/test-main.js', included: true }
    ],
    excludes: [
      '**/*.js.map',
      '/main.js',
      '/main.ts',
      'definitions/*.d.ts'
    ],
    frameworks: ['jasmine', 'requirejs'],
    browsers: ['PhantomJS']
    // browsers: ['Chrome']
  });
};
