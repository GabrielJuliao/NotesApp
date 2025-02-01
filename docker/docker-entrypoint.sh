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

# Validate that CONTEXT_PATH is set
if [ -z "$CONTEXT_PATH" ]; then
    log_logstash "ERROR" "CONTEXT_PATH is not set. Exiting..."
    exit 1
fi

log_logstash "INFO" "Using CONTEXT_PATH: $CONTEXT_PATH"
log_logstash "INFO" "Preparing Nginx configuration..."

# Use a predefined directory inside the container
CONFIG_DIR="/tmp/nginx"
mkdir -p "$CONFIG_DIR"

# Generate a unique filename for the config
NEW_CONFIG_FILE="$CONFIG_DIR/nginx_config_$(date +%s).conf"
cp "$CONFIG_FILE" "$NEW_CONFIG_FILE"

log_logstash "INFO" "Nginx configuration file created: $NEW_CONFIG_FILE"

# Ensure `envsubst` works by replacing variables in the new config file
log_logstash "INFO" "Replacing variables in Nginx configuration..."
envsubst '${CONTEXT_PATH}' < "$CONFIG_FILE" > "$NEW_CONFIG_FILE"

# Validate if the new config file is not empty after substitution
if [ ! -s "$NEW_CONFIG_FILE" ]; then
    log_logstash "ERROR" "Nginx configuration became empty after substitution! Exiting..."
    rm -f "$NEW_CONFIG_FILE"
    exit 1
fi

log_logstash "INFO" "Starting Nginx with config: $NEW_CONFIG_FILE"

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

# Start Nginx using the new config file
exec /docker-entrypoint.sh nginx -c "$NEW_CONFIG_FILE" -g "daemon off;"
