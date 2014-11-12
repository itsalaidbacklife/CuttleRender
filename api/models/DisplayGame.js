/**
 * DisplayGame.js
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * This model represents the information on a Game that will be accessible to a user prior to joining the game.    *
 * Each DisplayGame will correspond with exactly one Game object and be used to render the homepage when a user    *
 * first loads site, displaying all Games currently being played and whether each game is open to new players
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *
 */

module.exports = {

  attributes: {
    
    //Array of socket id's of clients playing the game
    players: {
      type: 'array',
      defaultsTo: []
    },

    //Boolean representing whether new players may join game
    //true --> open to new players, false --> closed
    status: {
      type: 'boolean',
      required: true,
      defaultsTo: true
    },

    //Name of game
    name: {
      type: 'string',
      required: 'true'
    }

  }
};