/* global AWS:false - from peerlibrary:aws-sdk */

CloudWatch = {};

CloudWatch.client = function(config) {
  check(config, {
    accessKeyId: String,
    secretAccessKey: String,
    region: String,
    namespace: Match.Optional(String),
    debug: Match.Optional(Boolean)
  });

  this._cloudwatch = new AWS.CloudWatch({
    accessKeyId: config.accessKeyId,
    secretAccessKey: config.secretAccessKey,
    region: config.region
  });

  this._config = config;


};


CloudWatch.client.prototype.track = function(metricName, value, unit) {
  var self = this;
  check(metricName, String);
  check(value, Number);

  if (!unit) {
    unit = 'Count';
  }

  if (this._config.debug) {
    console.log('Sending CloudWatch metric: %s : %f %s', metricName, value, unit);
  }



  this._cloudwatch.putMetricData({
    MetricData: [{
      MetricName: metricName,
      Value: parseFloat(value),
      Unit: unit,

    }],
    Namespace: this._config.namespace
  }, function() {
    if (self._config.debug === true) {
      console.log(arguments);
    }
  });

};

CloudWatch.client.prototype.startTimer = function(metricName) {
  var timer = new Timer(metricName, this);
  timer.start();
  return timer;
};
