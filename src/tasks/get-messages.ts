'use strict';

import axios from 'axios';
const slackToken = process.env.SLACK_TOKEN;

function getMessages(channel) {

    return new Promise((resolve, reject) => {

        const groupHistoryUrl = `https://slack.com/api/groups.history?token=${slackToken}&channel=${channel}`;
        
        axios.get(groupHistoryUrl)
            .then(response => {
                resolve(response.data.messages);
            })
            .catch(err => reject(err))
    });
}

export default getMessages