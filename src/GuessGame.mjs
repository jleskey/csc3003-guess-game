import express from 'express';
import bodyParser from 'body-parser';

const app = express();

const port = 8080;

// Using body-parser allows you to access request.body from within
// routes and use that data.
app.use(bodyParser.urlencoded({ extended: true }));

const form =
	'<h2>Welcome to Guess the Number Game!</h2>' +
	'<p><strong>To play, guess a number between 1 and 100.</strong></p>' +
	'<form action="/" method="post">' +
	'<p><label for="guess">Enter your guess: </label>' +
	'<input type="number" name="guess"></p>' +
	'<input type="submit">' +
	'</form>';

app.get('/', (_, res) => {
	response.send(form);
});

app.post('/', (req, res) => {
	res.send(`${form}<p>Your guess is: ${req.body.guess}</p>`);
});

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

app.listen(port, () => console.log(`Listening on port ${port}.`));
