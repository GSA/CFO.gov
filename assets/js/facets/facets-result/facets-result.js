 /**
     * ========== PLEASE USE A DIFFERENT FILE FOR THE RESULT PAGE ====== 
     * creates a single card result and adds it to the Dom
     * @param {bool} noResults true if no results false if results
     * @param {object} item - and item(variables of an md file) to be made into the card html
     */
  function createResults(noResults, item) { // creates a results div and contents
    const outerDiv1 = document.createElement("div");
    outerDiv1.setAttribute("class", "tablet:grid-col-12 grid-spacing policy");
    const outerDiv2 = document.createElement("div");
      outerDiv2.setAttribute("class", "cfo-career-outer-box padding-4");
    outerDiv1.append(outerDiv2);
    const outerDiv3 = document.createElement("div");
    outerDiv3.setAttribute("class", "cfo-career-text-container position-relative");
    outerDiv2.append(outerDiv3);
    if (noResults) {
        const textArea = document.createElement("p");
        textArea.setAttribute("class", "cfo-career-results-text-bold");
        outerDiv3.appendChild(textArea);
        const text1 = document.createTextNode("Your search has turned up no results.");
        textArea.appendChild(text1);
        const textArea2 = document.createElement("p");
        outerDiv3.appendChild(textArea2);
        const text2 = document.createTextNode('Check if your spelling is correct, or try removing filters. Remove quotes around phrases to match each word individually: "blue drop" will match less than blue drop.');
        textArea2.appendChild(text2);
    } else {
        let template = '<div class="cfo-career-category-container font-body-md">'
            + '<div class="cfo-inner-competency-div margin-bottom-2"><span class="card-display card-text-color"><strong>GS LEVEL:</strong></span><span class="card-content-color"> GS {{ card.level }}</span></div>'
            + '<div class="cfo-inner-competency-div margin-bottom-2"><span class="card-display card-text-color"><strong>TYPE:</strong></span><span class="card-content-color"> {{ card.competency_group }}</span></div>'
            + '</div>'
            + '<div class="cfo-career-category-container font-body-md">'
            + '<div class="cfo-inner-competency-div margin-bottom-2"><span class="card-display card-text-color"><strong>JOB SERIES:</strong></span><span class="card-content-color"> {{ card.series }}</span></div>'
            + '<div class="cfo-inner-competency-div margin-bottom-2"><span class="card-display card-text-color"><strong>COMPETENCY:</strong></span><span class="card-content-color"> {{ card.competency }}</span></div>'
            + '</div>'
            + '<p class="font-body-md card-display card-text-color margin-top-0"><strong>DESCRIPTION:</strong><span class="card-content-color"> {{ card.competency_description }}</span></p>';
        outerDiv3.innerHTML = template.replace('{{ card.level }}', item.level)
            .replace('{{ card.competency_group }}', item.competency_group)
            .replace('{{ card.series }}', item.series)
            .replace('{{ card.competency }}', item.competency)
            .replace('{{ card.competency_description }}', item.competency_description);

        const innerDivHr = document.createElement("div");
        innerDivHr.setAttribute("class", "hr");
        outerDiv3.append(innerDivHr);

        const innerDiv2 = document.createElement("div");
        innerDiv2.setAttribute("class", "grid-row grid-gap");
        outerDiv3.append(innerDiv2);
        innerDiv2.innerHTML = item.content;

        let itemElement = $().createId(item.competency_group);
        let eventId = document.getElementById(itemElement);
        const coursesTopDiv = document.createElement('div');
        coursesTopDiv.setAttribute("id", "divTopLink-" + eventId);
        let courseTopMarkup = '<ul class="usa-list" role="list">';
        if (item.relevant_courses.length > 0) {
            if (item.relevant_courses.length > 3) {
            for (let i = 0, l = 3; i < l; i++) {
                // Inserting the attribute to open a link in a new tab on each link
                let relevant_course = item.relevant_courses[i];
                if (typeof (relevant_course) === 'string' && relevant_course.indexOf('">') >= 0) {
                    relevant_course = relevant_course.replace('>', ' target="_blank" >');
                }
                courseTopMarkup += '<li role="listitem" class="card-content-color">' + relevant_course + '</li>';
            }
        } else {
                for (let i = 0, l = item.relevant_courses.length; i < l; i++) {
                    // Inserting the attribute to open a link in a new tab on each link
                    let relevant_course = item.relevant_courses[i];
                    if (typeof (relevant_course) === 'string' && relevant_course.indexOf('">') >= 0) {
                        relevant_course = relevant_course.replace('>', ' target="_blank" >');
                    }
                    courseTopMarkup += '<li role="listitem" class="card-content-color">' + relevant_course + '</li>';
                }
        }
            courseTopMarkup += '</ul>';
        }
        coursesTopDiv.innerHTML = '<h3 class="card-text-color">COURSE LISTINGS FOR PURPOSE:</h3>' + courseTopMarkup;
        outerDiv3.append(coursesTopDiv);

        const coursesDiv = document.createElement('div');
        coursesDiv.setAttribute("id", "divLink-" + eventId);
        coursesDiv.setAttribute("class", "display-none");
        let courseMarkup = '<ul class="usa-list" role="list">';
        if (item.relevant_courses.length > 0) {
            for (let i = 0, l = item.relevant_courses.length; i < l; i++) {
                // Inserting the attribute to open a link in a new tab on each link
                let relevant_course = item.relevant_courses[i];
                if (typeof (relevant_course) === 'string' && relevant_course.indexOf('">') >= 0) {
                    relevant_course = relevant_course.replace('>', ' target="_blank" >');
                }
                courseMarkup += '<li role="listitem" class="card-content-color">' + relevant_course + '</li>';
            }
            courseMarkup += '</ul>';
        }
        coursesDiv.innerHTML = '<h3 class="card-text-color">COURSE LISTINGS FOR PURPOSE:</h3>' + courseMarkup;
        outerDiv3.append(coursesDiv);

        if (item.relevant_courses.length > 3) {
            const showMoreTopDiv = document.createElement('div');
            showMoreTopDiv.setAttribute("class", "text-center margin-top-3");
            const showMoreDiv = document.createElement('div');
            showMoreDiv.setAttribute("class", "usa-button usa-button--outline border-0 bg-white");
            showMoreDiv.setAttribute("id", "showMore-" + eventId);
            showMoreDiv.setAttribute("onclick", "showMoreOrLess(" + eventId + ")");
            showMoreDiv.innerHTML = 'Show More';
            showMoreTopDiv.appendChild(showMoreDiv);
            outerDiv3.append(showMoreTopDiv);
        }

        const selectButtonWrapper = document.createElement('div');
        outerDiv3.prepend(selectButtonWrapper);
        selectButtonWrapper.setAttribute("class", "select-button");
        selectButtonWrapper.setAttribute("style", "color: #003062 !important");
        selectButtonWrapper.innerHTML = '<label><input type="checkbox" value="' + item.permalink + '"' + (window.isSelected(item.permalink) ? ' checked' : '') + '> <span>SELECT FOR DOWNLOAD</span></label>'
    }
    const resultsContainer = document.getElementById("career-search-results");
    resultsContainer.appendChild(outerDiv1);
}