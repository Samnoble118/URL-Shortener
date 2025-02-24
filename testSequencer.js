// testSequencer.js
class TestSequencer extends require('@jest/test-sequencer').default {
    // eslint-disable-next-line no-unused-vars
    async run({ testFile, tests }, options) {
      return tests;
    }
  }

  module.exports = TestSequencer;