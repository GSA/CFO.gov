/**
 * Set global values.
 */
let facetGlobalVars = {
    data: [], // the array that holds the search terms and the filters
    results: [], // the array that holds the results from searching a filtering
    adding: false, // if adding to results
    removing: false, // if removing from results
    fullSet: [], // a full set of all competency_group and competencies
    competency: [], // array of competencies
    competency_group: [], // array of competency_groups
    searchOrder: [], // hold a list of objects representing the order of a search competency, level, series etc..
    searchKeys: [ // when searching the columns to search - Competency Description, Proficiency Level Definition, Behavioral Illustrations, Relevant Courses
        "title",
        "competency_description",
        "proficiency_level_definition",
        "behavioral_illustrations",
        "relevant_courses",
    ],
    start: 0,
    perPage: parseInt($('select[name="per_page"]').val()) || 10,
    totalItems: 105, // total items in results array
    totalPages: 11, // total pages in results array / pagination items per page
    currentPage: 1, // pagination current page
    inProgressCheckAll: false // is checking all process in progress?
};

/**
 * @file Facets code.
 * Wrap all code with jQuery function.
 */
$(document).ready(function () {

    /**
     * loads all md pages on init
     */
    $.getJSON(window.federalist.path.baseurl + '/search.json', function (res) {

        $('#career-advancement-search-input').val('');
        if ($("#career-competency-select-all").is(":checked")) {
            $("#career-competency-select-all").prop("checked", false);
        }

        res.forEach(item => {
            if (!facetGlobalVars.competency.includes(item.competency)) {
                facetGlobalVars.competency.push(item.competency);
            }
            if (!facetGlobalVars.competency_group.includes(item.competency_group)) {
                facetGlobalVars.competency_group.push(item.competency_group);
            }
            facetGlobalVars.results.push(item);
            facetGlobalVars.fullSet.push(item);
        });

        $("input:checkbox").each(function () {
            $(this).prop('checked', false);
        });

        $("#career-competency-select-all").on("focus", function () {
            $('label[for="career-competency-select-all"]').addClass("padding-05");
            $('label[for="career-competency-select-all"]').css("outline", "0.25rem solid #2491ff");
        });

        $("#career-competency-select-all").on("blur", function () {
            $('label[for="career-competency-select-all"]').removeClass("padding-05");
            $('label[for="career-competency-select-all"]').css("outline", "none");
        });

        $("#job-career-competency-select-all, #general-career-competency-select-all").on('change', function () {
            var id = this.id;
            let comps = Array.from(getVisibleFacets());

            if (id === 'job-career-competency-select-all') {
                var jobSelect = '#job-career-competency-select';
                if ($(jobSelect).text() === 'Select All') {
                    $(jobSelect).html("<strong>De-Select All</strong>");
                    facetGlobalVars.competency_group.forEach(item => {
                        if (comps.some(x => x.group === item.toLowerCase())) {
                            let itemElement = $().createId(item);
                            let eventId = document.getElementById(itemElement);
                            if (eventId.hasAttribute('data-major-group') && eventId.getAttribute('data-major-group') === 'job-specific') {
                                $().toggleSelectAll(itemElement, true);
                            }
                        }
                    });
                } else {
                    $(jobSelect).html("<strong>Select All</strong>");
                    facetGlobalVars.competency_group.forEach(item => {
                        let itemElement = $().createId(item);
                        let eventId = document.getElementById(itemElement);
                        if (eventId.hasAttribute('data-major-group') && eventId.getAttribute('data-major-group') === 'job-specific') {
                            $().toggleSelectAll(itemElement, false);
                        }
                    });
                }
            }
            if (id === 'general-career-competency-select-all') {
                var generalSelect = '#general-career-competency-select';
                if ($(generalSelect).text() === 'Select All') {
                    $(generalSelect).html("<strong>De-Select All</strong>");
                    facetGlobalVars.competency_group.forEach(item => {
                        if (comps.some(x => x.group === $().createId(item))) {
                            let itemElement = $().createId(item);
                            let eventId = document.getElementById(itemElement);
                            if (eventId.hasAttribute('data-major-group') && eventId.getAttribute('data-major-group') === 'general') {
                                $().toggleSelectAll(itemElement, true);
                            }
                        }
                    });
                } else {
                    $(generalSelect).html("<strong>Select All</strong>");
                    facetGlobalVars.competency_group.forEach(item => {
                        let itemElement = $().createId(item);
                        let eventId = document.getElementById(itemElement);
                        if (eventId.hasAttribute('data-major-group') && eventId.getAttribute('data-major-group') === 'general') {
                            $().toggleSelectAll(itemElement, false);
                        }
                    });
                }
            }
            if (!ifExistsInArray('competency', facetGlobalVars.searchOrder)) facetGlobalVars.searchOrder.push('competency');
            let major_group = '';
            if (this.id.includes('job')) {
                major_group = 'job-specific';
            } else if (this.id.includes('general')) {
                major_group = 'general';
            }
            let checked = this.checked;
            facetGlobalVars.inProgressCheckAll = true;
            $('[data-filter="competency"][data-major-group="' + major_group + '"]').each((index, elem) => {
                let $elem = $(elem),
                    comp = $elem.attr('aria-label'),
                    group = $elem.attr('data-group');
                if (comps.some(x => x.comp === comp && x.group.toLowerCase() === group)) {
                    $(elem).prop({checked: checked});
                    if (elem.hasAttribute('data-group')) {
                        $elem.trigger('change');
                    }
                }
            });
            facetGlobalVars.inProgressCheckAll = false;
            $().getSearch();
        });

        // create an array of everything of both disabled and active.
        facetGlobalVars.competency_group.forEach(groupItem => {
            let eventGroupId = $().createId(groupItem);
            if (eventGroupId !== "") {
                facetGlobalVars.competency.forEach(item => {
                    let eventId = $().createId(eventGroupId + " " + item);
                    if (eventId !== "") {
                        $("#" + eventId).on('change', function () {
                            if (this.checked) {
                                if (!ifExistsInArray('competency', facetGlobalVars.searchOrder)) facetGlobalVars.searchOrder.push('competency');
                                if (!ifExists(eventId)) {
                                    createRemoveButtons('checkbox', eventId, this, eventGroupId, item);
                                }
                            } else {
                                let labelId = "#competency-group-label-" + eventGroupId;
                                if ($("#" + eventId).closest('.career-competency-level-4-input-group').css('display') === 'block') {
                                    $(labelId).attr('data-state', 'disabled').html("<strong>Select All</strong>").change();
                                    disableGlobalSelect(eventGroupId);
                                }
                                $("#" + eventId).prop("checked", false);
                                let group = $("#" + eventId).data('group');
                                facetGlobalVars.removing = true;
                                addRemoveFilterButton(group, item, null, false);
                                if ($("#" + group).is(":checked")) $("#" + group).prop("checked", false);
                                if ($("#career-competency-select-all").is(":checked")) {
                                    $("#career-competency-select-all").prop("checked", false);
                                }
                                facetGlobalVars.data = $.grep(facetGlobalVars.data, function (e) {
                                    return e.id !== eventId;
                                });
                                $().adjustSearchOrder();
                                if (facetGlobalVars.data.length === 0) {
                                    facetGlobalVars.searchOrder = [];
                                    resetFilterBlocks();
                                }
                                $("#" + eventId + "-button").remove();
                                if (!facetGlobalVars.inProgressCheckAll) {
                                    $().getSearch();
                                }
                            }
                        });
                    }
                });
            }
        });
        facetGlobalVars.competency_group.forEach(item => {
            let eventId = $().createId(item);
            if (eventId !== "") {
                $("#" + eventId).on("focus", function () {
                    $('label[for="' + eventId + '"]').addClass("padding-05");
                    $('label[for="' + eventId + '"]').css("outline", "0.25rem solid #2491ff");
                });

                $("#" + eventId).on("blur", function () {
                    $('label[for="' + eventId + '"]').removeClass("padding-05");
                    $('label[for="' + eventId + '"]').css("outline", "none");
                });
                $("#" + eventId).unbind('change').on('change', function () {
                    let labelId = "#competency-group-label-" + eventId,
                        checked;
                    if ($(labelId).text() === 'Select All') {
                        $().toggleSelectAll(eventId, true);
                        checked = true;
                    } else {
                        addRemoveFilterButton(eventId, '', null, true);
                        removeParentContainers(eventId);
                        $().toggleSelectAll(eventId, false);
                        disableGlobalSelect(eventId);
                        checked = false;
                    }

                    if (checked) {
                        if (!ifExistsInArray('competency', facetGlobalVars.searchOrder)) {
                            facetGlobalVars.searchOrder.push('competency');
                        }

                        let comps = getVisibleFacets();
                        facetGlobalVars.inProgressCheckAll = true;
                        comps.forEach(x => {
                            if (eventId === x.group) {
                                $('input:checkbox[data-group="' + x.group + '"][aria-label="' + x.comp + '"]').prop({'checked': true}).trigger('change');
                            }
                        });
                        facetGlobalVars.inProgressCheckAll = false;
                        $().getSearch();
                    } else {
                        facetGlobalVars.adding = false;
                        facetGlobalVars.removing = true;
                        $("#" + eventId).prop("checked", false);
                        facetGlobalVars.competency.forEach(competencyItem => {
                            let eventCompetencyId = $().createId(eventId + " " + competencyItem);
                            if ($("#" + eventCompetencyId).data("group") === eventId) {
                                $("#" + eventCompetencyId).prop('checked', false);
                                $("#" + eventCompetencyId + "-button").remove();
                                facetGlobalVars.data = $.grep(facetGlobalVars.data, function (e) {
                                    return e.id !== eventCompetencyId;
                                });
                                $().adjustSearchOrder();
                                if (facetGlobalVars.data.length === 0) {
                                    facetGlobalVars.searchOrder = [];
                                    resetFilterBlocks();
                                }
                            }
                        });
                        $.grep(facetGlobalVars.data, function (e) {
                            return e.id !== eventId;
                        });
                        $().adjustSearchOrder();
                        if (facetGlobalVars.data.length === 0) {
                            resetFilterBlocks();
                        }
                        $("#" + eventId + "-button").remove();
                        if (!facetGlobalVars.inProgressCheckAll) {
                            $().getSearch();
                        }
                    }
                });
            }
        });

        setTotalPages();
    });

    /**
     * Change group Select/De-Select all button.
     * @param {string} eventGroupId - Group id.
     */
    function disableGlobalSelect(eventGroupId) {
        let labelId = $('#' + eventGroupId).data('major-group') === 'job-specific'
            ? 'job-career-competency-select' : 'general-career-competency-select';
        $('#' + labelId).html('<strong>Select All</strong>').next('input').prop('checked', false);
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
            $('#' + labelId).html('<strong>De-Select All</strong>').next('input').prop('checked', true);
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
     * Create a clear all filters button
     */
    function createClearButton() {
        $("#career-facet-remove-all-filters-button").on('click', function () {
            facetGlobalVars.adding = false;
            facetGlobalVars.removing = true;

            facetGlobalVars.data.forEach(item => {
                if (item.keys != null) {
                    $('#career-advancement-search-input').val('');
                    $('#career-advancement-search-input').removeAttr('value');
                } else {
                    if (item.type === 'checkbox') {
                        $("#" + item.id).prop("checked", false);
                        let group = $("#" + item.id).data('group');
                        if ($("#" + group).is(":checked")) $("#" + group).prop("checked", false);
                        if ($("#career-competency-select-all").is(":checked")) $("#career-competency-select-all").prop("checked", false);
                    } else $("#" + item.id).toggleClass('active');
                    $("#" + item.id + "-button").remove();
                }
            })
            facetGlobalVars.data = [];
            facetGlobalVars.searchOrder = [];
            resetFilterBlocks();
            if (!facetGlobalVars.inProgressCheckAll) {
                $().getSearch();
            }

            $('.career-competency-level-3-input-group label[data-state="enabled"]').attr('data-state', 'disable').html('<strong>Select All</strong>').change();
            $("#dialog").dialog().dialog("close");
        });
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
            selectButtonWrapper.innerHTML = '<label><input type="checkbox" value="' + item.permalink + '"' + (window.isSelected(item.permalink) ? ' checked' : '') + '> <span>Select for Download</span></label>'
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
        if (inputType === "button") {
            facetGlobalVars.data.push({
                id: eventTargetId,
                type: 'button',
                keys: null
            });
        } else {
            facetGlobalVars.data.push({
                id: eventTargetId,
                type: 'checkbox',
                keys: null
            });
        }

        facetGlobalVars.adding = true;
        facetGlobalVars.removing = false;
        if (eventTargetId.match("GS")) {
            if (!ifExistsInArray('level', facetGlobalVars.searchOrder)) facetGlobalVars.searchOrder.push('level');
        }
        if (eventTargetId.match("series")) {
            if (!ifExistsInArray('series', facetGlobalVars.searchOrder)) facetGlobalVars.searchOrder.push('series');
        }
        if (facetGlobalVars.data.length === 1) {
            createClearButton();
            $("#career-facet-remove-all-filters-button").css('display', 'block');
        }
        if (inputType === "button") button.toggleClass("active");
        const removeButtonA = document.createElement("a");
        removeButtonA.setAttribute("id", eventTargetId + "-button");
        removeButtonA.setAttribute("tabindex", 0);
        removeButtonA.setAttribute("href", "javascript:void(0)");
        removeButtonA.setAttribute("class", "usa-tag margin-top float-left bg-white text-black border-blue padding-05 margin-1 text-no-uppercase text-no-underline");
        let removeButtonText;
        if (inputType === "button") {
            removeButtonText = createButtonText(eventTargetId);
        } else {
            removeButtonText = (' ' + competencyGroup + " - " + competencyTitle).replace(/ [\w]/g, a => a.toLocaleUpperCase()).trim();
        }

        removeButtonA.innerHTML = removeButtonText + "&nbsp;&nbsp;<i class='fa fa-times'></i>";

        if (eventTargetId.match("series")) {
            const buttonJobContainer = document.getElementById("career-search-results-filter-remove-buttons-series");
            buttonJobContainer.appendChild(removeButtonA);
            $("#series").css('display', 'block');
            $("#btnSeries").attr('aria-expanded', 'false');
            $("#career-search-results-filter-remove-buttons-series").attr("hidden", true);
        }
        if (eventTargetId.match("GS")) {
            const buttonGSContainer = document.getElementById("career-search-results-filter-remove-buttons-gs");
            buttonGSContainer.appendChild(removeButtonA);
            $("#gs").css('display', 'block');
            $("#btnGS").attr('aria-expanded', 'false');
            $("#career-search-results-filter-remove-buttons-gs").attr("hidden", true);
        }
        if (competencyGroup != null) {
            removeButtonA.removeAttribute("class");
            removeButtonA.setAttribute("class", "usa-tag bg-accent-warm margin-top float-left text-black padding-05 margin-1 text-no-uppercase text-no-underline");

            if (eventTargetId.match("primary") || eventTargetId.match("secondary") || eventTargetId.match("alternate")) {
                addRemoveFilterButton(competencyGroup, competencyTitle, removeButtonA, false);
                $("#job-competency").css('display', 'block');
                $("#btnJobCompetency").attr('aria-expanded', 'false');
                $("#career-search-results-filter-remove-buttons-job-competency").attr("hidden", true);
            }
            if (eventTargetId.match("personal") || eventTargetId.match("project") || eventTargetId.match("leading") || eventTargetId.match("future-skills")) {
                addRemoveFilterButton(competencyGroup, competencyTitle, removeButtonA, false);
                $("#general-competency").css('display', 'block');
                $("#btnGeneralCompetency").attr('aria-expanded', 'false');
                $("#career-search-results-filter-remove-buttons-general-competency").attr("hidden", true);
            }
            //if ($("#" + competencyGroup + "-button").onclick == undefined) {
            //    $("#" + competencyGroup + "-button").on('click', function (e) {
            //        e.preventDefault();

            //    });
            //}
        }

        if (!facetGlobalVars.inProgressCheckAll) {
            $().getSearch();
        }

        $("#" + eventTargetId + "-button").on('click', function () {
            removeTagFilter(inputType, button != null && button.length > 0 ? button[0].id : null, eventTargetId);
            if (!facetGlobalVars.inProgressCheckAll) {
                $().getSearch();
            }
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

        if (inputType === 'button') {
            elem.toggleClass('active');
        } else {
            elem.prop('checked', false);
            let group = $("#" + eventTargetId).data('group');
            if ($("#" + group).is(":checked")) {
                $("#" + group).prop("checked", false);
            }
            if ($("#career-competency-select-all").is(":checked")) {
                $("#career-competency-select-all").prop("checked", false);
            }
        }

        let target = -1;
        for (let i = 0, l = facetGlobalVars.data.length; i < l; i++) {
            if (facetGlobalVars.data[i].id === id) {
                target = i;
                break;
            }
        }

        facetGlobalVars.data.splice(target, 1);
        $().adjustSearchOrder();
        if (facetGlobalVars.data.length === 0) {
            facetGlobalVars.searchOrder = [];
            resetFilterBlocks();
        }

        if (!facetGlobalVars.inProgressCheckAll) {
            $().getSearch();
        }
        if (id.match("series")) {
            const seriesLength = facetGlobalVars.data.filter(i => i.id.indexOf("series") > -1);
            if (seriesLength.length === 0) {
                $("#series").css('display', 'none');
            }
        }
        if (id.match("GS")) {
            const gsLength = facetGlobalVars.data.filter(i => i.id.indexOf("GS") > -1);
            if (gsLength.length === 0) {
                $("#gs").css('display', 'none');
            }
        }
    }


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
                                        stringToMatch = stringToMatch.replace(/[^a-zA-Z0-9\s]/g, "").toLowerCase();
                                        if (stringToMatch.match(obj.keys.toLowerCase().replace(/[^a-zA-Z0-9\s]/g, ""))) {
                                            if (!ifExistsResults(item.permalink, newResults)) {
                                                newResults.push(item);
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
            console.log(competencyGroup);
            console.log(status);
            let label = status ? '<strong>De-Select All</strong>' : '<strong>Select All</strong>';
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

    function getVisibleFacets() {
        let filters = {
            series: [],
            level: []
        };
        // breakdown all relevant filters into just ones we're interested in for faceting purposes
        facetGlobalVars.searchOrder.forEach(s => {
            switch (s) {
                case 'series':
                    filters[s] = facetGlobalVars.data.filter(x => x.id.match(/series-/)).map(x => x.id);
                    break;
                case 'level':
                    filters[s] = facetGlobalVars.data.filter(x => x.id.match(/GS-/)).map(x => x.id);
                    break;
            }
        });

        // filters cards to only those that match the selected, relevant filters
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

    /**
     * Enable all competencies if Select All is checked.
     */
    function enableDisabledCompetencies() {
        facetGlobalVars.inProgressCheckAll = true;
        // Check if we need to change label for select/de-select all
        $('.career-competency-level-3-input-group label[data-state="enabled"]').each(function () {
            let compGroup = $(this).next().prop('id');
            $('input[data-filter="competency"][data-group="' + compGroup + '"]:not(:checked)').each(function (index, item) {
                if ($(this).closest('.career-competency-level-4-input-group').css('display') !== 'none') {
                    $(this).prop('checked', true).change();
                }
            });
        });
        facetGlobalVars.inProgressCheckAll = false;
    }

    /**
     * Iterates through all buttons and links and attaches n event to them
     * triggered in _includes/scripts.html
     */
    $.fn.createButtonEvents = function () {
        this.filter("button").each(function () {
            const button = $(this);
            button.on('click', function (evt) {
                evt.preventDefault();
                if (button[0].classList.contains("cfo-page-right") || button[0].classList.contains("cfo-page-left") || button[0].id === "cfo-search-button") {
                    if (button[0].id === "cfo-search-button") {
                        let searchKeyword = $("#career-advancement-search-input").val().trim();
                        if (searchKeyword.length > 0) {
                            if (!ifExistsInArray('search', facetGlobalVars.searchOrder)) facetGlobalVars.searchOrder.push('search');
                            if (facetGlobalVars.data.length) {
                                let searchExists = false;
                                facetGlobalVars.data.forEach(item => {
                                    if (item.id === 'keys') {
                                        item.keys = searchKeyword;
                                        searchExists = true;
                                    }
                                });
                                if (!searchExists) {
                                    facetGlobalVars.data.push({
                                        id: 'keys',
                                        type: 'keys',
                                        keys: searchKeyword
                                    });
                                }
                            } else {
                                facetGlobalVars.data.push({
                                    id: 'keys',
                                    type: 'keys',
                                    keys: searchKeyword
                                });
                            }
                        } else {
                            if (facetGlobalVars.data.length) {
                                let target = -1;
                                for (let i = 0, l = facetGlobalVars.data.length; i < l; i++) {
                                    if (facetGlobalVars.data[i].id === 'keys') {
                                        target = i;
                                        break;
                                    }
                                }
                                if (target !== -1) {
                                    facetGlobalVars.data.splice(target, 1);
                                }
                            }
                            let index = facetGlobalVars.searchOrder.indexOf('search');
                            if (index !== -1) {
                                facetGlobalVars.searchOrder.splice(index, 1);
                            }
                        }
                        createClearButton();
                        $("#career-facet-remove-all-filters-button").css('display', 'block');
                        if (!facetGlobalVars.inProgressCheckAll) {
                            $().getSearch();
                        }
                        return false;
                    } else if (button[0].classList.contains("cfo-page-right")) {
                        if (facetGlobalVars.currentPage < facetGlobalVars.totalPages) {
                            $("#career-search-results").empty();
                            setCurrentPage(facetGlobalVars.currentPage += 1);
                            $(".cfo-pagination-page").text(facetGlobalVars.currentPage);
                            let dataSet = (facetGlobalVars.results.length && facetGlobalVars.searchOrder.length) ? facetGlobalVars.results : facetGlobalVars.fullSet;
                            let end;
                            if (facetGlobalVars.currentPage === 1) {
                                facetGlobalVars.start = 0;
                                end = facetGlobalVars.perPage;
                            } else {
                                facetGlobalVars.start = (facetGlobalVars.currentPage - 1) * facetGlobalVars.perPage;
                                end = Math.min(facetGlobalVars.start + facetGlobalVars.perPage, dataSet.length);
                            }
                            $("#career-search-results").empty();
                            resultFullSetFilter(dataSet);
                            for (i = facetGlobalVars.start; i < end; i++) {
                                if (typeof (dataSet[i]) != "undefined" && facetGlobalVars.results[i] !== null) {
                                    createResults(false, dataSet[i]);
                                }
                            }
                            $(".cfo-page-left").removeAttr("disabled")
                            if (facetGlobalVars.currentPage === facetGlobalVars.totalPages) {
                                $(".cfo-page-right").attr("disabled", "disabled");
                            }
                        } else {
                            $(".cfo-page-right").attr("disabled", "disabled");
                        }
                        $("html, body").animate({scrollTop: 0}, "fast");
                        return false;
                    } else if (button[0].classList.contains("cfo-page-left")) {
                        if (facetGlobalVars.currentPage > 1) {
                            $("#career-search-results").empty();
                            setCurrentPage(facetGlobalVars.currentPage -= 1);
                            $(".cfo-pagination-page").text(facetGlobalVars.currentPage);
                            let dataSet = (facetGlobalVars.results.length && facetGlobalVars.searchOrder.length) ? facetGlobalVars.results : facetGlobalVars.fullSet;
                            let end;
                            if (facetGlobalVars.currentPage === 1) {
                                facetGlobalVars.start = 0;
                                end = facetGlobalVars.perPage;
                            } else {
                                facetGlobalVars.start = (facetGlobalVars.currentPage - 1) * facetGlobalVars.perPage;
                                end = Math.min(facetGlobalVars.start + facetGlobalVars.perPage, dataSet.length);
                            }
                            $("#career-search-results").empty();
                            resultFullSetFilter(dataSet);
                            for (let i = facetGlobalVars.start; i < end; i++) {
                                if (typeof (dataSet[i]) != "undefined" && facetGlobalVars.results[i] !== null) {
                                    createResults(false, dataSet[i]);
                                }
                            }
                            $(".cfo-page-right").removeAttr("disabled");
                            if (facetGlobalVars.currentPage === 1) $(".cfo-page-left").attr("disabled", "disabled");
                        } else {
                            $(".cfo-page-left").attr("disabled", "disabled");
                        }
                        $("html, body").animate({scrollTop: 0}, "fast");
                        return false;
                    }
                } else if (button[0].id.match('competency-group-button')) {
                    $(this).parent().siblings().slideToggle();
                    $(this).find('i').toggleClass('fa-plus fa-minus');
                    // Set aria label
                    let ariaLabel = $(this).find('i').hasClass('fa-plus') ? ', collapsed' : ', expanded';
                    $(this).attr('aria-label', $(this).text() + ariaLabel);
                } else {
                    if (button[0].id.match('series') || button[0].id.match('GS')) {
                        enableDisabledCompetencies();
                    }
                    if (!ifExists(evt.target.id)) {
                        createRemoveButtons('button', evt.target.id, button);
                    } else {
                        removeCriteria('button', evt.target.id);
                    }
                }
            });
        });
    };


    /**
     * Filtering based on the leftspine with series,level,competency_group
     */
    function resultFullSetFilter(resultFullSetFilter) {
        var series_index = ['0501', '0510', '0511', '0560'].slice(0).reverse();
        var level_index = ['7-9', '10-13', '14-15'].slice(0).reverse();
        var competency_group_index = ['Primary', 'Secondary', 'Alternate', 'Personal', 'Project', 'Leading', 'Future Skills'].slice(0).reverse();
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
});
