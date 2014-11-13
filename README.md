# CuttleRender

a [Sails](http://sailsjs.org) application

PREVIOUS:
-Enable dealing hands
-Enable drawing a card (use this to test render function)
-Finish/fix render call on button press
-Prevented users from entering closed games
	-How do we check?
	-Request for view does not come through socket
	-By the time request for view is made, game status has been updated to false
		-Maybe only update the displaygame status in first action, then game status in second
TODO:
-Fix deal method to reset game
-Enable shuffling deck
-Enable playing a card to field
-Enable scuttling
-WHERE THE FUCK IS GAMEVIEW.JS