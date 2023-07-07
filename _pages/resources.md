---
title: Resources
layout: default
permalink: /resources/
description: Resources.
keyword: Resources
---
<section class="usa-graphic-list">
    <div class="grid-container">
        <h1 class="column-centered-heading margin-bottom-1">Resources</h1>
        <div class="usa-graphic-list__row grid-row grid-gap margin-0">
            <p class="font-sans-sm padding-top-1 margin-0">Welcome to the Resources library. This is a high-level look at policies, priorities, training, playbooks, and more, in federal financial
            management. This is a living catalog that is consistently updated as policies, priorities, and resources evolve. Use the filters on the le to browse. It is not exhaustive of all applicable financial policies, priorities, or resources. Hover over the resource type for a brief definition of the
                resource type.</p>
            <p class="font-sans-sm padding-top-1 margin-0">Can't find what you're looking for? Want to suggest a resource? <a href="mailto:CFOC.support@gsa.gov">Contact us!</a></p>
            <br>
        </div>
    </div>
</section>
<section class="usa-graphic-list margin-bottom-4 margin-top-4">
    <div class="grid-container">
        <div class="usa-graphic-list__row grid-row grid-gap">
            {% include resources-filters.html %}
            {% include resources-data.html %}
        </div>
    </div>
</section>