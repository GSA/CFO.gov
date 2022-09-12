
let data = new Array(); // the array that holds the search terms and the filters
let results = new Array(); // the array that holds the results from searching a filtering
let adding = false; // if adding to results
let removing = false; // if removing from results
let fullSet = []; // a full set of all competency_group and competencies
let competency = []; // array of competencies
let competency_group = []; // array of competency_groups
let startingSearchFilter = []; // hold the starting search filter object
let searchOrder = []; // hold a list of objects representing the order of a search competency, level, series etc..

/**
 * loads all md pages on init
 */
$.getJSON(window.federalist.path.baseurl + '/search.json', function(res) {
  $('#career-advancement-search-input').val('');
  if ($("#career-competency-select-all").is(":checked")) {
    $("#career-competency-select-all").prop( "checked", false );
  }

  res.forEach(item => {
    if (!competency.includes(item.competency)) {
      competency.push(item.competency);
    }
    if (!competency_group.includes(item.competency_group)) {
      competency_group.push(item.competency_group);
    }
    results.push(item);
    fullSet.push(item);
  });

  competency_group.sort();
  competency.sort();

  $("input:checkbox").each(function() {
    $(this).prop('checked', false);
  });

  $("#career-competency-select-all").on("focus", function() {
    $('label[for="career-competency-select-all"]').addClass( "padding-05" );
    $('label[for="career-competency-select-all"]').css( "outline", "0.25rem solid #2491ff" );
  });

  $("#career-competency-select-all").on("blur", function() {
    $('label[for="career-competency-select-all"]').removeClass( "padding-05" );
    $('label[for="career-competency-select-all"]').css( "outline", "none" );
  });

  $("#career-competency-select-all").on('change', function() {
    if(startingSearchFilter.length < 4 && !ifExistsInArray('competency', searchOrder)) searchOrder.push('competency');
    if(startingSearchFilter.length == 0) {
      startingSearchFilter.push({keys: null, id: 'competency'});
    }
    if(this.checked) {
      competency_group.forEach(item => {
        let eventGroupId = createId(item);
        $("#"+eventGroupId).prop('checked', true);
        $("input:checkbox").each(function() {
          if ($(this).data("group") == eventGroupId && !$(this).prop("disabled")) {
            $(this).prop({'checked': true}).trigger('change');
          }
        });
      });
    } else {
      competency_group.forEach(item => {
        let eventGroupId = createId(item);
        $("#"+eventGroupId).prop('checked', false);
        $("input:checkbox").each(function() {
          if ($(this).data("group") == eventGroupId && !$(this).prop("disabled")) {
            $(this).prop({'checked': false}).trigger('change');
          }
        });
      });
    }
  });

  // create an array of everything of both disabled and active.
  competency_group.forEach(groupItem => {
    let eventGroupId = createId(groupItem);
    competency.forEach(item => {
      let eventId = createId(eventGroupId +" "+ item);
      $("#"+eventId).on('change', function() {
        if (this.checked) {
          if (startingSearchFilter.length < 4 && !ifExistsInArray('competency', searchOrder)) searchOrder.push('competency');
          if (!ifExists(eventId)) {
            createRemoveButtons('checkbox', eventId, this, eventGroupId, item);
            // console.log("Data " + JSON.stringify(data));
            // console.log("StartingSearchFilter " + JSON.stringify(startingSearchFilter));
            // console.log("searchOrder " + JSON.stringify(searchOrder));
          }
        } else {
          adding = false;
          removing = true;
          $("#"+eventId).prop( "checked", false );
          let group = $("#"+eventId).data('group');
          if($("#"+group).is(":checked")) $("#"+group).prop( "checked", false );
          if($("#career-competency-select-all").is(":checked")) $("#career-competency-select-all").prop( "checked", false );
          data = $.grep(data, function(e) {
            return e.id != eventId;
          });
          adjustSearchOrder();
          if(data.length == 0) {
            searchOrder = [];
            startingSearchFilter = [];
            $("#career-facet-remove-all-filters-button").css('display', 'none');
          }
          $("#"+eventId+"-button").remove();
          getSearch();
        }
      });
    });
  });

  competency_group.forEach(item => {
    let eventId = createId(item);

    $("#"+eventId).on("focus", function() {
      $('label[for="' + eventId + '"]').addClass( "padding-05" );
      $('label[for="' + eventId + '"]').css( "outline", "0.25rem solid #2491ff" );
    });

    $("#"+eventId).on("blur", function() {
      $('label[for="' + eventId + '"]').removeClass( "padding-05" );
      $('label[for="' + eventId + '"]').css( "outline", "none" );
    });

    $("#" + eventId).on('change', function () {
      console.log("Select All Competency Group");
      if(this.checked) {
        if(startingSearchFilter.length < 4 && !ifExistsInArray('competency', searchOrder)) searchOrder.push('competency');
        if(startingSearchFilter.length == 0) {
          startingSearchFilter.push({keys: null, id: 'competency'});
        }
        $("input:checkbox").each(function() {
          if ($(this).data("group") == eventId && !$(this).prop("disabled")) {
            $(this).prop({'checked': true}).trigger('change');
          }
        });
      } else {
        adding = false;
        removing = true;
        $("#"+eventId).prop( "checked", false );
        competency.forEach(competencyItem => {
          let eventCompetencyId = createId(eventId + " " + competencyItem);
          if($("#"+eventCompetencyId).data("group") == eventId) {
            $("#"+eventCompetencyId).prop('checked', false);
            $("#"+eventCompetencyId+"-button").remove();
            data = $.grep(data, function(e){
              return e.id != eventCompetencyId;
            });
            adjustSearchOrder();
            if(data.length == 0) {
              searchOrder = [];
              startingSearchFilter = [];
              $("#career-facet-remove-all-filters-button").css('display', 'none');
            }
          }
        });
        data = $.grep(data, function(e){
          return e.id != eventId;
        });
        adjustSearchOrder();
        if(data.length == 0) {
          startingSearchFilter = [];
          $("#career-facet-remove-all-filters-button").css('display', 'none');
        }
        $("#"+eventId+"-button").remove();
        getSearch();
      }
    });
  });

  setTotalPages();
});

/**
 * creates an id from a space and/or comma delimited string
 * @param {string} item - a string with spaces and/or commas
 * @returns - a string delimited with dashes(-)
 */
function createId(item) {
  let newStr = item.replaceAll(', ', '-');
  let finalStr = newStr.replaceAll(' ', '-');
  return finalStr.toLowerCase();
}

let searchKeys = [ // when searching the columns to search - Compentency Description, Proficiency Level Definition, Behavioral Illustrations, Relevant Courses
  // "job_series",
  // "competency",
  "title",
  "competency_description",
  "proficiency_level_definition",
  "behavioral_illustrations",
  "relevant_courses",
];
let start = 0;
let perPage = parseInt($('select[name="per_page"]').val()) || 10; // pagination items per page
let totalItems = 105; // total items in results array
let totalPages = 11; // total pages in results array / pagination items per page
let currentPage = 1; // pagination current page
// career-search-results - container for search results
// cfo-pagination-page - container for currentPage
// cfo-pagination-pages - container for totalPages
// cfo-page-left - the previous page button
// cfo-page-right - the next page button

/**
 * returns the type of filter
 * @param {string} id a button id
 * @returns - series, level or competency
 */
function getFilterType(id) {
  const series = new RegExp('series-*');
  const level = new RegExp('GS-*');
  if(series.test(id)) return 'series';
  else if(level.test(id)) return 'level';
  return 'competency';
}

/**
 * Create a clear all filters button
 */
function createClearButton() {
  /* const removeAllButton = document.createElement("a");
  removeAllButton.setAttribute("id", "career-facet-remove-all-filters-button");
  removeAllButton.setAttribute("class", "career-facet-remove-button");
  const removeAllButtonText = document.createTextNode(createButtonText("Clear All"));
  removeAllButton.appendChild(removeAllButtonText);
  const buttonContainer = document.getElementById("career-search-results-filter-remove-buttons");
  buttonContainer.appendChild(removeAllButton); */

  $("#career-facet-remove-all-filters-button").on('click', function() {
    adding = false;
    removing = true;

    data.forEach(item => {
      if(item.keys != null) {
        $('#career-advancement-search-input').val('');
        $('#career-advancement-search-input').removeAttr('value');
      } else {
        if(item.type == 'checkbox') {
          $("#"+item.id).prop( "checked", false );
          let group = $("#"+item.id).data('group');
          if($("#"+group).is(":checked")) $("#"+group).prop( "checked", false );
          if($("#career-competency-select-all").is(":checked")) $("#career-competency-select-all").prop( "checked", false );
        } else $("#"+item.id).toggleClass('active');
        $("#"+item.id+"-button").remove();
      }
    })
    data = [];
    searchOrder = [];
    startingSearchFilter = [];
    $("#career-facet-remove-all-filters-button").css('display', 'none');
    getSearch();
  });
}

function ifFilters() {
  return data.length > 0;
}

/**
 * returns if an element exists in an array
 * @param {string} elm - element in array
 * @param {*} array - array to search
 * @returns bool
 */
function ifExistsInArray(elm, array) {
  let exists = false;
  array.forEach(item => {
    if(item == elm) exists = true;
  });
  return exists;
}

/**
 * returns if a search or facet filter exists in the data array
 * @param {string} id the id of the element
 * @returns bool
 */
function ifExists(id) {
  let exists = false;
  data.forEach(item => {
    if(item.id == id) exists = true;
  });
  return exists;
}

/**
 * returns if an item exists in the results array
 * @param {string} title - the title
 * @param {array} array - the array to search
 * @returns - bool
 */
function ifExistsResults(title, array) {
  let exists = false;
  array.forEach(item => {
    if(item.title == title) exists = true;
  });
  return exists;
}

/**
 * sets totalItems in results arra
 */
function setTotalItems() {
  totalItems = results.length;
}

/**
 * sets totalPages for pagination
 */
function setTotalPages() {
  if (!results.length) {
    if (searchOrder.length) {
      totalPages = 0;
    }
    else {
      totalPages = Math.ceil(fullSet.length / perPage);
    }
  }
  else {
    totalPages = Math.ceil(results.length / perPage);
  }
}

/**
 * sets currentPage for pagination
 * @param {string} page - integer representing the current page of pagination
 */
function setCurrentPage(page) {
  currentPage = page;
}

/**
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
  if(noResults) {
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
          + '<div class="cfo-inner-competency-div"><span><strong>GS Level:</strong> {{ card.level }}</span></div>'
          + '<div class="cfo-inner-competency-div"><span><strong>Job Series:</strong> {{ card.series }}</span></div>'
      + '</div>'
      + '<div class="cfo-career-category-container font-body-md margin-y-0">'
          + '<div class="cfo-inner-competency-div"><span><strong>Competency:</strong> {{ card.competency }}</span></div>'
          + '<div class="cfo-inner-competency-div"><span><strong>Type:</strong> {{ card.competency_group }}</span></div>'
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
        courseMarkup += '<li role="listitem">' + item.relevant_courses[i] + '</li>';
      }
      courseMarkup += '</ul>';
    }
    else {
      courseMarkup = '<p>No courses</p>';
    }
    coursesDiv.innerHTML = '<h3>Course Listing</h3>'+courseMarkup;
    outerDiv3.append(coursesDiv);

    const selectButtonWrapper = document.createElement('div');
    outerDiv3.prepend(selectButtonWrapper);
    selectButtonWrapper.setAttribute("class", "select-button");
    selectButtonWrapper.innerHTML = '<label><input type="checkbox" value="' + item.permalink + '"' + (window.isSelected(item.permalink)?' checked':'') + '> <span>Select for Download</span></label>'
  }
  const resultsContainer = document.getElementById("career-search-results");
  resultsContainer.appendChild(outerDiv1);
}

/**
 * Creates a single remove button.
 * Called in two places
 * 1) when a button is clicked
 * 2) when a checkbox is checked
 *
 * @param {string} inputType - The type of input - button, checkbox
 * @param {string} eventTargetId - The id of the object clicked
 * @param {object} button - The this representation of the object clicked - button or checkbox
 * @param {string} competencyGroup - The group id of the checkbox (not used with buttons)
 * @param {string} competencyTitle - The competency title (not used with buttons)
 */
function createRemoveButtons(inputType, eventTargetId, button, competencyGroup, competencyTitle) {
  if(inputType == "button") {
    data.push({
      id: eventTargetId,
      type: 'button',
      keys: null
    });
  } else {
    data.push({
      id: eventTargetId,
      type: 'checkbox',
      keys: null
    });
  }

  adding = true;
  removing = false;
  if(eventTargetId.match("GS")) {
    if(startingSearchFilter.length < 4 && !ifExistsInArray('level', searchOrder)) searchOrder.push('level');
  }
  if(eventTargetId.match("series")) {
    if(startingSearchFilter.length < 4 && !ifExistsInArray('series', searchOrder)) searchOrder.push('series');
  }
  if(data.length == 1) {
    createClearButton();
    $("#career-facet-remove-all-filters-button").css('display', 'block');
    if(startingSearchFilter.length == 0) {
      startingSearchFilter.push({keys: null, id: eventTargetId});
    }
  }
  if(inputType == "button") button.toggleClass("active");
  const removeButtonA = document.createElement("a");
  removeButtonA.setAttribute("id", eventTargetId+"-button");
  removeButtonA.setAttribute("tabindex", 0);
  removeButtonA.setAttribute("href", "javascript:void(0)");
  removeButtonA.setAttribute("class", "usa-tag bg-accent-warm text-black padding-1 margin-right-2 margin-bottom-2 text-no-uppercase text-no-underline");
  let removeButtonText = '';
  if(inputType == "button") {
    removeButtonText = createButtonText(eventTargetId);
  } else {
    let = competencyName = competencyGroup +" - "+ competencyTitle
    removeButtonText = (' '+competencyName).replace(/ [\w]/g, a => a.toLocaleUpperCase()).trim();
  }

  removeButtonA.innerHTML = removeButtonText + "&nbsp;&nbsp;<i class='fa fa-times'></i>";
  const buttonContainer = document.getElementById("career-search-results-filter-remove-buttons");
  buttonContainer.appendChild(removeButtonA);

  getSearch();

  $("#"+eventTargetId+"-button").on('click', function() {
    // console.log("Removing: "+eventTargetId+"-button");
    adding = false;
    removing = true;
    if(inputType == "button") $("#"+button[0].id).toggleClass("active");
    else {
      $("#"+eventTargetId).prop( "checked", false );
      let group = $("#"+eventTargetId).data('group');
      if($("#"+group).is(":checked")) $("#"+group).prop( "checked", false );
      if($("#career-competency-select-all").is(":checked")) $("#career-competency-select-all").prop( "checked", false );
    }
    data = $.grep(data, function(e){
      return e.id != eventTargetId;
    });
    adjustSearchOrder();
    if(data.length == 0) {
      searchOrder = [];
      startingSearchFilter = [];
      $("#career-facet-remove-all-filters-button").css('display', 'none');
    }
    $("#"+eventTargetId+"-button").remove();
    getSearch();
    // console.log(JSON.stringify(data));
  });
}

/**
 * removes the filters effects
 * @param {string} inputType - if a button or checkbox
 * @param {string} id - the id of the button or checkbox
 */
function removeCriteria(inputType, id) {
  $('#' + id + '-button').remove();
  let elem = $('#' + id);

  if (inputType == 'button') {
    elem.toggleClass('active');
  }
  else {
    elem.prop('checked', false);
    let group = $("#"+eventTargetId).data('group');
    if ($("#"+group).is(":checked")) {
      $("#"+group).prop( "checked", false );
    }
    if ($("#career-competency-select-all").is(":checked")) {
      $("#career-competency-select-all").prop( "checked", false );
    }
  }

  let target = -1;
  for (let i = 0, l = data.length; i < l; i++) {
    if (data[i].id == id) {
      target = i;
      break;
    }
  }

  data.splice(target, 1);
  adjustSearchOrder();
  if( data.length == 0) {
    searchOrder = [];
    startingSearchFilter = [];
    $("#career-facet-remove-all-filters-button").css('display', 'none');
  }

  getSearch();
}

/**
 * adjusts the searchOrder array
 */
function adjustSearchOrder() {
  let newSearchOrder = [];
  // console.log(JSON.stringify(data));
  data.forEach(item => {
    if(item.type == 'keys') {
      if(!ifExistsInArray('search', newSearchOrder)) {
        newSearchOrder.push('search');
      }
    } else {
      // console.log("Item Id: " + item.id + " &&& Type: " + getFilterType(item.id))
      if(!ifExistsInArray(getFilterType(item.id), newSearchOrder)) {
        newSearchOrder.push(getFilterType(item.id));
      }
    }
  });
  searchOrder = [];
  newSearchOrder.forEach(item => {
    searchOrder.push(item);
  });
  // console.log("New Search Order: " + JSON.stringify(newSearchOrder) + " &&& Old Search Order: " + JSON.stringify(searchOrder));
}

/**
 * creates the remove button text
 * @param {string} text - text to converted to name
 * @returns button text
 */
function createButtonText(text) {
  let part1 = text.split("-");
  if(part1[0] == 'GS') return part1[0]+" "+part1[1]+"-"+part1[2];
  else {
    let removeButtonText = part1.join(" ");
    return (' '+removeButtonText).replace(/ [\w]/g, a => a.toLocaleUpperCase()).trim();
  }
}

/**
 * Iterates over the searchOrder array and creates results based upon the filters selected
 * Uses enableDisableCompetencies and the createResults
 */
function getSearch() {
  results = [];
    // take search and facet(data) selections and iterate through res looking for matches
    /* if(startingSearchFilter.length > 0) {
      let cvalue = '';
      if(startingSearchFilter[0].keys === null) {
        console.log('Its a filter: ' + startingSearchFilter[0].id);
      } else {
        console.log('Its a Search: ' + startingSearchFilter[0].keys);
      }
    } */


    // create a count of the the items displayed and display it.
    // count all search results for an item as a sanity check and make a spread sheet.
  // console.log("searchOrder: " + JSON.stringify(searchOrder));
  if(searchOrder.length > 0) {
    searchOrder.forEach((searchItem, index) => {
      // console.log("Index: " + index);
      switch(index) {
        case 0:
          // console.log("searchItem: " + searchItem);
          if(searchItem == 'search') { // is the search always first No - if first add if second subtract
            //console.log(startingSearchFilter[0].keys);
            fullSet.forEach(item => { // go over all loaded md pages
              searchKeys.forEach(term => {
                //console.log(item[term].toLowerCase() + " &&&& " + startingSearchFilter[0].keys.toLowerCase());
                if (typeof item[term] == "string") {
                  if(item[term].toLowerCase().match(startingSearchFilter[0].keys.toLowerCase())) {
                    if (!ifExistsResults(item.title, results)) {
                      results.push(item);
                    }
                  }
                }
                else if (Array.isArray(item[term])) {
                  if (item[term].filter(i => i.toLowerCase().match(startingSearchFilter[0].keys.toLowerCase())).length) {
                    if (!ifExistsResults(item.title, results)) {
                      results.push(item);
                    }
                  }
                }
              });
            });
          } else {
            fullSet.forEach(item => { // go over all loaded md pages
              data.forEach(obj => { // go over the search and facets selected
                if(getFilterType(obj.id) == searchItem) {
                  let filters = item.filters.split(" ");
                  let val = '';
                  switch (getFilterType(obj.id)) {
                    case 'series': // Series
                      val = filters[2];
                    break;
                    case 'level': // GS Level
                      val = filters[1];
                    break;
                    case 'competency': // Group - Competency
                      val = filters[0];
                  }

                  // console.log("Val: " + val);
                  if (val.toLowerCase() == obj.id.toLowerCase()) {
                    if (!ifExistsResults(item.title, results)) {
                      results.push(item);
                    }
                  }
                }
              });
            });
          }
        break;
        default:
          // console.log("default searchItem: " + searchItem);
          let newResults = [];
          if(searchItem == 'search') {
            // create a results array for the next search criteria
            fullSet.forEach(item => { // go over all loaded md pages
              searchKeys.forEach(term => {
                data.forEach(obj => { // go over the search and facets selected
                  if(obj.type == 'keys') {
                    // console.log(item[term].toLowerCase() + " &&&& " + obj.keys.toLowerCase());
                    if(item[term].toLowerCase().match(obj.keys.toLowerCase())) {
                      if(!ifExistsResults(item.title, newResults)) {
                        newResults.push(item);
                      }
                    }
                  }
                });
              });
            });
            // console.log("New Results: " + newResults.length);
          } else {
            // create a results array for the next search criteria
            fullSet.forEach(item => { // go over all loaded md pages
              data.forEach(obj => { // go over the search and facets selected
                if(getFilterType(obj.id) == searchItem) {
                  let filters = item.filters.split(" ");
                  let val = '';
                  switch (getFilterType(obj.id)) {
                    case 'series': // Series
                      val = filters[2];
                    break;
                    case 'level': // GS Level
                      val = filters[1];
                    break;
                    case 'competency': // Group - Competency
                      val = filters[0];
                  }

                  //console.log("Val: " + val);
                  if (val.toLowerCase() == obj.id.toLowerCase()) {
                    if(!ifExistsResults(item.title, newResults)) {
                      newResults.push(item);
                    }
                  }
                }
              });
            });
            // console.log("New Results: " + newResults.length);
          }

          // look for newfilters in prior results set and if they are there
          // save the prior results in to a different array.
          finishResults = [];
          results.forEach(item => {
            newResults.forEach(newItem => {
              if (item.title.toLowerCase() == newItem.title.toLowerCase()) {
                if(!ifExistsResults(item.title, finishResults)) {
                  finishResults.push(item);
                }
              }
            });
          });

          // populate results with finishResults
          results = [];
          finishResults.forEach(item => {
            if(!ifExistsResults(item.title, results)) {
              results.push(item);
            }
          });
        break;
      }

      // console.log("searchItem: " + searchItem);
      if (searchItem == 'series' || searchItem == 'level') {
        enableDisableCompetencies(false);
      }
    });

    // console.log("Results Length: " + results.length);

    $("#career-search-results").empty();

    // console.log("noResults Competency Groups: " + noResultsCompGroups.length);
    // console.log("noResults Competency: " + noResultsComps.length);
    // console.log("Results Length: " + results.length);

    if(results.length === 0) {
      // console.log("Search Order Length: " + searchOrder.length);
      if(searchOrder.length === 0) {
        for (i=0; i < Math.min(fullSet.length, perPage); i++) {
          if (typeof(fullSet[i]) != "undefined" && fullSet[i] !== null) {
            createResults(false, fullSet[i]);
          }
        }
        $(".cfo-pagination-results").text(fullSet.length);
      } else {
        createResults(true);
        setTotalItems();
        $(".cfo-pagination-results").text(totalItems);
        $(".cfo-page-right").attr("disabled", "disabled");
        $(".cfo-page-left").attr("disabled", "disabled");
      }
    } else {
      for (i=0; i < Math.min(results.length, perPage); i++) {
        if (typeof(results[i]) != "undefined" && results[i] !== null) {
          // console.log(JSON.stringify(results[i]));
          createResults(false, results[i]);
        }
      }
      $(".cfo-page-left").attr("disabled", "disabled");
      $(".cfo-page-right").removeAttr("disabled");

      setTotalItems();
      $(".cfo-pagination-results").text(totalItems);
    }

    setCurrentPage(1);
    $(".cfo-pagination-page").text(currentPage);
    setTotalPages();
    $(".cfo-pagination-pages").text(totalPages);
  } else {
    for (i=0; i < Math.min(fullSet.length, perPage); i++) {
      if (typeof(fullSet[i]) != "undefined" && fullSet[i] !== null) {
        createResults(false, fullSet[i]);
      }
    }
    $(".cfo-pagination-results").text(fullSet.length);
    setCurrentPage(1);
    $(".cfo-pagination-page").text(currentPage);
    setTotalPages();
    $(".cfo-pagination-pages").text(totalPages);
    enableDisableCompetencies(true);
  }
  unselectAll();
}

/**
 * Iterates through all checkboxes in results array and disable those that have no results.
 * If in all mode it iterates through the full set and enables all checkboxes.
 * @param {bool} all - if enable all checkboxes
 */
function enableDisableCompetencies(all) {
  fullCompetency = [];
  fullSet.forEach(item => {
    let set = item.competency_group + " " + item.competency;
    if (!ifExistsInArray(set, fullCompetency)) {
      fullCompetency.push(set);
    }
  });

  resultsComps = [];
  resultsCompGroups = [];
  if (all) {
    fullSet.forEach(item => {
      competency_group.forEach(obj => {
        if (item.competency_group == obj) {
          if (!ifExistsInArray(obj, resultsCompGroups)) {
            resultsCompGroups.push(obj);
          }
        }
      });

      let set = item.competency_group + " " + item.competency;
      fullCompetency.forEach(obj => {
        if (set == obj) {
          if (!ifExistsInArray(set, resultsComps)) {
            resultsComps.push(set);
          }
        }
      });
    });

    competency_group.forEach(item => {
      let itemId = createId(item);
      document.getElementById(itemId).disabled = false;
    });

    fullCompetency.forEach(item => {
      let itemId = createId(item);
      document.getElementById(itemId).disabled = false;
      document.getElementById(itemId).parentNode.parentNode.hidden = false
    });
  } else {
    results.forEach(item => {
      competency_group.forEach(obj => {
        if (item.competency_group == obj) {
          if (!ifExistsInArray(obj, resultsCompGroups)) {
            resultsCompGroups.push(obj);
          }
        }
      });

      let set = item.competency_group + " " + item.competency;
      fullCompetency.forEach(obj => {
        if (set == obj) {
          if (!ifExistsInArray(set, resultsComps)) {
            resultsComps.push(set);
          }
        }
      });
    });

    competency_group.forEach(item => {
      let itemId = createId(item);
      if (!ifExistsInArray(item, resultsCompGroups)) {
        document.getElementById(itemId).disabled = true;
      } else {
        document.getElementById(itemId).disabled = false;
      }
    });

    fullCompetency.forEach(item => {
      let itemId = createId(item);
      if (!ifExistsInArray(item, resultsComps)) {
        document.getElementById(itemId).disabled = true;
        document.getElementById(itemId).parentNode.parentNode.hidden = true
      } else {
        document.getElementById(itemId).disabled = false;
        document.getElementById(itemId).parentNode.parentNode.hidden = false
      }
    });
  }
}

(function( $ ) {

  /**
   * Iterates through all buttons and links and attaches n event to them
   * triggered in _includes/scripts.html
   */
  $.fn.createButtonEvents = function() {
    this.filter( "button" ).each(function() {
        var button = $( this );
        // console.log("Button Id: " + button[0].id);
        button.on('click', function(evt) {
          evt.preventDefault();
          //console.log("Button Id: " + button[0].id);
          if(button[0].classList.contains("cfo-page-right") || button[0].classList.contains("cfo-page-left") || button[0].id == "cfo-search-button") {
            if(button[0].id == "cfo-search-button") {
              // console.log("Input Val: " + $("#career-advancement-search-input").val());
              if(startingSearchFilter.length < 4 && !ifExistsInArray('search', searchOrder)) searchOrder.push('search');
              if(startingSearchFilter.length == 0) {
                startingSearchFilter.push({keys: $("#career-advancement-search-input").val(), id: 'keys'});
              }
              if(searchOrder.length == 1 && searchOrder[0] == 'search') { // reset the search if it is the first and is researched without selecting a filter.
                startingSearchFilter = [];
                startingSearchFilter.push({keys: $("#career-advancement-search-input").val(), id: 'keys'});
              }
              if(data.length) {
                let searchExists = false;
                data.forEach(item => {
                  if(item.id == 'keys') {
                    item.keys = $("#career-advancement-search-input").val();
                    searchExists = true;
                  }
                });
                if(!searchExists) {
                  data.push({
                    id: 'keys',
                    type: 'keys',
                    keys: $("#career-advancement-search-input").val()
                  });
                }
              } else {
                data.push({
                  id: 'keys',
                  type: 'keys',
                  keys: $("#career-advancement-search-input").val()
                });
                createClearButton();
                $("#career-facet-remove-all-filters-button").css('display', 'block');
              }
              getSearch();
              //console.log(JSON.stringify(searchOrder));
              return false;
            } else if(button[0].classList.contains("cfo-page-right")) {
              if(currentPage < totalPages) {
                $("#career-search-results").empty();
                setCurrentPage(currentPage += 1);
                $(".cfo-pagination-page").text(currentPage);
                let dataSet = (results.length && searchOrder.length) ? results : fullSet;
                if(currentPage == 1) {
                  start = 0;
                  end = perPage;
                } else {
                  start = (currentPage - 1) * perPage;
                  end = Math.min(start + perPage, dataSet.length);
                }
                //console.log(start + " - " + end);
                for(i=start; i<end; i++) {
                  if(typeof(dataSet[i]) != "undefined" && results[i] !== null) {
                    createResults(false, dataSet[i]);
                  }
                }
                $(".cfo-page-left").removeAttr("disabled")
                if(currentPage == totalPages) $(".cfo-page-right").attr("disabled", "disabled");
              } else {
                $(".cfo-page-right").attr("disabled", "disabled");
              }
              return false;
            } else if(button[0].classList.contains("cfo-page-left")) {
              if(currentPage > 1) {
                $("#career-search-results").empty();
                setCurrentPage(currentPage -= 1);
                $(".cfo-pagination-page").text(currentPage);
                let dataSet = (results.length && searchOrder.length) ? results : fullSet;
                if(currentPage == 1) {
                  start = 0;
                  end = perPage;
                } else {
                  start = (currentPage - 1) * perPage;
                  end = Math.min(start + perPage, dataSet.length);
                }
                //console.log(start + " - " + end);
                for(i=start; i<end; i++) {
                  if(typeof(dataSet[i]) != "undefined" && results[i] !== null) {
                    createResults(false, dataSet[i]);
                  }
                }
                $(".cfo-page-right").removeAttr("disabled");
                if(currentPage == 1) $(".cfo-page-left").attr("disabled", "disabled");
              } else {
                $(".cfo-page-left").attr("disabled", "disabled");
              }
              return false;
            }
          } else if(button[0].id.match('competency-group-button')) {
            $(this).parent().siblings().slideToggle();
            $(this).find('i').toggleClass('fa-plus fa-minus');
          } else {
            if (!ifExists(evt.target.id)) {
              createRemoveButtons('button', evt.target.id, button);
            }
            else {
              removeCriteria('button', evt.target.id);
            }
          }
        });
    });
  };

}( jQuery ));