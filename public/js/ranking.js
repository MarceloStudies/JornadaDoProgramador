$(document).ready(function() {
    $("#mostrarRanking").on("click", function() {
    });

    $("#mostrarRanking,#ocultarRanking").click(function () {
        var $profileContainer = $(".ranking-container");
    
        if ($profileContainer.hasClass("hidden")) {
          $profileContainer.removeClass("hidden");
          $profileContainer.addClass("animate-slide-right");
          $profileContainer.removeClass("animate-slide-left");
        } else {
          $profileContainer.removeClass("animate-slide-right");
          $profileContainer.addClass("animate-slide-left");
          setTimeout(function () {
            $profileContainer.addClass("hidden");
          }, 500);
        }
      });
});
