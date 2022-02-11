(function ($) {
  let selected = {},
    unselect = false,
    buttonSelector = '.policy input[type="checkbox"]',
    downloadButton;
  
  window.isSelected = function (val) {
    return (typeof selected[val] != 'undefined');
  }
  
  window.unselectAll = function () {
    selected = {};
    unselect = false;
    $('button[data-op="select-all"]').text('Select All Cards');
    $('#career-search-results').find(buttonSelector).prop('checked', false);
    downloadButton.prop('aria-disabled', true).prop('disabled', true);
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
      downloadButton.prop('aria-disabled', disable).prop('disabled', disable);
    });
    
    $('button[data-op="select-all"]').click(function () {
      if (unselect) {
        unselectAll();
      }
      else {
        for (let i = 0, l = results.length; i < l; i++) {
          selected[results[i].permalink] = true;
        }
        unselect = true;
        this.innerText = 'Deselect All Cards';
        $('#career-search-results').find(buttonSelector).prop('checked', true);
      }
      
      let disable = Object.keys(selected).length == 0;
      downloadButton.prop('aria-disabled', disable).prop('disabled', disable);
    });
    
    downloadButton = $('#career-download-buttons').find('[data-op="download-selected"]').click(function () {
      let cards = [];
      for (let i = 0, l = results.length; i < l; i++) {
        if (typeof selected[results[i].permalink] != 'undefined') {
          cards.push(results[i]);
        }
      }
      generatePDF(cards);
    });
    
    $('#career-advancement-search-input').autocomplete({
      source: function (request, response) {
        let normalized = request.term.toLowerCase()
        let outputs = fullSet.map(function (item) {
          let value = item.title;
          if (value.toLowerCase().indexOf(normalized) != -1) {
            return value;
          }
          else if (item.job_series.toLowerCase().indexOf(normalized) != -1) {
            return value;
          }
          else if (item.competency.toLowerCase().indexOf(normalized) != -1) {
            return value;
          }
          else if (item.competency_description.toLowerCase().indexOf(normalized) != -1) {
            return value;
          }
          else if (item.proficiency_level_definition.toLowerCase().indexOf(normalized) != -1) {
            return value;
          }
          else if (item.behavioral_illustrations.toLowerCase().indexOf(normalized) != -1) {
            return value;
          }
          else if (item.relevant_courses.toLowerCase().indexOf(normalized) != -1) {
            return value;
          } 
          return null;
        });
        outputs = outputs.filter(function (x) { return !!x });
        response(outputs);
      }
    });
    
    $('select[name="per_page"]').change(function (e) {
      perPage = $(this).val();
      getSearch();
      $('select[name="per_page"]').val(perPage);
    });
  });
  
  
  
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
      doc.font(bold).text(card.title);
      doc.moveDown(1);
      doc.font(bold).text('GS Level: ', {continued: true}).font(norm).text(card.level);
      doc.moveDown(1);
      doc.font(bold).text('Competency Description: ', {continued: true}).font(norm).text(card.competency_description);
      doc.moveDown(2);
      elem.innerHTML = card.content;
      doc.font(bold).text('Behavior Illustrations');
      $(elem).find('> div:first-child dl *').each(function () {
        if (this.nodeName == 'DT') {
          doc.moveDown(1);
          doc.font(bold).text(this.innerText, doc.page.margins.left, null, { indent: 18 });
        }
        else if (this.nodeName == 'DD') {
          doc.font(norm).text(this.innerText, doc.page.margins.left + 36, null, { width: doc.page.width - doc.page.margins.left - doc.page.margins.right });
        }
      });
      doc.moveDown(2);
      doc.font(bold).text('Proficiency Level Definition', doc.page.margins.left);
      let items = [];
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
      doc.font(bold).text('Relevant Courses', doc.page.margins.left);
      doc.moveDown(1);
      let courses = $(elem).find('> div:nth-child(3) ul li');
      if (courses.length == 0) {
        doc.font(norm).text('No Courses yet.');
      }
      else {
        courses.each(function () {
          let textNodes = Array.from(this.childNodes).filter(function (x) { return x.nodeType == Node.TEXT_NODE }),
              col1 = textNodes[0],
              col2 = $(this).find('a')[0],
              y = doc.y;
              
          doc.font(norm).fillColor('black').text(col1.wholeText, {
            align: 'left',
          }).moveUp(1).fillColor('blue').text(col2.innerText, {
            align: 'right',
          });
          
          let link_width = doc.widthOfString(col2.innerText),
              height = doc.currentLineHeight(),
              right_edge = doc.page.width - doc.page.margins.right - link_width;
          
          doc.underline(right_edge, y, link_width, height, {color: 'blue'})
             .link(right_edge, y, link_width, height, col2.href);
          
        });
      }
    }
    
    doc.end();
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
})(jQuery);