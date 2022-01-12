import pandas as pd
import os

cards = pd.read_csv("csv/FEDS-Sample-Data-10-Jan-22-UTF-8.csv", sep=",", header=0)

html_escape_table = {
    "&": "&amp;",
    '"': "&quot;",
    "'": "&apos;"
    }

career_level = {
    "Level 1 - Awareness": "GS 0-3",
    "Level 2 - Basic": "GS 4-6",
    "Level 3 - Intermediate": "GS 7-9",
    "Level 4 - Advanced": "GS 10-13",
    "Level 5 - Expert": "GS 14-15"
    }

def html_escape(text):
    if type(text) is str:
        return "".join(html_escape_table.get(c,c) for c in text)
    else:
        return "False"

def create_name(text):
    parts = text.split("/")
    parts2 = '-'.join(parts)
    parts3 = parts2.split(" ")
    return '-'.join(parts3)

for row, item in cards.iterrows():
    parts = item.job_series.split(" ")

    html_filename = str(parts[0]) + "-" + create_name(item.competency) + "-" + create_name(item.proficiency_level)
    md_filename = "2021-11-26-" + html_filename + ".md"
    
    md = "---\nlayout: career-planning-landing\n"
    md += 'category: career\n'
    md += 'title: ' + item.job_series + ' ' + career_level[item.proficiency_level] + ' ' + item.competency + '\n'
    md += 'series: ' + str(parts[0]) + '\n'
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
    md += 'level: "' + career_level[item.proficiency_level] + '"\n'
    md += 'proficiency_level: ' + str(item.proficiency_level) + '\n'
    md += 'proficiency_level_definition: "' + item.proficiency_level_definition + '"\n'
    md += 'behavioral_illustrations: "' + item.behavioral_illustrations + '"\n'
    md += 'relevant_courses: "' + str(item.relevant_courses) + '"\n'
    md += 'filters: ' + create_name(item.competency) + ' ' + create_name(career_level[item.proficiency_level]) + ' ' + 'series-' + str(parts[0]) + '\n'  
    md += "---\n"

    md += '\n<p><b>Proficiency Level Definition</b></p>\n'
    if len(str(item.proficiency_level_definition)) > 3:
        md += '<p>"' + item.proficiency_level_definition + '"</p>\n'
    else:
        md += '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec dapibus interdum pellentesque. Integer eu vehicula elit. Sed cursus magna in dui suscipit rhoncus. Curabitur sed elit viverra, fermentum massa non, hendrerit ex. Vivamus eget mattis tortor, eu elementum sapien. Praesent elementum feugiat nisi venenatis vestibulum. Nulla pretium ipsum orci, ut feugiat arcu facilisis sit amet. Morbi bibendum est non nibh aliquam, non dictum massa elementum. Nullam vitae auctor erat. Mauris at arcu ut purus sodales porttitor ut sit amet ex. Donec viverra quam nisl, a congue arcu fermentum rhoncus.</p>\n'

    md += '<p><b>Behavior Illustration</b></p>\n'
    if len(str(item.behavioral_illustrations)) > 3:
        md += '<p>"' + item.behavioral_illustrations + '"</p>\n'
    else:
        md += '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec dapibus interdum pellentesque. Integer eu vehicula elit. Sed cursus magna in dui suscipit rhoncus. Curabitur sed elit viverra, fermentum massa non, hendrerit ex. Vivamus eget mattis tortor, eu elementum sapien. Praesent elementum feugiat nisi venenatis vestibulum. Nulla pretium ipsum orci, ut feugiat arcu facilisis sit amet. Morbi bibendum est non nibh aliquam, non dictum massa elementum. Nullam vitae auctor erat. Mauris at arcu ut purus sodales porttitor ut sit amet ex. Donec viverra quam nisl, a congue arcu fermentum rhoncus.</p>\n'

    md += '<p><b>Relevant Courses</b></p>\n'
    courses = str(item.relevant_courses).split("@")
    if len(courses) >= 1:
        for course in courses:
            if course != "nan":
                print(course)
                parts = course.split("&")
                md += '<div class="cfo-courses-outer"><div class="cfo-courses-inner">' + parts[0] + '</div><div class="cfo-courses-inner"><a href="' + parts[1] + '">Read More..</a></div></div>\n'
            else:
                md += '<div class="cfo-courses-outer"><div class="cfo-courses-inner">No Courses Yet.</div></div>\n'
    # else:
    #     md += '<div class="cfo-courses-outer"><div class="cfo-courses-inner">Course 1</div><div class="cfo-courses-inner">UOP</div><div class="cfo-courses-inner"><a href="/cards/' + html_filename + '/">Read More..</a></div></div>\n'
    #     md += '<div class="cfo-courses-outer"><div class="cfo-courses-inner">Course 2</div><div class="cfo-courses-inner">Delta</div><div class="cfo-courses-inner"><a href="/cards/' + html_filename + '/">Read More..</a></div></div>\n'
    #     md += '<div class="cfo-courses-outer"><div class="cfo-courses-inner">Course 3</div><div class="cfo-courses-inner">LAVC</div><div class="cfo-courses-inner"><a href="/cards/' + html_filename + '/">Read More..</a></div></div>\n'
                
    md_filename = os.path.basename(md_filename)
    #print(md)

    with open("../_cards/" + md_filename, 'w') as f:
        f.write(md)
