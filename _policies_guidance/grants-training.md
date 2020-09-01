---
layout: knowledge-sharing-landing
title: Grants Training
subtitle: Grants Training
permalink: /grants-training/
type: financial-assistance
filters: financial-assistance training-module
---

<div class="usa-alert usa-alert--info" xmlns="http://www.w3.org/1999/html">
    <div class="usa-alert__body">
        <h3 class="usa-alert__heading">PDF Version of the Grants Training Modules</h3>
        <p class="usa-alert__text">We recently upgraded the website platform for our website. As part of that transition, we identified technical issues with the original Grants Training Modules that have prevented us from restoring it in its interactive format. We're looking into mid-term solutions to redesign the modules and make them better.
            In the short term, below you will find the PDF version of the Grants Training Modules. Please note, there is no completion certificate with this PDF format. </p>
    </div>
</div>

<div class="grid-container font-sans-sm">
<h2>GRANTS TRAINING</h2>

<div><p>AS A PART OF THE CFO COUNCIL'S MISSION TO FOSTER MORE EFFICIENT AND EFFECTIVE FEDERAL GRANTS MANAGEMENT SYSTEM, THE COUNCIL COORDINATES TRAINING ON KEY ISSUES RELATED TO THAT MISSION.</p>
</div>

<div><p><i><b>Please Note:</b> To properly view all Grants 101 Training Modules, please use either Google Chrome or Microsoft Internet Explorer. Please also make sure that Flash is enabled for your selected browser. All training modules will open in new tabs. </i></p></div>

<h3>GRANTS TRAINING 101 MODULES</h3>

<div>Grants Training 101 Modules are available on this page. The training is designed to provide Federal officials a basic knowledge training on grants and cooperative agreements.  The training is not designed to provide detailed administrative, accounting and audit requirements that are specific to programs based on their statutory provisions, agency regulations and guidance.  Thus, this training should be supplemented by materials that are specific to agency guidance and requirements.</div>

<h3>MODULE 1 - LAWS, REGULATIONS AND GUIDANCE</h3>
<div><p>This module presents the underlying laws, regulations, policies, practices, and guidance for grant or cooperative agreement programs, including their legal order of precedence and their relevance to different recipient types.  Lesson 1 presents the basics for Statutes, Regulations, and Guidance.  Lesson 2 discusses applicability of the governing regulations by recipient type.</p></div>

<div><p><i>Please note: There is no audio used in Module 1.</i></p></div>

<div><p><a href="{{ site.baseurl }}/wp-content/uploads/2020/09/Module-1.pdf">Module 1 (Lessons 1 and 2)</a></p></div>


<h3>MODULE 2 - FINANCIAL ASSISTANCE MECHANISMS</h3>
<div><p>This module presents the multiple types of Federal assistance programs - the difference between them and the use of specific award instrument.  Lesson 1 describes the types of assistance awards and Lesson 2 describes the appropriate use for each types of award instrument.</p></div>

<div><p><i>Please note: There is no audio used in Module 2.</i></p></div>

<div><p><a href="{{ site.baseurl }}/wp-content/uploads/2020/09/Module-2.pdf">Module 2 (Lessons 1 and 2)</a></p></div>

<h3>MODULE 3 - UNIFORM GUIDANCE ADMINISTRATIVE REQUIREMENTS</h3>
<div><p>This module provides an introduction to the general provisions, pre- and post-award administrative requirements outlined in Subparts A through D of the Uniform Guidance (2 CFR 200) for Federal awarding agencies and award recipients. The module includes examples of how Federal awarding agencies apply these requirements into their day-to-day grants management practices and what is required by the award recipient during the period of performance.</p></div>

<div><p><a href="{{ site.baseurl }}/wp-content/uploads/2020/09/Module-3-Lesson-1.pdf">Lesson 1 </a> &nbsp; | &nbsp;<a href="{{ site.baseurl }}/wp-content/uploads/2020/09/Module-3-Lesson-2.pdf">  Lesson 2  </a>&nbsp; | &nbsp;<a href="{{ site.baseurl }}/wp-content/uploads/2020/09/Module-3-Lesson-3.pdf"> Lesson 3 </a>&nbsp; | &nbsp;<a href="{{ site.baseurl }}/wp-content/uploads/2020/09/Module-3-Lesson-4.pdf"> Lesson 4 </a> | &nbsp;<a href="{{ site.baseurl }}/wp-content/uploads/2020/09/Module-3-Resources.pdf"> Resources </a> | &nbsp;<a href="{{ site.baseurl }}/wp-content/uploads/2020/09/Module-3-Transcript.pdf"> Transcript </a></p></div>

<h3>MODULE 4 - COST PRINCIPLES</h3>
<div><p>This module provides an introduction to the cost principles that apply to award recipients outlined in the Uniform Guidance 2 CFR 200. This module will outline the general principles governing cost, indirect costs, costs that require prior approval, other highlighted costs, and examples of how agencies apply the costs principles as they are administering grant and cooperative agreements.</p></div>

<div><p><a href="{{ site.baseurl }}/wp-content/uploads/2020/09/Module-4-Lesson-1.pdf"> Lesson 1</a> &nbsp; | &nbsp;<a href="{{ site.baseurl }}/wp-content/uploads/2020/09/Module-4-Lesson-2.pdf"> Lesson 2 </a>&nbsp; | &nbsp;<a href="{{ site.baseurl }}/wp-content/uploads/2020/09/Module-4-Lesson-3.pdf"> Lesson 3 </a>&nbsp; | &nbsp;<a href="{{ site.baseurl }}/wp-content/uploads/2020/09/Module-4-Lesson-4.pdf"> Lesson 4 </a> &nbsp;| &nbsp;<a href="{{ site.baseurl }}/wp-content/uploads/2020/09/Module-4-Lesson-5.pdf"> Lesson 5 </a> | &nbsp;<a href="{{ site.baseurl }}/wp-content/uploads/2020/09/Module-4-Resources.pdf"> Resources </a>| &nbsp;<a href="{{ site.baseurl }}/wp-content/uploads/2020/09/Module-4-Transcript.pdf"> Transcript </a></p></div>

<h3>MODULE 5 - RISK MANAGEMENT AND SINGLE AUDIT</h3>
<div><p>This module provides common techniques to manage risk to strengthen compliance with the Uniform Guidance 2 CFR 200 and an introduction to the single audit requirements, including recipient and Federal awarding agency requirements.</p></div>

<div><p><a href="{{ site.baseurl }}/wp-content/uploads/2020/09/Module-5-Lesson-1.pdf"> Lesson 1 </a> &nbsp; | &nbsp;<a href="{{ site.baseurl }}/wp-content/uploads/2020/09/Module-5-Lesson-2.pdf"> Lesson 2 </a>&nbsp; | &nbsp;<a href="{{ site.baseurl }}/wp-content/uploads/2020/09/Module-5-Lesson-3.pdf"> Lesson 3 </a> | &nbsp;<a href="{{ site.baseurl }}/wp-content/uploads/2020/09/Module-5-Resources.pdf"> Resources </a> | &nbsp;<a href="{{ site.baseurl }}/wp-content/uploads/2020/09/Module-5-Transcript.pdf"> Transcript </a></p></div>
    <div class="usa-media-block tablet:grid-col-12">
        <p class="card-tag margin-top-0 text-gray-50 text-thin"> ADDITIONAL TRAININGS: </p>
        <div class="knowledge-sharing" >
            {% assign sorted = site.policies_guidance | where: 'training', 'yes' %}
            {% for grant in sorted %}
            {% assign filters = grant.filters | split: ' ' %}
            <div class="tablet:grid-col-4  grid-spacing policy {{ grant.filters }}">
                <div class="border-top-05 border-accent-warm bg-white padding-3 shadow-5 height-full members-hover ">
                    <div class="text-container height-mobile">
                        {% if grant.permalink %}
                        <a class="no-style anchor-fill" href="{{ site.baseurl }}{{ grant.permalink }}">
                            {% else %}
                            <a class="no-style anchor-fill" href="{{ grant.doc-link }}">
                                {% endif %}
                                <div class="text-container height-mobile">
                                    <p  class="usa-link" >
                                        {{ grant.subtitle }}
                                    </p>
                                    {% assign filters = grant.filters | split: ' ' %}
                                    {% for filter in filters %}
                                    {% capture has_link %}{% if filter contains '-' %}Yes{% else %}No{% endif %}{% endcapture%}
                                    {% if has_link == 'No' %}
                                    <p class="title-resources">
                                        {{ filter | upcase }}
                                    </p>
                                    {% else %}
                                    {% assign hyphen_filter = filter | split: '-' %}
                                    <p class="title-resources">
                                        {% for second_filter in hyphen_filter %}
                                        {{ second_filter | upcase }}
                                        {% endfor %}
                                    </p>
                                    {% endif %}
                                    {% endfor %}
                                </div></a>
                    </div>
                </div>
            </div>
            {% endfor %}
        </div>
    </div>

</div>

