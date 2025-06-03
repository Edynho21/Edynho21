document.addEventListener('DOMContentLoaded', () => {
    const cells = document.querySelectorAll('.cell');
    const statusDisplay = document.getElementById('status');
    const restartButton = document.getElementById('restartButton');

    let gameActive = true;
    let currentPlayer = 'X';
    let gameState = ['', '', '', '', '', '', '', '', '']; // Representa o estado do tabuleiro
    let playerXMoves = []; // Armazena os índices das jogadas do X
    let playerOMoves = []; // Armazena os índices das jogadas do O

    const winningConditions = [
        [0, 1, 2], // Linhas
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6], // Colunas
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8], // Diagonais
        [2, 4, 6]
    ];

    // Mensagens
    const currentPlayerTurn = () => `É a vez do ${currentPlayer}`;
    const winningMessage = () => `O jogador ${currentPlayer} venceu!`;

    // Atualiza o status inicial
    statusDisplay.innerHTML = currentPlayerTurn();

    // Função para lidar com o clique na célula
    function handleCellClick(clickedCellEvent) {
        const clickedCell = clickedCellEvent.target;
        const clickedCellIndex = parseInt(clickedCell.dataset.cellIndex);

        // Se a célula já estiver preenchida pelo jogador atual, ou o jogo não estiver ativo, ignore
        // A peça do jogador atual pode estar preenchida se ele clicou na sua própria peça para removê-la,
        // mas a regra é remover a mais antiga, não a que ele clica.
        if (gameState[clickedCellIndex] === currentPlayer || !gameActive) {
            return;
        }

        // Se a célula está vazia, simplesmente faz a jogada
        if (gameState[clickedCellIndex] === '') {
            makeMove(clickedCellIndex);
        } else {
            // Se a célula está ocupada pelo OUTRO jogador, não permite jogar nela.
            // A lógica de remoção é automática pela 4ª peça.
            return;
        }

        handleResultValidation();
    }

    // Função para fazer a jogada e gerenciar a remoção
    function makeMove(index) {
        // Se a célula está vazia, o jogador coloca a peça
        if (gameState[index] === '') {
            gameState[index] = currentPlayer;
            cells[index].innerHTML = currentPlayer;
            cells[index].classList.add(currentPlayer.toLowerCase());

            if (currentPlayer === 'X') {
                playerXMoves.push(index);
                // Se X já tem 4 peças ou mais, remove a mais antiga
                if (playerXMoves.length > 3) {
                    const oldestMoveIndex = playerXMoves.shift(); // Remove o primeiro (mais antigo)
                    removePiece(oldestMoveIndex);
                }
            } else { // currentPlayer === 'O'
                playerOMoves.push(index);
                // Se O já tem 4 peças ou mais, remove a mais antiga
                if (playerOMoves.length > 3) {
                    const oldestMoveIndex = playerOMoves.shift(); // Remove o primeiro (mais antigo)
                    removePiece(oldestMoveIndex);
                }
            }
        }
    }

    // Função para remover uma peça do tabuleiro
    function removePiece(index) {
        gameState[index] = '';
        cells[index].innerHTML = '';
        cells[index].classList.remove('x', 'o');
    }

    // Função para verificar o resultado do jogo
    function handleResultValidation() {
        let roundWon = false;
        for (let i = 0; i < winningConditions.length; i++) {
            const winCondition = winningConditions[i];
            let a = gameState[winCondition[0]];
            let b = gameState[winCondition[1]];
            let c = gameState[winCondition[2]];

            if (a === '' || b === '' || c === '') {
                continue; // Pula se alguma célula estiver vazia
            }
            if (a === b && b === c) {
                roundWon = true;
                break;
            }
        }

        if (roundWon) {
            statusDisplay.innerHTML = winningMessage();
            gameActive = false;
            return;
        }

        // Se ninguém ganhou, troca o jogador
        handlePlayerChange();
    }

    // Função para trocar o jogador
    function handlePlayerChange() {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        statusDisplay.innerHTML = currentPlayerTurn();
    }

    // Função para reiniciar o jogo
    function handleRestartGame() {
        gameActive = true;
        currentPlayer = 'X';
        gameState = ['', '', '', '', '', '', '', '', ''];
        playerXMoves = [];
        playerOMoves = [];
        statusDisplay.innerHTML = currentPlayerTurn();
        cells.forEach(cell => {
            cell.innerHTML = '';
            cell.classList.remove('x', 'o'); // Remove as classes de estilização
        });
    }

    // Adiciona os event listeners
    cells.forEach(cell => cell.addEventListener('click', handleCellClick));
    restartButton.addEventListener('click', handleRestartGame);
});