# SlackBot

Simple bot that allows you to run tasks via Slack.

## Requirements

* Node.js 6.9.x 
* PhantomJS
* A Slack token: [Test Tokens](https://api.slack.com/docs/oauth-test-tokens)
* Docker (optional)

## Setup 

1. Clone the project `$ git clone git@github.com:minustime/slackbot.git`
2. Install dependencies `$ npm install`
3. Build it `$ npm run build`

## Run 

Start the bot by running `$ SLACK_TOKEN=<your slack token> node dist/index`

_OR_

**via Docker**

1. Copy `env_make.sample` into `env_make`
2. Add your Slack token as an environment variable
3. Build the Docker image `$ make build`
4. Run the container `$ make run`

To bring down the container do `$ make stop`

## Bot Commands

Once the bot joins your team, you can invite it to a group channel and run commands.

### Load testing

The load testing feature uses the [artillery.io](https://artillery.io) library. Results are posted as a screenshot to the channel where the testing initiated.

**Start a quick load test**

`artillery quick -d 60 -r 10 -k https://myapp.dev`

More on Artillery's quick command: [Artillery cli reference](https://artillery.io/docs/cli_reference.html#quick)

**Start a test using an Artillery config file**

Upload your config files to the channel and run:

`artillery run yourconfig.json`

More on Artillery's config files start here: [Artillery basic concepts](https://artillery.io/docs/basicconcepts.html)

### To-do

* Add tests
* Allow to run in channels, private mesages, etc.
* Add types
* Refactor RTMS
* Pass bot options via environment vars
