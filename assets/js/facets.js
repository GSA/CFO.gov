
let data = new Array(); // the array that holds the search terms and the filters
let results = new Array(); // the array that holds the results from searching a filtering
$.getJSON('/search.json', function(res) { // load all md pages
  res.forEach(item => {
    results.push(item);
  });
});
let searchKeys = [ // when searching the columns to search
  "layout",
  "title",
  "series",
  "job_series",
  "career_level",
  "permalink",
  "functional_competency_designation",
  "competency",
  "level",
  "proficiency_level",
  "proficiency_level_definition",
  "behavioral_illustrations",
  "relevant_courses",
  "filters"
];
let start = 0;
let perPage = 10; // pagination items per page
let totalItems = 105; // total items in results array
let totalPages = 11; // total pages in results array / pagination items per page
let currentPage = 1; // pagination current page
// career-search-results - container for search results
// cfo-pagination-page - container for currentPage
// cfo-pagination-pages - container for totalPages
// cfo-page-left - the previous page button
// cfo-page-right - the next page button

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
    const textArea = document.createElement("p");
    textArea.setAttribute("class", "cfo-career-results-text-bold");
    outerDiv3.appendChild(textArea);
    const text1 = document.createTextNode(item.title);
    textArea.appendChild(text1);

    const innerDiv1 = document.createElement("div");
    innerDiv1.setAttribute("class", "career-card-level-heading");
    outerDiv3.append(innerDiv1);
    const textArea2 = document.createElement("p");
    innerDiv1.appendChild(textArea2);
    const text2 = document.createTextNode(item.level);
    textArea2.appendChild(text2);

    const innerDiv2 = document.createElement("div");
    innerDiv2.setAttribute("class", "career-card-content");
    outerDiv3.append(innerDiv2);
    //innerDiv2.innerHTML = card.content;

    const textArea3 = document.createElement("p");
    textArea3.setAttribute("class", "cfo-career-results-text-bold");
    innerDiv2.appendChild(textArea3);
    const text3 = document.createTextNode("Proficiency Level Definition");
    textArea3.appendChild(text3);

    const textArea4 = document.createElement("p");
    innerDiv2.appendChild(textArea4);
    const text4 = document.createTextNode(item.proficiency_level_definition);
    textArea4.appendChild(text4);

    const textArea5 = document.createElement("p");
    textArea5.setAttribute("class", "cfo-career-results-text-bold");
    innerDiv2.appendChild(textArea5);
    const text5 = document.createTextNode("Behavior Illustration");
    textArea5.appendChild(text5);

    const textArea6 = document.createElement("p");
    innerDiv2.appendChild(textArea6);
    const text6 = document.createTextNode(item.behavioral_illustrations);
    textArea6.appendChild(text6);

    const textArea7 = document.createElement("p");
    textArea7.setAttribute("class", "cfo-career-results-text-bold");
    innerDiv2.appendChild(textArea7);
    const text7 = document.createTextNode("Relevant Courses");
    textArea7.appendChild(text7);

    const textArea8 = document.createElement("p");
    innerDiv2.appendChild(textArea8);
    let courses = item.relevant_courses == "nan" ? "No Courses yet." : item.relevant_courses;
    const text8 = document.createTextNode(courses);
    textArea8.appendChild(text8);
    
    const selectButtonWrapper = document.createElement('div');
    outerDiv3.appendChild(selectButtonWrapper);
    selectButtonWrapper.setAttribute("class", "select-button");
    selectButtonWrapper.innerHTML = '<label><span>Select: </span><input type="checkbox" value="' + item.permalink + '"' + (window.isSelected(item.permalink)?' checked':'') + '></label>'
  }
  const resultsContainer = document.getElementById("career-search-results");
  resultsContainer.appendChild(outerDiv1);
}

function createButtonText(text) { // creates the remove button text
  let part1 = text.split("-");
  //console.log(JSON.stringify(part1));
  if(part1[0] == 'GS') return part1[0]+" "+part1[1]+"-"+part1[2]+" X";
  else {
    let removeButtonText = part1.join(" ") + " X";
    return (' '+removeButtonText).replace(/ [\w]/g, a => a.toLocaleUpperCase()).trim();
  }
}

function getSearch() {
  results = [];
  $.getJSON('/search.json', function(res) { // load all md pages
    // take search and facet(data) selections and iterate through res looking for matches
    res.forEach(item => { // go over all loaded md pages
      data.forEach(obj => { // go over the search and facets selected
        // console.log("Obj: " + JSON.stringify(obj));
        if(obj.id == "keys") { // search only
          Object.keys(item).forEach(key => { // go over all keys 
            if($.inArray(key, searchKeys)) { // if they are in the keys we want searched(searchKeys array)
              /*
              if(obj.keys.indexOf('"') == 0 && obj.keys.indexOf('"', obj.keys.length - 1) == obj.keys.length - 1) { // check for quotes and search for phrase
                console.log(obj.keys);
                if(item[key].match(obj.keys)) { // if there is a match add the match to the results array
                  // add to results if not there already.
                  if(!ifExistsResults(item.title)) {
                    results.push(item);
                  }
                }
              } else { // else split by space and search for individual word */
                let words = obj.keys.split(" ");
                words.forEach(word => { // go through each word
                  if(item[key].match(word)) { // if there is a match add the match to the results array
                    // add to results if not there already.
                    if(!ifExistsResults(item.title)) {
                      results.push(item);
                    }
                  }
                });
              // } split the words in search phrase by space
              // console.log(key, item[key]);
            }
          });
        } else {
          let filters = item.filters.split(" ");
          filters.forEach(filter => {
            // console.log("Both: " + filter.toLowerCase() + " - " + obj.id.toLowerCase());
            if(filter.toLowerCase() == obj.id.toLowerCase()) {
              if(!ifExistsResults(item.title)) {
                results.push(item);
              }
            }
          });
        }
      });
    });

    $("#career-search-results").empty();
    // console.log(results.length);
    if(results.length === 0) {
      createResults(true);
      $("#cfo-page-right").attr("disabled", "disabled");
      $("#cfo-page-left").attr("disabled", "disabled");
    } else {
      count = 0;
      for(i=0; i<results.length-1; i++) {
        if(count <= 9) {
          if(typeof(results[i]) != "undefined" && results[i] !== null) createResults(false, results[i]);
        }
        count++;
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
                  end = 10;
                } else {
                  start = (currentPage - 1) * 10;
                  end = start + 10;
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
                  end = 10;
                } else {
                  start = (currentPage - 1) * 10;
                  end = start + 10;
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
              data.push({
                id: evt.target.id,
                keys: null
              });
              $(this).toggleClass('active');
              const removeButtonA = document.createElement("a");
              removeButtonA.setAttribute("id", evt.target.id+"-button");
              removeButtonA.setAttribute("class", "career-facet-remove-button");
              const removeButtonText = document.createTextNode(createButtonText(evt.target.id));
              removeButtonA.appendChild(removeButtonText);
              const buttonContainer = document.getElementById("career-search-results-filter-remove-buttons");
              buttonContainer.appendChild(removeButtonA);

              getSearch();

              $("#"+evt.target.id+"-button").on('click', function() {
                // console.log("Removing: "+evt.target.id+"-button");
                $("#"+button[0].id).toggleClass('active');
                data = $.grep(data, function(e){ 
                  return e.id != evt.target.id; 
                });
                $("#"+evt.target.id+"-button").remove();
                getSearch();
                //console.log(JSON.stringify(data));
              });
            }

            //console.log(JSON.stringify(data));
          }
        });
    });
  };

}( jQuery ));