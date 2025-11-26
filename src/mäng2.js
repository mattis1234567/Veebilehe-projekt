/**
 * Allikas/Autor: El Jefe (https://codepen.io/ElJefe/pen/vEERrW)
 */
var mugHeight;       // Kapa maksimaalne kõrgus
var beerHeight;      // Õlle praegune kõrgus
var percentFilled;   // Täituvus protsentides (ujukomaarv)
var roundedPercent;  // Täituvus protsentides (ümaratuna)
// Juhuslik sihtväärtus (protsent), mida mängija peab saavutama
var game = Math.floor((Math.random() * 100) + 1); 

// Funktsioon kõrguste ja täituvusprotsendi arvutamiseks/uuendamiseks
function getHeights(){
	mugHeight = $('#mug').height();
	beerHeight = $('#beer').height();
	percentFilled = (beerHeight / mugHeight) * 100;
  roundedPercent = Math.round(percentFilled);
	// Uuendab HTML-i elemendis protsendi näidu
	$('#percent-filled').html('Õlle kogus: ' + roundedPercent + '%');
};

// Kraani (handle) peale hiire liigutamise (hover) sündmus
$('#handle').hover(
  // mouseover (hiir liikus peale)
  function(){
    $('#beer').addClass('fill');                  // Lisab klassi, mis käivitab CSS animatsiooni
    $('#beer').css('animation-play-state', 'running'); // Käivitab animatsiooni (õlle valamine)
    $('#pour').addClass('pouring');               // Lisab klassi, mis muudab kraanist tuleva vedeliku nähtavaks
  },
  // mouseout (hiir liikus ära)
  function(){
    getHeights();                                 // Arvutab lõpliku täituvusprotsendi
    $('#beer').css('animation-play-state', 'paused'); // Peatab animatsiooni
    $('#pour').removeClass('pouring');            // Peidab kraanist tuleva vedeliku
    
    // Kontrollib tulemust ja kuvab vastava teate
    if (roundedPercent === 0) {
      // Ei tee midagi, kui valamine peatati kohe alguses
    } else if (roundedPercent === game) {
    	$('#result').html('Edukas sooritus'); // Täpne täitmine
    } else if((game - roundedPercent) < 5 && (game - roundedPercent) > -5 ){
      $('#result').html('Käib kahh');         // Täitmine oli sihtmärgist +/- 4% piires
    } else {
      $('#result').html('Häbi, häbi püksis käbi!'); // Ebaõnnestunud täitmine
    }
  }
);

// Kapa (mug) kliki sündmus (taaskäivitamine)
$('#mug').click(function(){
  $('#beer').removeClass('fill');  // Eemaldab 'fill' klassi, nullides õlle taseme (CSS kaudu)
  getHeights();                    // Arvutab uuesti kõrgused
  $('#result').html('');           // Puhastab tulemuse teate
	game = Math.floor((Math.random() * 100) + 1); // Loob uue juhusliku sihtväärtuse
  $('#target').html(game);         // Uuendab sihtprotsendi näidu HTML-is
})

// Dokument on valmis (käivitub lehe laadimisel)
$(document).ready(function(){
	$('#target').html(game);  // Määrab algse sihtprotsendi
});