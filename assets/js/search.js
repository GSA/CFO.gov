document.addEventListener("DOMContentLoaded", function () {
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
  var searchResults = document.getElementById("search-results");
  searchResults.setAttribute("start", offset + 1);

  if (window.location.href.includes("/payment-accuracy/search/")) {
    var formElement = document.getElementById("search_form");
    formElement.action = window.location.pathname;
  }

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
        urlParams.get("query");
      document.getElementById("search-keyword").innerHTML =
        urlParams.get("query");
      document.getElementById("results-count").innerHTML = totalResults;

      if (posts.web.results.length > 0) {
        document
          .getElementById("search-results")
          .classList.remove("display-none");
        document.getElementById("no-results").classList.add("display-none");
        for (item in posts.web.results) {
          render_result(
            `
          <li class="padding-bottom-5 margin-top-4 usa-prose border-bottom-05 border-base-lightest">
            <a href="${posts.web.results[item]["url"]}">${posts.web.results[
              item
            ]["title"]
              .replace(/\uE000/g, '<span class="text-bold">')
              .replace(/\uE001/g, "</span>")}</a>
            <div class="green-color"> ${posts.web.results[item]["url"]} </div>
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
        document.getElementById("no-results").classList.remove("display-none");
      }
        document.getElementById("results-header").classList.remove("display-none");
      update_pager();
    });

  function render_result(content, append = true) {
    const previous = document.getElementById("search-results").innerHTML;
    document.getElementById("search-results").innerHTML =
      append == true ? previous + content : content;
  }

  function update_pager() {
    var pager = document.getElementById("pager");
    var pagerLinks = "";

    pager.innerHTML = "";
    if (page > 1) {
      pagerLinks += '<a href="' + getLinkToPage(page - 1) + '" aria-label="Previous page"><< Prev</a>';
    }
    pagerLinks +=
      '<span class="margin-2">Page ' +
      page +
      " of " +
      Math.ceil(totalResults / resultsPerPage) +
      "</span>";
    if (totalResults > (page * resultsPerPage)) {
      pagerLinks += '<a href="' + getLinkToPage(parseInt(page) + 1) + '" aria-label="Next page">Next >></a>';
    }
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
});
