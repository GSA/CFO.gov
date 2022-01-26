
let data = new Array(); // the array that holds the search terms and the filters
let results = new Array(); // the array that holds the results from searching a filtering
let adding = false;
let removing = false;
let fullSet = [];
let competency = [];
let competency_group = [];
const startingSearchFilter = {};
$.getJSON(window.federalist.path.baseurl + '/search.json', function(res) { // load all md pages
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
  $("input:checkbox").each(function() {    
    $(this).prop('checked', false);                                    
  });

  $("#career-competency-select-all").on('change', function() { 
    if(this.checked) {
      competency_group.forEach(item => {
        let eventGroupId = createId(item);
        $("#"+eventGroupId).prop('checked', true);
        $("input:checkbox").each(function() {
          if ($(this).data("group") == eventGroupId) {      
            $(this).prop('checked', true).trigger('change');                                        
          } 
        });
      });
    } else {
      competency_group.forEach(item => {
        let eventGroupId = createId(item);
        $("#"+eventGroupId).prop('checked', false);
        $("input:checkbox").each(function() {
          if ($(this).data("group") == eventGroupId) {      
            $(this).prop('checked', false).trigger('change');                                    
          } 
        });
      });
    }      
  });

  competency_group.forEach(groupItem => {
    let eventGroupId = createId(groupItem);
    competency.forEach(item => {
      let eventId = createId(eventGroupId +" "+ item);
      $("#"+eventId).on('change', function() { 
          if(this.checked) {
            if(!ifExists(eventId)) {
              console.log(eventId);
              createRemoveButtons('checkbox', eventId, this);
            }
          } else {
            adding = false;
            removing = true;
            $("#"+eventId).prop( "checked", false );
            let group = $("#"+eventId).data('group');
            if($("#"+group).is(":checked")) $("#"+group).prop( "checked", false );
            if($("#career-competency-select-all").is(":checked")) $("#career-competency-select-all").prop( "checked", false );
            data = $.grep(data, function(e){ 
              return e.id != eventId; 
            });
            if(data.length == 0) $("#career-facet-remove-all-filters-button").css('display', 'none');
            $("#"+eventId+"-button").remove();
            getSearch();
          }      
      });
    });
  });
  competency_group.forEach(item => {
    let eventId = createId(item);
    $("#"+eventId).on('change', function() { 
      if(this.checked) {
        $("input:checkbox").each(function() {
          if ($(this).data("group") == eventId) {      
              $(this).prop('checked', true).trigger('change');                  
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
            if(data.length == 0) $("#career-facet-remove-all-filters-button").css('display', 'none'); 
          }
        });
        data = $.grep(data, function(e){ 
          return e.id != eventId; 
        });
        if(data.length == 0) $("#career-facet-remove-all-filters-button").css('display', 'none');
        $("#"+eventId+"-button").remove();
        getSearch();
      }       
    });
  });
});

function createId(item) {
  let newStr = item.replaceAll(', ', '-');
  let finalStr = newStr.replaceAll(' ', '-');
  return finalStr.toLowerCase();
}

let searchKeys = [ // when searching the columns to search
  "job_series",
  "competency",
  "competency_description",
  "proficiency_level_definition",
  "behavioral_illustrations",
  "relevant_courses",
];
let start = 0;
let perPage = 5; // pagination items per page
let totalItems = 105; // total items in results array
let totalPages = 11; // total pages in results array / pagination items per page
let currentPage = 1; // pagination current page
// career-search-results - container for search results
// cfo-pagination-page - container for currentPage
// cfo-pagination-pages - container for totalPages
// cfo-page-left - the previous page button
// cfo-page-right - the next page button

function getFilterType(id) {
  const series = new RegExp('series-*');
  const level = new RegExp('GS-*');
  if (series.test(id)) {
    return 1;
  }
  else if (level.test(id)) {
    return 2;
  }
  else if (id == 'keys') {
    return 0;
  }
  return 3;
}

function createClearButton() {
  /* const removeAllButton = document.createElement("a");
  removeAllButton.setAttribute("id", "career-facet-remove-all-filters-button");
  removeAllButton.setAttribute("class", "career-facet-remove-button");
  const removeAllButtonText = document.createTextNode(createButtonText("Clear All"));
  removeAllButton.appendChild(removeAllButtonText);
  const buttonContainer = document.getElementById("career-search-results-filter-remove-buttons");
  buttonContainer.appendChild(removeAllButton); */

  $("#career-facet-remove-all-filters-button").on('click', function() {
    // console.log("Removing: career-facet-remove-all-filters-button");
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
    $("#career-facet-remove-all-filters-button").css('display', 'none');
    getSearch();
    // console.log(JSON.stringify(data));
  });
}

function ifFilters() {
  return data.length > 0;
}

function ifExists(id) { // returns if a search or facet filter exists in the data array
  let exists = false;
  data.forEach(item => {
    if(item.id == id) exists = true;
  });
  return exists;
}

function ifExistsResults(title) { // returns if an item exists in the results array
  let exists = false;
  results.forEach(item => {
    if(item.title == title) exists = true;
  });
  return exists;
}

function setTotalItems() { // sets totalItems in results array
  totalItems = results.length;
}

function setTotalPages() { // sets totalPages for pagination
  totalPages = Math.ceil(results.length / perPage);
}

function setCurrentPage(page) { // sets currentPage for pagination
  currentPage = page;
}

function createResults(noResults, item) { // creates a results div and contents
  const outerDiv1 = document.createElement("div");
  outerDiv1.setAttribute("class", "tablet:grid-col-12 grid-spacing policy");
  const outerDiv2 = document.createElement("div");
  outerDiv2.setAttribute("class", "cfo-career-outer-box");
  outerDiv1.append(outerDiv2);
  const outerDiv3 = document.createElement("div");
  outerDiv3.setAttribute("class", "cfo-career-text-container");
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
    let template = '<p><span><strong>GS Level:</strong> {{ card.level }}</span><span><strong>Job Series:</strong> {{ card.series }}</span></p>'
                + '<p><strong>ALL:</strong> {{ card.competency }}'
                + '<p class="competency-desc"><strong>Competency Definition:</strong> {{ card.competency_description }}</p>';
    outerDiv3.innerHTML = template.replace('{{ card.level }}', item.level)
      .replace('{{ card.series }}', item.series)
      .replace('{{ card.competency }}', item.competency)
      .replace('{{ card.competency_description }}', item.competency_description);

    const innerDiv2 = document.createElement("div");
    innerDiv2.setAttribute("class", "grid-row grid-gap");
    outerDiv3.append(innerDiv2);
    innerDiv2.innerHTML = item.content;

    const selectButtonWrapper = document.createElement('div');
    outerDiv3.appendChild(selectButtonWrapper);
    selectButtonWrapper.setAttribute("class", "select-button");
    selectButtonWrapper.innerHTML = '<label><input type="checkbox" value="' + item.permalink + '"' + (window.isSelected(item.permalink)?' checked':'') + '> <span>Select for Download</span></label>'
  }
  const resultsContainer = document.getElementById("career-search-results");
  resultsContainer.appendChild(outerDiv1);
}

function createRemoveButtons(inputType, eventTargetId, button) {
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
  if(data.length == 1) {
    createClearButton();
    $("#career-facet-remove-all-filters-button").css('display', 'block');
    startingSearchFilter.id = null;
    startingSearchFilter.keys = eventTargetId;
  }
  if(inputType == "button") button.toggleClass("active");
  const removeButtonA = document.createElement("a");
  removeButtonA.setAttribute("id", eventTargetId+"-button");
  removeButtonA.setAttribute("class", "career-facet-remove-button");
  const removeButtonText = document.createTextNode(createButtonText(eventTargetId));
  removeButtonA.appendChild(removeButtonText);
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
    if(data.length == 0) $("#career-facet-remove-all-filters-button").css('display', 'none');
    $("#"+eventTargetId+"-button").remove();
    getSearch();
    // console.log(JSON.stringify(data));
  });
}

function createButtonText(text) { // creates the remove button text
  let part1 = text.split("-");
  if(part1[0] == 'GS') return part1[0]+" "+part1[1]+"-"+part1[2]+" X";
  else {
    let removeButtonText = part1.join(" ") + " X";
    return (' '+removeButtonText).replace(/ [\w]/g, a => a.toLocaleUpperCase()).trim();
  }
}

function getSearch() {
  results = [];
  $.getJSON(window.federalist.path.baseurl + '/search.json', function(res) { // load all md pages
    // take search and facet(data) selections and iterate through res looking for matches
    res.forEach(item => { // go over all loaded md pages
      data.forEach(obj => { // go over the search and facets selected
        let filters = item.filters.split(" ");
        let val = '';
        let key = 'id';
        switch (getFilterType(obj.id)) {
          case 0:
            val = item.title;
            key = 'keys';
          break;
          case 1:
            val = filters[2];
          break;
          case 2:
            val = filters[1];
          break;
          case 3:
            val = filters[0];
        }
        if (val.toLowerCase() == obj[key].toLowerCase()) {
          if( !ifExistsResults(item.title)) {
            results.push(item);
          }
        }
      });
    });

    $("#career-search-results").empty();
    if(results.length === 0) {
      createResults(true);
      $("#cfo-page-right").attr("disabled", "disabled");
      $("#cfo-page-left").attr("disabled", "disabled");
    } else {
      for (i=0; i < Math.min(results.length, perPage); i++) {
        if (typeof(results[i]) != "undefined" && results[i] !== null) {
          createResults(false, results[i]);
        }
      }
      $("#cfo-page-left").attr("disabled", "disabled");
      $("#cfo-page-right").removeAttr("disabled");
    }
    
    setCurrentPage(1);
    $("#cfo-pagination-page").text(currentPage);
    setTotalPages();
    $("#cfo-pagination-pages").text(totalPages);
    setTotalItems();
    $("#cfo-pagination-results").text(totalItems);
  });
  unselectAll();
}

(function( $ ) {
 
  $.fn.createButtonEvents = function() {
    this.filter( "button" ).each(function() {
        var button = $( this );
        // console.log("Button Id: " + button[0].id);
        $("#"+button[0].id).on('click', function(evt) {
          evt.preventDefault();
          //console.log("Button Id: " + button[0].id);
          if(button[0].id == "cfo-page-right" || button[0].id == "cfo-page-left" || button[0].id == "cfo-search-button") {
            if(button[0].id == "cfo-search-button") {
              // console.log("Input Val: " + $("#career-advancement-search-input").val());
              if(data.length) {
                data.forEach(item => {
                  if(item.keys != undefined) {
                    item.keys = $("#career-advancement-search-input").val();
                  } else {
                    data.push({
                      id: 'keys',
                      keys: $("#career-advancement-search-input").val()
                    });
                  }
                });
              } else {
                data.push({
                  id: 'keys',
                  keys: $("#career-advancement-search-input").val()
                });
                createClearButton();
                $("#career-facet-remove-all-filters-button").css('display', 'block');
                startingSearchFilter.id = 'keys';
                startingSearchFilter.keys = $("#career-advancement-search-input").val();
              }
              getSearch();
              //console.log(JSON.stringify(data));
              return false;
            } else if(button[0].id == "cfo-page-right") {
              if(currentPage < totalPages) {
                $("#career-search-results").empty();
                setCurrentPage(currentPage += 1);
                $("#cfo-pagination-page").text(currentPage);
                if(currentPage == 1) {
                  start = 0;
                  end = perPage;
                } else {
                  start = (currentPage - 1) * perPage;
                  end = start + perPage;
                }
                //console.log(start + " - " + end);
                for(i=start; i<end; i++) {
                  if(typeof(results[i]) != "undefined" && results[i] !== null) createResults(false, results[i]);
                }
                $("#cfo-page-left").removeAttr("disabled")
                if(currentPage == totalPages) $("#cfo-page-right").attr("disabled", "disabled");
              } else {
                $("#cfo-page-right").attr("disabled", "disabled");
              }
              return false;
            } else if(button[0].id == "cfo-page-left") {
              if(currentPage > 1) {
                $("#career-search-results").empty();
                setCurrentPage(currentPage -= 1);
                $("#cfo-pagination-page").text(currentPage);
                if(currentPage == 1) {
                  start = 0;
                  end = perPage;
                } else {
                  start = (currentPage - 1) * perPage;
                  end = start + perPage;
                }
                //console.log(start + " - " + end);
                for(i=start; i<end; i++) {
                  if(typeof(results[i]) != "undefined" && results[i] !== null) createResults(false, results[i]);
                }
                $("#cfo-page-right").removeAttr("disabled");
                if(currentPage == 1) $("#cfo-page-left").attr("disabled", "disabled");
              } else {
                $("#cfo-page-left").attr("disabled", "disabled");
              }
              return false;
            }
          } else {
            if(!ifExists(evt.target.id)) {
              createRemoveButtons('button', evt.target.id, button);
            }
          }
        });
    });
  };

}( jQuery ));