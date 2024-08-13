---
title: Resources
layout: coffa-default
permalink: /coffa/resources/
description: Resources
keyword: Resources
---

<section class="usa-hero grid-container about-the-council margin-bottom-5">
    <div class="grid-row grid-gap flex-align-center">
        <div class="tablet:grid-col-auto tablet:grid-offset-1 text-center">
            <img class="circle-card tablet:float-left" src="{{site.baseurl}}/assets/images/logos/resources.svg"
                 alt="Resources Logo" />
        </div>
        <div class="tablet:grid-col-8 margin-left-2 margin-right-2">
            <div class="priority-tag-line">
                <h1 class="margin-0 font-ui-2xl text-normal">{{ page.title }}</h1>
            </div>
        </div>
    </div>
</section>

<section class="usa-graphic-list">
    <div class="grid-container">
        <h2 class="margin-bottom-0">WELCOME TO THE RESOURCES LIBRARY</h2>
        <div class="usa-graphic-list__row grid-row grid-gap margin-0">
            <p class="padding-top-1 margin-0">This is a high-level look at policies, priorities, training, and more, in Federal financial
            assistance. This is a living catalog that is updated as policies, priorities, and resources evolve. Use the filters on the left to browse. It is not exhaustive of all applicable financial assistance policies, priorities, or resources. Hover over the resource type for a brief definition of the resource type.</p>
            <br>
        </div>
        <h2 class="margin-bottom-0">Frequently Searched Items</h2>
            <ul>
                <li><a href="https://www.ecfr.gov/current/title-2/subtitle-A/chapter-II/part-200?toc=1">Title 2 of the CFR</a></li>
                <li><a href="https://www.whitehouse.gov/wp-content/uploads/2024/04/M-24-11-Revisions-to-2-CFR.pdf">OMB M-24-11: Reducing Burden in the Administration of Federal Financial Assistance</a></li>
                <li><a href="https://simpler.grants.gov/">Simpler Grants.gov</a></li>
                <li><a href="https://www.hrsa.gov/grants/simpler-nofos">HHS Simpler NOFO Pilot</a></li>
                <li><a href="https://www.whitehouse.gov/omb/management/made-in-america/build-america-buy-america-act-federal-financial-assistance/">Build America, Buy America Act</a></li>
                <li><a href="https://www.cfo.gov/coffa/assets/files/Revised-American-Rescue-Plan-Assistance-Listings_10-29-2021.pdf">The American Rescue Plan Act (ARP) of 2021 COVID-19 Financial Assistance Programs</a></li>
            </ul>
        <h2 class="margin-bottom-0">Related Resources</h2>
    </div>
</section>
<section class="usa-graphic-list margin-bottom-4 margin-top-4">
    <div class="grid-container">
        <div class="usa-graphic-list__row grid-row grid-gap">
            {% include resources-filters-coffa.html %}
            {% include resources-data-coffa.html %}
        </div>
    </div>
</section>