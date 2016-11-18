'use strict';

import Rtm from './lib/rtm';
import loadtest from './loadtest';

const slackToken = process.env.SLACK_TOKEN;

if(!slackToken) {
    console.log('Slack token missing.');
    process.exit(1);
}

// Connect to Slack
const bot = new Rtm(slackToken);

// Are we on?
bot.on('open', msg => console.log(msg));

// Fire up the load testing module
loadtest(bot); 