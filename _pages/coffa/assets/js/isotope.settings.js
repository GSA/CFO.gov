// Filter based on two factors + alphabetical sort
// Uses URI hash as trigger allowing direct links etc
// Losely based on: http://isotope.metafizzy.co/filtering.html#url-hash

jQuery(document).ready(function ($) {
    var $container = $(".resources");

    // Filter isotope
    $container.isotope({
        // options
        itemSelector: ".policy",
        layoutMode: "masonry",
        getSortData: {
            date: "p"
        }
    });

    var iso = $container.data('isotope');
    var $filterCount = $('.filter-count');

    function updateFilterCount() {
        if (iso != null) {
            $filterCount.text(iso.filteredItems.length + ' items');
        }
    }



    // Alphabetical sort
    // Sort items alphabetically based on course title
    var sortValue = false;
    $(".sort").on("click", function () {
        // Get current URI hash
        var currentHash = location.hash;
        // If button is currently unchecked:
        if ($(this).hasClass("checked")) {
            // Set sort to false
            sortValue = false;
            // Remove sort attribute in hash
            location.hash = currentHash.replace(/&sort=([^&]+)/i, "");
        } else {
            // Set sortValue to current sort value
            sortValue = $(this).attr("data-sort-value");
            // Add sort attribute to hash
            location.hash = currentHash + "&sort=" + encodeURIComponent(sortValue);
        }
    });

    // Set up filters array with default values
    var filters = {};
    // When a button is pressed, run filterSelect
    $(".filter-list a").on("click", filterSelect);
    // Set the URI hash to the current selected filters
    function filterSelect() {
        // Current hash value
        var hashFilter = getHashFilter();
        // Set filters to current values (important for first run)
        filters["focus_area"] = hashFilter["focus_area"];
        filters["sub_focus_area"] = hashFilter["sub_focus_area"];
        filters["type"] = hashFilter["type"];
        filters["source"] = hashFilter["source"];
        filters["fiscal_year"] = hashFilter["fiscal_year"];
        // filters["status"] = hashFilter["status"];
        // data-filter attribute of clicked button
        var currentFilter = $(this).attr("data-filter");
        // Navigation group (priority_area or type) as object
        var $navGroup = $(this).parents(".filter-list");
        // data-filter-group key for the current nav group
        var filterGroup = $navGroup.attr("data-filter-group");
        // If the current data-filter attribute matches the current filter,
        if (currentFilter == hashFilter["focus_area"] || currentFilter == hashFilter["sub_focus_area"] || currentFilter == hashFilter["type"] || currentFilter == hashFilter["source"] || currentFilter == hashFilter["fiscal_year"]) {
            // Reset group filter as the user has unselected the button
            filters[filterGroup] = "*";
        } else {
            // Set data-filter of current button as value with filterGroup as key
            filters[filterGroup] = $(this).attr("data-filter");
        }
        // Create new hash
        var newHash = "focus_area=" + encodeURIComponent(filters["focus_area"]) + "&sub_focus_area=" + encodeURIComponent(filters["sub_focus_area"]) + "&type=" + encodeURIComponent(filters["type"]) + "&source=" + encodeURIComponent(filters["source"]) + "&fiscal_year=" + encodeURIComponent(filters["fiscal_year"]);
        // + "&status=" + encodeURIComponent( filters["status"] );
        // If sort value exists, add it to hash
        if (sortValue) {
            newHash = newHash + "&sort=" + encodeURIComponent(sortValue);
        }
        // Apply the new hash to the URI, triggering onHahschange()
        location.hash = newHash;
    } // filterSelect

    function onHashChange() {
        // Current hash value
        var hashFilter = getHashFilter();
        // Concatenate priority_area and type for Isotope filtering
        var theFilter = hashFilter["focus_area"] + hashFilter["sub_focus_area"] + hashFilter["type"] + hashFilter["source"] + hashFilter["fiscal_year"];
        // + hashFilter["status"];

        if (hashFilter) {
            // Repaint Isotope container with current filters and sorts
            $container.isotope({
                filter: decodeURIComponent(theFilter),
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
            $(".filter-list").find("[data-filter='" + hashFilter["focus_area"] + "'],[data-filter='" + hashFilter["sub_focus_area"] + "'],[data-filter='" + hashFilter["type"] + "'],[data-filter='" + hashFilter["source"] + "'],[data-filter='" + hashFilter["fiscal_year"] + "']").addClass("checked").attr("aria-checked", "true");
            //,[data-filter='" + hashFilter["status"] + "']
        }
    } // onHahschange

    function getHashFilter() {
        // Get filters (matches) and sort order (sorts)
        var focus_area = location.hash.match(/focus_area=([^&]+)/i);
        var sub_focus_area = location.hash.match(/sub_focus_area=([^&]+)/i);
        var type = location.hash.match(/type=([^&]+)/i);
        var source = location.hash.match(/source=([^&]+)/i);
        var fiscal_year = location.hash.match(/fiscal_year=([^&]+)/i);
        // var status = location.hash.match( /status=([^&]+)/i );
        var sorts = location.hash.match(/sort=([^&]+)/i);

        // Set up a hashFilter array
        var hashFilter = {};
        // Populate array with matches and sorts using ternary logic
        hashFilter["focus_area"] = focus_area ? focus_area[1] : "*";
        hashFilter["sub_focus_area"] = sub_focus_area ? sub_focus_area[1] : "*";
        hashFilter["type"] = type ? type[1] : "*";
        hashFilter["source"] = source ? source[1] : "*";
        hashFilter["fiscal_year"] = fiscal_year ? fiscal_year[1] : "*";
        // hashFilter["status"] = status ? status[1] : "*";
        hashFilter["sorts"] = sorts ? sorts[1] : "";

        return hashFilter;
    } // getHashFilter

    // When the hash changes, run onHashchange
    window.onhashchange = onHashChange;

    // When the page loads for the first time, run onHashChange
    onHashChange();

});
