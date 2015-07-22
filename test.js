/* global CloudWatch:false - from dispatch:CloudWatch-client */
/* global sinon:false - from practicalmeteor:sinon */
/* global stubs:false - from practicalmeteor:sinon */

var bogusSettings = {
  accessKeyId: 'foo',
  secretAccessKey: 'bar',
  region: 'us-east-1',
  namespace: 'test'
};

Tinytest.add('CloudWatch - Package should create instance from Meteor.settings.cloudWatch', function(test) {
  // Manually configure...
  Meteor.settings.cloudWatch = bogusSettings;

  CloudWatch._loadClient();

  test.isNotNull(CloudWatch._instance._cloudwatch);

  // Reset
  CloudWatch._instance = null;
});

Tinytest.add('CloudWatch - _loadClient should throw an error if settings are present but not correct', function(test) {
  Meteor.settings.cloudWatch = {};

  test.throws(CloudWatch._loadClient);
});


Tinytest.add('CloudWatch - Timer should log a metric on stop', function() {
  var client = new CloudWatch.client(bogusSettings);

  var trackStub = stubs.create('track', client, 'track');
  var timer = client.startTimer('foo.bar.baz');
  Meteor._sleepForMs(100);
  timer.stop();

  sinon.assert.calledWith(trackStub, 'foo.bar.baz', sinon.match.number);

  stubs.restoreAll();
});

Tinytest.add('CloudWatch - monitorFunction should log stats accurately', function(test) {

  var client = new CloudWatch.client(bogusSettings);

  var trackStub = stubs.create('track', client, 'track');

  var monitoredFunction = client.monitorFunction('testMetric', function(boolVal) {
    if (!boolVal) {
      throw new Error('Boolval must be true');
    }
  });

  monitoredFunction(true);
  test.throws(function() {
    monitoredFunction(false);
  });

  sinon.assert.calledTwice(trackStub);
  sinon.assert.calledWith(trackStub, 'testMetric.success', 1);
  sinon.assert.calledWith(trackStub, 'testMetric.error', 1);
});
