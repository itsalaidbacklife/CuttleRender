/**
* OneOff.js
*
* This is a model for a one-off effect. It will be associated many-to-one with one Game object
* in the collection game.stack. This is used to determine the order in which effects occur when
* a player plays a one-off (allowing for counter-effects).
*
* The model contains a game (foreign key to its game), a caster index (index of which player is playing it),
* a hand_index, (index of one-off within a player's hand) and
* a target index (index of which card, or player is being targeted, if any).
*/

module.exports = {

  attributes: {
  	//Foreign key to the game where the one-off is being played
  	game: {
  		model: 'game',
  		required: true
  	},

  	//Index of player that is casting the one off
  	caster_index: {
  		type: 'integer',
  		required: true
  	},

  	//Index of one-off within its player's hand
  	hand_index: {
  		type: 'integer',
  		required: 'true'
  	},

  	//Index of the target (either which card in their hand, which player, or which card on field)
  	target_index: {
  		type: 'integer'
  	}


  }
};

