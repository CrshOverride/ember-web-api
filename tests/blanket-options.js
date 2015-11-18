/* globals blanket, module */

var options = {
  modulePrefix: 'ember-web-api',
  filter: '//.*ember-web-api/.*/',
  antifilter: '//.*(tests|template).*/',
  loaderExclusions: [],
  enableCoverage: true,
  cliOptions: {
    lcovOptions: {
      outputFile: 'coverage/coverage.dat',
      renamer: function(moduleName) {
        var expression = /^APP_NAME/;
        return moduleName.replace(expression, 'app') + '.js';
      }
    },
    reporters: ['lcov'],
    autostart: true
  }
};
if (typeof exports === 'undefined') {
  blanket.options(options);
} else {
  module.exports = options;
}
