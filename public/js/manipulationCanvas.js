 // create a script that wait 3s for show the canva game and remove the loader
 setTimeout(() => {
    document.querySelector(".loader-content").style.display = "none";
    
    $("#map").show();
reloadCanvas();

  }, 10000);

  // Função para recarregar o canvas
function reloadCanvas() {
var screenWidth = $(window).width();
var screenHeight = $(window).height();

var canvas = document.getElementById("map");
canvas.width = screenWidth;
canvas.height = screenHeight;
var ctx = canvas.getContext("2d");
ctx.clearRect(0, 0, canvas.width, canvas.height);

showCanvasMain();

}

$(window).on('resize', function() {
alert('');
reloadCanvas();
});