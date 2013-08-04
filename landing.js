if (Meteor.isClient) {

  Template.newsletter.events({
    'click input#news-submit' : function (e, template) {
      // template data, if any, is available in 'this'
      e.preventDefault();
      var email = template.find('#email-input').value;
      Meteor.call('subscribe', email, displayMessage);
      Session.set('sending', true);
    }
  });

  var displayMessage = function(error, result) {
    Session.set('sending', false);
    if (error) {
      Session.set('errorMessage', error.reason);
    }
    else if (result) {
      Session.set('successMessage', 'Thanks! A message was sent to validate your subscription.');
    }
    else {
      Session.set('errorMessage', 'Something went wrong. Please try again or contact us.');
    }
  };

  Template.newsletter.helpers({
    errorMessage: function() {
      return Session.get('errorMessage');
    },
    successMessage: function() {
      return Session.get('successMessage');
    },
    notSuccess: function() {
      return !Session.get('successMessage');
    },
    sending: function() {
      return Session.get('sending');
    }
  });
}


if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });

  Meteor.methods({

    subscribe: function(email) {
      var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      var valid = re.test(email);

      if (!valid) {
        throw new Meteor.Error(400, 'Please enter a valid email address.');
      }

      Meteor.http.post(
        'http://lists.peerlibrary.org/lists',
        {
          params:
          {
            list: 'news',
            action: 'subrequest',
            action_subrequest: 'subscribe',
            email: email
          }
        }
      );

      return true;
    }
  });
}
