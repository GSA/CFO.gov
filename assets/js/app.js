// Add your custom javascript here
//console.log("Hi from Federalist");
function topFunction() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}

// jQuery( document ).ready(function($) );
jQuery(document).ready(function ($) {
    $(function () {
        $("#tabs").tabs().addClass("ui-tabs-vertical ui-helper-clearfix");
        $("#tabs li").removeClass("ui-corner-top").addClass("ui-corner-left");
    })
});

(function(history){
    var pushState = history.pushState;
    history.pushState = function(state) {
        if (typeof(history.onpushstate) == "function") {
            history.onpushstate({state: state});
        }
        // Call the original pushState method
        return pushState.apply(history, arguments);
    };
})(window.history);

window.onpopstate = history.onpushstate = function(event) {
    location.reload();
};