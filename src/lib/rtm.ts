'use strict';

import { EventEmitter } from 'events';
import axios from 'axios';
const WebSocket = require('ws');

interface SlackRTM {
    slackToken: string;
    startUrl: string;
    connectUrl: string;
    profile: Object;
    ws: any;
}

class SlackRTM extends EventEmitter {

    constructor(slackToken) {

        super();

        this.slackToken = slackToken;
        this.startUrl = `https://slack.com/api/rtm.start`;
        this.connectUrl = '';

        this.profile = {};
        this.ws = '';

        this.init();
    }
    
    init() {
        this.getWSUrl()
            .then(() => this.connect())
            .catch(err => console.log(err));
    }

    getWSUrl() {
        return axios.get(this.startUrl, {params: {token: this.slackToken}})
            .then(response => {
                if (response.data.ok === true) {
                    this.connectUrl = response.data.url;
                    this.profile = response.data.self;
                }
                else {
                    throw TypeError('Endpoint could not stablish connection.')
                }
            })
    }

    connect () {

        this.ws = new WebSocket(this.connectUrl);
        this.ws.on('open', () => this.emit('open', 'I\'m connected to Slack!'));
        this.ws.on('message', (event, flags) => {

            event = JSON.parse(event);

            switch (event.type) {
                case 'message':
                    if(event.text) {
                        this.emit('message', event);
                    }
                    break;
                case 'reconnect_url':
                    this.connectUrl = event.url;
                    break;
            }
        })
    }

    confirm(request, text) {
        return new Promise((resolve, reject) => {
            this.say(request, text);
            const listener = this.on('message', function once(message) {
                
                if(message.user === request.user) {
                    if(/^(yes|y|yeah)$/.test(message.text)) {
                        listener.removeListener('message', once);
                        resolve(true);
                    }
                   if(/^(no|n|nope)$/.test(message.text)) {
                        listener.removeListener('message', once);
                        resolve(false);
                    }
                }

                setTimeout(() => {
                    reject();
                    listener.removeListener('message', once);
                }, 60 * 1000);
            })
        });
    } 

    listen(pattern, callback) {
        this.on('message', (message) => {
            const match = message.text.match(new RegExp(pattern, 'i'));
            if (match) {
                return callback(Object.assign({}, message, { match: match }))
            }
        });
    }

    listenOnce(pattern, request, callback) {
        const listener = this.on('message', function once(message) {
            const match = message.text.match(new RegExp(pattern, 'i'));
            if (match && request.channel === message.channel) {
                listener.removeListener('message', once);
                return callback(Object.assign({}, message, { match: match }))
            }
        });
    }

    typing(request) {
        this.ws.send(JSON.stringify({
            id: Date.now(),
            type: 'typing',
            channel: request.channel
        }));
    }

    say(request, text) {

        // Use API method for richer formatting
        axios.get(`https://slack.com/api/chat.postMessage`, {
            params: {
                token: request.slackToken,
                channel: request.channel,
                text: text,
                username: 'SlackBot' 
            }
        });
    }
}

export default SlackRTM