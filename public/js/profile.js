function isNull(variable) {
  if (variable == "" || variable == null || variable === undefined) return true;

  return false;
}

$(document).ready(function () {
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
  $("#mostrarDiv").click(function () {
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
