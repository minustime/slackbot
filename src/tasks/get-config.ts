'use strict';

import getMessages from './get-messages';
import downloadFile from './download-file'; 
const debug = require('debug')('loadtest');

function getFiles(messages) {
    return messages.filter(item => item.subtype && item.subtype === 'file_share');
}

function getFile(files, fileName) {
    return files.find(item => item.file.name === fileName);
}

function validateCommand(bot, request) {

    return new Promise((resolve, reject) => {

        // Get chat history from specific channel
        getMessages(request.channel)
            .then((messages) => {

                // FIXIT: Get only files that user requesting load test uploaded?
                const uploads = getFiles(messages);
                const configFile = getFile(uploads, request.configName);

                if(configFile) {

                    const configFileUrl = configFile.file.url_private;

                    // Download the main file
                    downloadFile(configFileUrl)
                        .then(configFileContent => {

                            const files = {
                                config: {
                                    name: request.configName,
                                    url: configFileUrl,
                                    content: JSON.stringify(configFileContent)
                                },
                                dependency: {
                                    name: '',
                                    url: '',
                                    content: ''
                                }
                            }

                            // Get dependency file name 
                            const dependencyName = (<any>configFileContent).config.payload && (<any>configFileContent).config.payload.path;
                            let dependencyFileUrl;

                            // Find the dependency
                            if (dependencyName) {
                                const dependencyFile = getFile(uploads, dependencyName);
                                if (dependencyFile) {
                                    dependencyFileUrl = dependencyFile.file.url_private;
                                }
                                else {
                                    debug(`Error, dependency file ${dependencyName} does not exist`);
                                    return reject(`⚠️ Hmm, your config depends on \`${dependencyName}\` but I can't find it in chat history. Please upload it here and try again.`);
                                }
                            }

                            // If config has a dependency file
                            if (dependencyFileUrl) {

                                // Download the dependency 
                                downloadFile(dependencyFileUrl)
                                    .then(dependencyFileContent => {
                                        files.dependency.url = dependencyFileUrl;
                                        files.dependency.name = dependencyName;
                                        files.dependency.content = String(dependencyFileContent);
                                        resolve(files);
                                    })
                                    .catch((err) => {
                                       debug(`Error, could not download dependency file: ${err}`);
                                       reject();
                                    });
                            }
                            else {
                                resolve(files);
                            }
                        })
                        .catch(err => {
                           debug(`Error, could not download config file: ${err}`);
                           reject(`⚠️ Sorry, I can't download \`${request.configName}\` for some reason. Please try again later!`);
                        });

                }
                else {
                    // Error, could not find config file
                    debug('Error, config file does not exist');
                    reject(`⚠️ Hmm, I can't find \`${request.configName}\` in chat history. Please upload it and try again. Click <https://artillery.io/docs/basicconcepts.html#the-config-section|here> for instructions on how to format your config file.`);
                }
            })
            .catch((err) => {
                debug(`Error, could not get room history: ${err}`);
                reject(`⚠️ Sorry, I can't download the room's history for some reason. Try again later!`);
            });
    })
}

export default validateCommand