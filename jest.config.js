// jest.config.js
module.exports = {
    testMatch: [
        "**/__tests__/**/*.[jt]s?(x)",
        "**/?(*.)+(spec|test).[tj]s?(x)"
    ],
    testSequencer: "<rootDir>/testSequencer.js" // or a path to your custom sequencer
};