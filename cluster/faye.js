var faye        = require('faye'),
    fayeIoRedis = require('faye-ioredis'),
    ioRedis     = require('ioredis'),
    http        = require('http'),
    alert       = require('alert'),
    port        = process.env.FAYE_PORT || '8080',
    redisType   = process.env.REDIS_TYPE || 'noredis',
    redisHost   = process.env.REDIS_HOST || 'redis-master',
    redisPort   = process.env.REDIS_PORT || 6379,
    redisSentinels      = process.env.REDIS_SENTINELS.split(','),
    redisSentinelsPort  = process.env.REDIS_SENTINELS_PORT || 26379;

var server = http.createServer();
var bayeux;

if (redisType == 'single') {
  alert('Creating server in master mode: ' + redisHost + ':' + redisPort);
  bayeux = new faye.NodeAdapter({
    mount:    '/',
    timeout:  25,
    engine: {
      type: fayeIoRedis,
      redisConnectionOptions: {
        host: redisHost,
        port: redisPort,
      }
    }
  });
} else if (redisType == 'sentinel') {
  alert('Creating server in sentinel mode: ' + redisSentinels);
  var sentinels = [];
  for (let i = 0; i < redisSentinels.length; i++) {
    sentinels.push({host: redisSentinels[i], port: redisSentinelsPort});    
  }
  bayeux = new faye.NodeAdapter({
    mount:    '/',
    timeout:  25,
    engine: {
      type: fayeIoRedis,
      redisClass: ioRedis.Sentinel,
      redisConnectionOptions: {
        sentinels: sentinels,
        name: "master"
      },
    }
  });
} else {
  alert('Creating server in no redis mode.');
  bayeux = new faye.NodeAdapter({mount: '/'});
}

alert('Attaching server ...')
bayeux.attach(server);
alert('Start server ...')
server.listen(port);

bayeux.on('handshake', (clientId) => {
  alert('Client ' + clientId + ' connected');
});

bayeux.on('subscribe', (clientId, channel) =>{
  alert('Client ' + clientId + ' subscribed to channel ' + channel);
});

bayeux.on('unsubscribe', (clientId, channel) =>{
  alert('Client ' + clientId + ' unsubscribed from channel ' + channel);
});

bayeux.on('publish', (clientId, channel, data) =>{
  alert('Published to channel ' + channel + '. Data: ' + require('util').inspect(data, {depth:null}));
});

bayeux.on('disconnect', (clientId) => {
  alert('Client ' + clientId + ' disconnected');
});