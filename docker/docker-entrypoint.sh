#!/bin/sh
# vim:sw=4:ts=4:et

# Exit immediately if a command exits with a non-zero status
set -e

# Function to log messages in Logstash-compatible JSON format
log_logstash() {
    TIMESTAMP=$(date --utc +"%Y-%m-%dT%H:%M:%S.%3NZ")
    LEVEL=$1
    MESSAGE=$2
    echo "{\"@timestamp\":\"$TIMESTAMP\",\"@version\":\"1\",\"level\":\"$LEVEL\",\"message\":\"$MESSAGE\"}"
}

# Function to check if a line is valid JSON
is_json() {
    echo "$1" | jq empty >/dev/null 2>&1
}

# Determine which configuration to use based on IS_TLS_ENABLED
if [ "$IS_TLS_ENABLED" = "true" ]; then
    log_logstash "INFO" "TLS is enabled. Using SSL-enabled configuration."
    CONFIG_FILE="$NGINX_CONFIG_TLS_PATH"
else
    log_logstash "INFO" "TLS is disabled. Using plaintext configuration."
    CONFIG_FILE="$NGINX_CONFIG_PLAINTEXT_PATH"
fi

# Start Nginx with the appropriate configuration file dynamically
log_logstash "INFO" "Starting Nginx with $CONFIG_FILE..."

# Redirect all further output, validating if each line is JSON before processing
exec > >(while read -r line; do
    if is_json "$line"; then
        echo "$line"
    else
        log_logstash "INFO" "$line"
    fi
done) 2> >(while read -r line; do
    if is_json "$line"; then
        echo "$line"
    else
        log_logstash "ERROR" "$line"
    fi
done)

exec /docker-entrypoint.sh nginx -c "$CONFIG_FILE" -g "daemon off;"