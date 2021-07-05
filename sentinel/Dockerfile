FROM redis
ADD sentinel.conf /etc/redis/sentinel.conf
RUN chown -R redis:redis /etc/redis/
EXPOSE 26379
CMD [ "redis-server", "/etc/redis/sentinel.conf", "--sentinel"]