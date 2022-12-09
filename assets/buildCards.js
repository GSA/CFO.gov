const fs = require('fs');
const parse = require('csv-parse').parse;

function buildCards() {
    let cards = {};

    fs.createReadStream('assets/csv/FEDS Competency Model Sample Data Golf.csv')
        .pipe(parse({ columns: true }))
        .on('data', function (row) {
            const parts = row[Object.keys(row)[0]].split(' '),
                key = [
                    parts[0],
                    gsLevel(row.career_level),
                    row.competency,
                    row.competency_group
                ].join('-'),
                profLevel = row.proficiency_level.match(/Level (\d)/)[1];

            cards[key] = cards[key] || {
                careerLevel: row.career_level,
                gsLevel: gsLevel(row.career_level),
                jobSeries: parts[0].slice(1),
                jobSeriesTitle: parts.slice(1).join(' '),
                jobSeriesFull: row[Object.keys(row)[0]],
                competency: row.competency,
                competencyGroup: row.competency_group,
                competencyDesignation: row.functional_competency_designation,
                compDesc: row.compentency_description,
                behavior: {},
                prof: {},
                courses: []
            };

            const courses = row.relevant_courses.split("~~~");
            for (let i = 0, l = courses.length; i < l; i++) {
                if (!courses[i]) {
                    continue;
                }
                let cparts = courses[i].split('|||'),
                    strings = cparts[0].split('%%%'),
                    urls = cparts[1].trim().split(' '),
                    courseName = strings[0].trim(),
                    institutionName = strings[1].trim(),
                    courseObj = {
                        urls: []
                    };

                if (courseName) {
                    courseObj.courseName = courseName;
                }
                if (institutionName) {
                    courseObj.instName = institutionName;
                }
                for (let j = 0, k = urls.length; j < k; j++) {
                    if (urls[j]) {
                        courseObj.urls.push(urls[j]);
                    }
                }
                cards[key].courses.push(courseObj);
            }

            let s = row.behavioral_illustrations;
            cards[key].behavior[profLevel] = (s.length && s[0] == '?') ? s.slice(2) : s;
            s = row.proficiency_level_definition;
            cards[key].prof[profLevel] = (s.length && s[0] == '?') ? s.slice(2) : s;
        })
        .on('end', function () {
            let count = 0;
            console.log(cards);
            for (var k in cards) {

                const card = cards[k],
                    permalink = '/cards/' + card.jobSeries + '-' + card.competency.replace(' ', '-') + '-' + card.careerLevel,
                    filters = [
                        card.competencyGroup.replace(/ /g, '-') + '-' + card.competency.replace(/, /g, '-').replace(/ /g, '-'),
                        'GS-' + card.gsLevel,
                        'series-0' + card.jobSeries
                    ].join(' ');

                let courses = "\r\n",
                    behaviorMarkup = "",
                    profLevelMarkup = "",
                    courseExport = "",
                    courseMarkup = "";

                for (let i = 0, l = card.courses.length; i < l; i++) {
                    if (courses.length) {
                        courses += '- ' + card.courses[i] + "\r\n";
                    }
                }

                let levels = ['1', '2', '3', '4', '5'];
                for (i = 0, l = levels.length; i < l; i++) {
                    let key = levels[i];
                    if (typeof card.behavior[key] != "undefined") {
                        behaviorMarkup += `<dt>${card.competency} ( ${levelToString(key)})</dt>`;
                        //behaviorMarkup += `<dd>${ card.behavior[i] }</dd>`;
                        let frags = card.behavior[key].split('?').filter(x => !!x.trim());
                        for (let j = 0, k = frags.length; j < k; j++) {
                            behaviorMarkup += `<dd>${frags[j]}</dd>`;
                        }
                    }

                    if (typeof card.prof[key] != "undefined") {
                        profLevelMarkup += `<dt>${card.competency} ( ${levelToString(key)})</dt>`;
                        // profLevelMarkup += `<dd>${ card.prof[i] }</dd>`;
                        let frags = card.prof[key].split('?').filter(x => !!x.trim());
                        for (let j = 0, k = frags.length; j < k; j++) {
                            profLevelMarkup += `<dd>${frags[j]}</dd>`;
                        }
                    }
                }

                let courseUnique = [...new Set(card.courses)];
                for (i = 0, l = courseUnique.length; i < l; i++) {
                    courseExport += '\n -';
                    courseMarkup += '<li>';
                    if (courseUnique[i].courseName) {
                        if (courseUnique[i].courseName.includes(":")) {
                            courseMarkup += courseUnique[i].courseName.replace(/:/g, "&#58;") + '<br>';
                            courseExport += ' ' + courseUnique[i].courseName.replace(/:/g, "&#58;");
                        }
                        else {
                            courseMarkup += courseUnique[i].courseName + '<br>';
                            courseExport += ' ' + courseUnique[i].courseName;
                        }
                    }
                    if (courseUnique[i].instName) {
                        if (courseUnique[i].instName.includes(":")) {
                            courseMarkup += courseUnique[i].instName.replace(/:/g, "&#58;") + '<br>';
                            courseExport += ' ' + courseUnique[i].instName.replace(/:/g, "&#58;");
                        }
                        else {
                            courseMarkup += courseUnique[i].instName + '<br>';
                            courseExport += ', ' + courseUnique[i].instName;
                        }
                    }
                    if (courseUnique[i].urls.length) {
                        for (j = 0, k = courseUnique[i].urls.length; j < k; j++) {
                            const link = `<a href="${courseUnique[i].urls[j]}">${courseUnique[i].urls[j]}</a>`;
                            courseMarkup += link + `<br>`;
                            courseExport += ', ' + link;
                        }
                    }
                    courseMarkup += '</li>';
                }

                let output = `---
layout: career-planning-landing
category: career
title: ${card.jobSeriesFull} ${card.careerLevel} ${card.competency}
series: ${card.jobSeries}
job_series_title: ${card.jobSeriesTitle}
job_series: ${card.jobSeriesFull}
career_level: ${card.careerLevel}
permalink: ${permalink}
functional_competency_designation: ${card.competencyDesignation}
competency: ${card.competency}
competency_group: ${card.competencyGroup}
competency_description: ${card.compDesc}
level: "${card.gsLevel}"
behavior_illustrations: ${Object.values(card.behavior).join(' ? ')}
proficiency_level_definition: ${Object.values(card.prof).join(' ? ')}
relevant_courses: ${courseExport || '[]'}
filters: ${filters}
---

<div class="desktop:grid-col-6 margin-y-205">
  <div class="border-top-05 bg-white padding-2 shadow-5 height-full members-hover border-1px border-gray-30 border-top-orange radius-lg">
    <h3>Behavior Illustrations</h3>
    <dl class="text-base">${behaviorMarkup}</dl>
  </div>
</div>
<div class="desktop:grid-col-6 margin-y-205">
  <div class="border-top-05 bg-white padding-2 shadow-5 height-full members-hover border-1px border-gray-30 border-top-orange radius-lg">
    <h3>Proficiency Level Definition</h3>
    <dl class="text-base">${profLevelMarkup}</dl>
  </div>
</div>`;
                let filename = `_cards/2021-11-26-0${card.jobSeries}-${card.competencyGroup.replace(/ /g, '-')}-${card.competency.replace(/ /g, '-')}-${card.careerLevel}.md`;
                fs.writeFileSync(filename, output);
                count++;
            }
            console.log(`CSV Parsed into ${count} files.`);
        });
}

function gsLevel(level) {
    let levels = {
        "Entry": "7-9",
        "Mid": "10-13",
        "Senior": "14-15"
    };

    return levels[level];
}

function levelToString(level) {
    let levels = {
        "1": 'Level 1 - Awareness',
        "2": 'Level 2 - Basic',
        "3": 'Level 3 - Intermediate',
        "4": 'Level 4 - Advanced',
        "5": 'Level 5 - Expert'
    }

    return levels[level];
}

buildCards();
