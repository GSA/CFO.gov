
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
        let competencyTitlePipeReplaced = competencyTitle.replace(',', '|');
        let groupItem = localStorage.getItem(competencyGroup);
        if (groupItem == null) {
            localStorage.setItem(competencyGroup, JSON.stringify([competencyTitlePipeReplaced]));
        }
        else {
            let groupItemValue = JSON.parse(groupItem);
            if (!groupItemValue.includes(competencyTitlePipeReplaced)) {
                groupItemValue.push(competencyTitlePipeReplaced);
            }
            else {
                if (removing) {
                    groupItemValue.splice(groupItemValue.indexOf(competencyTitlePipeReplaced), 1);
                    removeTagFilter('checkbox', null, competencyGroup + '-' + competencyTitle.replace(' ', '-'));
                }
            }
            localStorage.setItem(competencyGroup, JSON.stringify(groupItemValue));
        }
    }
    else {
        localStorage.removeItem(competencyGroup);
    }
    const spanStart = '<span style="border-radius:50%;background-color:white;padding:2px">';
    const spanEnd = '</span>';

    //set item length and name
    const itemLength = removeAll ? 0 : JSON.parse(localStorage.getItem(competencyGroup)).length;
    const itemName = ' ' + competencyGroup + ' ' + spanStart + itemLength.toString() + spanEnd;

    //handle button for duplicates
    const subButton = document.getElementById(competencyGroup + "-button");

    if (subButton == null) {
        removeButtonA.setAttribute("id", competencyGroup + "-button");
        removeButtonA.setAttribute("class", "usa-tag bg-accent-warm text-black padding-1 margin-1 text-capitalize text-no-underline");
        if (removeButtonA.getAttribute("onClick") == null) {
            removeButtonA.setAttribute("onClick", "onSubButtonClick('" + competencyGroup + "');")
        }
        removeButtonA.innerHTML = itemName;
        buttonCompetencyContainer.appendChild(removeButtonA);
    }

    else {
        let replacedText = subButton.innerHTML.trim().replace(spanStart, '').replace(spanEnd, '');
        let data = replacedText.match(/\w* \d+/g);
        data.forEach(function (item, index) {
            if (replacedText.includes(item) && item.includes(competencyGroup)) {
                subButton.setAttribute("class", "usa-tag bg-accent-warm text-black padding-1 margin-1 text-capitalize text-no-underline");
                subButton.innerHTML = replacedText.replace(item, itemName);
            }
        });
    }
}

function onPopupSubButtonClick(competencyGroup, id, competencyTitle) {
    const spanStart = '<span style="border-radius:50%;background-color:white;padding:2px">';
    const spanEnd = '</span>';
    let eventTargetId = id.replace('pop', competencyGroup).replace('-button', '').toLowerCase();
    removeTagFilter("checkbox", null, eventTargetId);
    let popupElement = document.getElementById(id);
    if (popupElement != null) {
        popupElement.remove();
    }
    //remove from local storage
    let competencyTitlePipeReplaced = competencyTitle.replace(',', '|');
    let groupItem = localStorage.getItem(competencyGroup);
    if (groupItem != null) {
        let groupItemValue = JSON.parse(groupItem);
        groupItemValue.splice(groupItemValue.indexOf(competencyTitlePipeReplaced), 1);
        localStorage.setItem(competencyGroup, JSON.stringify(groupItemValue));
    }

    //set item length and name
    const itemLength = groupItem != null ? JSON.parse(localStorage.getItem(competencyGroup)).length : 0;
    const itemName = ' ' + competencyGroup + ' ' + spanStart + itemLength.toString() + spanEnd;


    const subButton = document.getElementById(competencyGroup + "-button");
    if (subButton != null) {
        let replacedText = subButton.innerHTML.trim().replace(spanStart, '').replace(spanEnd, '');
        let data = replacedText.match(/\w* \d+/g);
        data.forEach(function (item, index) {
            if (replacedText.includes(item) && item.includes(competencyGroup)) {
                subButton.setAttribute("class", "usa-tag bg-accent-warm text-black padding-05 margin-1 text-capitalize text-no-underline");
                subButton.innerHTML = replacedText.replace(item, itemName);
            }
        });
    }
}

function removeTagFilter(inputType, id, eventTargetId) {
    // console.log("Removing: "+eventTargetId+"-button");
    adding = false;
    removing = true;
    if (inputType == "button") $("#" + id).toggleClass("active");
    else {
        if (eventTargetId.indexOf("pop") < 0) {
            let popElement = document.getElementById(eventTargetId.replace('primary', 'pop').replace('secondary', 'pop').replace('alternative', 'pop') + '-button');
            if (popElement != null) {
                popElement.remove();
            }
        }
        $("#" + eventTargetId).prop("checked", false);
        let group = $("#" + eventTargetId).data('group');
        if ($("#" + group).is(":checked")) $("#" + group).prop("checked", false);
        if ($("#career-competency-select-all").is(":checked")) $("#career-competency-select-all").prop("checked", false);
    }
    data = $.grep(data, function (e) {
        return e.id != eventTargetId;
    });
    data.forEach(function (i) {
        let givenId = eventTargetId + "-button";
        if (i.id.indexOf(givenId) > -1) {
            data = data.filter(x => x.id != givenId);
        }
    });

    if (eventTargetId.match("series")) {
        const seriesLength = data.filter(i => i.id.indexOf("series") > -1);
        if (seriesLength == 0) {
            $("#series").css('display', 'none');
        }
    }
    if (eventTargetId.match("GS")) {
        const gsLength = data.filter(i => i.id.indexOf("GS") > -1);
        if (gsLength.length == 0) {
            $("#gs").css('display', 'none');
        }
    }
    if (eventTargetId.match("primary")) {
        const competencyPrimaryLength = data.filter(i => i.id.indexOf("primary") > -1);
        if (competencyPrimaryLength.length == 0) {
            $("#dialog").dialog("close");
        }
    }
    if (eventTargetId.match("secondary")) {
        const competencySecondaryLength = data.filter(i => i.id.indexOf("secondary") > -1);
        if (competencySecondaryLength.length == 0) {
            $("#dialog").dialog("close");
        }
    }
    if (eventTargetId.match("alternate")) {
        const competencyAlternateLength = data.filter(i => i.id.indexOf("alternate") > -1);
        if (competencyAlternateLength.length == 0) {
            $("#dialog").dialog("close");
        }
    }
    if (eventTargetId.match("personal")) {
        const competencyPersonalLength = data.filter(i => i.id.indexOf("personal") > -1);
        if (competencyPersonalLength.length == 0) {
            $("#dialog").dialog("close");
        }
    }
    if (eventTargetId.match("project")) {
        const competencyProjectLength = data.filter(i => i.id.indexOf("project") > -1);
        if (competencyProjectLength.length == 0) {
            $("#dialog").dialog("close");
        }
    }
    if (eventTargetId.match("leading")) {
        const competencyLeadingLength = data.filter(i => i.id.indexOf("leading") > -1);
        if (competencyLeadingLength.length == 0) {
            $("#dialog").dialog("close");
        }
    }
    if (eventTargetId.match("future-skills")) {
        const competencyFutureSkillsLength = data.filter(i => i.id.indexOf("future-skills") > -1);
        if (competencyFutureSkillsLength.length == 0) {
            $("#dialog").dialog("close");
        }
    }
    adjustSearchOrder();
    if (data.length == 0) {
        searchOrder = [];
        startingSearchFilter = [];
        $("#career-facet-remove-all-filters-button").css('display', 'none');
        $("#series").css('display', 'none');
        $("#gs").css('display', 'none');
        $("#job-competency").css('display', 'none');
        $("#general-competency").css('display', 'none');
    }
    $("#" + eventTargetId + "-button").remove();
    getSearch();
    // console.log(JSON.stringify(data));
}

function onSubButtonClick(competencyGroup) {
    $("#dtags").html('');
    let groupItem = localStorage.getItem(competencyGroup);
    if (groupItem != null) {
        let groupItems = groupItem.replace('[', '').replace(']', '').replace(', ', ' ').split(',');
        let groupItemsLength = groupItems.length;
        groupItems.forEach(function (i) {
            let givenId = "pop-" +
                i.replace('| ', '-')
                    .replace('"', '')
                    .replace('"', '')
                    .replace(',', '-')
                    .replace(' ', '-')
                    .replace(' ', '-')
                    .replace(' ', '-')
                    .replace(' ', '-')
                    .replace(' ', '-')
                    .replace(' ', '-')
                    .replace(' ', '-') + "-button";
            const removeButtonA = document.createElement("a");
            removeButtonA.setAttribute("id", givenId);
            removeButtonA.setAttribute("tabindex", 0);
            removeButtonA.setAttribute("href", "javascript:void(0)");
            removeButtonA.setAttribute("class", "usa-tag margin-top float-left bg-white border-blue padding-05 margin-1 text-no-uppercase text-no-underline");
            removeButtonA.innerHTML = i.replace('|', ',').replace('"', '').replace('"', '') + "&nbsp;&nbsp;<i class='fa fa-times'></i>";
            if (removeButtonA.getAttribute("onClick") == null) {
                removeButtonA.setAttribute("onClick", "onPopupSubButtonClick('" + competencyGroup + "', '" + givenId + "', '" + i + "');")
            }
            document.getElementById("dtags").appendChild(removeButtonA);
            groupItemsLength--;
            //if (groupItemsLength === 0) {
            //}
        });
        $("#dialog").dialog({
            width: 600
        });
    }
}