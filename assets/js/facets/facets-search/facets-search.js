$.fn.extend({
    /**
     * adjusts the searchOrder array
     */
    adjustSearchOrder: function () {
        let newSearchOrder = [];
        facetGlobalVars.data.forEach(item => {
            if (item.type === 'keys') {
                if (!ifExistsInArray('search', newSearchOrder)) {
                    newSearchOrder.push('search');
                }
            } else {
                if (!ifExistsInArray(getFilterType(item.id), newSearchOrder)) {
                    newSearchOrder.push(getFilterType(item.id));
                }
            }
        });
        facetGlobalVars.searchOrder = [];
        newSearchOrder.forEach(item => {
            facetGlobalVars.searchOrder.push(item);
        });
    },

    /**
     * Iterates over the searchOrder array and creates results based upon the filters selected
     * Uses enableDisableCompetencies and the createResults
     */
    getSearch: function () {
        // console.log(facetGlobalVars);
        facetGlobalVars.results = [];
        // create a count of the the items displayed and display it.
        // count all search results for an item as a sanity check and make a spread sheet.
        if (facetGlobalVars.searchOrder.length > 0) {
            facetGlobalVars.searchOrder.forEach((searchItem, index) => {
                let newResults = [];
                if (searchItem === 'search') {
                    // create a results array for the next search criteria
                    facetGlobalVars.fullSet.forEach(item => { // go over all loaded md pages
                        facetGlobalVars.searchKeys.forEach(term => {
                            facetGlobalVars.data.forEach(obj => { // go over the search and facets selected
                                if (obj.type === 'keys' && typeof item[term] !== "undefined") {
                                    let stringToMatch = Array.isArray(item[term]) ? item[term].join(' ') : item[term];
                                    if (stringToMatch !== null) {
                                        stringToMatch = stringToMatch.replace(/[^a-zA-Z0-9\s]/g, "").toLowerCase();
                                        if (stringToMatch.match(obj.keys.toLowerCase().replace(/[^a-zA-Z0-9\s]/g, ""))) {
                                            if (!ifExistsResults(item.permalink, newResults)) {
                                                newResults.push(item);
                                            }
                                        }
                                    }
                                }
                            });
                        });
                    });
                } else {
                    // create a results array for the next search criteria
                    facetGlobalVars.fullSet.forEach(item => { // go over all loaded md pages
                        facetGlobalVars.data.forEach(obj => { // go over the search and facets selected
                            if (getFilterType(obj.id) === searchItem) {
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

                                if (val.toLowerCase() === obj.id.toLowerCase()) {
                                    if (!ifExistsResults(item.permalink, newResults)) {
                                        newResults.push(item);
                                    }
                                }
                            }
                        });
                    });
                }

                // look for new filters in prior results set and if they are there
                // save the prior results in to a different array.
                let finishResults = [];
                if (facetGlobalVars.results.length > 0) {
                    facetGlobalVars.results.forEach(item => {
                        newResults.forEach(newItem => {
                            if (item.permalink.toLowerCase() === newItem.permalink.toLowerCase()) {
                                if (!ifExistsResults(item.permalink, finishResults)) {
                                    finishResults.push(item);
                                }
                            }
                        });
                    });
                } else {
                    finishResults = newResults;
                }

                // populate results with finishResults
                facetGlobalVars.results = [];
                finishResults.forEach(item => {
                    if (!ifExistsResults(item.title, facetGlobalVars.results)) {
                        facetGlobalVars.results.push(item);
                    }
                });
            });
            enableDisableCompetencies(false);
            $("#career-search-results").empty();

            if (facetGlobalVars.results.length === 0) {
                if (facetGlobalVars.searchOrder.length === 0) {
                    for (i = 0; i < Math.min(facetGlobalVars.fullSet.length, facetGlobalVars.perPage); i++) {
                        if (typeof (facetGlobalVars.fullSet[i]) != "undefined" && facetGlobalVars.fullSet[i] !== null) {
                            createResults(false, facetGlobalVars.fullSet[i]);
                        }
                    }
                    $(".cfo-pagination-results").text(facetGlobalVars.fullSet.length);
                } else {
                    createResults(true);
                    setTotalItems();
                    $(".cfo-pagination-results").text(facetGlobalVars.totalItems);
                    $(".cfo-page-right").attr("disabled", "disabled");
                    $(".cfo-page-left").attr("disabled", "disabled");
                }
            } else {
                resultFullSetFilter(facetGlobalVars.results);
                for (i = 0; i < Math.min(facetGlobalVars.results.length, facetGlobalVars.perPage); i++) {
                    if (typeof (facetGlobalVars.results[i]) != "undefined" && facetGlobalVars.results[i] !== null) {
                        createResults(false, facetGlobalVars.results[i]);
                    }
                }
                $(".cfo-page-left").attr("disabled", "disabled");
                $(".cfo-page-right").removeAttr("disabled");

                setTotalItems();
                $(".cfo-pagination-results").text(facetGlobalVars.totalItems);
            }

            setCurrentPage(1);
            $(".cfo-pagination-page").text(facetGlobalVars.currentPage);
            setTotalPages();
            $(".cfo-pagination-pages").text(facetGlobalVars.totalPages);
        } else {
            $("#career-search-results").empty();
            resultFullSetFilter(facetGlobalVars.fullSet);
            for (i = 0; i < Math.min(facetGlobalVars.fullSet.length, facetGlobalVars.perPage); i++) {
                if (typeof (facetGlobalVars.fullSet[i]) != "undefined" && facetGlobalVars.fullSet[i] !== null) {
                    createResults(false, facetGlobalVars.fullSet[i]);
                }
            }
            $(".cfo-pagination-results").text(facetGlobalVars.fullSet.length);
            setCurrentPage(1);
            $(".cfo-pagination-page").text(facetGlobalVars.currentPage);
            setTotalPages();
            $(".cfo-pagination-pages").text(facetGlobalVars.totalPages);
            enableDisableCompetencies(true);
        }
        unselectAll();

        if (facetGlobalVars.results.length === 0 && facetGlobalVars.data.length === 0) {
            facetGlobalVars.results = facetGlobalVars.fullSet;
            $('#career-facet-remove-all-filters-button').hide();
        }
    },

    /**
     * creates an id from a space and/or comma delimited string
     * @param {string} item - a string with spaces and/or commas
     * @returns - a string delimited with dashes(-)
     */
    createId: function (item) {
        let newStr = item.replaceAll(', ', '-');
        let finalStr = newStr.replaceAll(' ', '-');
        return finalStr.toLowerCase();
    },


    /**
     * Toggle Select/De-Select all button.
     * @param {string} competencyGroup competency group
     * @param {boolean} status True for enable De-Select All button
     */
    toggleSelectAll: function (competencyGroup, status) {
        let label = status ? '<strong>DE-SELECT ALL</strong>' : '<strong>SELECT ALL</strong>';
        let state = status ? 'enabled' : 'disabled';
        $('#competency-group-label-' + competencyGroup).attr('data-state', state).html(label).change();
        if (!status) {
            disableGlobalSelect(competencyGroup);
        } else {
            // Check global Select All status and set if it needed.
            enableGlobalSelect(competencyGroup);
        }
    }
});
