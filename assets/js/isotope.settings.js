// Filter based on two factors + alphabetical sort
// Uses URI hash as trigger allowing direct links etc
// Based on: http://isotope.metafizzy.co/filtering.html#url-hash

jQuery(document).ready(function ($) {
    var $container = $(".resources");
    let currentYear = new Date().getFullYear();
    const archivedYears = 7;
    const endYear = currentYear - archivedYears;
    let notArchivedYears = [];
    for (let i = currentYear; i >= endYear; i--) {
        notArchivedYears.push(`.${i}:not(.archived)`);
    }

    let notArchivedFilter = notArchivedYears.join(", ");

    // Add the years to the data-filter attribute of the filter-list-not-archived
    $("#filter-list-not-archived").attr("data-filter", notArchivedFilter);
    var initialFilter = notArchivedFilter;

    // Create initial hash
    var initHash = "archive_area=" + encodeURIComponent(initialFilter);

    // Apply the new hash to the URI, triggering onHashchange()
    if (location.pathname == '/coffa/resources' && !location.hash) {
        location.hash = initHash;
    }

    // Filter isotope
    $container.isotope({
        itemSelector: ".policy",
        layoutMode: "masonry",
        getSortData: {
            date: "p",
            title: ".title" // add alphabetical sorting
        },
        filter: initialFilter,
    });

    var iso = $container.data("isotope");
    var $filterCount = $(".filter-count");

    function updateFilterCount() {
        if (iso != null) {
            $filterCount.text(iso.filteredItems.length + " items");
        }
    }

    // Alphabetical sort
    var sortValue = false;
    $(".sort").on("click", function () {
        var currentHash = location.hash;
        if ($(this).hasClass("checked")) {
            sortValue = false;
            location.hash = currentHash.replace(/&sort=([^&]+)/i, "");
        } else {
            sortValue = $(this).attr("data-sort-value");
            location.hash = currentHash + "&sort=" + encodeURIComponent(sortValue);
        }
    });

    // Set up filters array with default values
    var filters = {};

    // When a button is pressed, run filterSelect
    $(".filter-list a").on("click", filterSelect);

    function filterSelect() {
        var hashFilter = getHashFilter();

        filters["focus_area"] = hashFilter["focus_area"];
        filters["sub_focus_area"] = hashFilter["sub_focus_area"];
        filters["type"] = hashFilter["type"];
        filters["source"] = hashFilter["source"];
        filters["fiscal_year"] = hashFilter["fiscal_year"];
        filters["archive_area"] = hashFilter["archive_area"];
        filters["council"] = hashFilter["council"];

        var currentFilter = $(this).attr("data-filter");
        var $navGroup = $(this).parents(".filter-list");
        var filterGroup = $navGroup.attr("data-filter-group");

        if (
            currentFilter == hashFilter["focus_area"] ||
            currentFilter == hashFilter["sub_focus_area"] ||
            currentFilter == hashFilter["type"] ||
            currentFilter == hashFilter["source"] ||
            currentFilter == hashFilter["fiscal_year"] ||
            currentFilter == hashFilter["archive_area"] ||
            currentFilter == hashFilter["council"]
        ) {
            filters[filterGroup] = "*";
        } else {
            filters[filterGroup] = $(this).attr("data-filter");
        }

        var newHash =
            "focus_area=" + encodeURIComponent(filters["focus_area"]) +
            "&sub_focus_area=" + encodeURIComponent(filters["sub_focus_area"]) +
            "&council=" + encodeURIComponent(filters["council"]) +
            "&type=" + encodeURIComponent(filters["type"]) +
            "&source=" + encodeURIComponent(filters["source"]) + // fixed space bug
            "&fiscal_year=" + encodeURIComponent(filters["fiscal_year"]) +
            "&archive_area=" + encodeURIComponent(filters["archive_area"]);

        if (sortValue) {
            newHash = newHash + "&sort=" + encodeURIComponent(sortValue);
        }
        location.hash = newHash;
    }

    function onHashChange() {
        var hashFilter = getHashFilter();
        var theFilter =
            hashFilter["focus_area"] +
            hashFilter["sub_focus_area"] +
            hashFilter["type"] +
            hashFilter["source"] +
            hashFilter["fiscal_year"] +
            hashFilter["archive_area"] +
            hashFilter["council"];

        if (hashFilter) {
            $container.isotope({
                filter: theFilter,
                sortBy: hashFilter["sorts"]
            });

            updateFilterCount();

            // Toggle checked status of sort button
            if (hashFilter["sorts"]) {
                $(".sort").addClass("checked");
            } else {
                $(".sort").removeClass("checked");
            }

            // Toggle checked status of filter buttons
            $(".filter-list").find(".checked").removeClass("checked").attr("aria-checked", "false");
            $(".filter-list").find(
                "[data-filter='" + hashFilter["focus_area"] + "'], " +
                "[data-filter='" + hashFilter["sub_focus_area"] + "'], " +
                "[data-filter='" + hashFilter["type"] + "'], " +
                "[data-filter='" + hashFilter["source"] + "'], " +
                "[data-filter='" + hashFilter["archive_area"] + "'], " +
                "[data-filter='" + hashFilter["council"] + "'], " +
                "[data-filter='" + hashFilter["fiscal_year"] + "']"
            ).addClass("checked").attr("aria-checked", "true");

            // 👇 dynamic filter update
            updateAvailableFilters();
        }
    }

    function getHashFilter() {
        var focus_area = location.hash.match(/focus_area=([^&]+)/i);
        var sub_focus_area = location.hash.match(/sub_focus_area=([^&]+)/i);
        var type = location.hash.match(/type=([^&]+)/i);
        var source = location.hash.match(/source=([^&]+)/i);
        var fiscal_year = location.hash.match(/fiscal_year=([^&]+)/i);
        var council = location.hash.match(/council=([^&]+)/i);
        var archive_area = location.hash.match(/archive_area=([^&]+)/i);
        var sorts = location.hash.match(/sort=([^&]+)/i);

        var hashFilter = {};
        hashFilter["focus_area"] = focus_area ? decodeURIComponent(focus_area[1]) : "*";
        hashFilter["sub_focus_area"] = sub_focus_area ? decodeURIComponent(sub_focus_area[1]) : "*";
        hashFilter["type"] = type ? decodeURIComponent(type[1]) : "*";
        hashFilter["source"] = source ? decodeURIComponent(source[1]) : "*";
        hashFilter["fiscal_year"] = fiscal_year ? decodeURIComponent(fiscal_year[1]) : "*";
        hashFilter["filter-list-not-archived"] = fiscal_year ? decodeURIComponent(fiscal_year[1]) : "*";
        hashFilter["archive_area"] = archive_area ? decodeURIComponent(archive_area[1]) : "*";
        hashFilter["council"] = council ? decodeURIComponent(council[1]) : "*";
        hashFilter["sorts"] = sorts ? sorts[1] : "";

        return hashFilter;
    }

    // 👇 NEW FUNCTION: dynamically hide irrelevant filters
    function updateAvailableFilters() {
        if (!iso) return;

        // If no filtering applied (show all items), show everything
        if (iso.filteredItems.length === iso.items.length) {
            $(".filter-list li").show();
            $(".filter-list").each(function () {
                $(this).prev("h3").show();
                $(this).show();
            });
            return;
        }

        let validClasses = new Set();
        iso.filteredItems.forEach(item => {
            item.element.classList.forEach(cls => {
                validClasses.add("." + cls);
            });
        });

        $(".filter-list").each(function () {
            $(this).find("a").each(function () {
                let filterVal = $(this).attr("data-filter");
                if (
                    filterVal === "*" ||
                    $(this).hasClass("checked") ||
                    validClasses.has(filterVal)
                ) {
                    $(this).parent().show();
                } else {
                    $(this).parent().hide();
                }
            });

            let visibleItems = $(this).find("li:visible").length;
            if (visibleItems === 0) {
                $(this).prev("h3").hide();
                $(this).hide();
            } else {
                $(this).prev("h3").show();
                $(this).show();
            }
        });
    }

    // When the hash changes, run onHashchange
    window.onhashchange = onHashChange;

    // When the page loads for the first time
    onHashChange();
    updateAvailableFilters();
});