// Filter based on two factors + alphabetical sort
// Uses URI hash as trigger allowing direct links etc
// Losely based on: http://isotope.metafizzy.co/filtering.html#url-hash

jQuery(document).ready(function ($) {
    var $container = $(".knowledge-sharing");

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
    if (iso != null){
        $filterCount.text( iso.filteredItems.length + ' items' );
    }
}



    // Alphabetical sort
    // Sort items alphabetically based on course title
    var sortValue = false;
    $(".sort").on("click", function(){
        // Get current URI hash
        var currentHash = location.hash;
        // If button is currently unchecked:
        if ( $(this).hasClass("checked") ) {
            // Set sort to false
            sortValue = false;
            // Remove sort attribute in hash
            location.hash = currentHash.replace( /&sort=([^&]+)/i, "");
        } else {
            // Set sortValue to current sort value
            sortValue = $(this).attr("data-sort-value");
            // Add sort attribute to hash
            location.hash = currentHash + "&sort=" + encodeURIComponent( sortValue );
        }
    });

    // Set up filters array with default values
    var filters = {};
    // When a button is pressed, run filterSelect
    $( ".filter-list a" ).on( "click", filterSelect );
    // Set the URI hash to the current selected filters
    function filterSelect() {
        // Current hash value
        var hashFilter = getHashFilter();
        // Set filters to current values (important for first run)
        filters["priority_area"] = hashFilter["priority_area"];
        filters["type"] = hashFilter["type"];
        // filters["status"] = hashFilter["status"];
        // data-filter attribute of clicked button
        var currentFilter = $(this).attr("data-filter");
        // Navigation group (priority_area or type) as object
        var $navGroup = $(this).parents(".filter-list");
        // data-filter-group key for the current nav group
        var filterGroup = $navGroup.attr("data-filter-group");
        // If the current data-filter attribute matches the current filter,
        if ( currentFilter == hashFilter["priority_area"] || currentFilter == hashFilter["type"] || currentFilter == hashFilter["status"] ) {
            // Reset group filter as the user has unselected the button
            filters[ filterGroup ] = "*";
        } else {
            // Set data-filter of current button as value with filterGroup as key
            filters[ filterGroup ] = $(this).attr("data-filter");
        }
        // Create new hash
        var newHash = "priority_area=" + encodeURIComponent( filters["priority_area"] ) + "&type=" + encodeURIComponent( filters["type"] );
        // + "&status=" + encodeURIComponent( filters["status"] );
        // If sort value exists, add it to hash
        if ( sortValue ) {
            newHash = newHash + "&sort=" + encodeURIComponent( sortValue );
        }
        // Apply the new hash to the URI, triggering onHahschange()
        location.hash = newHash;
    } // filterSelect

    function onHashChange() {
        // Current hash value
        var hashFilter = getHashFilter();
        // Concatenate priority_area and type for Isotope filtering
        var theFilter = hashFilter["priority_area"] + hashFilter["type"] ;
        // + hashFilter["status"];

        if ( hashFilter ) {
            // Repaint Isotope container with current filters and sorts
            $container.isotope( {
                filter:  decodeURIComponent( theFilter ),
                sortBy: hashFilter["sorts"]
            } );

            updateFilterCount();
            // Toggle checked status of sort button
            if ( hashFilter["sorts"] ) {
                $(".sort").addClass("checked");
            } else {
                $(".sort").removeClass("checked");
            }
            // Toggle checked status of filter buttons
            $( ".filter-list" ).find(".checked").removeClass("checked").attr("aria-checked","false");
            $( ".filter-list" ).find("[data-filter='" + hashFilter["priority_area"] + "'],[data-filter='" + hashFilter["type"] + "']").addClass("checked").attr("aria-checked","true");
            //,[data-filter='" + hashFilter["status"] + "']
        }
    } // onHahschange

    function getHashFilter() {
        // Get filters (matches) and sort order (sorts)
        var priority_area = location.hash.match( /priority_area=([^&]+)/i );
        var type = location.hash.match( /type=([^&]+)/i );
        // var status = location.hash.match( /status=([^&]+)/i );
        var sorts = location.hash.match( /sort=([^&]+)/i );

        // Set up a hashFilter array
        var hashFilter = {};
        // Populate array with matches and sorts using ternary logic
        hashFilter["priority_area"] = priority_area ? priority_area[1] : "*";
        hashFilter["type"] = type ? type[1] : "*";
        // hashFilter["status"] = status ? status[1] : "*";
        hashFilter["sorts"] = sorts ? sorts[1]: "";

        return hashFilter;
    } // getHashFilter

    // When the hash changes, run onHashchange
    window.onhashchange = onHashChange;

    // When the page loads for the first time, run onHashChange
    onHashChange();

});
