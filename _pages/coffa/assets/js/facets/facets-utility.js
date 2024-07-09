


/**
 * Rermoves a parent container.
 * Called in two places
 * 1) when removes a button
 * 2) when unchecking
 *
 * @param {string} eventTargetId - The id of the object clicked
 */
function removeParentContainers(eventTargetId) {
    if (eventTargetId.match("series")) {
        const seriesLength = facetGlobalVars.data.filter(i => i.id.indexOf("series") > -1);
        if (seriesLength == 0) {
            $("#series").css('display', 'none');
        }
    }
    if (eventTargetId.match("GS")) {
        const gsLength = facetGlobalVars.data.filter(i => i.id.indexOf("GS") > -1);
        if (gsLength.length == 0) {
            $("#gs").css('display', 'none');
        }
    }
    const competencyPrimaryLength = facetGlobalVars.data.filter(i => i.id.indexOf("primary") > -1);
    const competencySecondaryLength = facetGlobalVars.data.filter(i => i.id.indexOf("secondary") > -1);
    const competencyAlternateLength = facetGlobalVars.data.filter(i => i.id.indexOf("alternate") > -1);
    if (eventTargetId.match("primary")) {
        if (competencyPrimaryLength.length == 0) {
            closeDialog();
        }
    }
    if (eventTargetId.match("secondary")) {
        if (competencySecondaryLength.length == 0) {
            closeDialog();
        }
    }
    if (eventTargetId.match("alternate")) {
        if (competencyAlternateLength.length == 0) {
            closeDialog();
        }
    }
    if ((competencyPrimaryLength.length == 0) && (competencySecondaryLength.length == 0) && (competencyAlternateLength.length == 0)) {
        $("#job-competency").css('display', 'none');
    }
    const competencyPersonalLength = facetGlobalVars.data.filter(i => i.id.indexOf("personal") > -1);
    const competencyProjectLength = facetGlobalVars.data.filter(i => i.id.indexOf("project") > -1);
    const competencyLeadingLength = facetGlobalVars.data.filter(i => i.id.indexOf("leading") > -1);
    if (eventTargetId.match("personal")) {
        if (competencyPersonalLength.length == 0) {
            closeDialog();
        }
    }
    if (eventTargetId.match("project")) {
        if (competencyProjectLength.length == 0) {
            closeDialog();
        }
    }
    if (eventTargetId.match("leading")) {
        if (competencyLeadingLength.length == 0) {
            closeDialog();
        }
    }
    if ((competencyPersonalLength.length == 0) && (competencyProjectLength.length == 0) && (competencyLeadingLength.length == 0)) {
        $("#general-competency").css('display', 'none');
    }
}

function closeDialog() {
    if (isDialogOpen()) {
        $("#dialog").dialog("close");
    }
}

function isDialogOpen() {
    return $("#dialog").hasClass('ui-dialog-content');
}

/**
 * Change group Select/De-Select all button.
 * @param {string} eventGroupId - Group id.
 */
function disableGlobalSelect(eventGroupId) {
    let labelId = $('#' + eventGroupId).data('major-group') === 'job-specific'
        ? 'job-career-competency-select' : 'general-career-competency-select';
    $('#' + labelId).html('<strong>SELECT ALL</strong>').removeClass("active").next('input').prop('checked', false);
}

/**
 * Change group Select/De-Select all button.
 * @param {string} eventGroupId - Group id.
 */
 function enableGlobalSelect(eventGroupId) {
    let majorGroup = $('#' + eventGroupId).data('major-group');
    let status = true;
    $('input.text-offscreen[data-major-group="' + majorGroup + '"]').each(function() {
        if ($(this).prev('label').attr('data-state') !== 'enabled') {
            status = false;
        }
    });
    if (status) {
        let labelId = $('#' + eventGroupId).data('major-group') === 'job-specific'
            ? 'job-career-competency-select' : 'general-career-competency-select';
        $('#' + labelId).html('<strong>DE-SELECT ALL</strong>').addClass("active").next('input').prop('checked', true);
    }
}

/**
     * returns the type of filter
     * @param {string} id a button id
     * @returns - series, level or competency
     */
 function getFilterType(id) {
    const series = new RegExp('series-*');
    const level = new RegExp('GS-*');
    if (series.test(id)) return 'series';
    else if (level.test(id)) return 'level';
    return 'competency';
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
        if (item === elm) exists = true;
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
        if (item.permalink === title) exists = true;
    });
    return exists;
}

/**
     * creates the remove button text
     * @param {string} text - text to converted to name
     * @returns button text
     */
 function createButtonText(text) {
    let part1 = text.split("-");
    if (part1[0] === 'GS') return part1[0] + " " + part1[1] + "-" + part1[2];
    else {
        let removeButtonText = part1.join(" ");
        return (' ' + removeButtonText).replace(/ [\w]/g, a => a.toLocaleUpperCase()).trim();
    }
}

 /**
     * Iterates through all checkboxes in results array and disable those that have no results.
     * If in all mode it iterates through the full set and enables all checkboxes.
     * @param {bool} all - if enable all checkboxes
     */
  function enableDisableCompetencies(all) {
    if (all) {
        $('[data-filter="competency"]').parents('.career-competency-level-4-input-group, .career-competency-level-3-input-group').show();
    } else {
        // hide everything
        $('[data-filter="competency"]').parents('.career-competency-level-4-input-group').hide();

        // and then selectively show what we want
        let comps = getVisibleFacets();
        comps.forEach((item) => {
            $('[data-filter="competency"][data-group="' + item.group + '"][title="' + item.comp + '"]').parents('.career-competency-level-4-input-group').show();
        });

        // hide all competency groups
        $('[data-filter="competency"]').parents('.career-competency-level-3-input-group').hide();

        comps.forEach((item) => {
            $('[data-filter="competency"][data-id="' + item.group + '"]').parents('.career-competency-level-3-input-group').show();
        });
        cleanUpData();
    }
}

 /**
     * Filtering based on the leftspine with series,level,competency_group
     */
  function resultFullSetFilter(resultFullSetFilter) {
    var series_index = ['0501', '0510', '0511', '0560'].slice(0).reverse();
    var level_index = ['7-9', '10-13', '14-15'].slice(0).reverse();
      var competency_group_index = ['Primary', 'Secondary', 'Alternate', 'Personal', 'Leading', 'Project'].slice(0).reverse();
    resultFullSetFilter.sort((a, b) => {
        const aseries_index = -series_index.indexOf(a.series);
        const bseries_index = -series_index.indexOf(b.series);
        const alevel_index = -level_index.indexOf(a.level);
        const blevel_index = -level_index.indexOf(b.level);
        const acompetency_group_index = -competency_group_index.indexOf(a.competency_group);
        const bcompetency_group_index = -competency_group_index.indexOf(b.competency_group);
        return aseries_index - bseries_index || alevel_index - blevel_index || acompetency_group_index - bcompetency_group_index;

    });
}

/**
 * Reset filter accordions and search filters.
 */
function resetFilterBlocks() {
    $("#career-facet-remove-all-filters-button").css('display', 'none');
    $("#series").css('display', 'none');
    $("#gs").css('display', 'none');
    $("#job-competency").css('display', 'none');
    $("#general-competency").css('display', 'none');
}

 /**
     * returns if a search or facet filter exists in the data array
     * @param {string} id the id of the element
     * @returns bool
     */
  function ifExists(id) {
    let exists = false;
    facetGlobalVars.data.forEach(item => {
        if (item.id === id) exists = true;
    });
    return exists;
}

/**
     * sets totalItems in results array
     */
 function setTotalItems() {
    facetGlobalVars.totalItems = facetGlobalVars.results.length;
}

/**
 * sets totalPages for pagination
 */
function setTotalPages() {
    if (!facetGlobalVars.results.length) {
        if (facetGlobalVars.searchOrder.length) {
            facetGlobalVars.totalPages = 0;
        } else {
            facetGlobalVars.totalPages = Math.ceil(facetGlobalVars.fullSet.length / facetGlobalVars.perPage);
        }
    } else {
        facetGlobalVars.totalPages = Math.ceil(facetGlobalVars.results.length / facetGlobalVars.perPage);
    }
}

/**
 * sets currentPage for pagination
 * @param {string} page - integer representing the current page of pagination
 */
function setCurrentPage(page) {
    facetGlobalVars.currentPage = page;
}

    /**
     * UI: NO
     * @descriptions Filter all the set of card an return the item filter with any series or level filter applied in this structure: {competency:val, competency_group:value}
     * @returns 
     */
     function getVisibleFacets() {
        let filters = {
            series: [],
            level: []
        };
        // breakdown all relevant filters into just ones we're interested in for faceting purposes
        facetGlobalVars.searchOrder.forEach(s => {
            switch (s) {
                case 'series':
                    // return all filters under series filter
                    filters[s] = facetGlobalVars.data.filter(x => x.id.match(/series-/)).map(x => x.id);
                    break;
                case 'level':
                    // return all filter under level filter
                    filters[s] = facetGlobalVars.data.filter(x => x.id.match(/GS-/)).map(x => x.id);
                    break;
            }
        });

        // filters cards to only those that match the selected, relevant filters
        // Will only return cards already filtered by series and level
        let items = facetGlobalVars.fullSet.filter((item) => {
            let series_check = (filters.series.length === 0 || filters.series.some((y) => {
                    return item.filters.includes(y);
                })),
                level_check = (filters.level.length === 0 || filters.level.some((y) => {
                    return item.filters.includes(y);
                }));

            return series_check && level_check;
        });
        return new Set(items.map((item) => {
            return {comp: item.competency, group: item.competency_group.toLowerCase().replace(' ', '-')};
        }));
    }

    /**
     * Remove hidden facets from the data array.
     */
     function cleanUpData() {
        // and then selectively show what we want
        let comps = getVisibleFacets();
        // create values array from the facets array
        let enabledFacets = [];
        let notIncluded;
        comps.forEach((item) => {
            enabledFacets.push(item.group + '-' + $().createId(item.comp));
        });

        notIncluded = facetGlobalVars.data.filter(function (dataItem) {
            return (dataItem.type === 'checkbox' && !enabledFacets.includes(dataItem.id));
        });
        facetGlobalVars.data = facetGlobalVars.data.filter(function (dataItem) {
            return (dataItem.type !== 'checkbox' || (dataItem.type === 'checkbox' && enabledFacets.indexOf(dataItem.id) !== -1));
        });
        // Reset competencies on cfoStorage.
        if (notIncluded.length) {
            notIncluded.forEach((item) => {
                $('#' + item.id + ':checked').prop('checked', false).change();
            });
        }

}


function bindCoursesLink() {
    $(".course-list .show-more:not(.click-init)").each(function() {
        $(this).addClass('click-init');
        $(this).on("click", function () {
            var $this = $(this);
            var $fullList = $this.closest(".course-list").find(".full-list");
            var $courseList = $this.closest(".course-list");
            var moreText = $this.data("more-text");
            var lessText = $this.data("less-text");
            var index = $this.data("index");
            $this.addClass('click-init');
            $fullList.slideToggle();

            if ($this.text() === moreText) {
                $this.text(lessText);
                $this.attr("aria-label", lessText + " Card number " + index);
            } else {
                $('html, body').animate({ scrollTop: $courseList.offset().top }, 500);
                $this.text(moreText);
                $this.attr("aria-label", moreText + " Card number " + index);
            }
        });
    });
}