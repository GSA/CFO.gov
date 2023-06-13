// Filter based on two factors + alphabetical sort
// Uses URI hash as trigger allowing direct links etc
jQuery(document).ready(function ($) {
    var link = window.location.href;
    var filterCategories = [];
    if (link.indexOf("/resources/") != -1) {
        $.getJSON("./assets/js/filterCategories.json", function (json) {
            filterCategories = json.filterTypes;
        });
        var $grid = $('#resources');
    }

    // Filter isotope
    $grid.isotope({
        // options
        itemSelector: ".policy",
        layoutMode: "masonry",
        getSortData: {
            date: "p"
        }
    });

    let iso = $grid.data('isotope');
    let $filterCount = $('.filter-count');
    function updateFilterCount() {
        if (iso != null) {
            $filterCount.text(iso.filteredItems.length + ' items');
        }
    }

    $("#btnReset").on("click", function () {
        var count = filters.length;
        for (let filter = 0; filter < count; filter++) {
            removeFilter(filters[0]);
        }
        $grid.isotope({ filter: filters.join(',') });
        updateFilterCount();
        $(".filter-list").find(".is-checked").removeClass("is-checked").attr("aria-checked", "false");
    });

    var filters = [];
    // change is-checked class on buttons
    $('.filter-list').on('click', 'a', function (event) {
        let $target = $(event.currentTarget);
        $target.toggleClass('is-checked');
        let isChecked = $target.hasClass('is-checked');
        let filter = $target.attr('data-filter');
        if (isChecked) {
            addFilter(filter);
        } else {
            removeFilter(filter);
        }
        // filter isotope
        // group filters together, inclusive
        $grid.isotope({ filter: filters.join(',') });
        updateFilterCount();
    });

    function addFilter(filter) {
        if (filters.indexOf(filter) == -1) {
            filters.push(filter);
        }
    }

    function removeFilter(filter) {
        let index = filters.indexOf(filter);
        if (index != -1) {
            filters.splice(index, 1);
        }
    }

    updateFilterCount();
});