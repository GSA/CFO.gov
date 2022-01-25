const fs = require('fs');
const parse = require('csv-parse').parse;

function buildCards () {
  let cards = {};

  fs.createReadStream('assets/csv/FEDS-Sample-Data-10-Jan-22-UTF-8.csv')
    .pipe(parse({columns: true}))
    .on('data', function (row) {
      const parts = row.job_series.split(' '),
        key = [
          parts[0],
          gsLevel(row.career_level),
          row.competency
        ].join('-'),
        profLevel = row.proficiency_level.match(/Level (\d)/)[1];
        
      cards[key] = cards[key] || {
        careerLevel: row.career_level,
        gsLevel: gsLevel(row.career_level),
        jobSeries: parts[0].slice(1),
        jobSeriesTitle: parts[1],
        jobSeriesFull: row.job_series,
        competency: row.competency,
        competencyGroup: row.competency_group,
        competencyDesignation: row.functional_competency_designation,
        compDesc: row.compentency_description,
        behavior: {},
        prof: {},
        courses: []
      };
      
      const courses = row.relevant_courses.split("@@@");
      for (let i = 0, l = courses.length; i < l; i++) {
        let cparts = courses[i].split('&&&');
        if (cparts[0]) {
          cards[key].courses.push(cparts);
        }
      }
      
      let s = row.behavioral_illustrations;
      cards[key].behavior[profLevel] = (s.length && s[0] == '?') ? s.slice(2) : s;
      s = row.proficiency_level_definition;
      cards[key].prof[profLevel] = (s.length && s[0] == '?') ? s.slice(2) : s;
    })
    .on('end', function () {
      let count = 0;
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
          courseMarkup = "";
          
          for (let i = 0, l = card.courses.length; i < l; i++) {
            if (courses.length) {
              courses += '- ' + card.courses[i] + "\r\n";
            }
          }
          
          let levels = ['1', '2', '3', '4', '5'];
          for (i = 0, l = levels.length; i < l; i++) {
            if (typeof card.behavior[i] != "undefined") {
              behaviorMarkup += `<dt>${ card.competency } ( ${ levelToString(levels[i]) })</dt>`;
              //behaviorMarkup += `<dd>${ card.behavior[i] }</dd>`;
              let frags = card.behavior[i].split('?').filter(x => !!x.trim());
              for (let j = 0, k = frags.length; j < k; j++) {
                behaviorMarkup += `<dd>${ frags[j] }</dd>`;
              }
            }
            
            if (typeof card.prof[i] != "undefined") {
              profLevelMarkup += `<dt>${ card.competency } ( ${ levelToString(levels[i]) })</dt>`;
              // profLevelMarkup += `<dd>${ card.prof[i] }</dd>`;
              let frags = card.prof[i].split('?').filter(x => !!x.trim());
              for (let j = 0, k = frags.length; j < k; j++) {
                profLevelMarkup += `<dd>${ frags[j] }</dd>`;
              }
            }
          }
          
          let courseUnique = [...new Set(card.courses)].filter(x => x || x.trim());
          for (i = 0, l = courseUnique.length; i < l; i++) {
            courseMarkup += `<li>${ courseUnique[i] }</li>`;
          }
      
        let output = `---
layout: career-planning-landing
category: career
title: ${ card.jobSeriesFull } ${ card.careerLevel } ${ card.competency }
series: ${ card.jobSeries }
job_series: ${ card.jobSeriesFull }
career_level: ${ card.careerLevel }
permalink: ${ permalink }
functional_competency_designation: ${ card.competencyDesignation}
competency: ${ card.competency }
competency_group: ${ card.competencyGroup }
competency_description: ${ card.compDesc }
level: "${ card.gsLevel }"
behavior_illustrations: ${ Object.values(card.behavior).join(' ? ') }
proficiency_level_definition: ${ Object.values(card.prof).join(' ? ') }
relevant_courses: ${ courses }
filters: ${ filters }
---

<div class="desktop:grid-col-4 margin-y-205">
  <div class="border-top-05 bg-white padding-2 shadow-5 height-full members-hover border-1px border-gray-30 radius-lg">
  <h3>Behavior Illustrations</h3>
  <dl class="text-base">${ behaviorMarkup }</dl>
  </div>
</div>
<div class="desktop:grid-col-4 margin-y-205">
<div class="border-top-05 bg-white padding-2 shadow-5 height-full members-hover border-1px border-gray-30 radius-lg">
  <h3>Proficiency Level Definition</h3>
  <dl class="text-base">${ profLevelMarkup }</dl>
  </div>
</div>
<div class="desktop:grid-col-4 margin-y-205">
<div class="border-top-05 bg-white padding-2 shadow-5 height-full members-hover border-1px border-gray-30 radius-lg">
  <h3>Course Listing</h3>
  <ul class="text-base">
  ${ courseMarkup }
  </ul>
  </div>
</div>`;
        let filename = `_cards/2021-11-26-0${ card.jobSeries }-${ card.competency.replace(' ', '-')}-${ card.careerLevel }.md`;
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
    "1" : 'Level 1 - Awareness',
    "2" : 'Level 2 - Basic',
    "3" : 'Level 3 - Intermediate',
    "4" : 'Level 4 - Advanced',
    "5" : 'Level 5 - Expert'
  }
  
  return levels[level];
}

buildCards();
