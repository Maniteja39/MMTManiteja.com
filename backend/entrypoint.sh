#!/bin/sh
set -eu

# Render provides DATABASE_URL in the form:
#   postgres://USER:PASSWORD@HOST:PORT/DBNAME
# Spring wants:
#   JDBC_DATABASE_URL=jdbc:postgresql://HOST:PORT/DBNAME
#   DATABASE_USERNAME=USER
#   DATABASE_PASSWORD=PASSWORD
#
# Parse once at startup so we don't need a special JDBC driver.
if [ -n "${DATABASE_URL:-}" ] && [ -z "${JDBC_DATABASE_URL:-}" ]; then
    # Strip scheme
    NO_SCHEME="${DATABASE_URL#postgres://}"
    NO_SCHEME="${NO_SCHEME#postgresql://}"

    # userinfo@hostport/db
    CREDS="${NO_SCHEME%@*}"
    HOST_DB="${NO_SCHEME#*@}"

    DATABASE_USERNAME="${CREDS%%:*}"
    DATABASE_PASSWORD="${CREDS#*:}"

    # Drop any query string from the host/db portion
    HOST_DB_NO_QS="${HOST_DB%%\?*}"

    export JDBC_DATABASE_URL="jdbc:postgresql://${HOST_DB_NO_QS}"
    export DATABASE_USERNAME
    export DATABASE_PASSWORD
fi

exec java ${JAVA_OPTS:-} -jar /app/app.jar
