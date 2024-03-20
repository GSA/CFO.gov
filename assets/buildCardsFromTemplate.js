const fs = require('fs');
const parse = require('csv-parse').parse;

// Define the path to your CSV file
const csvFilePath = 'assets/CPTT/courses.csv';
const cardsFile = './CPTT/cards.json';
const cards = require(cardsFile);
const competencyDescriptions = require('./CPTT/competency_descriptions.json');

function buildCards() {

  for (let card of cards) {
    // Format data.
    card.jobSeries = card['JOB SERIES:'];
    card['JOB SERIES:'] = card['JOB SERIES:'].toString().padStart(4, '0');
    card.jobSeriesFull = card['JOB SERIES:'] + ' ' + getJobSeries(card['JOB SERIES:']);
    const gsLevel = card['GS LEVEL:'];
    const match = gsLevel.match(/\b([A-Z]+)\b/);
    if (match && match[1]) {
      card.careerLevel = match[1].charAt(0).toUpperCase() + match[1].slice(1).toLowerCase();
    } else {
      card.careerLevel = '';
    }
    card.competency = card['COMPETENCY:'];
    card.jobSeriesTitle = getJobSeries(card['JOB SERIES:']);
    card.competencyGroup = card['TYPE:'];
    card.gsLevel = getGsLevel(card.careerLevel);
    card.permalink = '/cardsNew/' + card.jobSeries + '-' + card.competency.replace(/, /g, '-').replace(/ /g, '-').replace(/\//g, '-') + '-' + card.careerLevel;
    card.competencyDesignation = card['Functional Competency Designation'];
    card.filters = [
      card.competencyGroup.replace(/ /g, '-') + '-' + card.competency.replace(/, /g, '-').replace(/ /g, '-').replace(/\//g, '-'),
      'GS-' + card.gsLevel,
      'series-0' + card.jobSeries
    ].join(' ');
    card.compDesc = card['DESCRIPTION'] ?? '';
    card.behavior = [];
    if (typeof card['APR'] === 'string') {
      card.levels = card['APR'].trim().split(',').map(Number);
    } else if (typeof card['APR'] === 'number') {
      card.levels = [card['APR']];
    } else {
      console.error('Invalid type for card.APR');
    }
    card.prof = [];
    card.relevant_courses = '';
    card.behaviorMarkup = '';
    card.profLevelMarkup = '';
    for (let level of card.levels) {
      if (level !== 0) {
        card.behaviorMarkup += `<dt>${card.competency} (${levelToString(level)})</dt>`;
        card.profLevelMarkup += `<dt>${card.competency} (${levelToString(level)})</dt>`;

        let prof = getProfLevelDef(card.competency, level);
        if (prof !== '') {
          card.prof[level] = prof;
          let frags = prof.split('\t').filter(x => !!x.trim());
          for (let j = 0, k = frags.length; j < k; j++) {
            card.profLevelMarkup += `<dd>${frags[j].replace(/(\r\n|\n|\r)/gm, ' ')}</dd>`;
          }
        }
        let behavior = getBehavioralIllustration(card.competency, level);
        if (behavior !== '') {
          card.behavior[level] = behavior;
          let frags = behavior.split('\t').filter(x => !!x.trim());
          for (let j = 0, k = frags.length; j < k; j++) {
            card.behaviorMarkup += `<dd>${frags[j].replace(/(\r\n|\n|\r)/gm, ' ')}</dd>`;
          }
        }
      }
    }

  }
  fs.createReadStream(csvFilePath)
    .pipe(parse({ columns: true }))
    .on('data', function (row) {
      addCourse(row);

    })
    .on('end', function () {
      let count = 0;
      for (var card of cards) {
        let output = `---
layout: career-planning-landing
category: career
title: ${card.jobSeriesFull} ${card.careerLevel} ${card.competency}
series: ${card.jobSeries}
job_series_title: ${card.jobSeriesTitle}
job_series: ${card.jobSeriesFull}
career_level: ${card.careerLevel}
permalink: ${card.permalink}
functional_competency_designation: ${card.competencyDesignation}
competency: ${card.competency.replace(/\//g, ' ')}
competency_group: ${card.competencyGroup}
competency_description: ${card.compDesc}
level: "${card.gsLevel}"
behavior_illustrations: "${Object.values(card.behavior).join(' ? ').replace(/(\r\n|\n|\r|\t)/gm, ' ')}"
proficiency_level_definition: "${Object.values(card.prof).join(' ? ').replace(/(\r\n|\n|\r|\t)/gm, ' ')}"
relevant_courses: ${card.relevant_courses || ''}
filters: ${card.filters}
---

<div class="desktop:grid-col-6 margin-y-3">
  <div class="border-top-2 bg-white padding-3 shadow-5 height-full members-hover border-1px button-border border-top-blue radius-lg">
    <p class="text-bold label-color font-size-21">Behavior Illustrations</p>
    <hr class="hr-green"/>
    <dl class="text-base card-content-color">${card.behaviorMarkup}</dl>
  </div>
</div>
<div class="desktop:grid-col-6 margin-y-3">
  <div class="border-top-2 bg-white padding-3 shadow-5 height-full members-hover border-1px button-border border-top-blue radius-lg">
    <p class="text-bold label-color font-size-21">Proficiency Level Definition</p>
     <hr class="hr-green"/>
    <dl class="text-base card-content-color">${card.profLevelMarkup}</dl>
  </div>
</div>`;
        let filename = `_cards/0${card.jobSeries}-${card.competencyGroup.replace(/ /g, '-')}-${card.competency.replace(/, /g, '-').replace(/ /g, '-').replace(/\//g, '-')}-${card.careerLevel}.md`;
        fs.writeFileSync(filename, output);
        count++;
      }
      console.log(`CSV Parsed into ${count} files.`);

    });


}

function getGsLevel(level) {
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

function getJobSeries(js) {
  let jobSeries = {
    "0501": "Financial Administration and Program Support",
    "0510": "Accounting",
    "0511": "Auditing",
    "0560": "Budget Analysis"
  }

  return jobSeries[js];
}

function getItemByCompetency(competencyName) {
  const item = competencyDescriptions.find(item => item.competency === competencyName);
  return item || null; // Return null if no matching item is found
}

function getBehavioralIllustration(competency, level) {
  const item = getItemByCompetency(competency);
  if (item) {
    const propertyKey = `behavioral_illustrations_${level}`;
    if (item[propertyKey]) {
      return item[propertyKey];
    } else {
      console.log(`Behavioral illustration for level ${level} not found for competency "${competency}".`);
    }
  } else {
    console.log(`Item with competency "${competency}" not found.`);
  }
  return '';
}

function getProfLevelDef(competency, level) {
  const item = getItemByCompetency(competency);
  if (item) {
    const propertyKey = `proficiency_level_${level}`;
    if (item[propertyKey]) {
      return item[propertyKey];
    } else {
      console.log(`Proficiency level for level ${level} not found for competency "${competency}".`);
    }
  } else {
    console.log(`Item with competency "${competency}" not found.`);
  }
  return '';
}

function addCourse (course) {
  for (let card of cards) {
    if ( (card.competency === course.competency_1 && isInclude(course.proficiency_levels_1, card.levels))
    || (card.competency === course.competency_2 && isInclude(course.proficiency_levels_2, card.levels))
    || (card.competency === course.competency_3 && isInclude(course.proficiency_levels_3, card.levels))
    || (card.competency === course.competency_4 && isInclude(course.proficiency_levels_4, card.levels))
    || (card.competency === course.competency_5 && isInclude(course.proficiency_levels_5, card.levels))
    || (card.competency === course.competency_6 && isInclude(course.proficiency_levels_6, card.levels))
    ) {
      let courseNameList = course.course_title.replace(/:/g, "&#58;");
      card.relevant_courses += `\n- <a href="${course.link}" aria-label="${courseNameList} - ${course.link}">${courseNameList}</a>, ${course.institution}`;
    }
  }
}

function isInclude(competency_levels, levels) {
  let compLevelsArray = competency_levels.split(',').map(Number);
  return compLevelsArray.some(level => levels.includes(level));
}

buildCards();
