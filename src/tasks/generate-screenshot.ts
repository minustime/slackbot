'use strict';

import * as fs from 'fs'
import { spawn } from 'child_process'
const phantom = require('phantom');

function generateScreenshot(bot, request, reportHtmlContent) {

    return new Promise((resolve, reject) => {

        bot.typing(request);

        // Create temporary directory
        fs.mkdtemp('/tmp/loadtest-', (err, dir) => {

            if(err) {
                return reject(err);
            }

            const reportImage = `${dir}/loadtest-report.png`;
            const reportHtmlFile = `${dir}/loadtest-report.html`;
            const phantomScriptFile = `${dir}/phantom-script.js`;
            const phantomScript = `
                var fs = require('fs'), page = require('webpage').create();
                page.content = fs.read('${reportHtmlFile}');
                setTimeout(function(){
                    page.evaluate(function() {
                        var child = document.getElementsByClassName('col-lg-8 col-lg-offset-2')[0];
                        child.parentNode.removeChild(child);
                    });
                    page.render('${reportImage}');
                    phantom.exit();
                }, 1000)`;

            try {
                fs.writeFileSync(phantomScriptFile, phantomScript);
                fs.writeFileSync(reportHtmlFile, reportHtmlContent);
            } catch (err) {
                return reject(err);
            }

        const cmd = spawn('phantomjs', [
            phantomScriptFile
        ]);

        cmd.stderr.on('data', (data) => {
            reject(data);
        });

        cmd.on('close', (code) => {
            resolve(reportImage);
        })

        // Preferred way to use phantom, but it's just not working.. come back later
        /*
        let phantomInstance = null;

        phantom.create(['--ignore-ssl-errors=yes'])
            .then(instance => {
                phantomInstance = instance;
                return instance.createPage();
            })
            .then(page => {
                page.property('viewportSize', {width: 1200, height: 800});
                return page.property('content', reportHtmlContent)
                    .then(() => {
                        console.log(reportImage);
                        return page.render(reportImage);
                    })
                    .catch(err => {
                        console.log(err)
                    })
            })
            .catch(err => {
                reject(err);
                phantomInstance.exit();
            })
        */

        });
    })
}

export default generateScreenshot