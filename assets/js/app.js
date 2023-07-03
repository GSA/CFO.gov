// Add your custom javascript here
//console.log("Hi from Federalist");
function topFunction() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}

// jQuery( document ).ready(function($) );
jQuery(document).ready(function ($) {
    $(function () {
        $("#tabs").tabs(
            {
                activate: function (event, ui) {
                    let path = ui.newPanel.data('path');
                    if (path !== undefined) {
                        window.history.pushState({}, null, window.location.origin + path + '#' + ui.newPanel.attr('id'));
                    }
                }
            }
        ).addClass("ui-tabs-vertical ui-helper-clearfix");
        $("#tabs li").removeClass("ui-corner-top").addClass("ui-corner-left");
    })

});
