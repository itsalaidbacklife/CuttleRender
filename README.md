# CuttleRender

a [Sails](http://sailsjs.org) application

PREVIOUS:
-Prevented users from entering closed games
	-How do we check?
	-Request for view does not come through socket
	-By the time request for view is made, game status has been updated to false
		-Maybe only update the displaygame status in first action, then game status in second
TODO:
-Enable drawing a card (use this to test render function)
-Finish/fix render call on button press
-WHERE THE FUCK IS GAMEVIEW.JS