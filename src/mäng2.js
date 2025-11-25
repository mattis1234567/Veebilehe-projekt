var mugHeight;
var beerHeight;
var percentFilled;
var roundedPercent;
var game = Math.floor((Math.random() * 100) + 1);

function getHeights(){
	mugHeight = $('#mug').height();
	beerHeight = $('#beer').height();
	percentFilled = (beerHeight / mugHeight) * 100;
  roundedPercent = Math.round(percentFilled);
	$('#percent-filled').html('Õlle kogus: ' + roundedPercent + '%');
};

$('#handle').hover(
  function(){
    $('#beer').addClass('fill');
    $('#beer').css('animation-play-state', 'running');
    $('#pour').addClass('pouring');
  },
  function(){
    getHeights();
    $('#beer').css('animation-play-state', 'paused');
    $('#pour').removeClass('pouring');
    if (roundedPercent === 0) {
    } else if (roundedPercent === game) {
    	$('#result').html('Edukas sooritus');
    } else if((game - roundedPercent) < 5 && (game - roundedPercent) > -5 ){
      $('#result').html('Käib kahh');
    } else {
      $('#result').html('Ega ikka sitast saia saa');
    }
  }
);

$('#mug').click(function(){
  $('#beer').removeClass('fill');
  getHeights();
  $('#result').html('');
	game = Math.floor((Math.random() * 100) + 1);
  $('#target').html(game);  
})

$(document).ready(function(){
	$('#target').html(game);  
});
