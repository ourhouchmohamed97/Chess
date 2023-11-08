document.addEventListener('DOMContentLoaded', () => {
    let board = null; // Initialize the ChessBoard
    const game = new Chess(); // create new Chess.js game instance
    const moveHistory = document.getElementById('move-history');
    let moveCount = 1; // Initialize the move count
    let userColor = 'w'; // Initialize the user color as white 

    // Function to make a random for the computer
    const makeRandomMove = () => {
        const possibleMoves = game.moves();

        if ( game.game_over()){
            alert("Checkmate");
        }else{
            const randomIdx = Math.floor(Math.random() * possibleMoves.length);
            const move = possibleMoves[randomIdx];
            game.move(move);
            board.position(game.fen());
            recordMove(move, moveCount); // Record and display the move with move count 
            moveCount++; // Increament the move count 
        }
    };

    //Function to record and display a move in the move history
    const recordMove = (move, count) => {
        const formattedMove = count % 2 === 1 ? `${Math.ceil(count / 2)}. ${move}` : `${move} -`;
        moveHistory.textContent += formattedMove + ' ';
        moveHistory.scrollTop = moveHistory.scrollHeight; // Auto-scroll to the latest move
    };
    
    // Function to handle the start of a drag position 
    const onDragStart = (source, piece) => {
        //Allow the user to drag only their own pieces based on color 
        return !game.game_over() && piece.search(userColor) === 0;
    };

    // Function to handle a piece drop on the board 
    const onDrop = (source, target) => {
        const move = game.move({
            from: source,
            to: target,
            promotion: 'q'
        });
        if (move === null) return 'snapback'; // Return the piece back to its original square if it is not valid

        window.setTimeout(makeRandomMove, 250);
        recordMove(move.san, moveCount); // Record and display the move with move count
        moveCount++;
    };

    //Function to handle the end of a piece snap animation 
    const onSnapEnd = () => {
        board.position(game.fen());
    };

    // Configuration options for the chessboard 
    const boardConfig = {
        showNotation: true,
        draggable: true,
        position: 'start',
        onDragStart,
        onDrop,
        onSnapEnd,
        moveSpeed: 'fast',
        snapBackSpeed: 500,
        snapSpeed: 100,
    };

    //Initialize the chessboard
    board = Chessboard('board', boardConfig);

    // Event listener for the "play again" button
    document.querySelector(".play-again").addEventListener
    ("click", function(){
        game.reset();
        board.start();
        moveHistory.textContent = '';
        moveCount = 1;
        userColor = 'w';
    });
    
    // Event listener for the "set position" button
    document.querySelector('.set-pos').addEventListener
    ('click', function(){
        const fen = prompt("Enter the FEN notation for the desired position!");
        if(fen !== null) {
            if(game.load(fen)){
                board.position(fen);
                moveHistory.textContent = '';
                moveCount = 1;
                userColor = 'w';
            }else{
                alert("Invalid FEN notation. Please try again.");
            }
        }
    });

    // Event listener for the "flip board" button
    document.querySelector('.flip-board').addEventListener
    ('click', function() {
        board.flip();
        makeRandomMove();
        userColor = userColor === 'w' ? 'b' : 'w'
    });

});

