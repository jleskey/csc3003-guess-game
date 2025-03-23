/**
 * @file GuessGame.mjs
 * @author Joseph Leskey
 * @date 19 March 2024
 */

import express from 'express';
import bodyParser from 'body-parser';

// App settings
const port = 8080;
const gamePath = '/';

// Set up an Express app.
const app = setup(port);

// Game settings
let min = 0;
let max = 100;

// Game state
let gameNumber = 0;
let number;

// Game loop
app.post(gamePath, (req, res) => {
	const guess = req.body.guess;
	const reply = (body) => res.send(para(body));

	if (guess) {
		if (guess == number) {
			reply('Wow, you got it. Great work. Want to go again?');
			startGame();
		} else if (!isNaN(guess)) {
			reply("That's wrong. Do better.")
		} else {
			reply("You might have missed the fact that you were filling out a \
					number input. Just saying.");
		}
	} else {
		reply('You didn\'t even try to guess? :(');
	}
});

/**
 * Hosts the game on a local server.
 *
 * @param {number} port Port number
 * @returns {express.Express} An express app
 */
function setup(port) {
	const app = express();

	// Using body-parser allows you to access request.body from within
	// routes and use that data.
	app.use(bodyParser.urlencoded({ extended: true }));

	app.get(gamePath, (_, res) => {
		res.send(html());
	});

	app.listen(port, () => {
		console.log(`Listening on port ${port}.`);
		startGame();
	});

	return app;
}

/**
 * Starts a new game.
 */
function startGame() {
	gameNumber++;
	number = between(min, max);
	console.log(`\nStarted game #${gameNumber}. The number is ${number}.`);
}

/**
 * Crafts an HTML response with the given content as a paragraph.
 *
 * @param {string?} content Content to display in the body of the HTML
 * @returns {string} The given content, wrapped in appropriate HTML
 */
function para(content) {
	return html(content ? `<p>${content}</p>` : '');
}

/**
 * Crafts an HTML response with the given content.
 *
 * @param {string?} content Content to display in the body of the HTML
 * @returns {string} The given content, wrapped in appropriate HTML
 */
function html(content) {
	return `
		<!DOCTYPE html>
		<html>
			<head>
				<title>Joseph's Guessing Game</title>
				<meta charset="utf-8">
			</head>
			<body>
				<h2>Welcome to Guess the Number Game!</h2>
				<p>
					<strong>
						To play, guess a number between ${min} and ${max}.
					</strong>
				</p>
				<form action="/" method="post">
					<p>
						<label for="guess">Enter your guess: </label>
						<input type="number" name="guess" min="${min}"
							max="${max}">
					</p>
					<input type="submit">
				</form>${content ? `\n${content}` : ''}
			</body>
		</html>
	`;
}

/**
 * Generates a pseudorandom number between two values (inclusive).
 *
 * @param {number} min The minimum value
 * @param {number} max The maximum value
 * @returns {number} The generated pseudorandom number
 */
function between(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
}
