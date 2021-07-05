var faye = require('faye');
var alert = require('alert');
var channel = '/' + process.env.FAYE_CHANNEL
var server = process.env.FAYE_SERVER

alert("Clent configuration: server: " + server + ", channel: " + channel);

var client = new faye.Client(server);

client.subscribe(channel, function(message) {
  alert('Got a message: ' + message.text);
});