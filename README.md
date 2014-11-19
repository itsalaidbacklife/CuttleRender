# CuttleRender

a [Sails](http://sailsjs.org) application

PREVIOUS:
-Made the portion of the socket response to a message that's inside the if(response) conditional its own function, then call it inside the socket response (so it can be recursively called if user fucks up their response)
-Server now responds upon creation of a one-off and gives chance to respond with a 2
-Enable scuttling
-Enable playing a card to field
-Enabled shuffling deck
-Enabled dealing hands
-Enabled drawing a card (use this to test render function)
-Finished/fixed render call on button press
-Prevented users from entering closed games

TODO:
-Enable the one-offs
	-Began push_stack action
		-Handling cases 1, 6 & 7

-Fix deal method to reset game
-WHERE THE FUCK IS GAMEVIEW.JS