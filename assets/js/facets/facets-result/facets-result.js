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

        const coursesDiv = document.createElement('div');
        coursesDiv.setAttribute("class", "course-list");
        let coursesMarkup = '';
      if (item.relevant_courses && Array.isArray(item.relevant_courses) && item.relevant_courses.length > 0) {
            coursesMarkup += '<div class="short-list"><ul class="usa-list" role="list">';
            let shortCount = (item.relevant_courses.length > 3) ? 3 : item.relevant_courses.length;
            for (let i = 0; i < shortCount; i++) {
                // Inserting the attribute to open a link in a new tab on each link
                let relevant_course = item.relevant_courses[i];
                if (typeof (relevant_course) === 'string' && relevant_course.indexOf('">') >= 0) {
                    relevant_course = relevant_course.replace(/>/g, ' target="_blank" >');
                }
                coursesMarkup += '<li role="listitem" class="card-content-color li-width">' + relevant_course + '</li>';
            }
            coursesMarkup += '</ul></div>';
        }
      if (item.relevant_courses && Array.isArray(item.relevant_courses) && item.relevant_courses.length > 3) {
            coursesMarkup += '<div class="full-list display-none"><ul class="usa-list margin-top-05" role="list">';
            for (let i = 3; i < item.relevant_courses.length; i++) {
                // Inserting the attribute to open a link in a new tab on each link
                let relevant_course = item.relevant_courses[i];
                if (typeof (relevant_course) === 'string' && relevant_course.indexOf('">') >= 0) {
                    relevant_course = relevant_course.replace(/>/g, ' target="_blank" >');
                }
                coursesMarkup += '<li role="listitem" class="card-content-color li-width">' + relevant_course + '</li>';
            }
            coursesMarkup += '</ul></div>';
            coursesMarkup += '<div class="text-center margin-top-3">\n' +
                '<button class="show-more usa-button usa-button--outline border-0 bg-white" data-more-text="Show More" data-less-text="Show Less" data-index="'+ i +'" aria-label="Show More card number '+ i +'">Show More</button>\n' +
                '</div>';
        }
        var urlBase = window.location.href.split('/career-planning-tool/');
        coursesDiv.innerHTML = '<div class="grid-row center-button"> <a href= "'+ urlBase[0] + '/training-resources/#series=' + item.series + '&level=GS ' + item.level +'&competency='+item.competency +'&competencygroup='+item.competency_group +'" class="usa-button usa-button--outline margin-bottom-1 button-border view-applicable-courses" aria-label="View applicable training courses for job series ' + item.series + ', GS level ' + item.level + ', competency ' + item.competency +'">VIEW APPLICABLE TRAINING COURSES</a></div>';
        outerDiv3.append(coursesDiv);

        const selectButtonWrapper = document.createElement('div');
        outerDiv3.prepend(selectButtonWrapper);
        selectButtonWrapper.setAttribute("class", "select-button");
        selectButtonWrapper.setAttribute("style", "color: #003062 !important");
        selectButtonWrapper.innerHTML = '<label><input type="checkbox" value="' + item.permalink + '"' + (window.isSelected(item.permalink) ? ' checked' : '') + '> <span>SELECT FOR DOWNLOAD</span></label>'
    }
    const resultsContainer = document.getElementById("career-search-results");
    var url = window.location.href.split('/training-resources/');
        if(url.length > 1) {
            return;
    }
    resultsContainer.appendChild(outerDiv1);
     bindCoursesLink();
 }