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
    outerDiv2.setAttribute("class", "cfo-career-outer-box");
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
        let template = '<div class="cfo-career-category-container font-body-md margin-y-0">'
            + '<div class="cfo-inner-competency-div"><span><strong>GS LEVEL:</strong> {{ card.level }}</span></div>'
            + '<div class="cfo-inner-competency-div"><span><strong>JOB SERIES:</strong> {{ card.series }}</span></div>'
            + '</div>'
            + '<div class="cfo-career-category-container font-body-md margin-y-0">'
            + '<div class="cfo-inner-competency-div"><span><strong>COMPETENCY:</strong> {{ card.competency }}</span></div>'
            + '<div class="cfo-inner-competency-div"><span><strong>TYPE:</strong> {{ card.competency_group }}</span></div>'
            + '</div>'
            + '<p class="font-body-md"><strong>Definition:</strong> {{ card.competency_description }}</p>';
        outerDiv3.innerHTML = template.replace('{{ card.level }}', item.level)
            .replace('{{ card.series }}', item.series)
            .replace('{{ card.competency }}', item.competency)
            .replace('{{ card.competency_group }}', item.competency_group)
            .replace('{{ card.competency_description }}', item.competency_description);

        const innerDiv2 = document.createElement("div");
        innerDiv2.setAttribute("class", "grid-row grid-gap");
        outerDiv3.append(innerDiv2);
        innerDiv2.innerHTML = item.content;

        const coursesDiv = document.createElement('div');
        let courseMarkup = '<ul class="usa-list" role="list">';
        if (item.relevant_courses.length > 0) {
            for (let i = 0, l = item.relevant_courses.length; i < l; i++) {
                // Inserting the attribute to open a link in a new tab on each link
                let relevant_course = item.relevant_courses[i];
                if (typeof (relevant_course) === 'string' && relevant_course.indexOf('">') >= 0) {
                    relevant_course = relevant_course.replace('>', ' target="_blank" >');
                }
                courseMarkup += '<li role="listitem">' + relevant_course + '</li>';
            }
            courseMarkup += '</ul>';
        } else {
            courseMarkup = '<p>No courses</p>';
        }
        coursesDiv.innerHTML = '<h3>Career Listing</h3>' + courseMarkup;
        outerDiv3.append(coursesDiv);

        const selectButtonWrapper = document.createElement('div');
        outerDiv3.prepend(selectButtonWrapper);
        selectButtonWrapper.setAttribute("class", "select-button");
        selectButtonWrapper.innerHTML = '<label><input type="checkbox" value="' + item.permalink + '"' + (window.isSelected(item.permalink) ? ' checked' : '') + '> <span>SELECT FOR DOWNLOAD</span></label>'
    }
    const resultsContainer = document.getElementById("career-search-results");
    resultsContainer.appendChild(outerDiv1);
}