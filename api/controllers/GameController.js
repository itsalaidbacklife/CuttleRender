/**
 * GameController
 *
 * @description :: Server-side logic for managing Games
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

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
};

var foo = function() {
	console.log("This is foo");
};

//This function takes a game and a string (representing which effect is to be executed within chosen game)
var chooseEffect = function(game, str) {
	console.log("Choosing effect: " + str);
	switch (str) {
		case 'destroyAllPoints':
			destroyAllPoints(game);
			break;
		Default
	}
};

module.exports = {
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

	//Shuffles the cards in a deck
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
	//TODO: Send message with game to everyone except player making the request
	//TODO: Check that requesting user is in game before continuing
	//TODO: Handle cases where target_index is provided
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
											//Place the card being played (as a one-off) in the scrap pile
											var temp_card = game.players[params.caster_index].hand[params.hand_index];
											//Switch the hand[0] with hand[hand_index]
											game.players[params.caster_index].hand[params.hand_index] = game.players[params.caster_index].hand[0];
											game.players[params.caster_index].hand[0] = temp_card;
											//Shift one-off into the scrap pile
											game.scrap[game.scrap.length] = game.players[params.caster_index].hand.shift();
											//Incriment the turn
											game.turn++;
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

	collapse_stack: function(req, res) {
		console.log("Request made to collapse the stack");
		var params = req.body;
		console.log(params);

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
							foo();
							//Switch based on card at top of stack,
							//Then capture the rule associated with that card in game.rules
							switch (game.stack[game.stack.length - 1].card[1]) {
								case '1':
									console.log("Last card in stack is an Ace");
									//Pull the name of the rule from game.rules
									var str = game.rules.ace;
									//Use the str representing the rule to choose which
									//effect to perform on the requested game
									chooseEffect(game, str);
									game.save();
									break;
							}

						}
					});
			}
		}
	}

};