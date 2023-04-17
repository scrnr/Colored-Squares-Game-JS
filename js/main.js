'use strict';

const gameField = document.getElementById('game');
const gameStartBtn = document.getElementById('btn-start');
const levelBox = document.getElementById('level-box');

const colors = ['#0000ff', '#ff0000', '#00ff00', '#ffd700', '#00ffff', '#ff00ff', '#800080', '#006400', '#ff8c00', '#ffe4e1', '#8a2be2'];

const game = new Game(gameField, colors);

gameStartBtn.onclick = () => Game.showScreen(1);

levelBox.onclick = event => {
    const btn = event.target;

    if (btn.localName === 'button') {
        let [row, column] = btn.textContent.split('x');
        if (!column) row = column = 3;
        game.start(row, column);
        Game.showScreen(2);
    }
}
