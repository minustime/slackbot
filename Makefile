BOT_NAME ?= slackbot

.PHONY: all info build start run rm stop

all: help 
help:
	@echo "\nShortcuts to work with the $(BOT_NAME) Docker image."
	@echo "Please ensure you have an env_make file setup.\n"
	@echo "Usage: \nmake build \nmake start \nmake run \nmake rm \nmake stop\n"
build:
	@docker build -t $(BOT_NAME) .
start:
	@docker start $(BOT_NAME)
run: rm
	@docker run -d --name $(BOT_NAME) -e SLACK_TOKEN=$(SLACK_TOKEN) -e DEBUG=loadtest $(BOT_NAME)
rm: stop
	@docker rm $$(docker ps -aq --filter name=$$BOT_NAME)
stop:
	@docker stop $(BOT_NAME)