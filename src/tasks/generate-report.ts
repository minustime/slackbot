'use strict';

import * as fs from 'fs'
import { spawn } from 'child_process'

function generateReportHtml(bot, request, reportJsonContent) {

    return new Promise((resolve, reject) => {

        bot.typing(request);

        // Create temporary directory
        fs.mkdtemp('/tmp/loadtest-', (err, dir) => {

            if(err) {
                return reject(err);
            }

            const reportJson = `${dir}/loadtest-report.json`;
            const reportHtml = `${dir}/loadtest-report.html`;

            // Save the config files to disc temporarily
            try {
                fs.writeFileSync(reportJson, reportJsonContent);
            } catch (err) {
                return reject(err);
            }

            let reportHtmlFileContent = '';

            // Generate the HTML report
            const cmd = spawn('artillery', [
                'report',
                reportJson,
                '-o',
                reportHtml
            ]);

            cmd.stdout.on('data', (data) => {
                reportHtmlFileContent += `${data}`;
            });

            cmd.stderr.on('data', (data) => {
                console.log(String(data));
                reject(`Error, could not write HTML report ${reportHtml}`);
            });

            cmd.on('close', (code) => {
                fs.readFile(reportHtml, (err, data) => {
                    console.log(reportHtml)
                    if(err) {
                        return reject(err);
                    }
                    resolve(String(data));
                })
            });
        });
    })
}

export default generateReportHtml