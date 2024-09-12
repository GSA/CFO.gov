(function ($) {
  let selected = {},
    unselect = false,
    buttonSelector = '.policy input[type="checkbox"]',
    downloadButtonPDF, // Download PDF report button
    downloadButtonCSV; // Download CSV report button

  window.isSelected = function (val) {
    return (typeof selected[val] != 'undefined');
  }

  window.unselectAll = function () {
    selected = {};
    unselect = false;
    $('button[data-op="select-all"]').text('SELECT ALL CARDS');
    $('#career-search-results').find(buttonSelector).prop('checked', false);
    downloadButtonPDF.prop('aria-disabled', true).prop('disabled', true);
    downloadButtonCSV.prop('aria-disabled', true).prop('disabled', true);
  }

  $(document).ready(function () {

    $('#career-search-results').on('change', buttonSelector, {}, function () {
      let val = $(this).val(),
        checked = $(this).prop('checked');

      if (checked) {
        selected[val] = true;
      }
      else {
        delete selected[val];
      }

      let disable = Object.keys(selected).length == 0;
      downloadButtonPDF.prop('aria-disabled', disable).prop('disabled', disable);
      downloadButtonCSV.prop('aria-disabled', disable).prop('disabled', disable);
    });

    $('#cfo-search-button').on('click', function () {
      $('#career-advancement-search-input').autocomplete("close");
    });

    $('button[data-op="select-all"]').click(function () {
      if (unselect) {
        unselectAll();
      }
      else {
        let set = facetGlobalVars.results.length ? facetGlobalVars.results : facetGlobalVars.fullSet;
        for (let i = 0, l = set.length; i < l; i++) {
          selected[set[i].permalink] = true;
        }
        unselect = true;
        this.innerText = 'DESELECT ALL CARDS';
        $('#career-search-results').find(buttonSelector).prop('checked', true);
      }

      let disable = Object.keys(selected).length == 0;
      downloadButtonPDF.prop('aria-disabled', disable).prop('disabled', disable);
      downloadButtonCSV.prop('aria-disabled', disable).prop('disabled', disable);
    });

    // button click event handler for Download PDF report button
    downloadButtonPDF = $('#career-download-buttons').find('[data-op="download-selected-pdf"]').click(function () {
      let cards = [];
      let cardSet = facetGlobalVars.results.length ? facetGlobalVars.results : facetGlobalVars.fullSet;
      for (let i = 0, l = cardSet.length; i < l; i++) {
        if (typeof selected[cardSet[i].permalink] != 'undefined') {
          cards.push(cardSet[i]);
        }
      }
      generatePDF(cards);
    });

    $(document).on("click", '.view-applicable-courses', function(){
      let val = $(this).val()
      let filters = val.split(' ');
      let href = location.pathname + "?series=" + filters[2] + "&level=" + filters[1] + "&competency=" + filters[0];
      //window.location.href=href;

      });



    // button click event handler for Download CSV report button
    downloadButtonCSV = $('#career-download-buttons').find('[data-op="download-selected-csv"]').click(function () {
      let cards = [];
      let cardSet = facetGlobalVars.results.length ? facetGlobalVars.results : facetGlobalVars.fullSet;
      for (let i = 0, l = cardSet.length; i < l; i++) {
        if (typeof selected[cardSet[i].permalink] != 'undefined') {
          cards.push(cardSet[i]);
        }
      }
      generateCSV(cards);
    });

    $('#career-advancement-search-input').autocomplete({
      source: function (request, response) {
        let normalized = request.term.toLowerCase();
        let n = normalized.length + 40;
        let outputs = facetGlobalVars.fullSet.map(function (item) {
          let value = item.title;
          // Search by title
          if (value.toLowerCase().indexOf(normalized) != -1) {
            return stripHtmlTags(value);
          }
          // else if (item.job_series.toLowerCase().indexOf(normalized) != -1) {
          //   return item.job_series;
          // }
          // else if (item.competency.toLowerCase().indexOf(normalized) != -1) {
          //   return item.competency;
          // }
          // Search by Competency Description
          else if (item.competency_description.toLowerCase().indexOf(normalized) != -1) {
            return stripHtmlTags(item.competency_description);
          }
          // Search by Proficiency Level Definition
          else if (item.proficiency_level_definition.toLowerCase().indexOf(normalized) != -1) {
            return stripHtmlTags(item.proficiency_level_definition);
          }
          // Search by Behavioral Illustrations
          else if (item.behavioral_illustrations.toLowerCase().indexOf(normalized) != -1) {
            return stripHtmlTags(item.behavioral_illustrations);
          }
          // Search by Relevant Courses
          else if (item.relevant_courses != null){
            let currentIndex;
            item.relevant_courses.forEach((course, index) => {
              currentIndex = course.toLowerCase().indexOf(normalized) != -1 ? index : currentIndex;
            });
            if (currentIndex !== undefined) {
              return stripHtmlTags(item.relevant_courses[currentIndex]);
            }
          }
          return null;
        });
        outputs = outputs.filter(function (x) { return !!x }).filter((item, index, self) => self.indexOf(item) === index);
        outputs = outputs.map(str => {
          str = str.substring(str.toLowerCase().indexOf(normalized))
              .split("?")[0]
              .split("|")[0];
          str = str.replace(/[,\s]+$/g, '').trim();
          return str.length > n ? str.substring(0, n) + "..." : str;
        });
        // Filter by unique value.
        outputs = [...new Set(outputs)];
        response(outputs);
      },
      select: function (event, ui) {
        let $elem = $(event.target);
        $elem.val(ui.item.value);
        $('#cfo-search-button').click();
        },
      change: function (event, ui) {
      }
    });

    $('select[name="per_page"]').change(function (e) {
      facetGlobalVars.perPage = parseInt($(this).val());
      facetGlobalVars.start = 0;
      if (!facetGlobalVars.inProgressCheckAll) {
        $().getSearch();
      }
      $('select[name="per_page"]').val(facetGlobalVars.perPage);
      if (facetGlobalVars.currentPage === 1 && facetGlobalVars.totalPages > 0) {
        $(".cfo-page-left").attr("disabled", "disabled");
        $(".cfo-page-right").removeAttr("disabled");
      }
    });

    bindCoursesLink();
  });

  // function to generate CSV reoort for selected info cards
  function generatePDF(cards) {
    // pdfkit js
    // create a document and pipe to a blob
    var doc = new PDFDocument({
      bufferPages: true
    });
    var stream = doc.pipe(blobStream());
   // loadFont('SourceSansPro', 'woff', window.federalist.path.baseurl + '/fonts/source-sans-pro/sourcesanspro-regular-webfont.woff2');
   // loadFont('SourceSansPro-Bold', 'woff', window.federalist.path.baseurl + '/fonts/source-sans-pro/sourcesanspro-bold-webfont.woff2');

    stream.on('finish', function () {
      const blob = stream.toBlob('application/pdf');
      const a = document.createElement('a');
      a.href = window.URL.createObjectURL(blob);
      a.download = "CareerPlanningCards"
      a.style.position = 'fixed';
      a.target = '_blank';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    });

    let bold = 'Helvetica-Bold';
    let norm = 'Helvetica';
    let elem = document.createElement('div');


    for (let i = 0, l = cards.length; i < l; i++) {
      let card = cards[i];
      if (i != 0) {
        doc.addPage();
      }
      doc.fontSize(12);
      doc.fillColor('black');
      let column_width = (doc.page.width - doc.page.margins.left - doc.page.margins.right) / 2;
      doc.font(bold).text('Job Series: ', {continued: true}).font(norm).text(card.series + ' ' + card.title);
      doc.font(bold).text('GS Level: ', { continued: true }).font(norm).text(card.level);
      doc.font(bold).text('Competency: ', { continued: true }).font(norm).text(card.competency);
      doc.font(bold).text('Type: ', { continued: true }).font(norm).text(card.competency_group);
      doc.moveDown(1);
      doc.font(bold).text('Definition: ', {continued: true}).font(norm).text(card.competency_description);
      doc.moveDown(2);
      elem.innerHTML = card.content;
      let items = [];
      doc.font(bold).text('Behavior Illustrations');
      $(elem).find('> div:first-child dl *').each(function () {
        if (this.nodeName == 'DT') {
          if (items.length) {
            doc.font(norm).list(items, doc.page.margins.left + 30, null, { bulletRadius: 2 });
            items.length = 0;
          }
          doc.moveDown(1);
          doc.font(bold).text(this.innerText, doc.page.margins.left, null, { indent: 18 });
        }
        else if (this.nodeName == 'DD') {
          items.push(this.innerText.trim());
        }
      });
      if (items.length) {
        doc.font(norm).list(items, doc.page.margins.left + 30, null, { bulletRadius: 2 });
      }
      doc.moveDown(2);
      doc.font(bold).text('Proficiency Level Definition', doc.page.margins.left);
      items = [];
      $(elem).find('> div:nth-child(2) dl *').each(function () {
        if (this.nodeName == 'DT') {
          if (items.length) {
            doc.font(norm).list(items, doc.page.margins.left + 30, null, { bulletRadius: 2 });
            items.length = 0;
          }
          doc.moveDown(1);
          doc.font(bold).text(this.innerText, doc.page.margins.left, null, { indent: 18 });
        }
        else if (this.nodeName == 'DD') {
          items.push(this.innerText.trim());
        }
      });
      if (items.length) {
        doc.font(norm).list(items, doc.page.margins.left + 30, null, { bulletRadius: 2 });
      }
      doc.moveDown(2);
      doc.font(bold).text('Vendor Course Listings', doc.page.margins.left);
      doc.moveDown(1);
      const parser = new DOMParser();

      if (!card.relevant_courses || card.relevant_courses.length === 0) {
        doc.font(norm).text('No Courses yet.');
      }
      else {
        for (let j = 0, k = card.relevant_courses.length; j < k; j++) {
          doc.fillColor('black').text('    \u2022 ', { underlione: false, continued: true})
            let elems = card.relevant_courses[j].split('</a>, ');
          doc.font(norm);
          for (let i = 0, l = elems.length; i < l; i++) {
            if (elems[i].indexOf('<a') == -1) {
              doc.fillColor('black').text(elems[i], {
                underline: false,
                continued: true
              });
            }
            else {
              const parseDoc = parser.parseFromString(elems[i], 'text/html');
              const link = parseDoc.querySelector('a');
              if (link) {
                const url = link.getAttribute('href');
                const anchorText = link.textContent;
                doc.fillColor('blue').text(anchorText, {
                  underline: true,
                  link: url,
                  continued: true
                });
              }
            }
            if (i != l - 1) {
              doc.fillColor('black').text(', ', {
                underline: false,
                continued: true
              });
            }
            else {
              doc.text(' ', {
                underline: false
              })
            }
          }
        }
      }
    }

    doc.end();
  }

  // function to generate CSV reoort for selected info cards
  function generateCSV(cards) {
    const parser = new DOMParser();
    csvrows = [];
    let elem = document.createElement('div');
      csvrows.push(['Job Series', 'GS Level', 'Competency', 'Type', 'Definition', 'Behavior Illustrations', 'Proficiency Level Definition', 'Vendor Course Listings' ]);
    for (let i = 0, l = cards.length; i < l; i++) {
      let card = cards[i];
      /**/

      elem.innerHTML = card.content;
      var strBI = "";
      let items = [];
      $(elem).find('> div:first-child dl *').each(function () {
        if (this.nodeName == 'DT') {
          if (items.length) {
            strBI = strBI + "\n";
            strBI = strBI + items;
            items.length = 0;
          }
          if (strBI.length > 1) {
            strBI = strBI + "\n";
          }
          strBI = strBI + this.innerText;
        }
        else if (this.nodeName == 'DD') {
          items.push(this.innerText.trim());
        }
      });
      if (items.length) {
        strBI = strBI + "\n";
        strBI = strBI + items;
      }

      var strPLD = "";
      items = [];
      $(elem).find('> div:nth-child(2) dl *').each(function () {
        if (this.nodeName == 'DT') {
          if (items.length) {
            strPLD = strPLD + "\n";
            strPLD = strPLD + items;
            items.length = 0;
          }
          if (strPLD.length > 1) {
            strPLD = strPLD + "\n";
          }
          strPLD = strPLD + this.innerText;
        }
        else if (this.nodeName == 'DD') {
          items.push(this.innerText.trim());
        }
      });
      if (items.length) {
        strPLD = strPLD + "\n";
        strPLD = strPLD + items;
      }

      var strCL = "";
      items = [];

      if (!card.relevant_courses || card.relevant_courses.length === 0) {
        strCL = 'No Courses yet.';
      }
      else {
        for (let j = 0, k = card.relevant_courses.length; j < k; j++) {
            let elems = card.relevant_courses[j].split('</a>, ');
          for (let m = 0, n = elems.length; m < n; m++) {
            if (elems[m].indexOf('<a') == -1) {
              let CLtext = elems[m];
              while (CLtext.indexOf("&") != -1) {
                CLtext = CLtext.replace("&", " ")
              }
              while (CLtext.indexOf("#") != -1) {
                CLtext = CLtext.replace("#", " ")
              }
              while (CLtext.indexOf(";") != -1) {
                CLtext = CLtext.replace(";", " ")
              }
                strCL = strCL + CLtext + "\n";
            }
            else {
                const parseDoc = parser.parseFromString(elems[m], 'text/html');
                const link = parseDoc.querySelector('a');
                if (link) {
                    const url = link.getAttribute('href');
                    const anchorText = link.textContent;
                    strCL = strCL + anchorText + " (" + url + ")";
                }
            }
            if (m != n - 1) {
              strCL = strCL + ", ";
            }
            else {
              strCL = strCL + ""
            }
          }
        }
      }

      csvrows.push(['"' + card.series + ' ' + card.title + '"', '"=""' + card.level + '"""', '"' + card.competency + '"', '"' + card.competency_group + '"', '"' + card.competency_description + '"', '"' + strBI + '"', '"' + strPLD + '"', '"' + strCL + '"']);

    }

    let csvContent = "data:text/csv;charset=utf-8,";

    csvrows.forEach(function (rowArray) {
      let row = rowArray.join(",");
      csvContent += row + "\r\n";
    });

    var encodedUri = encodeURI(csvContent);
    var link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "CareerPlanningCards.csv");
    link.setAttribute("aria-label", "Download csv");
    document.body.appendChild(link); // Required for FF

    link.click();

  }

  function loadFont(name, type, url, ff) {
    var callback=registerFont;
    var request = new XMLHttpRequest();
    request.onreadystatechange = function() {
      if (request.readyState==4 && request.status==200) {
        if (type == 'woff') {
          registerFont(request.responseText,name,type,url,ff);
        } else if(type == 'ttf') {
          registerFont(request.response,name,type,url,ff);
        }
      }
    };
    request.open('GET', url, true);
    if (type == 'woff') {
      request.overrideMimeType('text/plain; charset=x-user-defined');
    } else {
      request.responseType = "arraybuffer";
    }
    request.send(null);
  };

  function registerFont(responseText, name, type, url, ff) {
    if (type =='woff'){
      var buf = _base64ToArrayBuffer(btoa(WORF.Converter.woffToSfnt(responseText)));
    } else {
      var buf = responseText;
    }
    PDFDoc.registerFont(name,buf,ff);
  };

  function _base64ToArrayBuffer(base64) {
    var binary_string =  window.atob(base64);
    var len = binary_string.length;
    var bytes = new Uint8Array( len );
    for (var i = 0; i < len; i++)        {
        bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes;
  }

  function stripHtmlTags(str) {
    if (!str || typeof str !== "string") return str;
    return str.replace(/<[^>]*>/g, "|").replace(/&#58;/g, "");
  }

})(jQuery);
