
    /**
     * UI: YES
     * @description TODO
     * 
     */
     function careerCompetencyOnToggle() {

        //Triggered when the user clicks on Job Specific Technical Competencies or General Career Competencies
        $("#job-career-competency-select-all, #general-career-competency-select-all").on('change', function () {
            var id = this.id;
            // Return all items filtered by series and level if apllied
            let comps = Array.from(getVisibleFacets());

            // If the user clicked on Job Specific Technical Competencies 
            if (id === 'job-career-competency-select-all') {
                var jobSelect = '#job-career-competency-select';
                // Toggle the text on the UI
                if ($(jobSelect).text() === 'SELECT ALL') {
                    $(jobSelect).html("<strong>DE-SELECT ALL</strong>");
                    $(jobSelect).addClass("active");
                    // competency_group already initialized from all item
                    /**
                     * UI: YES
                     * when a select all for deselect all for  Job Specific is toggle, it will get all the group of the filtered item only, 
                     * if any match job-specific group, it will toggle it
                     */
                    facetGlobalVars.competency_group.forEach(item => {
                        if (comps.some(x => x.group === item.toLowerCase())) {
                            let itemElement = $().createId(item);
                            let eventId = document.getElementById(itemElement);
                            if (eventId.hasAttribute('data-major-group') && eventId.getAttribute('data-major-group') === 'job-specific') {
                                // this toggling if it apply one of the 7 parent competencies
                                $().toggleSelectAll(itemElement, true);
                            }
                        }
                    });
                } else {
                    $(jobSelect).html("<strong>SELECT ALL</strong>");
                    $(jobSelect).removeClass("active");
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
                if ($(generalSelect).text() === 'SELECT ALL') {
                    $(generalSelect).html("<strong>DE-SELECT ALL</strong>");
                    $(generalSelect).addClass("active");
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
                    $(generalSelect).html("<strong>SELECT ALL</strong>");
                    $(generalSelect).removeClass("active");
                    facetGlobalVars.competency_group.forEach(item => {
                        let itemElement = $().createId(item);
                        let eventId = document.getElementById(itemElement);
                        if (eventId.hasAttribute('data-major-group') && eventId.getAttribute('data-major-group') === 'general') {
                            $().toggleSelectAll(itemElement, false);
                        }
                    });
                }
            }
            // Updating  searchOrder, for this filter has been updated with competency filtering 
            if (!ifExistsInArray('competency', facetGlobalVars.searchOrder)) facetGlobalVars.searchOrder.push('competency');
            let major_group = '';
            if (this.id.includes('job')) {
                major_group = 'job-specific';
            } else if (this.id.includes('general')) {
                major_group = 'general';
            }
            let checked = this.checked;
            facetGlobalVars.inProgressCheckAll = true;
            /**
             * All dom input element either for job specific if selected of general career if selected
             */
            $('[data-filter="competency"][data-major-group="' + major_group + '"]').each((index, elem) => {
                let $elem = $(elem),
                    comp = $elem.attr('aria-label'),
                    group = $elem.attr('data-group');
                // from all {competency:val, competency_group:value} from the fitered items on job-seris and gs-level, if it is matching the com or group of the imput element from the dom, 
                if (comps.some(x => x.comp === comp && x.group.toLowerCase() === group)) {
                    $(elem).prop({checked: checked});
                    if (elem.hasAttribute('data-group')) {
                        $elem.trigger('change');// Force the element to trigger a change that will call another function for filtering.
                    }
                }
            });
            facetGlobalVars.inProgressCheckAll = false;
            $().getSearch();
        });
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
        removeButtonA.setAttribute("class", "usa-tag margin-top float-left bg-white text-color border-blue padding-05 margin-1 text-no-uppercase text-no-underline");
        let removeButtonText;
        if (inputType === "button") {
            removeButtonText = createButtonText(eventTargetId);
        } else {
            removeButtonText = (' ' + competencyGroup + " - " + competencyTitle).replace(/ [\w]/g, a => a.toLocaleUpperCase()).trim();
        }
        removeButtonA.setAttribute("aria-label", "Remove "+ removeButtonText + " filter");
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
            removeButtonA.setAttribute("class", "usa-tag bg-filter margin-top float-left text-color padding-05 margin-1 text-no-uppercase text-no-underline");

            if (eventTargetId.match("primary") || eventTargetId.match("secondary") || eventTargetId.match("alternate")) {
                addRemoveFilterButton(competencyGroup, competencyTitle, removeButtonA, false);
                $("#job-competency").css('display', 'block');
                $("#btnJobCompetency").attr('aria-expanded', 'false');
                $("#career-search-results-filter-remove-buttons-job-competency").attr("hidden", true);
            }
            if (eventTargetId.match("personal") || eventTargetId.match("leading") || eventTargetId.match("project")) {
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
        $().getSearch();
    }
