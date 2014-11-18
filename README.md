# CuttleRender

a [Sails](http://sailsjs.org) application

PREVIOUS:
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
		-New one-offs aren't being appended to the stack FIX THIS
			-One-offs do have reference to their game
			-Check with a populate and log
				-NEVERMIND, SUCCESS!
		-Make the portion of the socket response to a message that's inside the if(response) conditional its own function, then call it inside the socket response (so it can be recursively called if user fucks up their response)

-Fix deal method to reset game
-WHERE THE FUCK IS GAMEVIEW.JS