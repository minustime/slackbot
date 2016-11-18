all: info

info:
		@echo 'Usage: make <build|up|down>'
build:
		npm run build && docker build -t slackbot .
up:
		docker-compose up
down:
		docker-compose down
