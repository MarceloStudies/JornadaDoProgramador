function isNull(variable) {
  if (variable == "" || variable == null || variable === undefined) return true;

  return false;
}

$(document).ready(function () {
  
  $.get("./api/showUserLogged", function (data) {
    const name = data.nickname;
    const email = data.email;
    const password = data.password;

    let points = data.pontuation


    $("#name").val(name);
    $("#email").val(email);
    $("#password").val(password);
    
  });

  $("#deleteProfile").on("click", () => {
    $.ajax({
      type: "DELETE",
      url: "./api/user",
      success: function (response) {
        window.location.replace("./sign");
      },
      error: function (xhr, status, error) {
        alert(xhr.responseJSON.message);
      },
    });
  });

  $("#btnUpdate").on("click", () => {
    var name = $("#name").val();
    var email = $("#email").val();
  
    // Remove a classe de erro dos campos, se estiver presente
    $(["#name", "#email"]).removeClass("is-invalid");
  
    var valid = true;
  
    // Valide os campos, se necessário
  
    if (valid) {
      $.ajax({
        type: "POST",
        url: "./api/update",
        data: {
          newData: {
            name: name,
            email: email
          }
        },
        dataType: "json", // Indica que você está esperando uma resposta JSON do servidor
        success: function (response) {
          // Verifica se response é uma string JSON válida e a converte para um objeto, se necessário
          if (typeof response === "string") {
            response = JSON.parse(response);
          }
  
          // Agora você pode acessar response.message sem erros
          alert(response.message);
  
          setTimeout(() => {
            window.location.replace("./game");
          }, 1000);
        },
        error: function (xhr, status, error) {
          // Verifica se xhr.responseText contém uma string JSON válida e a converte para um objeto, se necessário
          var jsonResponse = xhr.responseText;
          if (jsonResponse && jsonResponse.trim().startsWith("{")) {
            jsonResponse = JSON.parse(jsonResponse);
            alert(jsonResponse.message);
          } else {
            // Se não for uma resposta JSON válida, exibe a mensagem de erro padrão
            alert("Erro interno do servidor. Por favor, tente novamente mais tarde.");
          }
        },
      });
    }
  });
  
  $("#saverProfile").on("click", () => {
    var name = $("#name");
    var email = $("#email");
    var pass = $("#pass");

    $(["#name", "#email", "#pass"]).removeClass("is-invalid");

    var valid = true;

    if (isNull(name.val())) {
      name.addClass("is-invalid");
      valid = false;
    }

    if (isNull(email.val())) {
      email.addClass("is-invalid");
      valid = false;
    }

    if (isNull(pass.val())) {
      pass.addClass("is-invalid");
      valid = false;
    }

    if (valid) {
      $.ajax({
        type: "PUT",
        url: "./api/user",
        data: {
          name: name.val(),
          email: email.val(),
          password: pass.val(),
        },
        success: function (response) {
          alert(response.message);

          setTimeout(() => {
            window.location.replace("./profile");
          }, 1000);
        },
        error: function (xhr, status, error) {
          alert(xhr.responseJSON.message);
        },
      });
    }
  });

  // MOSTRAR CARD PROFILE
  $("#mostrarDiv,#ocultarDiv").click(function () {
    var $profileContainer = $(".profile-container");

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

  $("#ocultarDiv").click(function () {
    alert("ocultar");
    var $profileContainer = $(".profile-container");
    $profileContainer.removeClass("animate-slide-right");
    $profileContainer.addClass("animate-slide-left");
    setTimeout(function () {
      $profileContainer.addClass("hidden");
    }, 500);
  });

  // graficos
  const ctx = document.getElementById("myChart");

  new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
      datasets: [
        {
          data: [12, 19, 3, 5, 2, 3],
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
});
