/**
 * Game.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {

	attributes: {

		//Id of DisplayGame associated with Game
		//This is the primary key of a Game model
		displayId: {
			type: 'integer',
			required: true,
			primaryKey: true,
			unique: true
		},

		//Name of Game
		name: {
			type: 'string',
			required: true
		},

		//Status determines whether game is open to new players
		status: {
			type: 'boolean',
			defaultsTo: true
		},

		//Untouched array of cards used to re-initialize the deck on reset
		/*cleanDeck: {
			type: 'array',
			defaultsTo: ["c1", "c2", "c3", "c4", "c5", "c6", "c7", "c8", "c9", "c10", "c11", "c12", "c13",
				"d1", "d2", "d3", "d4", "d5", "d6", "d7", "d8", "d9", "d10", "d11", "d12", "d13",
				"h1", "h2", "h3", "h4", "h5", "h6", "h7", "h8", "h9", "h10", "h11", "h12", "h13",
				"s1", "s2", "s3", "s4", "s5", "s6", "s7", "s8", "s9", "s10", "s11", "s12", "s13"
			]
		}, */

		//Array of cards representing the current game deck
		deck: {
			type: 'array',
			defaultsTo: ["c1", "c2", "c3", "c4", "c5", "c6", "c7", "c8", "c9", "cT", "cJ", "cQ", "cK",
				"d1", "d2", "d3", "d4", "d5", "d6", "d7", "d8", "d9", "dT", "dJ", "dQ", "dK",
				"h1", "h2", "h3", "h4", "h5", "h6", "h7", "h8", "h9", "hT", "hJ", "hQ", "hK",
				"s1", "s2", "s3", "s4", "s5", "s6", "s7", "s8", "s9", "sT", "sJ", "sQ", "sK"
			]

		},

		//A collection of players each with hands, fields, socketIds and a foreign key: currentGame
		players: {
			collection: 'player',
			via: 'currentGame'
		},

		//An array of all cards in the scrap pile
		scrap: {
			type: 'array',
			defaultsTo: []
		},

		//An integer representing the maximum number of cards a player may have in their hand
		handLimit: {
			type: 'integer',
			defaultsTo: 8
		},

		turn: {
			type: 'integer',
			defaultsTo: 0
		},

	},
	//Turn of automatic generation of primary key (id) for Games, as they will be found via their displayId,
	//corresponding to their DisplayGame
	autoPK: false
};