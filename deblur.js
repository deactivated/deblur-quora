(function ($) {
  "use strict";

  function extractAnswer(page) {
    var $page = $(page);

    return $page
      .find("div.answer_content div[id$='_container']")
      .html();
  }

  function getAnswer(user) {
    var
      answer_url = document.location.href + "/answer/" + user,
      dfd = new jQuery.Deferred();

    $.get(answer_url, function (resp) {
      var answer = extractAnswer(resp);
      dfd.resolve(answer);
    }).fail(function () {
      dfd.reject();
    });

    return dfd;
  }

  function hookAnswer() {
    var $answer, $user, $text, user_href;

    $answer = $(this).closest('div.answer_wrapper');

    if ($answer.data('quora-deblurred') !== undefined) {
      return;
    } else {
      $answer.data('quora-deblurred', true);
    }

    $text = $answer.find("div.answer_content");

    $user = $answer.find("div.answer_user a.user");
    user_href = $user.attr('href');

    $.when(getAnswer(user_href)).then(function (answer_html) {
      console.log("got answer");
      $text.html(answer_html);
    });
  }

  $("div.blurred_answer").on("click", hookAnswer);
}(jQuery));
