module.exports = {
  name: 'market-monitor',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/apps/market-monitor',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};
