/**
 * GameController
 *
 * @description :: Server-side logic for managing Games
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

//////////////////////
//Object Definitions//
//////////////////////

//Target represents a card, or player being targeted for an effect
var Target = function() {
	//String that represents whether the target is a card, or player
	//Expected: 'player' or 'card'
	this.kind = '';

	//Integer that represents which player, or which player's card is being targeted
	this.player = null;

	//Integer that represents which card on given player's field is being targeted
	this.index = null;
};

////////////////////////
//Function Definitions//
////////////////////////

//Checks for a winner by checking the number of points both players haveAnd comparing 
//with the number they need to win (Based on the number of kings on their field)
var winner = function(game) {
	console.log('\nChecking game ' + game.displayId + ' for a winner');
	var p0Points = 0;
	var p0Kings = 0;
	var p1Points = 0;
	var p1Kings = 0;

	var temp_rank = 0;

	//Check the numbers of points and kings for p0
	game.players[0].field.forEach(
	function(card, index, field){
		switch(card[1]) {
			case '1':
			case '2':
			case '3':
			case '4':
			case '5':
			case '6':
			case '7':
			case '8':
			case '9':
				temp_rank = parseInt(card[1]);
				p0Points += temp_rank;
				break;

			case 'T':
				p0Points += 10;
				break;

			case 'K':
				p0Kings++;
				break;
		}
	});

	//Check if p0 has won
	switch(p0Kings){
		case 0:
			if (p0Points >= 21) {
				console.log('\nPlayer 0 is the winner!\n');
				game.winner = 0;
			}
			break;
		case 1:
			if (p0Points >= 14) {
				console.log('\nPlayer 0 is the winner!\n');
				game.winner = 0;
			}
			break;
		case 2:
			if (p0Points >= 10) {
				console.log('\nPlayer 0 is the winner!\n');
				game.winner = 0;
			}
			break;
		case 3:
			if (p0Points >= 7) {
				console.log('\nPlayer 0 is the winner!\n');
				game.winner = 0;
			}
		case 4:
			if (p0Points >= 5) {
				console.log('\nPlayer 0 is the winner!\n');
				game.winner = 0;
			}
	}
	//Count the numbers of points and kings for p1
	game.players[1].field.forEach(
	function(card, index, field){
		switch(card[1]) {
			case '1':
			case '2':
			case '3':
			case '4':
			case '5':
			case '6':
			case '7':
			case '8':
			case '9':
				temp_rank = parseInt(card[1]);
				p1Points += temp_rank;
				break;

			case 'T':
				p1Points += 10;
				break;

			case 'K':
				p1Kings++;
				break;
		}

	});
	//Check if p1 has won
	switch(p1Kings){
		case 0:
			if (p1Points >= 21) {
				console.log('\nPlayer 1 is the winner!\n');
				game.winner = 1;
			}
			break;
		case 1:
			if (p1Points >= 14) {
				console.log('\nPlayer 1 is the winner!\n');
				game.winner = 1;
			}
			break;
		case 2:
			if (p1Points >= 10) {
				console.log('\nPlayer 1 is the winner!\n');
				game.winner = 1;
			}
			break;
		case 3:
			if (p1Points >= 7) {
				console.log('\nPlayer 1 is the winner!\n');
				game.winner = 1;
			}
		case 4:
			if (p1Points >= 5) {
				console.log('\nPlayer 1 is the winner!\n');
				game.winner = 1;
			}
	}
};

//Resets the game
var reset = function(game) {
	console.log("\nReseting Game " + game.displayId);
	//Reset deck:
	game.deck = [];
	game.cleanDeck.forEach(
	function(card, index, deck) {
		game.deck[index] = card;
	});

	//Reset hands and fields
	game.players[0].hand = [];	
	
	game.players[0].field = [];
	
	game.players[1].hand = [];

	game.players[1].field = [];
	
	game.scrap = [];

	game.turn = 0;

	//Reset winner
	game.winner = null;
	game.play_again = 0;

};

								///////////////////
								//One-Off Effects//
								///////////////////
/*
 * These are functions that take a game object and perform an effect to it
 */

//This function destroys all the points on the field of a game, passed as a parameter
//By Default it is bound to the ACE
var destroyAllPoints = function(game) {
	console.log("Destroying all points in game " + game.displayId);
	var p0FieldLength = game.players[0].field.length;
	var p1FieldLength = game.players[1].field.length;

	//Int representing the number of cards that have been moved from p0's field
	//When we remove a given element from game.players[0].field, we will need to offset
	//the index i
	var p0Counter = 0;

	//Int representing the number of cards that have been moved from p1's field
	var p1Counter = 0;

	//Check which field is longer to determine the length of the loop
	//that will remove the point cards
	if (p0FieldLength >= p1FieldLength) {
		var longest = p0FieldLength;
	} else {
		var longest = p1FieldLength;
	}
	//Iterate through the fields of both players and remove their point-cards
	for (i = 0; i < longest; i++) {

		//Check if we have looped through all of p0's field, yet.
		if (i - p0Counter < game.players[0].field.length) {
			//Check if the card rank (specified by the card[1] is a number)
			if (['1', '2', '3', '4', '5', '6', '7', '8', '9', 'T'].indexOf( (game.players[0].field[i - p0Counter][1])) > -1 ) {
				console.log("p0's card is a number: " + game.players[0].field[i - p0Counter]);

				//If so, move card from field to scrap
				game.scrap[game.scrap.length] = game.players[0].field.splice([i - p0Counter], 1)[0];
				//Then incriment p0Counter to keep track of where next element will now be found
				p0Counter++;
			}
		}

		//Check that we have not looped through all of p1's field
		if (i - p1Counter < game.players[1].field.length) {
			//If the card is a number card, append its index to p1Indicies. This will be used to remove the card
			if (['1', '2', '3', '4', '5', '6', '7', '8', '9', 'T'].indexOf((game.players[1].field[i - p1Counter][1])) > -1 ) {
				console.log("p1's card is a number: " + game.players[1].field[i - p1Counter]);

				//If there are still unchecked cards on p1's field
				//If so, move card from field to scrap
				game.scrap[game.scrap.length] = game.players[1].field.splice([i - p1Counter], 1)[0];
				//Then incriment p1Counter, to keep track of where next element can now be found 
				//(indicies shift after a card is removed)
				p1Counter++;
			}
		}
	}
};

//This function destroys all of the non-point cards on both players' fields
//in a game, passed as a parameter
//By default, this function is bound to SIX
var destroyAllFaces = function(game) {
	console.log("Destroying all face cards in game " + game.displayId);
	var p0FieldLength = game.players[0].field.length;
	var p1FieldLength = game.players[1].field.length;

	//Int representing the number of cards that have been moved from p0's field
	//When we remove a given element from game.players[0].field, we will need to offset
	//the index i
	var p0Counter = 0;

	//Int representing the number of cards that have been moved from p1's field
	var p1Counter = 0;

	//Check which field is longer to determine the length of the loop
	//that will remove the point cards
	if (p0FieldLength >= p1FieldLength) {
		var longest = p0FieldLength;
	} else {
		var longest = p1FieldLength;
	}
	//Iterate through the fields of both players and remove their point-cards
	for (i = 0; i < longest; i++) {

		//Check if we have looped through all of p0's field, yet.
		if (i - p0Counter < game.players[0].field.length) {
			//Check if the card rank (specified by the card[1] is a face card)
			if (['J', 'Q', 'K'].indexOf(game.players[0].field[i - p0Counter][1]) > -1)  {
				console.log("p0's card is a face card: " + game.players[0].field[i - p0Counter]);
				console.log(['J', 'Q', 'K'].indexOf( (game.players[0].field[i - p0Counter][1]) ) );
				console.log(['J', 'Q', 'K'].indexOf( (game.players[0].field[i - p0Counter][1]) )  > -1);


				//If so, move card from field to scrap
				game.scrap[game.scrap.length] = game.players[0].field.splice([i - p0Counter], 1)[0];
				//Then incriment p0Counter to keep track of where next element will now be found
				p0Counter++;
			}
		}

		//Check that we have not looped through all of p1's field
		if (i - p1Counter < game.players[1].field.length) {
			//If the card is a face card, append its index to p1Indicies. This will be used to remove the card
			if (['J', 'Q', 'K'].indexOf( game.players[1].field[i - p1Counter][1]) > -1 ) {
				console.log("p1's card is a face card: " + game.players[1].field[i - p1Counter]);
				console.log(['J', 'Q', 'K'].indexOf( (game.players[1].field[i - p1Counter][1]) ) );
				console.log(['J', 'Q', 'K'].indexOf( (game.players[1].field[i - p1Counter][1]) )  > -1);				

				//If there are still unchecked cards on p1's field
				//If so, move card from field to scrap
				game.scrap[game.scrap.length] = game.players[1].field.splice([i - p1Counter], 1)[0];
				//Then incriment p1Counter, to keep track of where next element can now be found 
				//(indicies shift after a card is removed)
				p1Counter++;
			}
		}
	}	
};

//Draws two cards for the target player, if this does not bring them over the hand limit
var drawTwo = function(game) {
	//The cards will be drawn by the player whose turn it is
	var player_number = game.turn % 2
	//If chosen player is beneath the hand limit, draw a card for them
	if (game.players[player_number].hand.length <= game.handLimit) {
		game.players[player_number].hand[game.players[player_number].hand.length] = game.deck.shift();
		//If they are still beneath the hand limit, draw them another card
		if (game.players[player_number].hand.length <= game.handLimit) {
			game.players[player_number].hand[game.players[player_number].hand.length] = game.deck.shift();
		}
	}
};

//Destroys one face card in a game specified by target (Target obj defined above)
var destroyTargetFace = function(game, target) {
	if (['K', 'J', 'Q'].indexOf(game.players[target.player].field[target.index][1]) > -1) {
		game.scrap[game.scrap.length] = game.players[target.player].field.splice(target.index, 1);
	//If the target card isn't a face card, roll back the turn and move the one-off back to its caster's hand
	} else {
		game.turn--;
		game.players[(target.player + 1) % 2].hand[game.players[(target.player + 1) % 2].hand.length] = game.scrap.pop();
	}
};


///////////////////////////
//chooseEffect() Function//
///////////////////////////
/*
 *This function performs a one-off effect on a game
 */

//TODO: Fix cases where target isn't passed appropriately
//This function takes a game and a string (representing which effect is to be executed within chosen game)
var chooseEffect = function(game, str, target) {
	console.log("Choosing effect: " + str);
	switch (str) {
		case 'destroyAllPoints':
			destroyAllPoints(game);
			break;
		case 'destroyAllFaces':
			destroyAllFaces(game);
			break;
		case 'drawTwo':
			drawTwo(game);
			break;
		case 'destroyTargetFace':
			destroyTargetFace(game, target);
			break;
	}
};

module.exports = {
	//This function draws a card for the requesting user if they are in the requested game and it's their turn
	//and they're under the hand-limit
	draw: function(req, res) {
		console.log("Draw request made");
		console.log(req.isSocket);
		console.log(req.body);
		console.log(req.socket.id);
		if (req.isSocket) {
			//Log and capture request parameters. Expecting displayId of Game
			console.log(req.body);
			var params = req.body;

			Game.findOne({
				displayId: params.displayId
			}).populate('players').exec(function(err, game) {
				if (err || !game) {
					console.log("Game not found");
					res.send("Game not found");
					//Check that game is full before allowing a move
				} else if (game.players.length === 2) {
					//console.log(game);
					console.log("Logging socket of request to draw: " + req.socket.id);
					//Checking which player is requesting to draw
					if (game.players[0].socketId === req.socket.id) {
						var player = 0;
						console.log("Player 0 is making request to draw");
					}

					if (game.players[1].socketId === req.socket.id) {
						var player = 1;
						console.log("Player 1 is making request to draw");
					}

					//Check if it is this player's turn
					if (player === (game.turn % 2)) {
						console.log("It is the correct player's turn");
						//Check if you are at the hand limit
						if (game.players[player].hand.length < game.handLimit) {
							console.log("Player is under the hand limit");
							//Deal if all is legit
							//Deal the card
							game.players[player].hand[game.players[player].hand.length] = game.deck.shift();
							//Incriment the turn
							game.turn++;
							//Save the changes
							game.save();
							//Publish the changes
							Game.publishUpdate(req.body.displayId, {
								game: game
							});
						} else {
							console.log("Player cannot draw due to Hand limit");
						}

					} else {
						console.log("Wrong player requesting to move");
						console.log(game);
						res.send({
							game: game
						});
					}
				}
			});


		}
	},

	//This function deals 6 cards to p1 and 5 to p0 (p0 is expected to go first). Note: It does not reset the game!
	deal: function(req, res) {
		console.log("Deal request made");
		//Capture parameters. Expecting {displayId: displayId}
		console.log(req.body);
		//console.log(req.socket.id);
		var req_id = req.body.displayId;

		//Check if request is from socket (it should be)
		if (req.isSocket) {
			//Find the chosen game
			Game.findOne({
				displayId: req_id
			}).populate('players').exec(
				function(err, game) {
					console.log("Found game for deal action. Logging");
					if (err || !game) {
						console.log("Game not found");
						res.send("Game not found");
						//Check that game has appropriate number of players
					} else if (game.players.length === 2) {
						//Check that requesting player is in the chosen game
						if (req.socket.id === game.players[0].socketId || req.socket.id === game.players[1].socketId) {
							//Deal one card to player[1] before looping through deal. They get an extra card
							//and Player[0] goes first
							game.players[1].hand[0] = game.deck.shift();
							//Loop to finish dealing
							for (i = 0; i < 5; i++) {
								//Give a card to player[0]
								game.players[0].hand[game.players[0].hand.length] = game.deck.shift();
								//Give a card to player[1]
								game.players[1].hand[game.players[1].hand.length] = game.deck.shift();
							}

							//Save and log new game
							game.save();
							//console.log(game);

							//Publish new game
							Game.publishUpdate(req_id, {
								game: game
							});
						}
					}
				});
		}
	},

	//Shuffles the cards in a game's deck
	shuffle: function(req, res) {
		console.log("Shuffle request made");
		console.log(req.body);
		//Capture displayId of game to be shuffled
		var req_id = req.body.displayId;
		//Check if request was made through socket (only continue if yes)
		if (req.isSocket) {
			//Find the requested game
			Game.findOne({
				displayId: req_id
			}).populate('players').exec(
				function(err, game) {
					if (err || !game) {
						console.log("Game not found");
						//Check that game is full
					} else if (game.players.length === 2) {
						//Check that player requesting shuffle is in requested game
						if (req.socket.id === game.players[0].socketId || req.socket.id === game.players[1].socketId) {
							//Keeps track of where we are in shuffling loop
							var len_index = game.deck.length;
							//randeom_index is randomly selected and used to shuffle deck
							var random_index = 0;
							var temp = '';
							//Loops until we've swiched each place at least once
							while (0 != len_index) {
								random_index = Math.floor(Math.random() * len_index);
								len_index -= 1;

								//Swich deck[len_index] with deck[random_index]
								temp = game.deck[len_index];
								game.deck[len_index] = game.deck[random_index];
								game.deck[random_index] = temp;
							}

							//Save changes and publish update
							game.save();
							Game.publishUpdate(req_id, {
								game: game
							});
						} else {
							console.log("Requesting player isn't in requested game!");
						}
					} else {
						console.log("Not enough players in game!");
					}
				});
		}
	},
	//Moves a card in a particular game
	//Expected params: displayId, player, sel (selector) and dest (destination)
	//TODO: Fix Brackets (not being highlighted)
	move_card: function(req, res) {
		console.log("Client has requested to move_card");
		console.log(req.body);
		var params = req.body;

		//Only continue if request came through socket
		if (req.isSocket) {
			//Find the requested game and populate it with its players
			Game.findOne({
				displayId: params.displayId
			}).populate('players').exec(
				function(err, game) {
					//Check that game was found
					if (err || !game) {
						console.log("Game not found");
						res.send("Game not found");
						//Check that game is full
					} else if (game.players.length === 2) {
						//Check that it is requesting player's turn
						if (params.player === (game.turn % 2)) {
							console.log("Correct player wants to move");

							//Capture selector and destination from request
							var sel = params.sel;
							console.log(sel);
							var dest = params.dest;
							console.log(dest);

							//Check if selected card is in players hand
							if (sel.place === 'hand') {
								//Check if destination is player's field
								if (dest.place === 'your_field') {
									//Store the card to be moved
									var temp = game.players[params.player].hand[sel.index];
									//Switch the desired card with the first card in the hand
									game.players[params.player].hand[sel.index] = game.players[params.player].hand[0];
									game.players[params.player].hand[0] = temp;

									//Shift desired card off top of player's hand into the last index of their field
									game.players[params.player].field[game.players[params.player].field.length] = game.players[params.player].hand.shift();
									game.turn++;
									//Check for a win
									winner(game);
								//Check if user wishes to play card from hand to opponent's field
								} else if (dest.place === 'op_field') {
									//Check if user wishes to scuttle
									if (dest.scuttle === true) {
										//Capture card to be played from hand
										var card = game.players[params.player].hand[sel.index];
										//Capture target card to be scuttled
										var target = game.players[(params.player + 1) % 2].field[dest.scuttle_index];

										//Compare card with target to see if scuttle is valid
										var card_rank = card[1];
										//Rank of T stands for 10
										if (card_rank === 'T') {
											card_rank = 10;
										}

										//Check that scuttling card is not a face card
										if (!(card_rank === 'J' || card_rank === 'Q' || card_rank === 'K')) {
											//Convert rank from str to int
											card_rank = parseInt(card_rank);
											//Capture rank of target card (to be scuttled)
											var target_rank = target[1];

											//Rank of T stands for 10
											if (target_rank === 'T') {
												target_rank = 10;
											}

											//Check that target card (to be scuttled) is not a face card
											if (!(target_rank === 'J' || target_rank === 'Q' || target_rank === 'K')) {
												//Convert target rank to int
												target_rank = parseInt(target_rank);

												//Capture suits of cards and target
												var card_suit = card[0];
												var target_suit = target[0];

												//Compare rank of card to target
												if (card_rank > target_rank) {
													console.log('Scuttling with high rank');
													//If the scuttle was valid, move both cards into the scrap pile
													//Switch target card with card at top of op_field
													game.players[(params.player + 1) % 2].field[dest.scuttle_index] = game.players[(params.player + 1) % 2].field[0];
													game.players[(params.player + 1) % 2].field[0] = target;

													//Scrap target card (shift it off top of field)
													game.scrap[game.scrap.length] = game.players[(params.player + 1) % 2].field.shift();

													//Switch scuttling card with card at top of user's hand
													game.players[params.player].hand[sel.index] = game.players[params.player].hand[0];
													game.players[params.player].hand[0] = card;
													game.scrap[game.scrap.length] = game.players[params.player].hand.shift();

													//Incriment the turn
													game.turn++;
													//If ranks are equal, compare suits (suits are ranked in reverse-alphabetical order, so we use str comparision)
												} else if (card_rank === target_rank && card_suit > target_suit) {
													console.log('Scuttling with high suit');
													//If the scuttle was valid, move both cards into the scrap pile
													//Switch target card with card at top of op_field
													game.players[(params.player + 1) % 2].field[dest.scuttle_index] = game.players[(params.player + 1) % 2].field[0];
													game.players[(params.player + 1) % 2].field[0] = target;

													//Scrap target card (shift it off top of field)
													game.scrap[game.scrap.length] = game.players[(params.player + 1) % 2].field.shift();

													//Switch scuttling card with card at top of user's hand
													game.players[params.player].hand[sel.index] = game.players[params.player].hand[0];
													game.players[params.player].hand[0] = card;
													game.scrap[game.scrap.length] = game.players[params.player].hand.shift();
												}
											}
										}
									}
								}
							}
						}
					}
					//Save changes and update clients
					game.save();
					Game.publishUpdate(params.displayId, {
						game: game
					});
				});
		}
	},

	//Adds one-off effect to game.stack and sends message players
	//Providing opportunity to add to the stack in response

	//NOTE: This does not incriment the turn, that happens when collapse_stack fires 

	//TODO: Check that requesting user is in game before continuing
	//POTENTIAL BUG: If Game.message() fires before Game.publishUpdate(), the client will 
	//render the dom and goof up the event handlers for responding with a 2
	push_stack: function(req, res) {
		console.log('Request made to push one-off to stack');
		var params = req.body;
		console.log(params);

		//Check if request was made through socket (only valid if yes)
		if (req.isSocket) {
			//If a displayId was passed, use it to find the relevant game
			if (params.displayId) {
				//Find the game and populate its players and stack
				Game.findOne({
					displayId: params.displayId
				}).populate('players').populate('stack').exec(
					function(err, game) {
						console.log("Logging stack");
						console.log(game.stack);
						//Catch error if game not found
						if (err || !game) {
							console.log("Game not found.");
						}

						//Check if the target_index was passed. If not, check that the one-of
						//is a 1, 6, or 7
						else if (params.hasOwnProperty("hand_index") && params.hasOwnProperty("caster_index")) {
							//Check that requesting user is in requested game and that either 
							//   1) It's requesting user's turn,
							//   OR
							// 	 2) the stack is nonempty and the requested one-off is a 2
							if (((params.caster_index === game.turn % 2) || (game.stack.length !== 0 && game.players[params.caster_index].hand[params.hand_index][1] === '2')) && game.players[params.caster_index].socketId == req.socket.id) {
								console.log("Correct player wants to play one-off");
								if (!(params.hasOwnProperty("target_index"))) {
									//If so, create a new one-off effect for them
									OneOff.create({
										game: game,
										caster_index: params.caster_index,
										hand_index: params.hand_index,
										card: game.players[params.caster_index].hand[params.hand_index]
									}).exec(function(err, one_off) {
										if (err || !one_off) {
											console.log("Error. One-off not created");
										} else {
											console.log(one_off);
											//Place the card being played (as a one-off) in the scrap pile
											var temp_card = game.players[params.caster_index].hand[params.hand_index];
											//Switch the hand[0] with hand[hand_index]
											game.players[params.caster_index].hand[params.hand_index] = game.players[params.caster_index].hand[0];
											game.players[params.caster_index].hand[0] = temp_card;
											//Shift one-off into the scrap pile
											game.scrap[game.scrap.length] = game.players[params.caster_index].hand.shift();
											//Save changes
											game.save();
											//Update all users playing this game of the changes
											Game.publishUpdate(params.displayId, {
												game: game
											});
											//Notify all users subscribed to this game (except one making request)
											//of the one_off added to the stack and 
											Game.message(game, {
												one_off: one_off
											}, req);
										}
									});
								//Else a target index was given
								} else {
									//If so, create a new one-off effect for them
									OneOff.create({
										game: game,
										caster_index: params.caster_index,
										hand_index: params.hand_index,
										card: game.players[params.caster_index].hand[params.hand_index],
										target_index: params.target_index
									}).exec(function(err, one_off) {
										if (err || !one_off) {
											console.log("Error. One-off not created");
										} else {
											console.log(one_off);
											console.log('\n');
											//Place the card being played (as a one-off) in the scrap pile
											var temp_card = game.players[params.caster_index].hand[params.hand_index];
											//Switch the hand[0] with hand[hand_index]
											game.players[params.caster_index].hand[params.hand_index] = game.players[params.caster_index].hand[0];
											game.players[params.caster_index].hand[0] = temp_card;
											//Shift one-off into the scrap pile
											game.scrap[game.scrap.length] = game.players[params.caster_index].hand.shift();

											//Save changes
											game.save();
											//Update all users playing this game of the changes
											Game.publishUpdate(params.displayId, {
												game: game
											});
											//Notify all users subscribed to this game (except one making request)
											//of the one_off added to the stack and 
											Game.message(game, {
												one_off: one_off
											}, req);
										}
									});
								}
								//Else: the user is not in that game, or it is not their turn 
							} else {
								console.log("Wrong player trying to play one-off");
								res.send(game);
							}
						}
					});
			}
		}
	},

	//This action performs the one-off effects that have been pushed to a game's stack
	//It checks which OneOffs are on the stack and calls chooseEffect() (defined at the top of this file)
	//Which calls the appropriate function (also defined at the top of this file) to perform the effect
	collapse_stack: function(req, res) {
		console.log("\nRequest made to collapse the stack");
		//Capture the request parameters
		var params = req.body;


		//Check that request was made through socket (otherwise it is invalid)
		if (req.isSocket) {
			//Check that request included a displayId of the game being played
			if (params.hasOwnProperty('displayId')) {
				//Find the requested game
				Game.findOne({
					displayId: params.displayId
				}).populate('players').populate('stack').exec(
					function(err, game) {
						//Check that game was found
						if (err || !game) {
							console.log("Game not found");
							res.send("Game not found");
							//Check that requesting user is in the requested game
						} else if (req.socket.id === game.players[0].socketId || req.socket.id === game.players[1].socketId) {
							//temp_stack_loop is an array that will be populated with all of the OneOffs in game.stack in reverse order
							//it will be used to iterate through each OneOff and perform the appropriate effect
							var temp_stack_loop =[];

							//temp_stack_check will initialized to game.stack.reverse() (it will start out the same as temp_stack_loop)
							//When a OneOff is executed, it will be deleted and it's corresponding  element in temp_stack_check is removed.

							//Before a OneOff is executed (within the tempp_stack_loop.forEach() loop), we check that the one-off
							//can still be found in temp_stack_check. If not, then it was countered (removed) and will be skipped.
							var temp_stack_check = [];

							//Populate temp_stack_loop and temp_stack_check with all OneOffs in game.stack in reverse order
							game.stack.reverse().forEach(
							function(one_off, index, stack){
								temp_stack_loop[index] = one_off;
								temp_stack_check[index] = one_off;
							});

							//Iterate through each OneOff in temp_stack_loop and execute them if they are still in temp_stack_check
							temp_stack_loop.forEach(
							function(one_off, index, arr){
								console.log(one_off);
								//Check that the current OneOff is still in temp_stack_check
								if (temp_stack_check.indexOf(one_off > -1)) {
									//If so, execute it, then remove it from the temp_stack check and delete it from game.stack
									console.log(one_off.card + " is in temp_stack_check\n");
									//Switch based on card at top of stack,
									//Then capture the rule associated with that card in game.rules
									switch (one_off.card[1]) {
										//If the one off was an ace, apply the rule for game.rules.ace
										case '1':
											console.log("Last card in stack is an Ace");
											//Pull the name of the rule from game.rules
											var str = game.rules.ace;
											//Use the str representing the rule to choose which
											//effect to perform on the requested game
											chooseEffect(game, str);
											break;

										case '2':
											console.log("Last card in stack is a 2");
											//Check whether the two is the only card in the stack
											//If so, it's being played out of turn and is a counter to a previous one-off
											if (temp_stack_check.length !== 1) {
												console.log("Two is being used to counter previous one-off");
												//If not, then use the two to counter the one-off before it
												OneOff.destroy(temp_stack_check[1].id, function(res){
													console.log("Destroyed one-off by countering it");
													console.log(res);
												});
												console.log("Removing effect being countered from stack: ");
												var removed = temp_stack_check.splice(1, 1);
												console.log("Logging removed one-off from temp_stack_check");
												console.log(removed);
												console.log("Logging temp_stack_check after attempted removal");
												console.log(temp_stack_check);
												console.log('\n');
											//Otherwise, two was played on turn and is targeting a face-card
											} else {
												if (one_off.hasOwnProperty("target_index")) {

													var target = new Target();
													//Assume the target player is the opponent
													target.player = (one_off.caster_index + 1) % 2;
													target.index = one_off.target_index;
													target.kind = 'card';
													//Capture appropriate rule and perform effect
													var str = game.rules.two;
													chooseEffect(game, str, target);
												}
											}
											break;

										case '5':
											console.log("Last card in stack is a 5");
											var str = game.rules.five;

											//Use the str representing the rule to choose which effect
											//to perform on the requested game
											chooseEffect(game, str);


										case '6':
											console.log("Last card in stack is a 6");
											var str = game.rules.six;
											//Use the str representing the rule to choose which
											//effect to perform on the requested game
											chooseEffect(game, str);
											break;
									}

									//After running chooseEffect(), delete the OneOff corresponding
									//to the effect just executed (from the database)
									OneOff.destroy(one_off.id, function(res){
										console.log(res);
									});
									console.log("Removing the one-off that just executed from temp_stack_loop: ");
									removed = temp_stack_loop.splice(0, 1);
									console.log(removed);
									console.log("\nLogging temp_stack_loop after one-off\n");
									console.log(temp_stack_loop);

									//Incriment the turn
									game.turn++;
									//Check for a winner
									winner(game);
									//Then save changes and publish the update
									game.save();
									Game.publishUpdate(params.displayId, {game: game});
								}
							});

						}
					});
			}
		}
	},

	play_again: function(req, res) {
		console.log("Request made to play again");
		var params = req.body;

		if (req.isSocket) {
			if (params.hasOwnProperty('displayId')) {
				Game.findOne(params.displayId).populate('players').exec(
				function(err, game){
					if (err || !game) {
						console.log("Game not found");
					} else if(game.play_again === game.players.length - 1) {
						console.log("Everyone wants to play again. Resetting");
						reset(game);
						game.save();
						Game.publishUpdate(params.displayId, {game: game});
					} else {
						game.play_again++;

						console.log(game.play_again + " players want to play again");
						game.save();
						//Game.publishUpdate(params.displayId, {game: game}, req);
					}
				});
			}
		}
	}

};