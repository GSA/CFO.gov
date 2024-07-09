/**
 * For any jquery dom reference, please use a variable where you have a proper documentation.
 */

/**
 * Set global values.
 */
let facetGlobalVars = {
    data: [], // the array that holds the search terms and the filters ed: [{id: 'series-0501', type: 'button', keys: null}]
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

        //Initialize input field
        $('#career-advancement-search-input').val('');
        if ($("#career-competency-select-all").is(":checked")) {
            $("#career-competency-select-all").prop("checked", false); //--- where career-competency-select-all is defined
        }

        // Looping through all the Cards
        res.forEach(item => {
            // Getting all items for competency filter
            if (!facetGlobalVars.competency.includes(item.competency)) {
                facetGlobalVars.competency.push(item.competency);
            }
            // Getting all items for competency  group filter
            if (!facetGlobalVars.competency_group.includes(item.competency_group)) {
                facetGlobalVars.competency_group.push(item.competency_group);
            }
            // by default all items are the result
            facetGlobalVars.results.push(item);
            // by default all items is the full set
            facetGlobalVars.fullSet.push(item);
        });

        // On init, unchecking all checkboxes
        $("input:checkbox").each(function () {
            if(window.location.href.split('/training-resources/').length < 2) {
                $(this).prop('checked', false);
            }
        });

        // For 508 when tabbing on select all for job specific
        $("#job-career-competency-select-all").on("focus", function () {
            $('label[for="job-career-competency-select-all"]').addClass("padding-05");
            $('label[for="job-career-competency-select-all"]').css("outline", "0.25rem solid #2491ff");
        });

        // is this being used ?
        $("#job-career-competency-select-all").on("blur", function () {
            $('label[for="job-career-competency-select-all"]').removeClass("padding-05");
            $('label[for="job-career-competency-select-all"]').css("outline", "none");
        });

        // For 508 when tabbing on select all for  general career
        $("#general-career-competency-select-all").on("focus", function () {
            $('label[for="general-career-competency-select-all"]').addClass("padding-05");
            $('label[for="general-career-competency-select-all"]').css("outline", "0.25rem solid #2491ff");
        });

        // is this being used ?
        $("#general-career-competency-select-all").on("blur", function () {
            $('label[for="general-career-competency-select-all"]').removeClass("padding-05");
            $('label[for="general-career-competency-select-all"]').css("outline", "none");
        });


        //Called when user toggle on on Job Specific Technical Competencies or General Career Competencies
        careerCompetencyOnToggle();

        // create an array of everything of both disabled and active.
        facetGlobalVars.competency_group.forEach(groupItem => {
            let eventGroupId = $().createId(groupItem);
            if (eventGroupId !== "") {
                facetGlobalVars.competency.forEach(item => {
                    let eventId = $().createId(eventGroupId + " " + item);
                    if (eventId !== "") {
                        // if any check box changes
                        $("#" + eventId).on('change', function () {
                            if (this.checked) {
                                if (!ifExistsInArray('competency', facetGlobalVars.searchOrder)) facetGlobalVars.searchOrder.push('competency');
                                if (!ifExists(eventId)) {
                                    createRemoveButtons('checkbox', eventId, this, eventGroupId, item);
                                }
                            } else {
                                let labelId = "#competency-group-label-" + eventGroupId;
                                if ($("#" + eventId).closest('.career-competency-level-4-input-group').css('display') === 'block') {
                                    $(labelId).attr('data-state', 'disabled').html("<strong>SELECT ALL</strong>").change();
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
                                if (!facetGlobalVars.inProgressCheckAll && !/training\-resources/.test(window.location.href)) {
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
                    if ($(labelId).text() === 'SELECT ALL') {
                        $().toggleSelectAll(eventId, true);
                        checked = true;
                    } else {
                        addRemoveFilterButton(eventId, '', null, true);
                        removeParentContainers(eventId);
                        $().toggleSelectAll(eventId, false);
                        disableGlobalSelect(eventId);
                        checked = false;
                        // var url = window.location.href.split('/training-resources/');
                        // if(url.length > 1) {
                        //     enableDisableCompetencies(true);
                        // }

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
                        if (!facetGlobalVars.inProgressCheckAll && !/training\-resources/.test(window.location.href)) {
                            $().getSearch();
                        }
                    }
                });
            }
        });

        setTotalPages();
        bindCoursesLink();
    });

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
                    if (!ifExists(evt.target.id)) {
                        createRemoveButtons('button', evt.target.id, button);
                    } else {
                        removeCriteria('button', evt.target.id);
                    }
                    if (button[0].id.match('series') || button[0].id.match('GS')) {
                        enableDisabledCompetencies();
                    }
                }
            });
        });
    };
});
