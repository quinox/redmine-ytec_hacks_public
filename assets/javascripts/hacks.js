/* global $ */

/*
 * Replace >> characters in project dropdowns with empty indentation, to allow search as you type.
 */
$(document).ready(function() {
  var PROJECT_OPTIONS_SELECTOR = '#project_quick_jump_box > option, #issue_project_id > option';

  $(PROJECT_OPTIONS_SELECTOR).each(function(i, el) {
    var $this = $(this);
    $this.html($this.text().replace('»', '&nbsp;&nbsp;'));
  });
});

/*
 * Wrap pasted stacktraces in a <pre><code> block
 *
 */
$(document).ready(function() {
  var ISSUE_DESCRIPTION_SELECTOR = '#issue_description';
  var start_pos = 0;

  var wrap_stacktraces = function() {
    var input_field = $(ISSUE_DESCRIPTION_SELECTOR).first();
    start_pos = doGetCaretPosition(input_field[0]);
    // There is only an "I'm about to paste" event, so we'll use
    // setTimeout to run the rest of the code after the paste is done.
    setTimeout(function() {
      var end_pos = doGetCaretPosition(input_field[0]);
      var input_field_text = input_field.val();
      var pasted = input_field_text.substring(start_pos, end_pos);
      var pasted_cleaned = pasted.replace(/^[ \t\n]+|[ \t\n]+$/g, '');
      var pasted_cleaned_length = pasted_cleaned.length;
      var start_needle_1 = 'Traceback (most recent call last):\n';
      var start_needle_2 = 'Internal Server Error: /';
      var end_needle = "wsgi.version': (1, 0)}>";
      var pasted_start_1 = pasted_cleaned.substring(0, start_needle_1.length);
      var pasted_start_2 = pasted_cleaned.substring(0, start_needle_2.length);
      var pasted_end = pasted_cleaned.substring(pasted_cleaned_length - end_needle.length);
      if ((pasted_start_1 == start_needle_1) || (pasted_start_2 == start_needle_2) && pasted_end == end_needle) {
        var new_text = input_field_text.substring(0, start_pos) + '<pre><code class="python">\n' + pasted_cleaned + '\n</code></pre>' + input_field_text.substring(end_pos);
        input_field.val(new_text);
      }
    });

  };
  var doGetCaretPosition = function (oField) {
    // Copied from http://stackoverflow.com/questions/2897155/get-cursor-position-within-an-text-input-field?answertab=votes#tab-top
    var iCaretPos = 0;
    // IE Support
    if (document.selection) {
      oField.focus();
      var oSel = document.selection.createRange(); // To get cursor position, get empty selection range
      oSel.moveStart ('character', -oField.value.length); // Move selection start to 0 position
      iCaretPos = oSel.text.length; // The caret position is selection length
    }
    // Firefox support
    else if (oField.selectionStart || oField.selectionStart == '0') {
      iCaretPos = oField.selectionStart;
    }
    // Return results
    return (iCaretPos);
  };

  $(ISSUE_DESCRIPTION_SELECTOR).on('paste', wrap_stacktraces);
});



/*
 * Auto add images as !filename.png! to your test
 *
 */
$(document).ready(function() {
  if (window.addInputFiles === undefined) {
    return;
  }

  var suitable_filename = /^[^ ]+\.(png|jpg|jpeg)$/;  // no spaces, image
  var original_addInputFiles = addInputFiles;

  var ytecAddInputFiles = function(inputfile) {
    var dom_to_add_to = null;
    if (!dom_to_add_to) {
      dom_to_add_to = document.getElementById('issue_notes');
    }
    if (!dom_to_add_to) {
      dom_to_add_to = document.getElementById('issue_description');
    }

    if (dom_to_add_to) {
      var text = dom_to_add_to.value;
      if (text == '' || text.endsWith('\n')) {
        for (var i = 0; i < inputfile.files.length; i++) {
          var filename = inputfile.files[i].name;
          if (suitable_filename.test(filename)) {
            dom_to_add_to.value += '!' + filename + '!\n\n';
          }
        }
      }
    }
  };

  window.addInputFiles = function() {
    try {
      ytecAddInputFiles(arguments[0]);
    } catch (e) {
      console.log('Failed to run custom addInputFiles hook:' + e);
    }
    original_addInputFiles.apply(this, arguments);
  };
});




/*
 *  Empty project dropdown when making issues
 *
 */
$(document).ready(function() {
  var url = new URL(document.location);
  if (url.searchParams.has('ytec_empty_project_dropdown')) {
    $('#issue_project_id').val('').attr('required', true);
  }
});
