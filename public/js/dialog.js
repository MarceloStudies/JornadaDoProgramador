var $dialogContainer = $("#dialog");

function plot_dialog() {
  if ($dialogContainer.hasClass("hidden")) {
      $dialogContainer.removeClass("hidden");
      $dialogContainer.addClass("animate-slide-right");
      $dialogContainer.removeClass("animate-slide-left");
  }
}

$(document).ready(function () {
  $("#message").focus(function() {

});
  $("#ocultarDivDialog").click(function () {
    $(".dialog-container").removeClass("animate-slide-right");
    $(".dialog-container").addClass("animate-slide-left");
    setTimeout(function () {
      $(".dialog-container").addClass("hidden");
    }, 500);
  });

  $.fn.recevideMessage = function () {};

  const sendMessage = () => {
    var times = localStorage.getItem("times");
    if (times == null) {
      localStorage.setItem("times", 1);
    } else {
      localStorage.setItem("times", parseInt(times) + 1);
    }

    let Qnttimes = localStorage.getItem("times");
    // if (Qnttimes > 3) {
    //   alert("Voce atingiu o limite maximo de perguntas para esse npc! ");
    //   return;
    // }

    var message = $("#message").val();
    var tipo = parseInt($("#tipo").val())

    $.ajax({
      type: "POST",
      url: "/openai/responder",
      data: { texto: message, tipo: tipo },
      success: function (response) {
        $("#place-message").append(`
        <div class="recevid-message flex flex-row justify-start items-center mb-2">

        <span class="font-tech text-sm text-white ml-2 bg-slate-600 w-1/2 h-10 pl-2 h-full px-2 flex items-center rounded-sm ">${response.resposta}</span>
      </div>
      `);
      },
      error: function (error) {
        console.error(
          "Erro ao enviar solicitação para a OpenAI: " + error.statusText
        );
      },
    });

    $("#place-message").append(`
      <div class="send-message flex flex-row justify-end items-center mb-2">
        <span class="font-tech text-sm text-white mr-2 bg-slate-600 w-1/2 h-10 pr-2 flex items-center  h-full px-2  justify-end rounded-sm ">${message}</span>
      </div>
    `);

    $("#message").val("");
  };

  $("#send-message").click(function () {
    sendMessage();
  });

  $("#message").keypress(function (e) {
    if (e.which == 13) {
      sendMessage();
    }
  });
});
