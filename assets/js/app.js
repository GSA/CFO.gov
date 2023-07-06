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

var baseUrl = '{{site.baseurl}}';

window.addEventListener('pageshow', function(event) {
    var targetPages = [
        baseUrl + '/federal-financial-assistance/',
        baseUrl + '/federal-financial-reporting//',
        baseUrl + '/workforce-modernization/',
        baseUrl + '/major-legislation/',
        baseUrl + '/payment-integrity/',
    ];

    if (event.persisted && targetPages.includes(window.location.href)) {
        window.location.reload();
    }
});
