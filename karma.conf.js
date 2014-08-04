module.exports = function(config) {
  config.set({
    // Up a level since we expect to be embedded inside bower_components/ in
    // parallel to polymer itself.
    basePath: "../",
    frameworks: ["mocha"],
    files: [
      // Test runner deps.
      "fx-framework/node_modules/chai/chai.js",
      "fx-framework/mocha.conf.js",

      // Framework core deps.
      "platform/platform.js",
      "sugar/release/sugar.min.js",

      // The actual tests.
      "fx-framework/*-test.html",

      // We need to be able to serve these files, but don't want to have them
      // loaded automatically.
      {pattern: "fx-framework/*.html", included: false},
      {pattern: "platform/*", included: false},
      {pattern: "polymer/*", included: false},
    ],
    reporters: ["progress"],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ["ChromeCanary"],
    singleRun: false,
  });
};
