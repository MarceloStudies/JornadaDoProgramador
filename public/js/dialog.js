var $dialogContainer = $(".dialog-container");

function plot_dialog() {
  $dialogContainer.removeClass("hidden");
  $dialogContainer.addClass("animate-slide-right");
  $dialogContainer.removeClass("animate-slide-left");
}

$(document).ready(function () {


  const param = ['Logica de operadores', 0, 10, 10, 4 ];
  $.ajax({
    type: "POST",
    url: "/openai/generateQuestions", 
    data: { texto: param }, 
    success: function (response) {
      console.log(response)
    }
  });



  $("#ocultarDiv").click(function () {
    $(".dialog-container").removeClass("animate-slide-right");
    $(".dialog-container").addClass("animate-slide-left");
    setTimeout(function () {
      $(".dialog-container").addClass("hidden");
    }, 500);
  });

  $.fn.recevideMessage = function (answer) {};


  const sendMessage = () =>{

    var times = localStorage.getItem("times");
    if (times == null) {
      localStorage.setItem("times", 1);
    } else {
      localStorage.setItem("times", parseInt(times) + 1);
    }

    let  Qnttimes = localStorage.getItem("times");
    if (Qnttimes > 2 ){
      alert("Voce atingiu o limite maximo de perguntas para esse npc! ")
      return 
    }


    var message = $("#message").val();

    $.ajax({
      type: "POST",
      url: "/openai/responder", 
      data: { texto: message }, 
      success: function (response) {

        $("#place-message").append(`
        <div class="recevid-message flex flex-row justify-start items-center mb-2">
        <img
          class="w-8 h-8 rounded-sm"
          src="https://static.wikia.nocookie.net/dcheroesrpg/images/f/fa/Twoface.jpg/revision/latest/smart/width/371/height/332?cb=20110718182806"
          alt=""
        />
        <span class="font-tech text-white ml-2 bg-slate-600 w-1/2 h-10 pl-2 h-full px-2 flex items-center rounded-sm ">${response.resposta}</span>
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
        <span class="font-tech text-white mr-2 bg-slate-600 w-1/2 h-10 pr-2 flex items-center  h-full px-2  justify-end rounded-sm ">${message}</span>
        <img
          class="w-8 h-8 rounded-sm"
          src="https://avatars.githubusercontent.com/u/59853942?v=4"
          alt=""
        />
      </div>
    `);

    $("#message").val("");
    

  }

  $("#send-message").click(function () {
    sendMessage();
  });

  $("#message").keypress(function (e) {
    if (e.which == 13) {
      sendMessage();
    }
  });

});
