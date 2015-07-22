Package.describe({
  name: 'dispatch:cloudwatch-metrics',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: 'Track custom metrics in AWS CloudWatch',
  // URL to the Git repository containing the source code for this package.
  git: 'https://github.com/DispatchMe/meteor-cloudwatch-metrics',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.use(['underscore', 'check', 'peerlibrary:aws-sdk@2.0.17_2'], 'server');
  api.versionsFrom('1.1.0.2');
  api.addFiles(['instance.js', 'autoload.js', 'timer.js', 'utils.js'], 'server');
  api.export('CloudWatch', 'server');
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use(['dispatch:cloudwatch-metrics', 'practicalmeteor:sinon'], 'server');
  api.addFiles('test.js', 'server');
});
