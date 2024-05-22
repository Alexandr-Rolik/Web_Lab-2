const fs = require('fs');
const xml2js = require('xml2js');
const moment = require('moment');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question('Введіть дату для пошуку (YYYY-MM-DD): ', (userDate) => {
    // Read the XML file
    fs.readFile('meeting.xml', 'utf-8', (err, data) => {
        if (err) {
            console.error('Error reading XML file:', err);
            rl.close();
            return;
        }

        // Parse XML to JSON
        xml2js.parseString(data, (err, result) => {
            if (err) {
                console.error('Error parsing XML:', err);
                rl.close();
                return;
            }

            // Extract meetings
            const meetings = result.meetings.meeting;

            // Filter meetings for the user-provided date
            const filteredMeetings = meetings.filter(meeting => {
                return moment(meeting.date[0]).format('YYYY-MM-DD') === userDate;
            });

            // Check if there are meetings on the specified date
            if (filteredMeetings.length === 0) {
                console.log("Такої дати немає у списку");
                rl.close();
                return;
            }

            // Generate HTML file with search results
            generateHTML(filteredMeetings, userDate);
            rl.close();
        });
    });
});

// Function to generate HTML file
function generateHTML(meetings, userDate) {
    let html = '<!DOCTYPE html>\n<html>\n<head>\n<title>Meeting Schedule</title>\n</head>\n<body>\n';
    html += '<h1>Meetings on ' + userDate + '</h1>\n<ul>\n';

    meetings.forEach(meeting => {
        html += '<li>Date: ' + meeting.date[0] + ', Time: ' + meeting.time[0] + ', With: ' + meeting.with[0] + ', Place: ' + meeting.place[0] + '</li>\n';
    });

    html += '</ul>\n</body>\n</html>';

    fs.writeFile('meeting_search_results.html', html, (err) => {
        if (err) {
            console.error('Error writing HTML file:', err);
            return;
        }
        console.log('HTML файл було успішно створено!');
    });
}
