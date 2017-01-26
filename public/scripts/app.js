/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

// Test / driver code (temporary). Eventually will get this from the server.
$(function(){

 function createdAt(ms){
  const miliSecs = Date.now() - ms;
  if (miliSecs >= 86400000) {
    days = (miliSecs / 86400000);
    return (Math.floor(days) + " days ago");
  }
  if (miliSecs >= 3600000) {
    hours = (miliSecs / 3600000);
    return (Math.floor(hours) + " hours ago");
  }
  if (miliSecs >= 60000) {
    minutes = (miliSecs / 60000);
    return (Math.floor(minutes) + " minutes ago");
  } else {
    seconds = (miliSecs / 1000) ;
    return (Math.floor(seconds)+ " seconds ago");
  }
 }

  $(".compose-button").click(function () {
    if ($(".new-tweet").is(":animated")) {
      return false;
    }
    $(".new-tweet").slideToggle( "slow", function() {
      $("textarea").focus();
    });
  })

  $("#tweets-container").on("mouseenter", "article", function () {
    $(this).find("header").css("opacity", "1");
    $(this).find(".icons").css("display", "inline-block");
  }).on("mouseleave", "article", function () {
    $(this).find("header").css("opacity", "0.5");
    $(this).find(".icons").css("display", "none");
  })

  function makeHeader(dataObj) {
    const $header = $("<header>");
    const $avatar = $("<img>").attr("src", dataObj.user.avatars.small);
    const $name = $("<h1>").text(dataObj.user.name);
    const $handle = $("<h2>").text(dataObj.user.handle);
    $header.append($avatar, $name, $handle);
    return $header;
  }

  function makeFooter (dataObj) {
    const $footer = $("<footer>");
    const $date = $("<span>").text(createdAt(dataObj.created_at)).addClass("date");
    const $flag = $("<i>").addClass("fa fa-flag").attr("aria-hidden", true);
    const $retweet = $("<i>").addClass("fa fa-retweet").attr("aria-hidden", true);
    const $heart = $("<i>").addClass("fa fa-heart").attr("aria-hidden", true);
    let $icon = $("<span>").addClass("icons");
    $icon.append($flag, " ", $retweet, " ", $heart);
    $footer.append($date, $icon);
    return $footer;
  }

  function makeContent (dataObj) {
    const $content = $("<p>").text(dataObj.content.text);
    return $content;
  }

  function createTweetElement(dataObj) {
    $aTweet = $("<article>");
    $header = makeHeader(dataObj);
    $content = makeContent(dataObj);
    $footer = makeFooter(dataObj);
    $aTweet.append($header, $content, $footer);
    $("#tweets-container").prepend($aTweet);
  }

  function renderTweets(tweets) {
    tweets.forEach((tweet) => {
      createTweetElement(tweet);
    });
  }

  function loadTweets() {
  $.ajax({
    url: '/tweets',
    methods: 'get',
    dataType: 'JSON',
    success: function (result) {
      renderTweets(result);
      }
    });
  }

  loadTweets();

  $('#compose-tweet').on('submit', function (event) {
    event.preventDefault();
    if ($("textarea").val() === '') {
      alert('Please write your tweet');
    } else if ($("textarea").val().length > 140) {
      alert('Please make sure that you tweet is less than 140 characters');
    } else {
      $.ajax({
      url: '/tweets',
      method: 'post',
      data: $(this).serialize(),
      success: function () {
        $("#tweets-container").empty();
        loadTweets();
        $("textarea").val('');
      }
      });
    }
  });
});