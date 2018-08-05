module.exports = {
  suites: ['test/index.html'],
  plugins: {
    istanbub: {
      reporters: ["text-summary", "lcov"],
      include: [
        'lib/**/*.js'
      ]
    }
  }
};
