'use strict';

import * as fs from 'fs'
import { spawn } from 'child_process'

const debug = require('debug')('loadtest');

function artilleryQuick(bot, request, params) {

    return new Promise((resolve, reject) => {

        // Create temporary directory
        fs.mkdtemp('/tmp/loadtest-', (err, dir) => {

            if(err) {
                debug(`Error, could not create temporary dir ${err}`);
                reject(`⚠️️ Something went wrong, please try again.`);
            }

            const reportFile  = `${dir}/loadtest-report.json`;
            params = params.concat(['-o', reportFile]);

            debug(`Running quick testing with params: ${params.join(' ')}`);

            // Run test
            const cmd = spawn('artillery', params, {
                detached: true,
                cwd: dir
            });

            cmd.stdout.on('data', (data) => {
                bot.typing(request);
                debug(`${data}`);
                if(String(data).includes('Phase')) {
                    bot.say(request, `${data}`);
                }
            });

            cmd.stderr.on('data', (data) => {
                debug(`${data}`);
            });

            cmd.on('close', (exitCode) => {

                debug(`Process exited with code: ${exitCode}`);

                if(exitCode === 0) {
                    fs.readFile(reportFile, (err, data) => {
                        if (err) {
                            debug(err);
                            return reject(`⚠️️ Sorry, something wen't wrong and halt the load testing. Please try again.`);
                        }
                        resolve(`${data}`);
                    })
                }
                else if(exitCode) {
                    reject(`⚠️️ Oops, I ran into an issue. Please check your syntax and try again.`);
                }
            });

            bot.say(request, '📢 Alright, if you want to cancel the testing type *_CANCEL_*. Here we go!');
            bot.listenOnce('^cancel$', request, () => {
                reject('Ok! load testing has been cancelled.');
                process.kill(-cmd.pid, 'SIGKILL');
            })
        });
    })
}

export default artilleryQuick