jQuery(document).ready(function ($) {
    $(function () {
        if ($("#cfo-tabs").length) {
            $("#cfo-tabs").tabs().addClass("ui-tabs-vertical ui-helper-clearfix");
            $("#cfo-tabs li").removeClass("ui-corner-top").addClass("ui-corner-left");

            // Handle tab click events
            $("#cfo-tabs ul li a").on("click", function () {
                var newPath = $(this).data("path"); // Get the data-path attribute value
                history.pushState(null, null, newPath); // Update the browser URL
            });

            // Handle browser back/forward navigation
            $(window).on("popstate", function (event) {
                updateCurrentTab();
            });

            if (!$('body').hasClass('cfo-tab-init')) {
                updateCurrentTab();
                $('body').addClass('cfo-tab-init');
            }
        }
    });

    function updateCurrentTab() {
        var currentPath = location.pathname;
        // Find the tab index that matches the currentPath
        var tabIndex = -1;
        $("#cfo-tabs ul li").each(function (index) {
            var tabPath = $(this).find("a").data("path");
            if (currentPath === tabPath) {
                tabIndex = index;
                return false; // Break the loop
            }
        });

        // Activate the tab that corresponds to the currentPath
        if (tabIndex !== -1) {
            $("#cfo-tabs").tabs("option", "active", tabIndex);
        }
    }
});