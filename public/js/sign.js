function isNull(variable) {
  if (variable == "" || variable == null || variable === undefined) return true;

  return false;
}

function showMessage(message, element, classList) {
  element.removeAttr("class");
  element.attr("class", "m-0 mt-3 mb-1 " + classList);
  element.text(message);
}

$(document).ready(function () {
  const signUpButton = document.getElementById("signUp");
  const signInButton = document.getElementById("signIn");
  const container = document.getElementById("container");

  signUpButton.addEventListener("click", () => {
    container.classList.add("right-panel-active");
  });

  signInButton.addEventListener("click", () => {
    container.classList.remove("right-panel-active");
  });

  $("#signUpForm").submit(function (e) {
    e.preventDefault();

    var name = $("#signUpName");
    var nickname = $("#signUpNickname");
    var email = $("#signUpEmail");
    var password = $("#signUpPassword");

    $([
      "#signUpName",
      "#signUpNickname",
      "#signUpEmail",
      "#signUpPassword",
    ]).removeClass("is-invalid");

    $("#signUpRequestMessage").addClass("invisible");

    var valid = true;

    if (isNull(name.val())) {
      $("#signUpName").addClass("is-invalid");
      valid = false;
    }

    if (isNull(nickname.val())) {
      $("#signUpNickname").addClass("is-invalid");
      valid = false;
    }

    if (isNull(email.val())) {
      $("#signUpEmail").addClass("is-invalid");
      valid = false;
    }

    if (isNull(password.val())) {
      $("#signUpPassword").addClass("is-invalid");
      valid = false;
    }

    if (valid) {
      $.ajax({
        type: "POST",
        url: "./api/register", // URL do arquivo PHP que processará o cadastro
        data: {
          name: name.val(),
          nickname: nickname.val(),
          email: email.val(),
          password: password.val(),
        },
        success: function (response) {
          showMessage(
            response.message,
            $("#signUpRequestMessage"),
            "text-success"
          );
          setTimeout(() => {
            container.classList.remove("right-panel-active");
          }, 1500);
        },
        error: function (xhr, status, error) {
          showMessage(
            xhr.responseJSON.message,
            $("#signUpRequestMessage"),
            "text-danger"
          );
        },
      });
    }
  });

  $("#signInForm").submit(function (e) {
    e.preventDefault();

    var nickname = $("#signInNickname");
    var password = $("#signInPassword");

    $(["#signInNickname", "#signInPassword"]).removeClass("is-invalid");

    $("#signInRequestMessage").addClass("invisible");

    var valid = true;

    if (isNull(nickname.val())) {
      $("#signInNickname").addClass("is-invalid");
      valid = false;
    }

    if (isNull(password.val())) {
      $("#signInPassword").addClass("is-invalid");
      valid = false;
    }

    if (valid) {
      $.ajax({
        type: "GET",
        url: "./api/login", // URL do arquivo PHP que processará o cadastro
        data: {
          nickname: nickname.val(),
          password: password.val(),
        },
        success: function (response) {
          showMessage(
            response.message,
            $("#signInRequestMessage"),
            "text-success"
          );

          setTimeout(() => {
            window.location.replace("./game");
          }, 2000);
        },
        error: function (xhr, status, error) {
          showMessage(
            xhr.responseJSON.message,
            $("#signInRequestMessage"),
            "text-danger"
          );
        },
      });
    }
  });
});
