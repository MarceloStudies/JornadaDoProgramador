$(document).ready(function () {
  const questions = [
    {
      question: "Qual é a capital da França?",
      options: ["Londres", "Paris", "Berlim", "Roma"],
      correctOption: 1,
    },
    {
      question: "Quem pintou a Mona Lisa?",
      options: [
        "Michelangelo",
        "Vincent van Gogh",
        "Leonardo da Vinci",
        "Pablo Picasso",
      ],
      correctOption: 2,
    },
    {
      question: "Quantos planetas existem em nosso sistema solar?",
      options: ["8", "9", "10", "7"],
      correctOption: 0,
    },
    {
      question: "Qual é o maior mamífero terrestre?",
      options: [
        "Elefante Africano",
        "Rinoceronte Branco",
        "Girafa",
        "Hipopótamo",
      ],
      correctOption: 0,
    },
  ];

  $("#exam").examMaker(questions);

  $("#btnCancel").on("click", function () {
    $("#card-exam").removeClass("ease-out");
    $("#card-exam").addClass("ease-in");
    $("#card-exam").addClass("opacity-0");
    $("#card-exam").addClass("hidden");

    
  });

});

$.fn.examMaker = function (questions) {
  let currentQuestion = 0;
  let right = 0;
  let wrong = 0;

  function displayQuestion() {
    $("#numberQuest").text(currentQuestion + 1);
    $("#question").text(questions[currentQuestion].question);

    const optionPlace = $("#optionPlace");
    optionPlace.empty();

    questions[currentQuestion].options.forEach((option, index) => {
      optionPlace.append(
        `<li class="flex align-baseline gap-2 pb-4 group">
    <input type="radio" class="radio-answer text-white bg-white" name="answer" value="${index}" />
    <p class="text-answer group-hover:underline">
      ${option}
    </p>
  </li>`
      );
    });
  }

  function updateScore() {
    if (
      $("input[name='answer']:checked").val() ==
      questions[currentQuestion].correctOption
    ) {
      right++;
    } else {
      wrong++;
    }
  }

  $("#btnNext").on("click", function () {
    updateScore();

    if (right + wrong === questions.length) {
      examResultMaker(questions.length, right, wrong);
 
    } else {
      $(".transition").removeClass("opacity-100");

      setTimeout(() => {
        $(".transition").addClass("opacity-0");

        setTimeout(() => {
          $(".transition").addClass("opacity-100");
          currentQuestion++;
          displayQuestion();
        }, 500);
      }, 500);
    }
  });
  displayQuestion();
};
const examResultMaker = (lengthQuestions, quantR, quantW) => {
  $("#title-card").text("Resultado");
  $("#question").text("Veja e analise seu desempenho");

  $("#body-card").empty();
  $("#body-card").addClass('justify-center');


  
  $("#body-card").append(
    `<canvas id="myChart"  class"self-center " width="400" height="400"></canvas>`
  );
  const ctx = document.getElementById("myChart");
  new Chart(ctx, {
    type: "pie",
    data: {
      labels: ["Erros", "Acertos"],
      datasets: [
        {
          label: "",
          data: [quantW, quantR],
          backgroundColor: ["rgb(140, 19, 10)", "rgb(1, 135, 57)"],
        },
      ],
    },
    options: {
      responsive: true,
    },
  });
};
