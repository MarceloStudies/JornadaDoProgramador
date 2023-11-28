$(document).ready(function () {
  // examMaker(questions)

  // callQuestions("Variáveis e Tipos de Dados");
  // $.post('./openai/generateQuestions', function(data){
  //   console.log(data)
  // })

  topics = ['Algoritmos', 'Variáveis e Tipos de Dados', 'Estruturas de Controle']
  

  $.get('./api/getQuestions', function(data){
    console.table(data)
  })
  

  $("#btnCancel").on("click", function () {
    $("#card-exam").removeClass("ease-out");
    $("#card-exam").addClass("ease-in");
    $("#card-exam").addClass("opacity-0");
    $("#card-exam").addClass("hidden");
  });
});

function callQuestions() {
  let topic = topics[Math.floor(Math.random() * topics.length)];
  $.get(`./api/${topic}/questions`, function (data) {
    const formattedData = data.map((question) => {
      return {
        topic: topic,
        id: question._id, // assuming the id is stored in _id
        question: question.title,
        options: question.alternatives,
        correctOption: question.correctAnswer,
        averageResponseTime: question.averageResponseTime,
      };
    });

    examMaker(formattedData);
  }).fail(function (err) {
    console.error("Error:", err);
  });
}

function examMaker(questions) {
  let currentQuestion = 0;
  let right = 0;
  let wrong = 0;
  let startTime;

  $("#card-exam").removeClass("hidden");

  function displayQuestion() {
    startTime = Date.now();
    $("#numberQuest").text(currentQuestion + 1);
    $("#question").text(questions[currentQuestion].question);

    const optionPlace = $("#optionPlace");
    optionPlace.empty();

    questions[currentQuestion].options.forEach((option, index) => {
      optionPlace.append(
        `<li class="flex align-baseline gap-2 pb-4 group">
    <input type="radio" class="radio-answer text-white bg-white" name="answer" value="${option}" />
    <p class="text-answer group-hover:underline">
      ${option}
    </p>
  </li>`
      );
    });
  }
  let heartCounter = 0; // Inicializa o contador de corações
  function updateScore() {
    const responseTime = (Date.now() - startTime) / 1000;
    const selectedAnswer = $("input[name='answer']:checked").val();
    const isCorrect =
      selectedAnswer == questions[currentQuestion].correctOption;

    
    const hearts = document.querySelectorAll('.vida'); // Seleciona todos os elementos com a classe "vida"
     
    
    // ...
    
    if (isCorrect) {
      right++;
    } else {
      wrong++;
      if (heartCounter < hearts.length) {
        hearts[heartCounter].style.display = 'none'; // Esconde o coração
        heartCounter++; // Incrementa o contador de corações
      }else{
        alert("Game over!")
        window.location.replace("./game");
      }
    }

    const answerDetail = {
      id: questions[currentQuestion].id,
      correct: isCorrect,
      responseTime: responseTime,
      topic: questions[currentQuestion].topic, // replace with the actual topic
    };

    // Save answerDetail to the server
    $.ajax({
      url: "./api/saveAnswer", // update the URL to match the new endpoint
      type: "POST", // change the method to POST
      data: answerDetail,
      success: function (response) {
        console.log("Answer saved successfully:", response);
        console.log(update_dificult(isCorrect, 1000, responseTime));
      },
      error: function (error) {
        console.error("Error saving the answer:", error);
      },
    });
  }

  function update_dificult(isCorrect, temp_m, temp_user) {
    let points;
    let dificuldade;
    $.get("./api/showUserLogged", function (data) {
      points = data.pontuation;
    });
    if (isCorrect) {
      points += (temp_m / temp_user) * 10;
      dificuldade += temp_m / temp_user;
    } else if (points > 0 && !isCorrect) {
      points -= (temp_m / temp_user) * 10;
      if (dificuldade > 0) {
        dificuldade -= temp_m / temp_user;
      } else {
        dificuldade = 0;
      }
    } else {
      dificuldade = 0;
      points = 0;
    }

    return points, dificuldade;
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
}

const examResultMaker = (lengthQuestions, quantR, quantW) => {
  $("#title-card").text("Resultado");
  $("#question").text("Veja e analise seu desempenho");

  $("#body-card").empty();
  $("#body-card").addClass("justify-center");

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
