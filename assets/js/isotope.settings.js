jQuery(document).ready(function ($) {
    const $container = $(".resources");
    const currentYear = new Date().getFullYear();
    const archivedYears = 7;
    const endYear = currentYear - archivedYears;
    const notArchivedYears = [];

    for (let i = currentYear; i >= endYear; i--) {
        notArchivedYears.push(`.${i}:not(.archived)`);
    }

    const notArchivedFilter = notArchivedYears.join(", ");
    $("#filter-list-not-archived").attr("data-filter", notArchivedFilter);
    const initialFilter = notArchivedFilter;
    const initHash = "archive_area=" + encodeURIComponent(initialFilter);

    if (location.pathname === '/coffa/resources' && !location.hash) {
        location.hash = initHash;
    }

    $container.isotope({
        itemSelector: ".policy",
        layoutMode: "masonry",
        getSortData: {
            date: "p",
            title: ".title"
        },
        filter: initialFilter
    });

    const iso = $container.data("isotope");
    const $filterCount = $(".filter-count");

    function updateFilterCount() {
        if (iso) {
            $filterCount.text(`${iso.filteredItems.length} items`);
        }
    }

    let sortValue = false;
    $(".sort").on("click", function () {
        const currentHash = location.hash;
        if ($(this).hasClass("checked")) {
            sortValue = false;
            location.hash = currentHash.replace(/&sort=([^&]+)/i, "");
        } else {
            sortValue = $(this).attr("data-sort-value");
            location.hash = currentHash + "&sort=" + encodeURIComponent(sortValue);
        }
    });

    const filters = {};

    $(".filter-list a").on("click", filterSelect);

    function filterSelect() {
        const hashFilter = getHashFilter();

        const filterGroups = [
            "focus_area", "sub_focus_area", "type", "source",
            "fiscal_year", "archive_area", "council"
        ];

        filterGroups.forEach(group => {
            filters[group] = hashFilter[group];
        });

        const currentFilter = $(this).attr("data-filter");
        const $navGroup = $(this).parents(".filter-list");
        const filterGroup = $navGroup.attr("data-filter-group");

        filters[filterGroup] = (currentFilter === hashFilter[filterGroup]) ? "*" : currentFilter;

        let newHash = filterGroups.map(group =>
            `${group}=${encodeURIComponent(filters[group])}`
        ).join("&");

        if (sortValue) {
            newHash += "&sort=" + encodeURIComponent(sortValue);
        }

        location.hash = newHash;
    }

    function onHashChange() {
        const hashFilter = getHashFilter();

        const filterParts = [
            hashFilter["focus_area"],
            hashFilter["sub_focus_area"],
            hashFilter["type"],
            hashFilter["source"],
            hashFilter["fiscal_year"],
            hashFilter["archive_area"],
            hashFilter["council"]
        ];

        const theFilter = filterParts.filter(f => f && f !== "*").join("");

        $container.isotope({
            filter: theFilter || "*",
            sortBy: hashFilter["sorts"]
        });

        updateFilterCount();

        $(".sort").toggleClass("checked", !!hashFilter["sorts"]);

        $(".filter-list").find(".checked").removeClass("checked").attr("aria-checked", "false");
        $(".filter-list").find(
            filterParts.map(f => `[data-filter='${f}']`).join(", ")
        ).addClass("checked").attr("aria-checked", "true");

        updateAvailableFilters();
    }

    function getHashFilter() {
        const hashFilter = {};
        const keys = [
            "focus_area", "sub_focus_area", "type", "source",
            "fiscal_year", "archive_area", "council", "sort"
        ];

        keys.forEach(key => {
            const match = location.hash.match(new RegExp(`${key}=([^&]+)`, "i"));
            hashFilter[key === "sort" ? "sorts" : key] = match ? decodeURIComponent(match[1]) : "*";
        });

        return hashFilter;
    }

    function updateAvailableFilters() {
        if (!iso) return;
    
        const hasArchived = iso.filteredItems.some(item =>
            item.element.classList.contains("archived")
        );
    
        // If no filtering applied (show all items), show everything
        if (iso.filteredItems.length === iso.items.length) {
            $(".filter-list li").show();
            $(".filter-list").each(function () {
                $(this).prev("h3").show();
                $(this).show();
            });
            return;
        }
    
        const validClasses = new Set();
        iso.filteredItems.forEach(item => {
            item.element.classList.forEach(cls => validClasses.add("." + cls));
        });
    
        $(".filter-list").each(function () {
            const $list = $(this);
            const isArchiveFilter = $list.attr("id") === "filter-list-not-archived";
    
            $list.find("a").each(function () {
                const $link = $(this);
                let filterVal = $link.attr("data-filter");
    
                // Normalize archive filter check
                const shouldShow =
                    filterVal === "*" ||
                    $link.hasClass("checked") ||
                    validClasses.has(filterVal) ||
                    (isArchiveFilter && hasArchived); // 👈 force show if archived items exist
    
                $link.parent().toggle(shouldShow);
            });
    
            const visibleItems = $list.find("li:visible").length;
            $list.prev("h3").toggle(visibleItems > 0);
            $list.toggle(visibleItems > 0);
        });
    }

    window.onhashchange = onHashChange;
    onHashChange();
    updateAvailableFilters();
});