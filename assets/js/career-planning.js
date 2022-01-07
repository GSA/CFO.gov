(function ($) {
  let selected = {},
    unselect = false,
    buttonSelector = '.policy input[type="checkbox"]';;
  
  window.isSelected = function (val) {
    return (typeof selected[val] != 'undefined');
  }
  
  window.unselectAll = function () {
    selected = {};
    unselect = false;
    this.value = 'Select All';
    $('#career-search-results').find(buttonSelector).prop('checked', false);
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
        this.value = 'Unselect All';
        $('#career-search-results').find(buttonSelector).prop('checked', true);
      }
    });
    
    $('#career-download-buttons').find('[data-op="download-selected"]').click(function () {
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
          return null;
        });
        outputs = outputs.filter(function (x) { return !!x });
        console.log(outputs);
        response(outputs);
      }
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
      doc.font(norm).text(card.level);
      doc.moveDown(1);
      doc.font(bold).text('Proficiency Level Definition');
      doc.moveDown(1);
      doc.font(norm).text(card.proficiency_level_definition);
      doc.moveDown(1);
      doc.font(bold).text('Behavior Illustration');
      doc.moveDown(1);
      doc.font(norm).text(card.behavioral_illustrations);
      doc.moveDown(1);
      doc.font(bold).text('Relevant Courses');
      doc.moveDown(1);
      elem.innerHTML = card.content;
      let courses = $(elem).find('.cfo-courses-outer');
      if (courses.length == 0) {
        doc.font(norm).text('No Courses yet.');
      }
      else {
        courses.each(function () {
          let col1 = this.children[0],
              col2 = this.children[1],
              col3 = this.children[2],
              y = doc.y;
              
          doc.font(norm).fillColor('black').text(col1.innerText, {
            align: 'left',
          }).moveUp(1).text(col2.innerText, {
            align: 'center',
          }).moveUp(1).fillColor('blue').text(col3.innerText, {
            align: 'right',
          });
          
          let link_width = doc.widthOfString(col3.innerText),
              height = doc.currentLineHeight(),
              right_edge = doc.page.width - doc.page.margins.left - doc.page.margins.right + 6;
          
          doc.underline(right_edge, y, link_width, height, {color: 'blue'})
             .link(right_edge, y, link_width, height, $(col3).find('a').attr('href'));
          
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