'use strict';

import getConfig from './tasks/get-config';
import confirmLoadTest from './tasks/confirm-loadtest';
import artilleryRun from './tasks/artillery-run';
import artilleryQuick from './tasks/artillery-quick';
import artilleryQuickValidate from './tasks/artillery-quick-validate';
import generateReportHtml from './tasks/generate-report';
import generateScreenshot from './tasks/generate-screenshot';
import uploadReport from './tasks/upload-report';

const debug = require('debug')('loadtest');

function runConfig(bot, request) {

    // Run the tasks
    getConfig(bot, request) 
        .then(result => confirmLoadTest(bot, request, result)) 
        .then(result => artilleryRun(bot, request, result))
        .then(result => generateReportHtml(bot, request, result))
        .then(result => generateScreenshot(bot, request, result))
        .then(result => uploadReport(bot, request, result))
        .catch(err => bot.say(request, err));
}

function runQuick(bot, request) {

    // Run the tasks
    artilleryQuickValidate(bot, request) 
        .then(result => artilleryQuick(bot, request, result))
        .then(result => generateReportHtml(bot, request, result))
        .then(result => generateScreenshot(bot, request, result))
        .then(result => uploadReport(bot, request, result))
        .catch(err => bot.say(request, err));
}

function init(bot) {

    debug('Loadtest module is ready..');

    // Listen for: artillery config.json
    bot.listen('^artillery run ([^ ]+.json)$', data => {

        runConfig(bot, {
            user: data.user,
            channel: data.channel,
            slackToken: bot.slackToken,
            configName: `${data.match[1]}`
        });
    })

    // Listen for: artillery quick
    bot.listen('^artillery (quick .+http(s?):\/\/[^ ]+)$', data => {

        runQuick(bot, {
            user: data.user,
            channel: data.channel,
            slackToken: bot.slackToken,
            command: data.match[1]
        });
    })
}

export default init