console.log("Attached gameview.js");


///////////////////////////////
//Object & Method Definitions//
///////////////////////////////

//ToDo: Create a selector and selector div
//Selector will be used to pick a card that will be moved somewhere
var Selector = function() {
	//Represents which player's card is selected (in game.players[])
	//this.player = 0;
	//Represents where the player's card is ('hand' or 'field')
	this.place = '';
	//Represents the index of the selected card within a hand or field
	this.index = 0;
	//Represents the str content of the selected card (ie: c5)
	this.card = '';
}
//Method on Selector that clears it
Selector.prototype.clear = function(){
	//Clear the object attributes
	//console.log("Clearing Selector");
	this.place = '';
	this.index = 0;
	this.card = '';
	//Clear the dom element representing the selector
	$('#selector').html('');
}

var Destination = function() {
	//Represents whether the card is moving to a hand, field, scrap or scuttle
	this.place = '';
	this.scuttle = false;
	//If the card is scuttling, represents where the card to be scuttled is found
	this.scuttle_index = 0;
}

//Method on Destination that clears it
Destination.prototype.clear = function(){
	//console.log("Clearing Destination");
	this.place = '';
	this.scuttle_index = 0;
	this.scuttle = false;
}

////////////////////////
//Variable Definitions//
////////////////////////

//Get displayId of game from dom element rendered with displayId param or response in DisplayGameController.gotoGame
var displayId = $('#displayId').html();
console.log("got displayId: " + displayId);

//Represents whether this user is p1 or p2 in their game
var player_number = 0;
//Selector used to determine which card will be moved
var sel = new Selector();
//Destination used to determine where a card will be moved
var dest = new Destination();

///////////////////////
//Function Defintions//
///////////////////////

//Clears dom and both the selector and destination
var clear = function() {
	console.log("Clearing");
	//Clear Opponent's hand of all card divs
	$('#op_hand').html("<p>Oponent's Hand</p>");

	//Clear Opponent's field
	$('#op_field').html("<p>Oponent's Field</p>");

	//Clear the deck
	$('#deck').html('');

	//Clear the Scrap pile
	$('#scrap').html('');

	//Clear your field
	$('#your_field').html("<p>Your Field</p>");

	//Clear your hand
	$('#your_hand').html("<p>Your Hand</p>");

}

//Clears and re-binds event hanlders for card clicks
//Called during render function after new cards are rendered
//TODO: Make this function update "Dest" when an #op_field is clicked
var clicks = function() {
	//Remove event hanlders for your_cards and op_field cards
	$('.your_card').off('click');
	$('.op_field').off('click');

	//When one of your cards is clicked, select it
	$('.your_card').on('click', function(){
		//Deslect clicked card if it was already selected
		if ($(this).html() === sel.card) {
			console.log("Card was already selected; deselecting");
			sel.clear();
		} else {
			console.log($(this).prop('id'));
			temp_index = $(this).prop('id');
			//Temp place will be used to find the place (hand/field) of the selected card
			//match uses the regex.exec(str) method to crate an array of the mathing info
			//The first element of match is the palce surrounded by underscores
			//The second element (what we want) is the place, itself
			var match = /\_([^()]*)\_/.exec(temp_index);
			var place = match[1];
			sel.place = place;
			temp_index = temp_index.replace(/[^\d]/g, '');
			sel.index = temp_index;
			sel.card = $(this).html();
			//Then update dom to display the selected card
			$('#selector').html(sel.card);
		}
	});
}


var render = function(game){
	clear();
	console.log("Rendering game:");
	console.log(game);

	//Check for players
	if(game.players.length === 0) {
		console.log("No players");
	//Check if we are player 0
	} else {
		if (game.players[0].socketId ===	socket.socket.sessionid){
			var player_index = 0;

			//Capture local reference into player_number
			player_number = player_index;
			console.log("We are player: " + player_index);
			var op_index = 1;
			console.log("They are player: " + op_index + '\n');
		} else if(game.players[1].socketId === socket.socket.sessionid){
			var player_index = 1;
			//Capture local reference into player_number
			player_number = player_index;
			console.log("We are Player: " + player_index);
			var op_index = 0;
			console.log("They are player: " + op_index);
		}
		//Render cards in scrap pile
		$('#scrap').html("Cards in Scrap: " + game.scrap.length);

		//Render Opponent's hand
		for (var i = 0; i < game.players[op_index].hand.length; i++) {
			//Select card to be rendered
			var card = game.players[op_index].hand[i];
			//Append a div into #op_hand representing the card.
			//It will have an id of #op_hand_INDEX, where INDEX = i
			//and a class of .card
			$('#op_hand').append("<div class='op_card card' id='op_hand_" + i + "'>" + " Card " + "</div>");
		}

		//Render our hand
		for (var i = 0; i < game.players[player_index].hand.length; i++) {
			//Select card to be rendered
			var card = game.players[player_index].hand[i];
			//Append a div into #op_hand representing the card.
			//It will have an id of #op_hand_INDEX, where INDEX = i
			//and a class of .card
			$('#your_hand').append("<div class='your_card card' id='your_hand_" + i + "'>" + card + "</div>");
		}

		//Render Opponent's field
		for (var i = 0; i < game.players[op_index].field.length; i++) {
			//Select card to be rendered
			var card = game.players[op_index].field[i];
			//Append a div into #op_hand representing the card.
			//It will have an id of #op_hand_INDEX, where INDEX = i
			//and a class of .card
			$('#op_field').append("<div class='card op_card op_field' id='op_field_" + i + "'>" + card + "</div>");
		}

		//Render Your field
		for (var i = 0; i < game.players[player_index].field.length; i++) {
			//Select card to be rendered
			var card = game.players[player_index].field[i];
			console.log("Logging card in our field: " + card);
			//Append a div into #op_hand representing the card.
			//It will have an id of #op_hand_INDEX, where INDEX = i
			//and a class of .card
			$('#your_field').append("<div class='your_card card' id='your_field_" + i + "'>" + card + "</div>");
		}
		//Update event handlers for new dom elements
		clicks();
	}
}



////////////////
//Socket Stuff//
////////////////
socket.on('game', function(obj) {
	console.log('Game event fired. Logging verb: ');
	console.log(obj.verb);

	//If the event was an update, log the changes
	//ToDo: Change render function to take a game object param
	if (obj.verb == 'updated') {
		console.log('Game was updated. Logging data: ');
		console.log(obj.data);
		//Render the game using the game from server
		render(obj.data.game);
	}
});

///////////////////////////
//On Click Function Calls//
///////////////////////////

//Make request to server and render game when render button is clicked
$('#render').on('click', function(){
	console.log("Making request for game to render");
	socket.get('/game/' + displayId, function(res){
		console.log(res);
		render(res.game);
	});
});

//Request to draw a card when draw button is clicked
$('#draw').on('click', function(){
	console.log("Requesting to draw card");
	socket.get('/draw', {displayId: displayId}, function(res){
		console.log(res);
		//Render game with response
		//render(res.game);
	});
});

//Request to deal hands when deal button is clicked
$('#deal').on('click', function(){
	console.log('Requesting to deal');
	//Make request for deal. Server should make changes, then
	//respond with a json object {game: Game_Object}, which is
	//logged. The server will also publish an update with
	//the updated game, which will be used to render the changes
	socket.get('/deal', {displayId: displayId}, function(res){
		console.log(res);
		//render(res.game);
	});
});

//Request to shuffle when shuffle button is clicked
$('#shuffle').on('click', function(){
	console.log('Requesting Shuffle');
	//Make request to shuffle deck
	socket.get('/shuffle', {displayId: displayId}, function(res){
		console.log(res);
	});
});

//When user clicks their field, if they've selected a card,
//request server to move selected card to their field
$('#your_field').on('click', function(){
	//Only continue if a card is selected
	if (sel.card != '') {
		//TODO: handle case where selected card was on your_field
		if(sel.place === 'hand') {
			dest.place = 'your_field';
			console.log('Requesting to move_card');
			//Make request to move_card, passing displayId of game, which player is requesting,
			//The selector and the destination
			socket.get('/move_card', {displayId: displayId, player: player_number, sel: sel, dest: dest}, function(res){
				console.log(res);
			});
			//Clear selector and destination
			sel.clear();
			dest.clear();
		}
	}
});