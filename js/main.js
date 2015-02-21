$('#idForm').submit(function( e ) {
	e.preventDefault();
	// check for valid ID. During testing, only < 5. 
	if( ( parseInt($('#idForm .textInput').val()) > 0 ) && ( parseInt($('#idForm .textInput').val() ) < 5 )) {
		console.log( $(this).serialize() );
		location.href = 'http://deltalumin.com/webpage/?' + $(this).serialize();
		console.log(ID);
	} else {
		alert("Please enter a valid ID number (1-4 for now)"); // need to update alert during pilot phase
	}
});

// put text box in focus on page load
function setup() {
	var textInput;
	textInput = $('#idForm .textInput');
	textInput.focus();
}

$(window).on('load', setup());