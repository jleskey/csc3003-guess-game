- Guess limit
- Option to change the guess limit (that also updates remaining guesses)
    - This makes the guess limit static.
- Option to change the maximum number (that may update the current number)
    - It doesn't reset the game state, but this game never claimed to have
      expected behavior.
    - And there's some slightly modular design going on, so behavior can be
      changed pretty easily.
- Option to reset the game state
