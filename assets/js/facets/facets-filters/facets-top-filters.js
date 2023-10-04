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
     const spanStart = '<span class="competencies-button">';
     const spanEnd = '</span>';
 
     //set item length and name
     const itemLength = removeAll ? 0 : JSON.parse(cfoStorage.getItem(competencyGroup)).length;
     const itemName = ' ' + competencyGroup + ' ' + spanStart + itemLength.toString() + spanEnd;
 
     //handle button for duplicates
     const subButton = document.getElementById(competencyGroup + "-button");
     if (itemLength == 0 && subButton !== null) {
         subButton.remove();
         closeDialog();
     }
     if (subButton == null && removeButtonA !== null) {
         removeButtonA.setAttribute("id", competencyGroup + "-button");
         removeButtonA.setAttribute("class", "usa-tag bg-filter margin-top float-left text-color padding-1 margin-1 text-capitalize text-no-underline");
         removeButtonA.innerHTML = itemName;
         removeButtonA.setAttribute("aria-label", itemName);
         buttonCompetencyContainer.appendChild(removeButtonA);
     }
 
     else if (subButton !== null) {
         let replacedText = subButton.innerHTML.trim().replace(spanStart, '').replace(spanEnd, '');
         let data = replacedText.match(/\w* \d+/g);
         data.forEach(function (item, index) {
             if (replacedText.includes(item) && item.includes(competencyGroup)) {
                 subButton.setAttribute("class", "usa-tag bg-filter  margin-top float-left text-color padding-1 margin-1 text-capitalize text-no-underline");
                 subButton.innerHTML = replacedText.replace(item, itemName);
                 subButton.setAttribute("aria-label", itemName);
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
    const spanStart = '<span class="competencies-button">';
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
    //$(this).attr('aria-label', $(this).text() + ariaLabel); 
    //$('<button type="button" data-role="none" role="button" tabindex="0" />').attr('aria-label', 'Slide: ' + (i + 1));

    const subButton = document.getElementById(competencyGroup + "-button");
    
    if (subButton != null) {
        let replacedText = subButton.innerHTML.trim().replace(spanStart, '').replace(spanEnd, '');
        let data = replacedText.match(/\w* \d+/g);
        data.forEach(function (item, index) {
            if (replacedText.includes(item) && item.includes(competencyGroup)) {
                subButton.setAttribute("class", "usa-tag bg-filter  margin-top float-left text-color padding-1 margin-1 text-capitalize text-no-underline");
                subButton.innerHTML = replacedText.replace(item, itemName);
                subButton.setAttribute("aria-label", itemName);
            }
        });
        if (itemLength == 0) {
        subButton.remove();
        closeDialog();
        }
    }
    // removeParentContainers(eventTargetId);
    if (!facetGlobalVars.inProgressCheckAll) {
        $().getSearch();
    }
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
        groupItems.sort();
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
            removeButtonA.setAttribute("aria-label", "Remove "+ i.replaceAll('|', ',').replaceAll('"', '') + " filter");
            removeButtonA.innerHTML = i.replaceAll('|', ',').replaceAll('"', '') + "&nbsp;&nbsp;<i class='fa fa-times'></i>";
            // if (removeButtonA.getAttribute("onClick") == null) {
            //     removeButtonA.setAttribute("onClick", "onPopupSubButtonClick('" + competencyGroup + "', '" + givenId + "', '" + i + "', '" + JSON.stringify(data) + "');")
            // }
            document.getElementById("dtags").appendChild(removeButtonA);
            groupItemsLength--;
        });
        $("#dialog").dialog({
            width: 600,
            title: competencyGroup.charAt(0).toUpperCase() + competencyGroup.slice(1),
            open: function (event, ui) { $('.ui-dialog').attr('aria-describedby', competencyGroup); }
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
            let popElement = document.getElementById(eventTargetId.replace('primary', 'pop').replace('secondary', 'pop').replace('alternative', 'pop').replace('personal', 'pop').replace('project', 'pop').replace('leading', 'pop') + '-button');
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
        let givenId = $().createId(eventTargetId);
        if (givenId === i.id) {
            facetGlobalVars.data = facetGlobalVars.data.filter(x => x.id != i.id);
        }
    });
    removeParentContainers(eventTargetId);

    $().adjustSearchOrder();
    if (facetGlobalVars.data.length == 0) {
        facetGlobalVars.searchOrder = [];
        $("#career-facet-remove-all-filters-button").css('display', 'none');
        $("#series").css('display', 'none');
        $("#gs").css('display', 'none');
        $("#job-competency").css('display', 'none');
        $("#general-competency").css('display', 'none');
    }
    $("#" + eventTargetId + "-button").remove();
}

/**
     * Create a clear all filters button
     */
 function createClearButton() {
    $("#career-facet-remove-all-filters-button").on('click', function () {
        location.reload();
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

        //Changing the state of all the select all button from "de-select all" to "select all"
        $('.career-competency-level-3-input-group label[data-state="enabled"]').attr('data-state', 'disable').html('<strong>SELECT ALL</strong>').change();
        $('#job-career-competency-select, #general-career-competency-select').html('<strong>SELECT ALL</strong>').change();
        $("#dialog").dialog().dialog("close");
    });
}