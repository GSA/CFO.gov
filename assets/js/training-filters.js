$(document).ready(function () {
  async function fetchData() {
    try {
      const response = await fetch('/assets/CPTT/courses.json');
      if (!response.ok) {
        throw new Error('Network response was not ok for courses.json');
      }
      return response.json();  // Return the parsed JSON data
    } catch (error) {
      console.error('Error fetching data:', error);
      return null;  // Return null in case of error
    }
  }

  // Use .then() for further processing
  fetchData().then(data => {
    if (data && data.length > 0) {
      var priceColumn = data[0].price;
      var competencyColumn = data[0].competency;
      var gsLevelColumn = data[0].gs_level;
      var jobSeriesColumn = data[0].job_series;

      // JSON data to populate the table
      const courses = data.slice(1);

      // Initialize DataTable with custom configs
      var table = $('#training-courses-table').DataTable({
        data: courses,
        dom: 'Bfrt',
        buttons: [
          {
            extend: 'csvHtml5',
            exportOptions: {
              modifier: {
                selected: true
              },
              columns: ':gt(0):lt(6)',
            },
            customize: function(csv) {
              var csvData = [];
              csv.split('\n').forEach(function(row, index) {
                if (row.trim().length > 0) { // Check for non-empty rows
                  var rowData = row.split(',');
                  if (index === 0) {
                    rowData.push('Course Description', 'Additional Course Information'); // Add headers
                  } else if (index <= data.length) {
                    rowData.push(data[index - 1].course_description, data[index - 1].additional_course_information); // Add data
                  }
                  csvData.push(rowData.join(','));
                }
              });
              return csvData.join('\n');
            }
          },
          {
            extend: 'pdfHtml5',
            exportOptions: {
              modifier: {
                selected: true
              },
              columns: ':gt(0):lt(6)',
            },
            customize: function(doc) {
              var body = doc.content[1].table.body;
              body[0].push('Course Description', 'Additional Course Information'); // Add headers
              data.forEach(function(rowData, index) {
                if (index < body.length - 1) {
                  body[index + 1].push(rowData.course_description, rowData.additional_course_information); // Add data
                }
              });
            }
          }
        ],
        columns: [
          { data: null, "className": 'dt-control', "orderable": false, "defaultContent": ''}, //accordion columnn
          { data: 'course_title', render: function(data, type, row) { return '<a href="' + (row.link || '#') + '" target="_blank" rel="noopener noreferrer">' + (data || '') + '</a>'; }, "className": "testFind" },
          { data: 'training_providers', defaultContent: '', "className": "testFind" },
          { data: 'course_duration_num', render: function(data, type, row) { return data ? (data.toString() + ' ' + row.course_duration_attribute) : ''; }, defaultContent: '', "className": "testFind"  },
          { data: 'learning_modality', defaultContent: '' },
          { data: 'course_credit_type', render: function(data) { return Array.isArray(data) ? data.join(', ') : (data || ''); }, defaultContent: '' },
          { data: 'price', render: function (data, type, row, meta) { return data ? ('$' + data.toLocaleString('en-US', { minimumFractionDigits: 2 })) : ''; }},
          { "orderable": false, "render": DataTable.render.select(), "defaultContent": ''},
          {
            data: 'competency',
            render: function (data, type, row, meta) {
              if (Array.isArray(data)) {
                return data.map(function(item) {
                  return item.toLowerCase().replace(/[\s,]+/g, '-');
                }).join(', ');
              } else {
                return data.toLowerCase().replace(/[\s,]+/g, '-');
              }
            },
            defaultContent: '',
            visible: false
          },
          { data: 'job_series', render: function (data, type, row, meta) { return Array.isArray(data) ? data.join(', ') : (data || ''); }, defaultContent: '', visible: false},
          { data: 'gs_level', render: function (data, type, row, meta) { return Array.isArray(data) ? data.join(', ') : (data || ''); }, defaultContent: '', visible: false}
        ],
        createdRow: (row, data, index) => { row.querySelector(':nth-child(7)').setAttribute("data-filter", data["price"]);},
        select: {
          style: 'multi',
          selector: 'td:nth-child(8)',
          className: 'no-background-color', // disable row highlighting
          headerCheckbox: false
        },
        paging:   true,
        ordering: false // Disable sorting for all columns
      });
      $(table.table().container()).css('overflow-x', 'auto');

      //update pagination on every draw
      table.on('draw.dt', function() {
        $('.cfo-pagination-page').text(table.page.info().page + 1);
        $('.cfo-pagination-pages').text(table.page.info().pages);
        $('.cfo-pagination-results').text(table.page.info().recordsDisplay);
        updateButtonState();
      });

      function updateButtonState() {
        var info = table.page.info();
        $('.training-page-left').prop('disabled', info.page === 0);
        $('.training-page-right').prop('disabled', info.page === (info.pages - 1));
      }

      $('.training-page-left').click(function() {
        table.page('previous').draw('page');
        updateButtonState();
      });

      $('.training-page-right').click(function() {
        table.page('next').draw('page');
        updateButtonState();
      });

      $('#per-page-top').change(function() {
        var length = $(this).val();
        table.page.len(length).draw();
        updateButtonState();
      })

      // Draw the table
      table.draw();

      // Object to store active filters for each column
      var activeFilters = {};
      var minBtn = 0;
      var maxBtn = 0;
      //var searchKeyword = '';

      // Apply toggle functionality to filter buttons
      $('.filterBtn').on('click', function () {
        var $btn = $(this);
        var columnIndex =  $btn.data('column-num');
        var filterValue = $btn.data('filter');
        minBtn = $btn.data('min');
        maxBtn = $btn.data('max');

        if (!activeFilters[columnIndex]) {
          activeFilters[columnIndex] = new Set();
        }

        // Toggle active class
        if ($btn.hasClass('active')) {
          $btn.removeClass('active');
          if (columnIndex == priceColumn) {
            activeFilters[columnIndex].delete(minBtn);
          } else {
            activeFilters[columnIndex].delete(filterValue);
          }
        } else {
          $btn.addClass('active');
          if (columnIndex == priceColumn) {
            activeFilters[columnIndex].add(minBtn);
          } else {
            activeFilters[columnIndex].add(filterValue);
          }
        }

        if (activeFilters[columnIndex].has('all')) {
          activeFilters[columnIndex].clear();
          activeFilters[columnIndex].add('all');
        }

        // Apply the filters
        table.draw();
        window.history.replaceState({}, "", "/training-resources/");
      });

      // Event handler for checkboxes
      $('input[type="checkbox"]:not(.dt-select-checkbox)').on('change', function() {
        var $checkbox = $(this);
        var filterValue = $checkbox.data('id');
        var competencyType = $checkbox.data('group');

        if (!activeFilters['competency']) {
          activeFilters['competency'] = new Set();
        }

        if ($checkbox.is(':checked')) {
          activeFilters['competency'].add(filterValue);
        } else {
          activeFilters['competency'].delete(filterValue);
        }
        // Apply the filters
        table.draw();
      });

      // Function to format accordion row
      function format(d) {
        return (
          '<div class="grid-container">' +
          '<div class="grid-row">' +
          '<div class="tablet:grid-col">' +
          '<dl>' +
          '<dt>Course Description</dt>' +
          "<p>" + d['course_description'] + "</p>" +
          '</dl>' +
          '</div>' +
          '<div class="tablet:grid-col">' +
          '<dl>' +
          '<dt>Additional Course Information</dt>' +
          "<p>" + d['additional_course_information'] + "</p>" +
          '</dl>' +
          '</div>' +
          '</div>' +
          '</div>'
        );
      }

      table.on('click', 'td.dt-control', function (e) {
        let tr = e.target.closest('tr');
        let row = table.row(tr);

        if (row.child.isShown()) {
          row.child.hide();
        }
        else {
          row.child(format(row.data())).show();
        }
      });

      // Event handler for "Select All" / "Deselect All" button
      $('#training-download-button-1').on('click', function() {
        var $button = $(this);
        var operation = $button.data('op');

        if (operation === 'select-all') {
          table.rows().select();
          $button.data('op', 'deselect-all').text('DESELECT ALL COURSES');
          var selectedRows = table.rows({ selected: true }).count();
          $('#training-download-button-2').attr('aria-disabled', selectedRows === 0).prop('disabled', false);
          $('#training-download-button-3').attr('aria-disabled', selectedRows === 0).prop('disabled', false);
        } else {
          table.rows().deselect();
          $button.data('op', 'select-all').text('SELECT ALL COURSES');
          $('#training-download-button-2').attr('aria-disabled', true).prop('disabled', true);
          $('#training-download-button-3').attr('aria-disabled', true).prop('disabled', true);
        }
      });

      // Event handler for row selection/deselection
      table.on('select deselect', function() {
        var selectedRows = table.rows({ selected: true }).count();
        $('#training-download-button-2').attr('aria-disabled', selectedRows === 0).prop('disabled', selectedRows === 0);
        $('#training-download-button-3').attr('aria-disabled', selectedRows === 0).prop('disabled', selectedRows === 0);
      });

      // Event handler for PDF download button
      $('#training-download-button-2').on('click', function() {
        table.button('.buttons-pdf').trigger();
      });

      // Event handler for CSV download button
      $('#training-download-button-3').on('click', function() {
        table.button('.buttons-csv').trigger();
      });

      // Custom filtering function
      $.fn.dataTable.ext.search.push(
        function(settings, data, dataIndex) {
          // Handle specific column filters
          for (var columnIndex in activeFilters) {
            var filterValues = Array.from(activeFilters[columnIndex]);
            if (filterValues.length > 0 && !filterValues.includes('all')) {
              var columnData = data[columnIndex];
              //price range filter
              if (columnIndex == priceColumn) {
                columnData = parseFloat(columnData.replace(/\$|,/g, ''));
                const rangeMappings = {
                  0: [0, 500],
                  500: [500, 1000],
                  1000: [1000, 2000],
                  2000: [2000, 10000],
                  10000: [10000, 20000]
                };
                var isInRange = filterValues.some(filterValue => {
                  if (rangeMappings[filterValue]) {
                    let [min, max] = rangeMappings[filterValue];
                    return columnData >= min && columnData < max;
                  }
                  return filterValue === columnData;
                });
                if (!isInRange) {
                  return false;
                }
              } else if (columnIndex == 'competency') {
                var filterValues = Array.from(activeFilters['competency']); //selected checkboxes from filter
                columnData = data[competencyColumn];
                var competencyValues = columnData.split(',').map(value => value.trim()); //competencies for this row
                var found = filterValues.some(filterValue => {
                  return competencyValues.includes(filterValue);
                });
                if (!found) {
                  return false;
                }
              } else if (columnIndex == jobSeriesColumn) {
                var jobSeriesValues = columnData.split(',').map(value => value.trim());
                var found = filterValues.some(filterValue => {
                  return jobSeriesValues.includes(filterValue);
                });
                if (!found) {
                  return false;
                }
              } else if (columnIndex == gsLevelColumn) {
                var gsLevelValues = columnData.split(',').map(value => value.trim());
                var found = filterValues.some(filterValue => {
                  return gsLevelValues.includes(filterValue);
                });
                if (!found) {
                  return false;
                }
              } else {
                //filtering for all other columns
                if (!filterValues.includes(columnData)) {
                  return false;
                }
              }
            }
          }
          return true;
        }
      );

      $('#career-advancement-search-input-training-resources').autocomplete({
        source: function (request, response) {
          let normalized = request.term.toLowerCase();
          let n = normalized.length + 40;

          let outputs = data.map(function (item) {
            let duration = stripHtmlTags(item.course_duration_num + item.course_duration_attribute);
            let value = item.course_title;
            // Search by title
            if (value.toLowerCase().indexOf(normalized) != -1) {
              return stripHtmlTags(value);
            }
            else if (item.training_providers.toLowerCase().indexOf(normalized) != -1) {
              return stripHtmlTags(item.training_providers);
            }
            // Search by Proficiency Level Definition
            else if (duration.toLowerCase().indexOf(normalized) != -1) {
              return duration;
            }
            // Search by Behavioral Illustrations
            else if (item.learning_modality.toLowerCase().indexOf(normalized) != -1) {
              return stripHtmlTags(item.learning_modality);
            }
            else if (item.course_credit_type.toLowerCase().indexOf(normalized) != -1) {
              return stripHtmlTags(item.course_credit_type);
            }
            // else if (item.price.toString().indexOf(normalized) != -1) {
            //   return stripHtmlTags(item.price);
            // }
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
          $('#cfo-search-button-tr').click();
        },
        change: function (event, ui) {
        }
      });

      function stripHtmlTags(str) {
        if (!str || typeof str !== "string") return str;
        return str.replace(/<[^>]*>/g, "|").replace(/&#58;/g, "");
      }

      $('#cfo-search-button-tr').on('click', function () {
        searchKeyword = $("#career-advancement-search-input-training-resources").val().trim().split('...')[0];

        table.search(searchKeyword).draw();
        //table.draw();

        // table.columns().every(function () {
        //   var column = this;
        //   console.log('column? ', column);
        //     column.search(searchKeyword).draw();
        // });

        //.columns(':visible').search(value)
        //table.columns(".testFind").search(searchKeyword).draw();
      })

      function toggleCheckboxes(group) {
        event.preventDefault();
        const $checkboxes = $(`input[data-group="${group}"]`);
        const $label = $(`#competency-group-label-${group}-training`);

        if ($label.data('state') === 'enabled') {
          // Deselect all checkboxes
          $checkboxes.prop('checked', false).change();
          $label.html('<strong>SELECT ALL</strong>');
          $label.data('state', 'disabled');
        } else {
          // Select all checkboxes
          $checkboxes.prop('checked', true).change();
          $label.html('<strong>DE-SELECT ALL</strong>');
          $label.data('state', 'enabled');
        }
        updateSelectAllState(group);
        table.draw();
      }

      function toggleAllCheckboxes(event, competencyType) {
        event.preventDefault();
        var groups = [];
        if (competencyType === 'job-career-competency-select-training') {
          groups = ['primary', 'secondary', 'alternate'];
        } else {
          groups = ['personal', 'leading', 'projects'];
        }
        const $globalLabel = $(`#${competencyType}`);
        const shouldSelectAll = $globalLabel.text().trim() === 'SELECT ALL';

        groups.forEach(group => {
          const $checkboxes = $(`input[data-group="${group}"]`);
          const $label = $(`#competency-group-label-${group}-training`);

          $checkboxes.prop('checked', shouldSelectAll).change();
          $label.html(shouldSelectAll ? '<strong>DE-SELECT ALL</strong>' : '<strong>SELECT ALL</strong>');
          $label.data('state', shouldSelectAll ? 'enabled' : 'disabled');
        });
        $globalLabel.html(shouldSelectAll ? '<strong>DE-SELECT ALL</strong>' : '<strong>SELECT ALL</strong>');
        table.draw();
      }

      function updateSelectAllState(competencyType) {
        const groups = competencyType === 'job-career-competency-select-training' ? ['primary', 'secondary', 'alternate'] : ['personal', 'leading', 'projects'];

        let allChecked = true;
        groups.forEach(group => {
          const $checkboxes = $(`input[data-group="${group}"]`);
          let groupAllChecked = true;
          $checkboxes.each(function() {
            if (!$(this).prop('checked')) {
              allChecked = false;
              groupAllChecked = false;
              return false;
            }
          });
          const $groupLabel = $(`#competency-group-label-${group}-training`);
          $groupLabel.html(groupAllChecked ? '<strong>DE-SELECT ALL</strong>' : '<strong>SELECT ALL</strong>');
          $groupLabel.data('state', groupAllChecked ? 'enabled' : 'disabled');
        });

        const $globalLabel = $(`#${competencyType}`);
        $globalLabel.html(allChecked ? '<strong>DE-SELECT ALL</strong>' : '<strong>SELECT ALL</strong>');
      }

      ['primary', 'secondary', 'alternate', 'personal', 'leading', 'projects'].forEach(group => {
        const $button = $(`#competency-group-label-${group}-training`);
        $button.on('click', () => toggleCheckboxes(group));
        const competencyType = group === 'primary' || group === 'secondary' || group === 'alternate' ? 'job-career-competency-select-training' : 'general-career-competency-select-training';
        $(`input[data-group="${group}"]`).on('change', () => updateSelectAllState(competencyType));
      });

      // Add event listener for the global select all button
      const $jobCareerAll = $('#job-career-competency-select-all-training');
      $jobCareerAll.on('click', (event) => toggleAllCheckboxes(event, 'job-career-competency-select-training'));
      const $generalSelectAll = $('#general-career-competency-select-all-training');
      $generalSelectAll.on('click', (event) => toggleAllCheckboxes(event, 'general-career-competency-select-training'));

      function onHashChange() {

        var indexMap = {};

        indexMap["level"] = gsLevelColumn;
        indexMap["series"] = jobSeriesColumn;

        // Current hash value
        var hashFilter = getHashFilter();
        // Concatenate priority_area and type for Isotope filtering
        // + hashFilter["status"];

        if (hashFilter) {
          // Repaint Isotope container with current filters and sorts
          for (var key in hashFilter) {
            if(key != "competency" && key != "competencygroup") {
              var columnIndex = indexMap[key];
              activeFilters[columnIndex] = new Set();
              activeFilters[columnIndex].add(hashFilter[key]);
              // Toggle checked status of sort button
              // Toggle checked status of filter buttons
              $(".tr-filter-list").find("[data-filter='" + hashFilter["series"] + "'],[data-filter='" + hashFilter["level"] + "']").addClass("active").attr("aria-checked", "true");
            } else if (key == "competency") {
              var comp= hashFilter[key];
              var compGroup = hashFilter["competencygroup"];
              activeFilters['competency'] = new Set();
              activeFilters['competency'].add(hashFilter[key]);
              let $groupElem = $('#competency-group-button-' + compGroup.toLowerCase());
              $groupElem.attr('aria-label', ' ' + compGroup + ', expanded');
              let $parentElem = $('.' + compGroup.toLowerCase());
              $('.' + compGroup.toLowerCase()).find(".career-competency-input-groups").show();
              var $elemToCheck = $('#'+compGroup.toLowerCase() + '-' + hashFilter[key]);
              $elemToCheck.prop('checked', true);
              $('.' + compGroup.toLowerCase()).find('.fa').removeClass('fa-plus');
              $('.' + compGroup.toLowerCase()).find('.fa').addClass('fa-minus');

            }
          }
          table.draw();
        }
      } // onHahschange

      function getHashFilter() {
        var series = location.hash.match(/series=([^&]+)/i);
        var levelRaw = location.hash.match(/level=([^&]+)/i);
        var competencyRaw = location.hash.match(/competency=([^&]+)/i);
        var competencyGroup = location.hash.match(/competencygroup=([^&]+)/i);

        var level = levelRaw[1].replaceAll('%20', ' ');
        var competency = competencyRaw[1].toLowerCase().replaceAll('%20', '-').replaceAll(',', '');
        seriesMap = {};
        seriesMap["0501"] = "0501 Financial Administration and Program Support";
        seriesMap["0560"] = "0560 Budget Analysis";
        seriesMap["0511"] = "0511 Auditing";
        seriesMap["0510"] = "0510 Accounting";

        // Set up a hashFilter array
        var hashFilter = {};
        // Populate array with matches and sorts using ternary logic
        hashFilter["series"] = series ? seriesMap[series[1]] : "*";
        hashFilter["level"] = level? level : "*";
        hashFilter["competency"] = competency ? competency : "*";
        hashFilter["competencygroup"] = competencyGroup ? competencyGroup[1] : "*";


        return hashFilter;
      } // getHashFilter

      // When the hash changes, run onHashchange

      // When the page loads for the first time, run onHashChange
      onHashChange();

    } else {
      console.error('JSON data is empty or malformed');
    }
  });
});