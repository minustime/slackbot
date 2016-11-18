'use strict';

import { stringify } from 'querystring';
import { parse } from 'url';

const debug = require('debug')('loadtest');

function artilleryQuickValidate(bot, request) {

    return new Promise((resolve, reject) => {

        let params = request.command.split(' ');

        // Ensure only known parameters are passed in
        // TODO: Add --payload
        // FIXIT: fully validate URL
        const isValid = params.every(param => {
            return /(quick|--duration|-d|--rate|-r|-t|-k|\d*|http(s?):\/\/(.+))/.test(param);
        });

        // Remove <> surrounding URLs
        params = params.map(param => {
            return /<.+>/.test(param) ? encodeURI(param.match(/<(.+)>/)[1]) : param;
        })

        if(isValid) {
            resolve(params);
        }
        else {
            debug(`Error, invalid params: ${request.command}`);
            reject(`⚠️️ Hmm, please ensure you're passing valid artillery quick params. Click <https://artillery.io/docs/cli_reference.html#quick|here> for details`);
        }
    })
}

export default artilleryQuickValidate