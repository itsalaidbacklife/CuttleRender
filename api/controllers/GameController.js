/**
 * GameController
 *
 * @description :: Server-side logic for managing Games
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	draw: function(req, res) {
		console.log("Draw request made");
		console.log(req.isSocket);
		console.log(req.body);
		console.log(req.socket.id);
		if(req.isSocket){
			//Log and capture request parameters. Expecting displayId of Game
			console.log(req.body);
			var params = req.body;

			Game.findOne({displayId: params.displayId}).populate('players').exec(function(err, game){
				if(err || !game){
					console.log("Game not found");
					res.send("Game not found");
				//Check that game is full before allowing a move
				} else if(game.players.length === 2) {
					console.log(game);
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
					if (player === (game.turn % 2) ) {
						console.log("It is the correct player's turn");
						//Check if you are at the hand limit
						if (game.players[player].hand.length <= game.handLimit) {
							console.log("Player is under the hand limit");
							//Deal if all is legit
							//Deal the card
							game.players[player].hand[game.players[player].hand.length] = game.deck.shift();
							//Incriment the turn
							game.turn++;
							//Save the changes
							game.save();
							//Publish the changes
							Game.publishUpdate(req.body.displayId, {game: game});
						} else{
							console.log("Player cannot draw due to Hand limit");
						}

					} else {
						console.log("Wrong player requesting to move");
						console.log(game);
						res.send({game:game});
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
		if(req.isSocket) {
			//Find the chosen game
			Game.findOne({displayId: req_id}).populate('players').exec(
			function(err, game){
				console.log("Found game for deal action. Logging");
				if(err || !game){
					console.log("Game not found");
					res.send("Game not found");
				//Check that game has appropriate number of players
				} else if(game.players.length === 2) {
					console.log("Indside player length conditional");
					//Check that requesting player is in the chosen game
					if(req.socket.id === game.players[0].socketId || req.socket.id === game.players[1].socketId) {
						//Deal one card to player[1] before looping through deal. They get an extra card
						//and Player[0] goes first
						game.players[1].hand[0] = game.deck.shift();
						//Loop to finish dealing
						for(i=0; i<5; i++) {
							//Give a card to player[0]
							game.players[0].hand[game.players[0].hand.length] = game.deck.shift();
							//Give a card to player[1]
							game.players[1].hand[game.players[1].hand.length] = game.deck.shift();
						}

						//Save and log new game
						game.save();
						//console.log(game);

						//Publish new game
						Game.publishUpdate(req_id, {game: game});
					}
				}
			});
		}
	}
	
};

