'use strict';

/**
 * @file main.js
 * @author Joseph Leskey
 */

// Get those action buttons rolling.
document.body.addEventListener('click', event => {
    const target = event.target;
    if (target instanceof HTMLButtonElement) {
        const action = target.dataset.action;
        if (action) {
            event.preventDefault();
            postAction(action);
        }
    }
})

/**
 * Posts an action to the game server.
 * @param {string} action The action
 */
function postAction(action) {
    let value;

    if (action === 'change max') {
        value = prompt('What should the largest number be?');
    } else if (action === 'change limit') {
        value = prompt('How many guesses do you want to get?');
    }

    if (value !== null) {
        post({
            action: action,
            value: value,
        });
    }
}

/**
 * Posts data to the game server.
 * @param {any} data The data
 */
function post(data) {
    fetch('', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams(data),
    }).then(() => location.replace(''));
}
