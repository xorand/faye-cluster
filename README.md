# Faye test setup with Redis Sentinel cluster

This compose file will create following test setup for Faye messaging server with Redis backend:

1. Redis master server and Redis slave server.
2. Three Redis Sentinels connected to Redis instances and watching master/slave changes.
3. Simple faye server setup with faye-ioredis plugin (faye redis backend), scaled by 3 instances with same name (simple dns round-robin balancing inside docker network).
4. Simple faye publish service - every 10 seconds will publish in channel /msgs message with current date and time
5. Simple faye client scaled by 10 instances. Every client configured to subscribe to channel /msgs and receive message published every 10 seconds.

## Starting up
Assume you have latest versions of docker and docker-compose. Clone repository, from cloned directory run
```
docker-compose up --build -d
```
Clients connect to faye server instances and receive messages no matter which server they are connected to, so Redis backend is working. We can monitor connected clients by running:
```
docker-compose logs faye-cluster
```
And we can monitor received messages by running:
```
docker-compose logs faye-client
```
We can stop Redis master container and initiate promoting slave Redis server to master by Sentinels and back to test Redis backend failover:
```
docker stop faye_cluster_redis-master_1
```
Then to resume:
```
docker start faye_cluster_redis-master_1
```
## Known issues
In this project faye-ioredis plugin was locked to version 0.2.0 (corresponds to ioredis 1.13.1).
Last version (0.3.0 with bumped ioredis to 4.19.4) not working correctly - in about 1 min after server was created it crashes with error:
```
 /usr/src/faye/node_modules/faye-ioredis/faye-redis.js:276
       .bind(this)
        ^
 
 TypeError: this._redis.setnx(...).bind is not a function
     at Engine._withLock (/usr/src/faye/node_modules/faye-ioredis/faye-redis.js:276:8)
     at Engine.gc (/usr/src/faye/node_modules/faye-ioredis/faye-redis.js:257:17)
     at Timeout._onTimeout (/usr/src/faye/node_modules/faye-ioredis/faye-redis.js:47:44)
     at listOnTimeout (internal/timers.js:557:17)
     at processTimers (internal/timers.js:500:7)
```