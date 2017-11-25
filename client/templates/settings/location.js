getLocation = function () {
  if (Meteor.isCordova) {
    // For whatever reason it wont return the value of the location. Created a session.
    function onSuccess(position) { Session.set('userLocation', position) };
    function onError(error) { }

    navigator.geolocation.getCurrentPosition(onSuccess, onError, { enableHighAccuracy: true });

    var location = Session.get('userLocation');
    return location
  } else {
    console.log("Not on mobile");
  }
}