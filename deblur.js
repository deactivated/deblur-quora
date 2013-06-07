/*global: Spinner*/
(function ($) {
  "use strict";

  var spinner_opts = {
    lines: 11, // The number of lines to draw
    length: 11, // The length of each line
    width: 12, // The line thickness
    radius: 6, // The radius of the inner circle
    corners: 1, // Corner roundness (0..1)
    rotate: 0, // The rotation offset
    direction: 1, // 1: clockwise, -1: counterclockwise
    color: '#000', // #rgb or #rrggbb
    speed: 1.2, // Rounds per second
    trail: 36, // Afterglow percentage
    shadow: false, // Whether to render a shadow
    hwaccel: true, // Whether to use hardware acceleration
    className: 'spinner', // The CSS class to assign to the spinner
    zIndex: 2e9, // The z-index (defaults to 2000000000)
    top: 'auto', // Top position relative to parent in px
    left: 'auto' // Left position relative to parent in px
  };

  function extractAnswer(page) {
    var $page = $(page);

    return $page
      .find("div.answer_content div[id$='_container']")
      .html();
  }

  function getAnswer(user) {
    var
    answer_url = (document.location.origin + document.location.pathname +
                  "/answer/" + user),
      dfd = new jQuery.Deferred();

    console.log("requesting: " + answer_url);
    $.get(answer_url, function (resp) {
      var answer = extractAnswer(resp);
      dfd.resolve(answer);
    }).fail(function () {
      dfd.reject();
    });

    return dfd;
  }

  function hookAnswer(e) {
    var $answer, $user, $text, user_href, spinner;

    $answer = $(this).closest('div.answer_wrapper');

    if ($answer.data('quora-deblurred') !== undefined) {
      return;
    } else {
      $answer.data('quora-deblurred', true);
    }

    $text = $answer.find("div.answer_content");

    spinner = new Spinner(spinner_opts).spin(this);

    $user = $answer.find("div.answer_user a.user");
    user_href = $user.attr('href');

    $.when(getAnswer(user_href)).then(function (answer_html) {
      $text.html(answer_html);
      spinner.stop();
    });
  }

  function injectAssets() {
    var tag = document.createElement('script');
    tag.setAttribute('src', chrome.extension.getURL("injected.js"));
    document.body.appendChild(tag);

    tag = document.createElement('link');
    tag.setAttribute('href', chrome.extension.getURL("styles.css"));
    tag.setAttribute('rel', "stylesheet");
    tag.setAttribute('type', "text/css");
    document.head.appendChild(tag);
  }

  injectAssets();

  $(document).on("click", "div.blurred_answer", hookAnswer);
}(jQuery));
