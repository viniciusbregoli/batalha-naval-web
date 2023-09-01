document.addEventListener("DOMContentLoaded", function () {
    const board = document.getElementById("board");
    const vidasElem = document.getElementById("vidas");
    const pontuacaoElem = document.getElementById("score");
    const gameOverElem = document.getElementById("game-over");
    const pontuacaoFinalElem = document.getElementById("final-score");
    const startRestartBtn = document.getElementById("start-restart-btn");
    const configElem = document.getElementById("config");
    const selectTiros = document.getElementById("tiro");
    const selectBombaElem = document.getElementById("bomba");
    const selectBombaAtomicaElem = document.getElementById("bomba-atomica");
    const dificuldadeRadios = document.querySelectorAll('#config input[name="dificuldade"]');
    const mensagemElem = document.querySelector(".game-message");
    const toggleMensagemElem = document.getElementById("toggle-message");

    let radioSelecionado = null;
    let bombaRestantes = 2;
    let bombaAtomicaRestantes = 1;

    const boardSize = 8 * 12;
    let vidas = null;
    let score = 0;

    toggleMensagemElem.addEventListener("change", function () {
        if (this.checked) {
            mensagemElem.style.display = "block";
        } else {
            mensagemElem.style.display = "none";
        }
    });

    startRestartBtn.addEventListener("click", function (event) {
        event.preventDefault();
        if (startRestartBtn.textContent === "Iniciar Jogo") {
            startGame();
        } else {
            restartGame();
        }
    });

    function destruirTile(tile) {
        if (!tile.classList.contains("tile-clicked")) {
            if (Math.random() > 0.6) {
                tile.textContent = "🚢";
                score += 10;
                pontuacaoElem.textContent = score;
                mensagemElem.textContent = "Você destruiu um submarino!";
            } else {
                tile.textContent = "🌊";
                vidas -= 1;
                vidasElem.textContent = `Vidas: ${vidas}`;
                mensagemElem.textContent = "Deu água!";

                if (vidas === 0) {
                    gameOver();
                }
            }
            tile.classList.add("tile-clicked");
        }
    }

    function getTilesBomba(tile) {
        const tiles = [];
        const tileId = parseInt(tile.id);
        const tileRow = Math.floor(tileId / 12);
        const tileCol = tileId % 12;

        tiles.push(tile);

        if (tileRow > 0) {
            tiles.push(document.getElementById(tileId - 12));
        }

        if (tileRow < 7) {
            tiles.push(document.getElementById(tileId + 12));
        }

        if (tileCol > 0) {
            tiles.push(document.getElementById(tileId - 1));
        }

        if (tileCol < 11) {
            tiles.push(document.getElementById(tileId + 1));
        }

        return tiles;
    }

    function getTilesBombaAtomica(tile) {
        const tiles = [];
        const tileId = parseInt(tile.id);
        const tileRow = Math.floor(tileId / 12);
        const tileCol = tileId % 12;

        tiles.push(tile);

        if (tileRow > 0) {
            tiles.push(document.getElementById(tileId - 12));
            if (tileCol > 0) {
                tiles.push(document.getElementById(tileId - 13));
            }
            if (tileCol < 11) {
                tiles.push(document.getElementById(tileId - 11));
            }
        }

        if (tileRow < 7) {
            tiles.push(document.getElementById(tileId + 12));
            if (tileCol > 0) {
                tiles.push(document.getElementById(tileId + 11));
            }
            if (tileCol < 11) {
                tiles.push(document.getElementById(tileId + 13));
            }
        }

        if (tileCol > 0) {
            tiles.push(document.getElementById(tileId - 1));
        }

        if (tileCol < 11) {
            tiles.push(document.getElementById(tileId + 1));
        }

        return tiles;
    }

    function inicializarBoard() {
        for (let i = 0; i < boardSize; i++) {
            const tile = document.createElement("div");
            tile.classList.add("tile");
            tile.id = i;
            tile.addEventListener("click", tileClicado);
            board.appendChild(tile);
        }
    }

    function tileClicado(event) {
        const tile = event.target;
        const tipoDeTiro = selectTiros.value;

        if (tipoDeTiro === "1") {
            destruirTile(tile);
            console.log(tile.id);
            tile.removeEventListener("click", tileClicado);
        } else if (tipoDeTiro === "2" && bombaRestantes > 0) {
            const tiles = getTilesBomba(tile);
            tiles.forEach((tile) => destruirTile(tile));
            tiles.forEach((tile) => tile.removeEventListener("click", tileClicado));
            bombaRestantes -= 1;
            selectBombaElem.textContent = `Bomba (${bombaRestantes} restantes)`;
        } else if (tipoDeTiro === "3" && bombaAtomicaRestantes > 0) {
            const tiles = getTilesBombaAtomica(tile);
            tiles.forEach((tile) => destruirTile(tile));
            tiles.forEach((tile) => tile.removeEventListener("click", tileClicado));
            bombaAtomicaRestantes -= 1;
            selectBombaAtomicaElem.textContent = `Bomba Atômica (${bombaAtomicaRestantes} restantes)`;
        }
    }

    function gameOver() {
        configElem.style.display = "block";
        gameOverElem.style.display = "block";
        startRestartBtn.style.display = "block";
        pontuacaoFinalElem.textContent = score;
        startRestartBtn.display = "";

        const tiles = document.querySelectorAll(".tile");
        tiles.forEach((tile) => tile.removeEventListener("click", tileClicado));
        startRestartBtn.textContent = "Reiniciar Jogo";
        startRestartBtn.style.display = "block";
    }

    function restartGame() {
        radioSelecionado = Array.from(dificuldadeRadios).find((radio) => radio.checked);
        if (radioSelecionado.value === "1") {
            vidas = 7;
        } else if (radioSelecionado.value === "2") {
            vidas = 5;
        } else if (radioSelecionado.value === "3") {
            vidas = 3;
        }
        bombaRestantes = 2;
        bombaAtomicaRestantes = 1;
        selectBombaElem.textContent = `Bomba (${bombaRestantes} restantes)`;
        selectBombaAtomicaElem.textContent = `Bomba Atômica (${bombaAtomicaRestantes} restantes)`;
        score = 0;
        vidasElem.textContent = `Vidas: ${vidas}`;
        pontuacaoElem.textContent = score;
        console.log(board);
        while (board.firstChild) {
            board.removeChild(board.firstChild);
        }
        gameOverElem.style.display = "none";
        configElem.style.display = "none";
        startRestartBtn.style.display = "none";
        inicializarBoard();
        startRestartBtn.textContent = "Iniciar Jogo";
    }

    function startGame() {
        radioSelecionado = Array.from(dificuldadeRadios).find((radio) => radio.checked);
        configElem.style.display = "none";
        startRestartBtn.style.display = "none";
        vidasElem.style.display = "block";
        if (radioSelecionado.value === "1") {
            vidas = 7;
        } else if (radioSelecionado.value === "2") {
            vidas = 5;
        } else if (radioSelecionado.value === "3") {
            vidas = 3;
        }
        vidasElem.textContent = `Vidas: ${vidas}`;
        inicializarBoard();
    }
});
