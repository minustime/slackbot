'use strict';

import * as fs from 'fs'
import axios from 'axios';
const FormData = require('form-data');

function uploadReport(bot, request, imageFile) {

    return new Promise((resolve, reject) => {

        const data = new FormData();
        const fileUpload = `https://slack.com/api/files.upload?token=${request.slackToken}&channels=${request.channel}&filename=report.png&title=Report&initial_comment=Done!`;

        data.append('filename', 'report.png');
        data.append('file', fs.createReadStream(imageFile));

        axios.post(fileUpload, data, {
            headers: data.getHeaders()
        })
            .then(response => {
                resolve(response.data.messages);
            })
            .catch(err => {
                reject(err)
            })
    });
}

export default uploadReport