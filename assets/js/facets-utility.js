/**
 * Creates a adding and removinf button on the results.
 * Called in two places
 * 1) when any buttons on left spine is clicked
 * 2) when any button on competency group is clicked
 *
 * @param {string} competencyGroup - The group id of the checkbox (not used with buttons)
 * @param {string} competencyTitle - The competency title (not used with buttons)
 * @param {object} removeButtonA - The appending text
 * @param {bool} removeAll - The remove button
 */
let cfoStorage = new cfoStore();
function addRemoveFilterButton(competencyGroup, competencyTitle, removeButtonA, removeAll) {
    let buttonCompetencyContainer = null;
    if (competencyGroup.match("primary") || competencyGroup.match("secondary") || competencyGroup.match("alternate")) {
        buttonCompetencyContainer = document.getElementById("career-search-results-filter-remove-buttons-job-competency");
    }
    else {
        buttonCompetencyContainer = document.getElementById("career-search-results-filter-remove-buttons-general-competency");
    }

    if (!removeAll) {
        //set items to local storage for popups
        let competencyTitlePipeReplaced = competencyTitle.replaceAll(',', '|');
        let groupItem = cfoStorage.getItem(competencyGroup);
        if (groupItem == null) {
            cfoStorage.setItem(competencyGroup, JSON.stringify([competencyTitlePipeReplaced]));
        }
        else {
            let groupItemValue = JSON.parse(groupItem);
            if (!groupItemValue.includes(competencyTitlePipeReplaced)) {
                groupItemValue.push(competencyTitlePipeReplaced);
            }
            else {
                if (facetGlobalVars.removing) {
                    groupItemValue.splice(groupItemValue.indexOf(competencyTitlePipeReplaced), 1);
                    removeTagFilter('checkbox', null, competencyGroup + '-' + competencyTitle.replace(' ', '-'));
                }
            }
            cfoStorage.setItem(competencyGroup, JSON.stringify(groupItemValue));
        }
    }
    else {
        cfoStorage.removeItem(competencyGroup);
    }
    const spanStart = '<span style="border-radius:50%;background-color:white;padding:2px">';
    const spanEnd = '</span>';

    //set item length and name
    const itemLength = removeAll ? 0 : JSON.parse(cfoStorage.getItem(competencyGroup)).length;
    const itemName = ' ' + competencyGroup + ' ' + spanStart + itemLength.toString() + spanEnd;

    //handle button for duplicates
    const subButton = document.getElementById(competencyGroup + "-button");
    if (itemLength == 0) {
        subButton.remove();
        closeDialog();
    }
    if (subButton == null && removeButtonA !== null) {
        removeButtonA.setAttribute("id", competencyGroup + "-button");
        removeButtonA.setAttribute("class", "usa-tag bg-accent-warm margin-top float-left text-black padding-1 margin-1 text-capitalize text-no-underline");
        removeButtonA.innerHTML = itemName;
        buttonCompetencyContainer.appendChild(removeButtonA);
    }

    else {
        let replacedText = subButton.innerHTML.trim().replace(spanStart, '').replace(spanEnd, '');
        let data = replacedText.match(/\w* \d+/g);
        data.forEach(function (item, index) {
            if (replacedText.includes(item) && item.includes(competencyGroup)) {
                subButton.setAttribute("class", "usa-tag bg-accent-warm  margin-top float-left text-black padding-1 margin-1 text-capitalize text-no-underline");
                subButton.innerHTML = replacedText.replace(item, itemName);
            }
        });
    }

    // Set on click event for buttons.
    $(buttonCompetencyContainer).find('.usa-tag').each(function() {
        $(this).unbind('click').on('click', function(e) {
            e.preventDefault();
            let id = $(this).attr('id');
            onSubButtonClick(id.replace('-button', ''))
        });
    });
}

/**
 * Creates a sub button click.
 * Called in one places
 * 1) when a sub button on the competency group is clicked
 *
 * @param {string} id - The id of the object clicked
 * @param {string} competencyGroup - The group id of the checkbox (not used with buttons)
 * @param {string} competencyTitle - The competency title (not used with buttons)
 */
function onPopupSubButtonClick(competencyGroup, id, competencyTitle) {
    const spanStart = '<span style="border-radius:50%;background-color:white;padding:2px">';
    const spanEnd = '</span>';
    let eventTargetId = id.replace('pop', competencyGroup).replace('-button', '');
    $().toggleSelectAll(competencyGroup, false);
    removeTagFilter("checkbox", null, eventTargetId);
    let popupElement = document.getElementById(id);
    if (popupElement != null) {
        popupElement.remove();
    }
    //remove from local storage
    let competencyTitlePipeReplaced = competencyTitle.replaceAll(',', '|').replaceAll('"', '').trim();
    let groupItem = cfoStorage.getItem(competencyGroup);
    if (groupItem != null) {
        let groupItemValue = JSON.parse(groupItem);
        groupItemValue.splice(groupItemValue.indexOf(competencyTitlePipeReplaced), 1);
        cfoStorage.setItem(competencyGroup, JSON.stringify(groupItemValue));
    }

    //set item length and name
    const itemLength = groupItem != null ? JSON.parse(cfoStorage.getItem(competencyGroup)).length : 0;
    const itemName = ' ' + competencyGroup + ' ' + spanStart + itemLength.toString() + spanEnd;


    const subButton = document.getElementById(competencyGroup + "-button");
    
    if (subButton != null) {
        let replacedText = subButton.innerHTML.trim().replace(spanStart, '').replace(spanEnd, '');
        let data = replacedText.match(/\w* \d+/g);
        data.forEach(function (item, index) {
            if (replacedText.includes(item) && item.includes(competencyGroup)) {
                subButton.setAttribute("class", "usa-tag bg-accent-warm  margin-top float-left text-black padding-1 margin-1 text-capitalize text-no-underline");
                subButton.innerHTML = replacedText.replace(item, itemName);
            }
        });
        if (itemLength == 0) {
        subButton.remove();
        closeDialog();
        }
    }
    removeParentContainers(eventTargetId);

}

/**
 * removes a single button.
 * Called in two places
 * 1) when a button is clicked
 * 2) when a checkbox is checked
 *
 * @param {string} inputType - The type of input - button, checkbox
 * @param {string} eventTargetId - The id of the object clicked
 * @param {string} id - The id of the object clicked
 */
function removeTagFilter(inputType, id, eventTargetId) {
    facetGlobalVars.adding = false;
    facetGlobalVars.removing = true;
    if (inputType == "button") $("#" + id).toggleClass("active");
    else {
        if (eventTargetId.indexOf("pop") < 0) {
            let popElement = document.getElementById(eventTargetId.replace('primary', 'pop').replace('secondary', 'pop').replace('alternative', 'pop').replace('personal', 'pop').replace('project', 'pop').replace('leading', 'pop').replace('future-skills', 'pop') + '-button');
            if (popElement != null) {
                popElement.remove();
            }
        }
        eventTargetId = eventTargetId.toLowerCase();
        $("#" + eventTargetId).prop("checked", false);
        let group = $("#" + eventTargetId).data('group');
        if ($("#" + group).is(":checked")) $("#" + group).prop("checked", false);
        if ($("#career-competency-select-all").is(":checked")) $("#career-competency-select-all").prop("checked", false);
    }
    facetGlobalVars.data = $.grep(facetGlobalVars.data, function (e) {
        return e.id != eventTargetId;
    });
    facetGlobalVars.data.forEach(function (i) {
        let givenId = eventTargetId + "-button";
        if (givenId.toLowerCase().startsWith(i.id.toLowerCase())) {
            facetGlobalVars.data = facetGlobalVars.data.filter(x => x.id != i.id);
        }
    });
    removeParentContainers(eventTargetId);

    $().adjustSearchOrder();
    if (facetGlobalVars.data.length == 0) {
        searchOrder = [];
        startingSearchFilter = [];
        $("#career-facet-remove-all-filters-button").css('display', 'none');
        $("#series").css('display', 'none');
        $("#gs").css('display', 'none');
        $("#job-competency").css('display', 'none');
        $("#general-competency").css('display', 'none');
    }
    $("#" + eventTargetId + "-button").remove();
    $().getSearch();
}

/**
 * Creates a competency button.
 * Called in one places
 * 1) when a competencyGroup is clicked
 *
 * @param {string} competencyGroup - The group id of the checkbox (not used with buttons)
 */
function onSubButtonClick(competencyGroup) {
    $("#dtags").html('');
    let groupItem = cfoStorage.getItem(competencyGroup);
    if (groupItem != null) {
        let groupItems = groupItem.replace('[', '').replace(']', '').replace(', ', ' ').split(',');
        let groupItemsLength = groupItems.length;
        groupItems.forEach(function (i) {
            let givenId = "pop-" +
                i.replaceAll('| ', '-')
                .replaceAll('"', '')
                .replaceAll(',', '-')
                .replaceAll(' ', '-')
                .toLowerCase()
                + "-button";
            const removeButtonA = document.createElement("a");
            removeButtonA.setAttribute("id", givenId);
            removeButtonA.setAttribute("tabindex", 0);
            removeButtonA.setAttribute("href", "javascript:void(0)");
            removeButtonA.setAttribute("class", "usa-tag margin-top float-left bg-white border-blue padding-05 margin-1 text-no-uppercase text-no-underline");
            removeButtonA.innerHTML = i.replaceAll('|', ',').replaceAll('"', '') + "&nbsp;&nbsp;<i class='fa fa-times'></i>";
            // if (removeButtonA.getAttribute("onClick") == null) {
            //     removeButtonA.setAttribute("onClick", "onPopupSubButtonClick('" + competencyGroup + "', '" + givenId + "', '" + i + "', '" + JSON.stringify(data) + "');")
            // }
            document.getElementById("dtags").appendChild(removeButtonA);
            groupItemsLength--;
        });
        $("#dialog").dialog({
            width: 600
        });
        $('#dtags .usa-tag').each(function(){
            $(this).unbind('click').on('click', function(e){
                e.preventDefault();
                let id = $(this).attr('id');
                let i = $(this).text();
                onPopupSubButtonClick(competencyGroup, id, i);
            });
        });
    }
}

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
    const competencyFutureSkillsLength = facetGlobalVars.data.filter(i => i.id.indexOf("future-skills") > -1);
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
    if (eventTargetId.match("future-skills")) {
        if (competencyFutureSkillsLength.length == 0) {
            closeDialog();
        }
    }
    if ((competencyPersonalLength.length == 0) && (competencyProjectLength.length == 0) && (competencyLeadingLength.length == 0) && (competencyFutureSkillsLength.length == 0)) {
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