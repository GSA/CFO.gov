
document.addEventListener("DOMContentLoaded", function () {
    console.log("In assets/js DOMContentLoaded event handler");
    var searchResults = document.getElementById("search-results");
    var pathParts = window.location.pathname.split("/payment-accuracy/");
    console.log("In DOMContentLoaded path-parts are");
    if (pathParts.length === 2) {
        var formElement = document.getElementById("search_form");
        formElement.action = pathParts[0] + '/payment-accuracy/search/';
    }
    var pathPartsCFO = window.location.pathname.split("/cfo/");
    console.log("pathPartsCFO is : "+pathPartsCFO);
    if(pathPartsCFO.length === 2) {
        var formElement = document.getElementById("search_form");
        formElement.action = pathPartsCFO[0] + '/cfo/search/';
    }
    if (searchResults !== null) {
        var searchgovParams = document.getElementById("searchgov-params");
        var currentURL = new URL(window.location.href);
        var urlParams = new URLSearchParams(window.location.search);
        var searchEndpoint = new URL(
            searchgovParams.dataset.endpoint + "/api/v2/search/i14y"
        );
        var resultsPerPage = 20;
        var page = urlParams.get("page") ?? 1;
        var offset = (page - 1) * resultsPerPage;
        var totalResults = 0;
        params = {
            affiliate: searchgovParams.dataset.affiliate,
            access_key: searchgovParams.dataset.accessKey,
            query: urlParams.get("query"),
            offset: offset,
        };
        searchResults.setAttribute("start", offset + 1);

        var inputElement = document.getElementById("extended-search-field-small");
        inputElement.value = urlParams.get("query");
        inputElement.focus();

        Object.keys(params).forEach((key) =>
            searchEndpoint.searchParams.append(key, params[key])
        );

        fetch(searchEndpoint)
            .then(function (res) {
                return res.json();
            })
            .then(function (posts) {
                totalResults = posts.web.total;
                document.getElementById("search-params").innerHTML =
                    DOMPurify.sanitize(urlParams.get("query"));
                document.getElementById("search-keyword").innerHTML =
                    DOMPurify.sanitize(urlParams.get("query"));
                document.getElementById("results-count").innerHTML = totalResults;

                if (posts.web.results.length > 0) {
                    document
                        .getElementById("search-results")
                        .classList.remove("display-none");
                    document.getElementById("no-results").classList.add("display-none");
                    for (item in posts.web.results) {
                        render_result(
                            `
          <li class="padding-bottom-3 margin-top-4 usa-prose border-bottom-05 border-base-lightest">
            <a href="${posts.web.results[item]["url"]}">${posts.web.results[
                                item
                                ]["title"]
                                .replace(/\uE000/g, '<span class="text-bold">')
                                .replace(/\uE001/g, "</span>")}</a>
            <div class="text-green"> ${posts.web.results[item]["url"]} </div>
            <div> ${posts.web.results[item]["snippet"]
                                .replace(/\uE000/g, '<span class="text-bold">')
                                .replace(/\uE001/g, "</span>")} </div>
          </li>
          `,
                            true
                        );
                    }
                }
            })
            .catch(function (ex) {
                console.log("parsing failed", ex);
            })
            .finally(function (e) {
                if (document.getElementById("search-results").childNodes.length == 0) {
                    document.getElementById("search-results").classList.add("display-none");
                    document.getElementById("results-header").classList.add("display-none");
                    document.getElementById("pager").classList.add("display-none");
                    document.getElementById("no-results").classList.remove("display-none");
                }
                document.getElementById("results-header").classList.remove("display-none");
                update_pager();
            });
    }

    function render_result(content, append = true) {
        const previous = document.getElementById("search-results").innerHTML;
        document.getElementById("search-results").innerHTML =
            append == true ? previous + content : content;
    }

    function update_pager() {
        var page = urlParams.get("page") ?? 1;
        var pager = document.getElementById("pager");
        var pagerLinks = "";
		var totalPages = Math.ceil(totalResults / resultsPerPage);

        pager.innerHTML = "";
        
        if (page > 1){
		    pagerLinks += '<a href="' + getLinkToPage(1) + '" aria-label="First page" class="pager-button">First</a>';
        }
		
		if (totalPages > 5 && page > 5) {
			pagerLinks += '<span style="font-weight: bold;" class="margin-2">...</span>';
		}

		var start = Math.max(2, page - 3);
		for (var i = start; i < page; i++) {
			pagerLinks += '<a href="' + getLinkToPage(i) + '" aria-label="Page ' + i + '" class="pager-button">' + i + '</a>';
		}

		pagerLinks += '<span class="margin-2, pager-button-current">Page ' + page + " of " + totalPages + "</span>";
        
		var end = Math.min((totalPages - 1), ((1*page) + 3));
		for (var j = (1*page) + 1; j <= end; j++) {
			pagerLinks += '<a href="' + getLinkToPage(j) + '" aria-label="Page ' + j + '" class="pager-button">' + j + '</a>';
		}

		if (totalPages > 5 && page < totalPages - 4) {
			pagerLinks += '<span style="font-weight: bold;" class="margin-2">...</span>';
		}

        if( totalPages > 1 && page < totalPages){
            pagerLinks += '<a href="' + getLinkToPage(totalPages) + '" aria-label="Last page" class="pager-button">Last</a>';
        }		

        pagerLinks += '<div class="usa-footer__contact-info grid-row grid-gap"><div class="grid-col-auto"><p class="margin-top-0">Powered by <strong>Search.gov</strong></p></div></div>';
        
        pager.innerHTML = pagerLinks;
    }

    function getLinkToPage(pageNumber) {
        var searchParams = currentURL.searchParams;
        if (searchParams.has("page")) {
            searchParams.set("page", pageNumber);
        } else {
            searchParams.append("page", pageNumber);
        }
        return currentURL.toString();
    }

    // function encodeHTML(str) {
    //     return str.replace(/&/g, "&amp;")
    //               .replace(/</g, "&lt;")
    //               .replace(/>/g, "&gt;")
    //               .replace(/"/g, "&quot;")
    //               .replace(/'/g, "&#39;");
    // }
});
