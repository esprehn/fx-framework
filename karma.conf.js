module.exports = function(config) {
  config.set({
    basePath: ".",
    frameworks: ["mocha"],
    files: [
      // Test runner deps.
      "/node_modules/chai/chai.js",
      "/mocha.conf.js",
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
