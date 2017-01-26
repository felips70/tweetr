$(function() {
  $("textarea").on("input", function () {
    const maxLength = 140;
    let inputLength = $(this).val().length;
    let charLeft = maxLength - inputLength;
    let counter = $(this).closest("form").find(".counter");
    counter.text(charLeft);

    if(charLeft < 0) {
      counter.css({
        "color": "red"
      })
    } else {
      counter.css({
        "color": "black"
      })
    }
  });
});
