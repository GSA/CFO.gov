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
        <h2 class="margin-bottom-0">Related Resources</h2>
    </div>
</section>
<section class="usa-graphic-list margin-bottom-4 margin-top-4">
    <div class="grid-container">
        <div class="usa-graphic-list__row grid-row grid-gap">
            {% include resources-filters-coffa.html %}
            {% include resources-data.html %}
        </div>
    </div>
</section>