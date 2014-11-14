/**
 * DisplayGameController
 *
 * @description :: Server-side logic for managing Displaygames
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

	//Subscribes Client to class room for DisplayGames
	//ALL clients are subscribed on connection (see homepage.js)
	//This allows for realtime uptdates to the list of games seen on the homepage
	//subscribes sockets will thus gain access to DisplayGame model events with
	//create and destroy verbs
	subscribe: function(req, res) {
		console.log('subscribing socket: ' + req.socket.id + ' to DisplayGame class room');
		DisplayGame.watch(req);
	},

	//Creates a new DisplayGame and Corresponding Game. Publishes DisplayGame creation so all users
	//can see updated list of games and their availability
	create: function(req, res) {
		console.log('creating DisplayGame');
		var req_name = req.param('name');

		//Creates the DisplayGame and executes function where the new DisplayGame
		//is a parameter called 'newguy'
		DisplayGame.create({
			name: req_name
		}).exec(function created(err, newguy) {
			//After DisplayGame is created, make corresponding Game and execute a function where
			//the new Game is a parameter called 'newGame'
			Game.create({
				name: newguy.name,
				displayId: newguy.id,

			}).exec(function createdGame(err, newGame) {
				console.log('Created Game: ' + newGame.name + ', with displayId: ' + newGame.displayId + '\n');
				//console.log(newGame);
			});

			//publishCreate will emit an event with name DisplayGame with an object paremeter
			//obj consists of verb (from request), data (object representing created DisplayGame) and id of DisplayGame
			//data consists of id, name and status of created DisplayGame
			DisplayGame.publishCreate({
				id: newguy.id,
				name: newguy.name,
				status: newguy.status
			});

			console.log('Created new DisplayGame: ' + newguy.name + ' with id: ' + newguy.id);


		});
	},	

	//This action is called when a player requests to join a game by clicking
	//a displaygame div on their homepage.
	//It creates a new Player model, with a foreign key to the chosen game,
	//then subscribes the user's socket to that game
	joinGame: function(req, res) {
		//Fetch parameters from request
		//Expects a displayId
		var params = req.body;
		console.log(params);

		//Fetch the displayId from the request parameters
		var req_id = params.displayId;

		//Find the game specified by the displayId given in request,
		//then populate that game with it's players attribute (collection of player models)
		Game.findOne({
			displayId: req_id
		}).populate('players').exec(
		//The newly found Game will be referenced as 'game'
		function(err, game){
			//Catch error if game not found
			if (err || !game) {
				return res.send('Game not found!');
				console.log('Game not found!');
			//Only subscribe user if game is open
			} else if (game.status == true) {
				var game_is_open = game.status;

				//Create new Player
				//Decide if this Player is player 1
				//Insert this Player into the players collection
				//of the chosen Game
				var isP1 = (game.players.length === 0);
				Player.create({
					isPlayerOne: isP1,
					socketId: req.socket.id,
					currentGame: game
				}).exec(function(err, res) {
					console.log("New Player Added: " + res.socketId + '\n');
					//console.log(res);
				});
				//Subscribe user to requested game
				Game.subscribe(req.socket, game);

				//Fetch DisplayGame corresponding to chosen game
				DisplayGame.findOne({id: req_id}).exec(function(err, dispGame){
					console.log("Found DisplayGame");

					//Add socket of new user to displayGame
					dispGame.players[game.players.length] = req.socket.id;

					console.log(dispGame);
					console.log('\n');


					//Close Displaygame (toggle its status) if new player is second player
					if (game.players.length == 1) {
						console.log("Game is now full");
						//game.status = false;
						dispGame.status = false;
						console.log("Logging new game status: ");
						console.log(dispGame.status);
						//Save changes to game and displaygame
						game.save();
						dispGame.save();

						//Publish update to displaygame to all users except one making request
						DisplayGame.publishUpdate(dispGame.id, {
							players: dispGame.players,
							status: dispGame.status,
							name: dispGame.name
						},
						req);
					}
					//Save Changes to DisplayGame
					dispGame.save();
					//Send true to user, to alert them that the game is open
					res.send(game_is_open);
				});
			//If game.status == false, send game.status to alert user that they may not join
			} else {
				console.log("Game was full upon request");
				game_is_open = false;
				//Send game.status, which is false
				res.send(game_is_open);
			}
			//Save Changes to game
			game.save();
		});
	console.log('\n');
	},

	//Sends the gameview to user (called after joinGame)
	//This action should only be called through http (NOT SOCKETS)
	gotoGame: function(req, res) {
		console.log("\nGotoGame Firing.");
		//console.log('gotoGame Firing');
		params = req.allParams();
		//console.log(params);
		Game.findOne({displayId: params.displayId}).populate('players').exec(
		function(err, game){
			//Catch error if game not found
			if(err || !game){
				console.log("Game not found");
				res.send("Game not found!");
			//Only allow user to join open game
			} else if(game.status === true){				
				//console.log(game);
				console.log('\n');
				//Check if this player is the second player to be brought to the view
				if(game.players.length === 2){
					game.status = false;
					game.save();
				}
				//Send view to user
				return res.view('gameview', params);
			}
		});
	}


	
		

};

