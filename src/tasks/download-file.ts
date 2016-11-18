'use strict';

import axios from 'axios';
const slackToken = process.env.SLACK_TOKEN;

function downloadOne (url) {
    return new Promise((resolve, reject) => {
        axios.get(url, {
            headers: {
                'Authorization': `Bearer ${slackToken}`
            }
        })
        .then(response => resolve(response.data))
        .catch(err => reject(`Error, could not download file: ${err}`));
    })

}

function downloadMany(files) {
    return new Promise((resolve, reject) => {

        const downloads = files.map(url => axios.get(url, {
            headers: {
                'Authorization': `Bearer ${slackToken}`
            }
        }));

        axios.all(downloads)
            .then(results => resolve(results.map(download => (<any>download).data)))
            .catch(err => reject(`Error, could not download files: ${err}`));
    });
}

function downloadFile(file) {
    return Array.isArray(file) ? downloadMany(file) : downloadOne(file);
}

export default downloadFile