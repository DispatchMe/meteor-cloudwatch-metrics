Track custom metrics with AWS CloudWatch

# Instantiating
A client will automatically be created for you if you have the following settings in `Meteor.settings`:

```json
{
  "cloudWatch":{
    "accessKeyId":"{access key}",
    "secretAccessKey":"{secret key}",
    "region":"{aws region}",
    "namespace":"custom namespace"
  }
}
```

All of the methods on this "default" client will be attached to the exported `CloudWatch` object, so you can call `CloudWatch.track(...)` and it will call `track()` on the default client.

Alternatively, you can create a new client as follows (port is usually 2003):

```javascript
var client = new CloudWatch.client(config);
```

# Usage
`client.track('metricName', value, unit='Count');`

See the [AWS SDK documentation](http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudWatch.html#putMetricData-property).


# Function Wrapping
You can use `client.monitorFunction` to wrap any function and send metrics to `statsd`. If the function throws an error, the count for `{metricName}.error` will be incremented by 1, and if not, the count for `{metricName}.success` will be incremented by 1. For example:

```javascript
Meteor.methods({
  'myMethod':CloudWatch.monitorFunction('myMetric', function(data) {
    // Do something with the data
  }, {
    trackSuccess:true,
    trackCalls:true
  })
});
```

In this case, every time you run `Meteor.call('myMethod')`, `myMetric.call` will be incremented by 1. If the function returns successfully, then a `myMetric.success` metric will be sent with value `1` , otherwise if there's an error thrown, `myMetric.error` will be sent.
