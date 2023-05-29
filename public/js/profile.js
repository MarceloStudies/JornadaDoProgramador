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
            window.location.reload();
          }, 1000);
        },
        error: function (xhr, status, error) {
          alert(xhr.responseJSON.message);
        },
      });
    }
  });
});
