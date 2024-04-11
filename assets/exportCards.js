const fs = require('fs');
const parse = require('csv-parse').parse;
const {createObjectCsvWriter} = require('csv-writer');
const crypto = require('crypto');

function buildCards() {
  let cards = {};
  let competencies = {};
  let coursesExport = {};

  fs.createReadStream('assets/csv/Consolidated_CPTT_PWD_20240319.csv')
    .pipe(parse({columns: true}))
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
      competencies[row.competency] = competencies[row.competency] || {
        'competency': row.competency,
        'proficiency_level_1' : '',
        'behavioral_illustrations_1' : '',
        'proficiency_level_2' : '',
        'behavioral_illustrations_2' : '',
        'proficiency_level_3' : '',
        'behavioral_illustrations_3' : '',
        'proficiency_level_4' : '',
        'behavioral_illustrations_4' : '',
        'proficiency_level_5' : '',
        'behavioral_illustrations_5' : '',
      };
      // Course key
      const hash = crypto.createHash('md5');
      hash.update(row.relevant_courses);
      const course_key = hash.digest('hex');

      let prof_level_key = 'proficiency_level_' + profLevel;
      let behavioral_illustrations_key = 'behavioral_illustrations_' + profLevel;
      if (competencies[row.competency][prof_level_key]  === '') {
        competencies[row.competency][prof_level_key] = row.proficiency_level_definition.replace(/(\r\n|\n|\r)/gm, ' ').replace(/ \? /gm, '\n•\t').replace(/\? /gm, '•\t');
        competencies[row.competency][behavioral_illustrations_key] = row.behavioral_illustrations.replace(/(\r\n|\n|\r)/gm, ' ').replace(/ \? /gm, '\n•\t').replace(/\? /gm, '•\t');
      }


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

        let courseFields = {
          'course_title': courseName,
          'institution': institutionName,
          'link': urls[0],
          'course_type': '',
          'course_duration': ''
        };

        for (let i = 1; i <= 50; i++) {
          courseFields[`competency_${i}`] = '';
          courseFields[`proficiency_levels_${i}`] = '';
        }

        coursesExport[course_key] = coursesExport[course_key] || courseFields;


        const maxCompetencies = 50;
        for (let i = 1; i <= maxCompetencies; i++) {
          const competencyKey = `competency_${i}`;
          const proficiencyKey = `proficiency_levels_${i}`;

          // Check if the competency value already exists for the current course_key
          if (coursesExport[course_key][competencyKey] === row.competency) {
            // Check if the profLevel is not already present in the proficiencyKey
            if (!coursesExport[course_key][proficiencyKey].split(',').includes(profLevel.toString())) {
              // Add profLevel to the existing proficiencyKey
              coursesExport[course_key][proficiencyKey] += `,${profLevel}`;
            }
            break; // Exit the loop since the update is done
          }
          // If the competency value doesn't exist in the current course_key, set it for the first empty slot
          else if (!coursesExport[course_key][competencyKey] && !coursesExport[course_key][proficiencyKey]) {
            coursesExport[course_key][competencyKey] = row.competency;
            coursesExport[course_key][proficiencyKey] = profLevel;
            break; // Exit the loop since the update is done
          }
        }

      }

      let s = row.behavioral_illustrations;
      cards[key].behavior[profLevel] = (s.length && s[0] == '?') ? s.slice(2) : s;
      s = row.proficiency_level_definition;
      cards[key].prof[profLevel] = (s.length && s[0] == '?') ? s.slice(2) : s;
    })
    .on('end', function () {
      let count = 0;
      let exportCards = [];
      for (var k in cards) {

        const card = cards[k],
          permalink = '/cards/' + card.jobSeries + '-' + card.competency.replace(/, /g, '-').replace(/ /g, '-').replace(/\//g, '-') + '-' + card.careerLevel,
          filters = [
            card.competencyGroup.replace(/ /g, '-') + '-' + card.competency.replace(/, /g, '-').replace(/ /g, '-').replace(/\//g, '-'),
            'GS-' + card.gsLevel,
            'series-0' + card.jobSeries
          ].join(' ');

        let courses = "\r\n",
          behaviorMarkup = "",
          profLevelMarkup = "",
          courseExport = "",
          courseMarkup = "";
        courseNameList = "";
        institutionName = "";

        for (let i = 0, l = card.courses.length; i < l; i++) {
          if (courses.length) {
            courses += '- ' + card.courses[i] + "\r\n";
          }
        }

        let levels = ['1', '2', '3', '4', '5'];
        for (i = 0, l = levels.length; i < l; i++) {
          let key = levels[i];
          if (typeof card.behavior[key] != "undefined") {
            behaviorMarkup += `<dt>${card.competency} (${levelToString(key)})</dt>`;
            //behaviorMarkup += `<dd>${ card.behavior[i] }</dd>`;
            let frags = card.behavior[key].split('?').filter(x => !!x.trim());
            for (let j = 0, k = frags.length; j < k; j++) {
              behaviorMarkup += `<dd>${frags[j]}</dd>`;
            }
          }

          if (typeof card.prof[key] != "undefined") {
            profLevelMarkup += `<dt>${card.competency} (${levelToString(key)})</dt>`;
            // profLevelMarkup += `<dd>${ card.prof[i] }</dd>`;
            let frags = card.prof[key].split('?').filter(x => !!x.trim());
            for (let j = 0, k = frags.length; j < k; j++) {
              profLevelMarkup += `<dd>${frags[j]}</dd>`;
            }
          }
        }

        let courseUnique = card.courses.filter(
          (object, index, self) =>
            index ===
            self.findIndex((o) => o.courseName === object.courseName && o.instName === object.instName && o.urls[0] === object.urls[0])
        ).sort((a, b) => a.courseName > b.courseName ? 1 : -1);

        for (i = 0, l = courseUnique.length; i < l; i++) {
          if (courseUnique[i].courseName) {
            if (courseUnique[i].courseName.includes(":")) {
              courseNameList = courseUnique[i].courseName.replace(/:/g, "&#58;");
            } else {
              courseNameList = courseUnique[i].courseName;
            }
          }
          if (courseUnique[i].instName) {
            if (courseUnique[i].instName.includes(":")) {
              institutionName = ', ' + courseUnique[i].instName.replace(/:/g, "&#58;");
            } else {
              institutionName = ', ' + courseUnique[i].instName;
            }
          }
          courseExport += '\n- ';
          courseMarkup += '<li>';
          if (courseUnique[i].urls.length) {
            for (j = 0, k = courseUnique[i].urls.length; j < k; j++) {
              const link = `<a href="${courseUnique[i].urls[j]}" aria-label="${courseNameList} - ${courseUnique[i].urls[j]}">${courseNameList}</a>${institutionName}`;
              courseMarkup += link;
              courseExport += link;
            }
          } else {
            courseMarkup += courseNameList;
            courseExport += courseNameList;
          }
          courseMarkup += '</li>';
        }
        count++;

        let keysArray = Object.keys(card.behavior).map(Number);
        let index = count;
        exportCards.push({
          'ID': index,
          "JOB SERIES:": card.jobSeries,
          "GS LEVEL:": card.careerLevel.toUpperCase() + " (" + card.gsLevel + ")",
          "TYPE:": card.competencyGroup,
          "Functional Competency Designation": card.competencyDesignation,
          "COMPETENCY:": card.competency,
          "DESCRIPTION": card.compDesc,
          "APPLICABLE PROFICIENCY RATINGS": keysArray[0] ?? '',
          "Column9": keysArray[1] ?? '',
          "Column10": keysArray[2] ?? '',
          "Column11": keysArray[3] ?? ''
        });
      }

      // Define CSV writer
      const csvWriter = createObjectCsvWriter({
        path: 'assets/CPTT/exported_cards.csv',
        header: Object.keys(exportCards[1]).map(key => ({id: key, title: key}))
      });

      csvWriter.writeRecords(exportCards)
        .then(() => console.log('The CSV file was written successfully'))
        .catch(err => console.error('Error writing CSV file:', err));


      // Competency descriptions
      const competencyValues = Object.values(competencies);
      if (competencyValues.length > 0) {
        const firstCompetency = competencyValues[0];
        const csvWriterCompDesc = createObjectCsvWriter({
          path: 'assets/CPTT/competency_descriptions.csv',
          header: Object.keys(firstCompetency).map(key => ({id: key, title: key}))
        });

        csvWriterCompDesc.writeRecords(competencyValues)
          .then(() => console.log('The CSV file was written successfully'))
          .catch(err => console.error('Error writing CSV file:', err));
      } else {
        console.log('No competencies found');
      }

// Write courses data to CSV file
      const coursesExportValues = Object.values(coursesExport);
      if (coursesExportValues.length > 0) {
        const firstCourse = coursesExportValues[0];
        const csvWriterCompDesc = createObjectCsvWriter({
          path: 'assets/CPTT/exported_courses.csv',
          header: Object.keys(firstCourse).map(key => ({id: key, title: key}))
        });

        csvWriterCompDesc.writeRecords(coursesExportValues)
          .then(() => console.log('The CSV file for courses was written successfully'))
          .catch(err => console.error('Error writing CSV file:', err));
      } else {
        console.log('No courses found');
      }


      console.log(`CSV Parsed for ${count} cards.`);
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
