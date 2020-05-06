// Add your custom javascript here
//console.log("Hi from Federalist");
function topFunction() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}

function topFunctionKeyboard(event) {
    if (event.keyCode === 13) {
        topFunction();
    }
}
// jQuery( document ).ready(function($) );
jQuery(document).ready(function ($) {
    $(function () {
        $("#tabs").tabs().addClass("ui-tabs-vertical ui-helper-clearfix");
        $("#tabs li").removeClass("ui-corner-top").addClass("ui-corner-left");
        $( "#accordion" ).accordion({
            collapsible: true
        });
    })

});
