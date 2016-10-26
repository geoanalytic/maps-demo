FROM postgres:9.5

# add backup scripts
ADD backup.sh /usr/local/bin/backup
ADD restore.sh /usr/local/bin/restore
ADD list-backups.sh /usr/local/bin/list-backups

# make them executable
RUN chmod +x /usr/local/bin/restore
RUN chmod +x /usr/local/bin/list-backups
RUN chmod +x /usr/local/bin/backup

# add Postgis support
RUN apt-get update \
  && apt-get install --no-install-recommends -y postgresql-9.5-postgis-2.2 postgresql-9.5-postgis-2.2-scripts \
  && apt-get clean \
  && rm -rf /var/lib/apt/lists/*

COPY 00-postgis.sql /docker-entrypoint-initdb.d/