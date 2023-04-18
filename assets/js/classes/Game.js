class Game {
    #cells = [];
    #colors = [];
    #darkIndexes = [];
    #leftCells = 0;
    #mainColors = [];
    #openCellIndexes = [];
    #isEnd = false;

    #field = null;
    #zone = null;
    #helpBtn = null;
    #repeatBtn = null;

    constructor(field, colors) {
        this.#field = field;
        this.#zone = this.#field.closest('.game__zone');
        this.#mainColors = colors;
        this.#repeatBtn = document.getElementById('repeat-btn');
        this.#helpBtn = document.getElementById('help-btn');
    }

    static showScreen(screen) {
        document.getElementById('screen-box').style.left = `${screen * -100}%`;
    }

    start(rowsCount, columnsCount) {
        this.#reset();

        this.#field.style.gridTemplateColumns = `repeat(${rowsCount}, 1fr)`;
        this.#field.style.gridTemplateRows = `repeat(${columnsCount}, 1fr)`;

        const cellsCount = rowsCount * columnsCount;
        const darkCount = this.#getDarkCellsCount(rowsCount);
        const colorCount = (cellsCount - darkCount) / 3;
        this.#leftCells = cellsCount - darkCount;
        this.#colors = this.#getColors(colorCount, darkCount);


        for (let i = 0; i < cellsCount; i++) {
            const cell = document.createElement('div');
            cell.className = 'game-cell';
            this.#field.append(cell);
            this.#cells.push(cell);

            if (this.#colors[i].includes('#000000')) this.#darkIndexes.push(i);
        }

        this.#cells.forEach((cell, index) => {
            cell.onclick = () => this.#openCell(cell, index);
        });

        this.#repeatBtn.onclick = () => Game.showScreen(1);

        this.#helpBtn.onclick = () => {
            if (!this.#isEnd) {
                this.#openAllCells();
                this.#helpBtn.disabled = true;

                setTimeout(() => this.#closeAllCells(), 2000);
            }
        }
    }

    #reset() {
        this.#cells = [];
        this.#colors = [];
        this.#openCellIndexes = [];
        this.#darkIndexes = [];
        this.#leftCells = 0;
        this.#helpBtn.disabled = false;
        this.#isEnd = false;
        this.#field.innerHTML = '';
        this.#field.className = 'game__field';
        this.#zone.className = 'game__zone';
        document.getElementById('win').classList.remove('show');
        document.getElementById('game-over').classList.remove('show');
    }

    #getDarkCellsCount(row) {
        let darkCount;

        switch (row) {
            case '3':
                darkCount = 0;
                break;
            case '6':
                darkCount = 3;
                break;
            case '7':
                darkCount = 4;
                break;
            case '8':
                darkCount = 7;
                break;
            default:
                darkCount = 1;
                break;
        }

        return darkCount;
    }

    #getColors(count, darkCount) {
        const colors = [];
        let j = - 1;

        for (let i = 0; i < count; i++) {
            j = (j < this.#mainColors.length - 1) ? j + 1 : 0;
            const color = this.#mainColors[j];
            colors.push(color, color, color);
        }

        Array(darkCount).fill().map(() => colors.push('#000000'));

        return this.#shuffle(colors);
    }

    #shuffle(cells) {
        for (let i = cells.length - 1; i > 0; i--) {
            const index = Math.floor(Math.random() * (i + 1));
            [cells[i], cells[index]] = [cells[index], cells[i]];
        }

        return cells;
    }

    #openCell(cell, index) {
        if (this.#openCellIndexes.includes(index)) return;

        this.#leftCells--;
        this.#field.classList.add('no-click');
        cell.style.backgroundColor = this.#colors[index];
        cell.classList.add('open');
        this.#openCellIndexes.push(index);

        if (this.#isTheEndOfTheGame(index)) return;

        const isIdentical = this.#checkOpenCells();

        if (typeof isIdentical === 'boolean') {
            this.#openCellIndexes.forEach(index => {
                const cell = this.#cells[index];

                if (isIdentical) {
                    setTimeout(() => {
                        cell.classList.add('correct');
                        this.#field.classList.remove('no-click');
                    }, 200);
                } else {
                    setTimeout(() => {
                        cell.classList.remove('open');

                        setTimeout(() => {
                            cell.style.backgroundColor = 'inherit';
                            this.#field.classList.remove('no-click');
                        }, 200);
                    }, 400);
                }
            });

            if (!isIdentical) this.#leftCells += this.#openCellIndexes.length;

            this.#openCellIndexes = [];
        } else {
            setTimeout(() => this.#field.classList.remove('no-click'), 200);
        }
    }

    #checkOpenCells() {
        if (this.#openCellIndexes.length >= 2) {
            const result = this.#openCellIndexes.reduce((count, openIndex, index, cells) => {
                if (index === 0) return 1;

                if (this.#colors[openIndex] === this.#colors[cells[--index]]) return ++count;

                return false;
            }, 0);

            if (result === false) {
                return false;
            } else if (result === 3) {
                return true;
            }
        }
    }

    #isTheEndOfTheGame(index) {
        if (this.#darkIndexes.includes(index)) {
            this.#isEnd = true;
            this.#gameOver();

            return true;
        }

        if (this.#leftCells === 0) {
            this.#isEnd = true;
            this.#win();

            return true;
        }

        return false;
    }

    #win() {
        setTimeout(() => {
            this.#openCellIndexes.forEach(index => {
                this.#cells[index].classList.add('correct');
            });
        }, 200);

        this.#endOfTheGame('win');
    }

    #gameOver() {
        setTimeout(() => {
            const darkIndex = this.#openCellIndexes.pop();
            this.#cells[darkIndex].classList.add('uncorrect');
        }, 200);

        this.#endOfTheGame('game-over');
    }

    #endOfTheGame(id) {
        setTimeout(() => {
            this.#openAllCells();

            this.#zone.classList.add('end');
            document.getElementById(id).classList.add('show');
        }, 400);
    }

    #openAllCells() {
        this.#cells.forEach((cell, index) => {
            cell.style.backgroundColor = this.#colors[index];
            cell.classList.add('open');
        });
    }

    #closeAllCells() {
        this.#cells.forEach(cell => {
            cell.classList.remove('open');

            setTimeout(() => cell.style.backgroundColor = 'inherit', 200);
        });
    }
}
