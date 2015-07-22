/**
 * Wrap an exposed function (e.g. Meteor.method) with logging
 * 
 * @param  {String} metricName            The name of the metric to log to (this will get 
 *                                        appended with "success" or "error" depending on 
 *                                        the result of the function)
 * @param  {Function} func                The function to wrap
 * @param {Object} options                Additional options for tracking
 * @param {Boolean} options.trackSuccess  Whether to track successful function calls (defaults to true)
 * @param {Boolean} options.trackCalls    Whether to track every function call regardless of success or error 
 *                                        (defaults to false)
 * @return {unknown}                      The return value of the function
 */
CloudWatch.client.prototype.monitorFunction = function(metricName, func, options) {
  options = _.defaults(options || {}, {
    trackSuccess: true,
    trackCalls: false
  });

  var self = this;
  return function() {
    var returnVal;

    if (options.trackCalls === true) {
      self.track(metricName + '.call', 1);
    }
    try {
      returnVal = func.apply(this, arguments);
    } catch (err) {
      self.track(metricName + '.error', 1);
      throw err;
    }
    if (options.trackSuccess === true) {
      self.track(metricName + '.success', 1);
    }

    return returnVal;
  };
};
