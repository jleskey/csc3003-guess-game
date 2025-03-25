/**
 * @file GuessGame.mjs
 * @author Joseph Leskey
 */

import express from 'express';
import bodyParser from 'body-parser';
import { join } from 'path';

// App settings
const port = 8080;
const gamePath = '/';

// Set up an Express app.
const app = setup(port);

// Game settings
let min = 0;
let max = 100;
let limitOverride;

// Game state
let gameNumber = 0;
let number;
let limit;
let guessesRemaining;

// Game loop
app.post(gamePath, (req, res) => {
    const action = req.body.action;
    if (action) {
        processAction(action, req.body.value, (body) => res.send(body));
    } else {
        processGuess(req.body.guess, (body) => res.send(para(body)));
    }
});

/**
 * Responds to the player playing taking an action
 * @param {string} guess The action
 * @param {(body) => express.Response} reply Function to send a reply
 */
function processAction(action, value, reply) {
    let unknown = false;

    switch (action) {
        case 'new game':
            startGame();
            break;
        case 'change max':
            changeMax(value);
            break;
        case 'change limit':
            changeLimit(value);
            break;
        default:
            unknown = true;
            break;
    }

    if (!unknown) {
        reply('OK');
    } else {
        reply('BAD')
    }
}

/**
 * Responds to the player playing the game.
 * @param {string} guess The player's guess
 * @param {(body) => express.Response} reply Function to send a reply
 */
function processGuess(guess, reply) {
    if (guessesRemaining > 0) {
        if (guess) {
            if (guess == number) {
                reply('Wow, you got it. Great work. Want to go again?');
                startGame();
            } else if (!isNaN(guess)) {
                if (--guessesRemaining == 0) {
                    reply('You lost.');
                } else {
                    reply('That\'s wrong. Aim ' +
                            `${+guess < number ? 'higher' : 'lower'}.` +
                            `<br><br>Guesses remaining: ${guessesRemaining}`);
                }
            } else {
                reply("You may have missed the fact that you were filling out a \
                        number input. Just saying.");
            }
        } else {
            reply('You didn\'t even try to guess? :(');
        }
    } else {
        reply('You have already lost. Please start a new game.');
    }
}

/**
 * Changes the maximum number and update the chosen number.
 * @param {number} value New number
 */
function changeMax(value) {
    if (value && !isNaN(value)) {
        max = +value;
        console.log(`Set max: ${value}`);
        if (max < number) {
            number = between(min, max);
            console.log(`Update number: ${number}`);
        }
    }
}

/**
 * Changes the limit and updates the remaining guesses.
 * @param {number} value New limit
 */
function changeLimit(value) {
    if (value && !isNaN(value)) {
        console.log(`Current remaining guesses: ${guessesRemaining}`);
        limitOverride = +value;
        console.log(`Set limit override: ${value}`);
        guessesRemaining = limitOverride - (limit - guessesRemaining);
        console.log(`Update remaining guesses: ${guessesRemaining}`);
        limit = limitOverride;
        console.log(`Update limit: ${value}`);
    }
}

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

    app.use('/static', express.static(join(import.meta.dirname, 'public')));

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

    if (!limitOverride) {
        // We'll be nice and make winning more or less mathematically
        // guaranteed (if you play like a binary search algorithm).
        limit = Math.ceil(Math.log2(max - min + 1));
    }
    guessesRemaining = limit;

    console.log(
        `\nStarted game #${gameNumber}. The number is ${number}. ` +
        `The player has ${guessesRemaining} guesses.`
    );
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
                    <input type="submit" value="Submit Guess">
                    <button data-action="new game">New Game</button>
                    <button data-action="change max">Change Maximum Number</button>
                    <button data-action="change limit">Change Number of Guesses</button>
                </form>${content ? `\n${content}` : ''}
                <script src="static/main.js"></script>
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
