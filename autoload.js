CloudWatch._loadClient = function() {
  if (Meteor.settings.cloudWatch) {
    CloudWatch._instance = new CloudWatch.client(Meteor.settings.cloudWatch);

    ['track', 'startTimer', 'monitorFunction'].forEach(function(func) {
      CloudWatch[func] = _.bind(CloudWatch._instance[func], CloudWatch._instance);
    });
  } else {
    console.warn('No CloudWatch settings - creating no-op client');


    CloudWatch.track = function() {
      return false;
    };

    CloudWatch.startTimer = function() {
      return {
        stop: function() {
          return false;
        }
      };
    };
  }
};

CloudWatch._loadClient();
