import pandas as pd
import os
import re

cards = pd.read_csv("csv/FEDS-Sample-Data-10-Jan-22-UTF-8.csv", sep=",", header=0)

html_escape_table = {
    "&": "&amp;",
    '"': "&quot;",
    "'": "&apos;"
    }

career_level = {
    "Entry": "GS 7-9",
    "Mid": "GS 10-13",
    "Senior": "GS 14-15"
    }

def html_escape(text):
    if type(text) is str:
        return "".join(html_escape_table.get(c,c) for c in text)
    else:
        return "False"

def create_name(text):
    parts = text.split("/")
    parts2 = '-'.join(parts)
    parts3 = parts2.split(", ")
    parts4 = '-'.join(parts3)
    parts5 = parts4.split(" ")
    parts6 = '-'.join(parts5)
    return re.sub('[,]', '', parts6)

for row, item in cards.iterrows():
    parts = item.job_series.split(" ")

    # html_filename = create_name(item.job_series) + '-' + create_name(career_level[item.career_level]) + '-' + create_name(str(item.competency_group)) + '-' + create_name(item.competency)
    html_filename = str(parts[0]) + "-" + create_name(item.competency_group) + "-" + create_name(item.competency) + "-" + create_name(item.proficiency_level)
    md_filename = "2021-11-26-" + html_filename + ".md"
    
    md = "---\nlayout: career-planning-landing\n"
    md += 'category: career\n'
    md += 'title: ' + item.job_series + ' ' + career_level[item.career_level] + ' ' + str(item.competency_group) + ' ' + item.competency + '\n'
    md += 'series: "' + str(parts[0]) + '"\n'
    md += 'job_series: "' + item.job_series + '"\n'
    md += 'career_level: "' + item.career_level + '"\n'
    md += "permalink: /cards/" + html_filename + "/\n"
    md += 'functional_competency_designation: "' + item.functional_competency_designation + '"\n'
    competency = item.competency.replace("/ ", " ")
    competency = competency.replace("/", " ")
    competency = competency.replace(" - ", " ")
    md += 'competency: "' + competency.strip() + '"\n'
    md += 'competency_group: "' + str(item.competency_group) + '"\n'
    md += 'compentency_description: "' + item.compentency_description + '"\n'
    md += 'level: "' + career_level[item.career_level] + '"\n'
    md += 'proficiency_level: ' + str(item.proficiency_level) + '\n'
    md += 'proficiency_level_definition: "' + item.proficiency_level_definition + '"\n'
    md += 'behavioral_illustrations: "' + item.behavioral_illustrations + '"\n'
    md += 'relevant_courses: "' + str(item.relevant_courses) + '"\n'
    md += 'filters: ' + create_name(str(item.competency_group.lower()) + "-" + item.competency.lower()) + ' ' + create_name(str(career_level[item.career_level]).lower()) + ' ' + 'series-' + str(parts[0]) + '\n'  
    md += "---\n"

    md += '\n<div id="cfo-card-content-behavioral-illustrations" class="cfo-inner-card-content">\n'
    md += '<p><b>Behavior Illustration</b></p>\n'
    if len(str(item.behavioral_illustrations)) > 3:
        illustrationParts = item.behavioral_illustrations.split("?")
        for illustration in illustrationParts:
            md += '<p>' + illustration.strip() + '</p>\n'
    md += '</div>\n'

    md += '\n<div id="cfo-card-content-proficiency-level-definition" class="cfo-inner-card-content">\n'
    md += '<p><b>Proficiency Level Definition</b></p>\n'
    if len(str(item.proficiency_level_definition)) > 3:
        proficiencyDefinition = item.proficiency_level_definition.split("?")
        md += '<ul>'
        for proficiency in proficiencyDefinition:
            md += '<li>' + proficiency.strip() + '</li>\n'
        md += '</ul>'
    md += '</div>\n'
    
    md += '\n<div id="cfo-card-content-relevant-courses" class="cfo-inner-card-content">\n'
    md += '<p><b>Relevant Courses</b></p>\n'
    courses = str(item.relevant_courses).split("@@@")
    if len(courses) >= 1:
        for course in courses:
            if course != "nan":
                print(course)
                parts = course.split("&&&")
                md += '<div class="cfo-courses-outer">\n'
                md += '<div class="cfo-courses-inner">' + parts[0] + '</div>\n'
                md += '<div class="cfo-courses-inner">' + parts[1] + '</div>\n'
                md += '<div class="cfo-courses-inner"><a href="' + parts[2] + '">Read More..</a></div>\n'
                md += '</div>\n'
            else:
                md += '<div class="cfo-courses-outer">\n'
                md += '<div class="cfo-courses-inner">No Courses Yet.</div>\n'
                md += '</div>\n'
    md += '</div>\n'
                
    md_filename = os.path.basename(md_filename)

    with open("../_cards/" + md_filename, 'w') as f:
        f.write(md)
