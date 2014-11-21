# CuttleRender

a [Sails](http://sailsjs.org) application

PREVIOUS:
-Began collapse_stack
	-Created functions destroyAllPoints() and chooseEffect()
	-Created game.rules
		-only default value atm: game.rules.ace = 'destroyAllPoints'
		-collapse_stack now switches based on the card at the top of the stack
			-Uses this to pick which rule to apply
			-Then runs chooseEffect on the game with the given rule string
	-test function foo() at top of GameController executed SUCCESSFULLY
-Began push_stack action
	-Handling cases 1, 3, 4, 5, 6 & 7
	-Handling cases 2, 9
-push_stack is ostensibly completed
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
	-collapse_stack
		-NEXT: Finish destroyAllPoints()
		-THEN: Make each effect function and tie them to their string in chooseEffect
		-Action now exists and is called when a user declines countering a new one-off with a two
		-collapse_stack currently calls a test function that at top of GameController
		-Make a unique function for each one-off
			-Or should there be one function per rule????
			-And one function that takes a game param and a string key to pick the rule to execute??


-Fix deal method to reset game

-WHERE THE FUCK IS GAMEVIEW.JS