if (Meteor.isClient) {

  Template.newsletter.events({
    'click input#news-submit' : function (e, template) {
      // template data, if any, is available in 'this'
      e.preventDefault();

      var email = template.find('#news-email').value;
      Meteor.call('newsletter', email, displayMessage);     
    }
  });

  var displayMessage = function(error, result) {
    if (error) {
      Session.set('message', error.reason);
      Session.set('messageClass', 'error');
    }
    else if (result) {
      Session.set('message', 'Thanks! A message was sent to validate your subscription.');
      Session.set('messageClass', 'success');
    }
    else {
      Session.set('message', 'Something went wrong. Please try again or contact us.');
      Session.set('messageClass', 'error');
    }
  };

  Template.newsletter.helpers({
    message: function() {
      return Session.get('message');
    },
    messageClass: function() {
      return Session.get('messageClass');
    },
    notSuccess: function() {
      return Session.get('messageClass') !== 'success';
    }
  });
}


if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });

  Meteor.methods({
    newsletter: function(email) {
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
