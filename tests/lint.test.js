var lint = require("mocha-eslint");

// Array of paths to lint
// Note: a seperate Mocha test will be run for each path and each file which
// matches a glob pattern
var paths = ["./app/configs/**", "./app/controllers/**", "./app/hooks/**", "./app/listeners/**", "./app/models/**", "./app/policies/**", "./app/resources/**", "./app/routers/**"];

var options = {
    // Increase the timeout of the test if linting takes to long
  timeout: 5000,  // Defaults to the global mocha `timeout` option

    // Increase the time until a test is marked as slow
  slow: 1000,  // Defaults to the global mocha `slow` option

    // Consider linting warnings as errors and return failure
  strict: true  // Defaults to `false`, only notify the warnings
};

// Run the tests
lint(paths, options);
