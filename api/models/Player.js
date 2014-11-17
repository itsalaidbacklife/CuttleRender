/**
 * Player.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {

	attributes: {
		//Current game player is playing
		currentGame: {
			model: 'game',
			required: true
		},

		//Boolean representing whether player is p1
		isPlayerOne: {
			type: 'boolean',
			required: true
		},

		//Array representing the cards in the player's hand
		hand: {
			type: 'array',
			defaultsTo: []
		},

		//Array representing the cards on player's Field
		field: {
			type: 'array',
			defaultsTo: []
		},

		//Id of the client socket of the player
		socketId: {
			type: 'string',
			defaultsTo: ''
		}

	}
};