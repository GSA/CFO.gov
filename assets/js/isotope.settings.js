jQuery(document).ready(function ($) {
    const $container = $(".resources");

    // Tag all cards with .not-archived if not already archived
    $(".policy").each(function () {
        if (!$(this).hasClass("archived")) {
            $(this).addClass("not-archived");
        }
    });

    // Initialize Isotope
    $container.isotope({
        itemSelector: ".policy",
        layoutMode: "masonry",
        getSortData: {
            date: "p",
            title: ".title"
        },
        filter: "*"
    });

    const iso = $container.data("isotope");
    const $filterCount = $(".filter-count");

    function updateFilterCount() {
        if (iso) {
            $filterCount.text(`${iso.filteredItems.length} items`);
        }
    }

    // ✅ Dynamic filtering logic
    const filters = {};

    $(".filter-list[data-filter-group]:not([data-filter-group='archive_area']) a").on("click", function () {
        const $this = $(this);
        const filterGroup = $this.closest(".filter-list").attr("data-filter-group");
        const filterValue = $this.attr("data-filter");

        // Toggle filter value
        filters[filterGroup] = filters[filterGroup] === filterValue ? "*" : filterValue;

        // Build combined filter string
        const activeFilters = Object.values(filters).filter(f => f && f !== "*");

        // If "Hide Archived Documents" is active, include .not-archived
        if ($("#filter-list-not-archived").hasClass("checked")) {
            activeFilters.push(".not-archived");
        }

        const filterString = activeFilters.length ? activeFilters.join("") : "*";

        $container.isotope({ filter: filterString });

        // Update UI
        $this.closest(".filter-list").find("a").removeClass("checked");
        if (filters[filterGroup] !== "*") {
            $this.addClass("checked");
        }

        updateFilterCount();
    });

    // ✅ Independent archive filter
    $("#filter-list-not-archived").on("click", function () {
        const $this = $(this);
        const isActive = $this.hasClass("checked");

        // Toggle archive filter
        if (isActive) {
            $this.removeClass("checked");
        } else {
            $this.addClass("checked");
        }

        // Reapply all filters
        const activeFilters = Object.values(filters).filter(f => f && f !== "*");

        if (!isActive) {
            activeFilters.push(".not-archived");
        }

        const filterString = activeFilters.length ? activeFilters.join("") : "*";

        $container.isotope({ filter: filterString });
        updateFilterCount();
    });

    // Initial count
    updateFilterCount();
});