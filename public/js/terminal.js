$(document).ready(function() {
    const text = "Qual a formula para calcular a derivada de uma função? ";
    let index = 0;

    function typeText() {
        if (index < text.length) {
            $("#typing").append(text[index]);
            index++;
            setTimeout(typeText, 50);
        } else {
            $("#cursor").addClass("blink");
        }
    }

    typeText();

    $("input[type='radio']").on("change", function() {
        const selectedOption = $("input[type='radio']:checked").val();
        if (selectedOption) {
            const confirmMessage = `Você selecionou a opção ${selectedOption}. Deseja continuar?`;
            if (confirm(confirmMessage)) {
                $(".terminal").fadeOut(1000);
            }
        }
    });
});
