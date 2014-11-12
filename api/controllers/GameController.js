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
						}

					} else {
						console.log("Wrong player requesting to move");
						res.send(game);
					}										
				}
			});


		}
	}
	
};

