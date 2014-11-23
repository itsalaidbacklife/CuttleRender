# CuttleRender

a [Sails](http://sailsjs.org) application

PREVIOUS:
-Began collapse_stack
	-Added function to draw 2 and bound it to 5, by default
	-Added function to destroy all face cards and bound it to 6, by default
	-Added code to counter previous one-off if the top of the stack is a two
	-destroyAllPoints() completed
	-collapse_stack now deletes the one-off after  running chooseEffect()
	-collapse_stack now properly iterates through each one-off in game.stack
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
		-NEXT: Finish 9, 2 (effects that require target, but no further prompting of user after request)
		-THEN: Finish 3, 4, 7 (effects that only prompt user to make choice as they resolve)
		-Create effects for 2's
			-Create function for playing a 2 on turn to destroy face card
		-Action now exists and is called when a user declines countering a new one-off with a two
		-Make a unique function for each one-off
		-Fix other one-off effect calls to send null target if target is not required, to generalize which cards are bound to which effects
-Fix move_card to leverage splice() (and maintain order of cards in hand/field)


-Fix deal method to reset game

-WHERE THE FUCK IS GAMEVIEW.JS