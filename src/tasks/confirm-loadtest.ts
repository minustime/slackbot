'use strict';

import { spawn } from 'child_process'

function confirmLoadTest(bot, request, files) {
    return new Promise((resolve, reject) => {
        bot.confirm(request, `📢 I'll run a load test using these config files: <${files.config.url}|${files.config.name}> and <${files.dependency.url}|${files.dependency.name}>. Go for it? type *_YES_* or *_NO_*.`)
            .then(yes => yes ? resolve(files) : bot.say(request, 'Ok!'))
            .catch(err => reject('Didn\'t get a response on time, cancelling the load test request.'))
    });
}

export default confirmLoadTest