#!/bin/bash

# Host and port from command line arguments
host="$1"
port="$2"
timeout=30
counter=0

# Extract host and port from format like "db:5432"
if [[ $host == *":"* ]]; then
    port=${host#*:}
    host=${host%:*}
fi

echo "Waiting for ${host}:${port}..."

# Loop until the connection succeeds or timeout is reached
until pg_isready -h "$host" -p "$port" -U "med_user" > /dev/null 2>&1; do
    counter=$((counter + 1))
    if [ $counter -eq $timeout ]; then
        echo "Timeout reached while waiting for ${host}:${port}"
        exit 1
    fi
    echo "Waiting for PostgreSQL to become available... ($counter/$timeout)"
    sleep 1
done

echo "${host}:${port} is available" 