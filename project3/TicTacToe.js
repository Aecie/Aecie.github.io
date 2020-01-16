	var IQ = "20";
	
	// 1 for X, 2 for O
	var board = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
	var value = [[1, 1, 1], [1, 1, 1], [1, 1, 1]];

	// random chess 1 or 2;
	var chess = Math.round(Math.random()*9)%2 + 1;
	// insert picture corresponding chess
	var response = ["<img src=\"image/Empty.png\">", "<img src=\"image/X.png\">", "<img src=\"image/O.png\">"];
	$("button, #concede, #restart").attr("disabled", true);
	inform("Welcome to TicTacToe Game! :p");

	// random first for player and ai / O and X
	function start(){
		var playerStart = Boolean(Math.round(Math.random()));
		IQ = $("select").val();
		$("button, #concede, #restart").attr("disabled", false);
		$("#start").attr("disabled", true);

		if(parseInt(IQ) != 0){
			if(!playerStart){
				inform("AI first");
				ai();
			} else 
				inform("Player first");
		} else {
			inform(((chess == 1)?"X":"O") + "'s turn");
		}
	}

	// empty the board and start
	function restart(){
		board = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
		value = [[1, 1, 1], [1, 1, 1], [1, 1, 1]];
		chess = Math.round(Math.random()*9)%2 + 1;

		$("button").empty();

		start();
	}

	// directly lose
	function concede(){
		if(parseInt(IQ) != 0)
			inform("You lose");
		else
			inform(((chess == 1)? "O" : "X") + " wins!")
		$("#restart").attr("disabled", false);
		$("button, #concede").attr("disabled", true);
	}

	// Information
	function inform(string){
		$("#info").empty();
		$("#info").append(string);
	}

	// player moves
	function move(i, j){
		if(board[i][j] != 0){
			inform("Occupied!");
			return;
		} else{
			board[i][j] = chess;
			$("#"+String(3*i + j + 1)).append(response[chess]);
			
			if(judgeOver() == chess){ // player wins
				if(parseInt(IQ) != 0)
					inform("You win!");
				else
					inform(((chess == 1)? "X":"O") + " wins!");

				$("button, #concede").attr("disabled", true);
				$("#restart").attr("disabled", false);
				return;
			} else if(judgeOver() == 3){ // tied
				inform("Tied!");
				$("button, #concede").attr("disabled", true);
				$("#restart").attr("disabled", false);
				return;
			}

			chess = (chess == 1)? 2 : 1; // change to AI's chess
			if(parseInt(IQ) != 0){
				inform("");
				ai(); // change to AI move
			} else
				inform(((chess == 1)? "X" : "O") + "'s turn");
		}
	}

	// set value
	function resetValue(){
		for(var i = 0; i < 3; i++){
			for(var j = 0; j < 3; j++){
				if(board[i][j] != 0)
					value[i][j] = 0;

				else{
					var player = (chess == 1)? 2: 1;
					// check the row and column
					// max value
					if((board[0][j] + board[1][j] + board[2][j] == 2*chess) && (board[0][j]*board[1][j]*board[2][j] == 0) && ((board[0][j]-1)*(board[1][j]-1)*(board[2][j]-1) == (chess-1)*(chess-1)*(-1)))
						value[i][j] += 10000;
					if((board[i][0] + board[i][1] + board[i][2] == 2*chess) && (board[i][0]*board[i][1]*board[i][2] == 0) && ((board[i][0]-1)*(board[i][1]-1)*(board[i][2]-1) == (chess-1)*(chess-1)*(-1)))
						value[i][j] += 10000;

					// second value
					if((board[0][j] + board[1][j] + board[2][j] == 2*player) && (board[0][j]*board[1][j]*board[2][j] == 0) && ((board[0][j]-1)*(board[1][j]-1)*(board[2][j]-1) == (player-1)*(player-1)*(-1)))
						value[i][j] += 1000;
					if((board[i][0] + board[i][1] + board[i][2] == 2*player) && (board[i][0]*board[i][1]*board[i][2] == 0) && ((board[i][0]-1)*(board[i][1]-1)*(board[i][2]-1) == (player-1)*(player-1)*(-1)))
						value[i][j] += 1000;

					if(parseInt(IQ) > 20){
						// To prevent a scheme by player
						if((i == 1 && (j == 0 || j == 2))||(j == 1 && (i == 0 || i == 2))){
							if(board[0][0] == player && board[1][1] == chess && board[2][2] == player)
								value[i][j] += 100;
							if(board[0][2] == player && board[1][1] == chess && board[2][0] == player)
								value[i][j] += 100;
						}

						// third value (a row/column contains only one player chess)
						if((board[0][j] + board[1][j] + board[2][j] == player) && (board[0][j]*board[1][j]*board[2][j] == 0) && ((board[0][j]-1)*(board[1][j]-1)*(board[2][j]-1) == player-1))
							value[i][j] += 10;
						if((board[i][0] + board[i][1] + board[i][2] == player) && (board[i][0]*board[i][1]*board[i][2] == 0) && ((board[i][0]-1)*(board[i][1]-1)*(board[i][2]-1) == player-1))
							value[i][j] += 10;

						// forth value (a row/column contains only one AI chess)
						if((board[0][j] + board[1][j] + board[2][j] == chess) && (board[0][j]*board[1][j]*board[2][j] == 0) && ((board[0][j]-1)*(board[1][j]-1)*(board[2][j]-1) == chess-1))
							value[i][j] += 5;
						if((board[i][0] + board[i][1] + board[i][2] == chess) && (board[i][0]*board[i][1]*board[i][2] == 0) && ((board[i][0]-1)*(board[i][1]-1)*(board[i][2]-1) == chess-1))
							value[i][j] += 5;

						// fifth value (no player or ai chess)
						if((board[0][j] + board[1][j] + board[2][j] == 0) && (board[0][j]*board[1][j]*board[2][j] == 0) && ((board[0][j]-1)*(board[1][j]-1)*(board[2][j]-1) == -1))
							value[i][j] += 2;
						if((board[i][0] + board[i][1] + board[i][2] == 0) && (board[i][0]*board[i][1]*board[i][2] == 0) && ((board[i][0]-1)*(board[i][1]-1)*(board[i][2]-1) == -1))
							value[i][j] += 2;
					}

					// main diagonal
					if(i == j){
						// max value
						if((board[0][0] + board[1][1] + board[2][2] == chess*2) && (board[0][0]*board[1][1]*board[2][2] == 0) && ((board[0][0]-1)*(board[1][1]-1)*(board[2][2]-1) == (chess-1)*(chess-1)*(-1)))
							value[i][j] += 10000;

						// second value
						if((board[0][0] + board[1][1] + board[2][2] == player*2) && (board[0][0]*board[1][1]*board[2][2] == 0) && ((board[0][0]-1)*(board[1][1]-1)*(board[2][2]-1) == (player-1)*(player-1)*(-1)))
							value[i][j] += 1000;

						if(parseInt(IQ) > 20){
							// third value, only one player
							if((board[0][0] + board[1][1] + board[2][2] == player) && (board[0][0]*board[1][1]*board[2][2] == 0) && ((board[0][0]-1)*(board[1][1]-1)*(board[2][2]-1) == player-1))
								value[i][j] += 10;

							// forth value, only one ai
							if((board[0][0] + board[1][1] + board[2][2] == chess) && (board[0][0]*board[1][1]*board[2][2] == 0) && ((board[0][0]-1)*(board[1][1]-1)*(board[2][2]-1) == chess-1))
								value[i][j] += 5;

							// fifth value, no player nor ai
							if((board[0][0] + board[1][1] + board[2][2] == 0) && (board[0][0]*board[1][1]*board[2][2] == 0) && ((board[0][0]-1)*(board[1][1]-1)*(board[2][2]-1) == -1))
								value[i][j] += 2;
						}
					}
					
					// vice diagonal
					if((i==0 && j==2) || (i==1 && j==1) || (i==2 && j==0)){
						// max value
						if((board[0][2] + board[1][1] + board[2][0] == chess*2) && (board[0][2]*board[1][1]*board[2][0] == 0) && ((board[0][2]-1)*(board[1][1]-1)*(board[2][0]-1) == (chess-1)*(chess-1)*(-1)))
							value[i][j] += 10000;

						// second value
						if((board[0][2] + board[1][1] + board[2][0] == player*2) && (board[0][2]*board[1][1]*board[2][0] == 0) && ((board[0][2]-1)*(board[1][1]-1)*(board[2][0]-1) == (player-1)*(player-1)*(-1)))
							value[i][j] += 1000;

						if(parseInt(IQ) > 20){
							// third value, only one player
							if((board[0][2] + board[1][1] + board[2][0] == player) && (board[0][2]*board[1][1]*board[2][0] == 0) && ((board[0][2]-1)*(board[1][1]-1)*(board[2][0]-1) == player-1))
								value[i][j] += 10;

							// forth value, only one ai
							if((board[0][2] + board[1][1] + board[2][0] == chess) && (board[0][2]*board[1][1]*board[2][0] == 0) && ((board[0][2]-1)*(board[1][1]-1)*(board[2][0]-1) == chess-1))
								value[i][j] += 5;

							// fifth value, no player nor ai
							if((board[0][2] + board[1][1] + board[2][0] == 0) && (board[0][2]*board[1][1]*board[2][0] == 0) && ((board[0][2]-1)*(board[1][1]-1)*(board[2][0]-1) == -1))
								value[i][j] += 2;
						}
					}
				}
			}
		}
	}

	// AI moves
	function ai(){
		var maxI = 0, maxJ = 0, temp = 0;
		// if empty board, randomly choose one;
		if(parseInt(IQ) > 10){
			if(isEmpty()){
				maxI = Math.round(Math.random()*9)%3;
				maxJ = Math.round(Math.random()*9)%3;
			}
			// set values and choose the max
			else{
				resetValue();
				for(var i = 0; i < 3; i++){
					for(var j = 0; j < 3; j++){
						if(value[i][j] > temp){
							temp = value[i][j];
							maxI = i;
							maxJ = j;
						}
					}
				}
			}
		} else{
			var choice = new Array();
			var length = 0;
			for(var i = 0; i < 3; i++)
				for(var j = 0; j < 3; j++)
					if(board[i][j] == 0)
						length = choice.push([i,j]);
			var randomChoice = Math.round(Math.random()*100)%length;
			maxI = choice[randomChoice][0];
			maxJ = choice[randomChoice][1];
		}
		

		board[maxI][maxJ] = chess;
		console.log(value[maxI][maxJ]);

		console.log("List: ");
		for(var i = 0; i < 3; i++)
			for(var j = 0; j < 3; j++)
				console.log(value[i][j]);




		$("#"+String(3*maxI + maxJ + 1)).append(response[chess]);
		if(judgeOver() == chess){ // AI wins
			inform("You lose.");
			$("button, #concede").attr("disabled", true);
			$("#restart").attr("disabled", false);
			return;
		} else if(judgeOver() == 3){ // tied
			$("button, #concede").attr("disabled", true);
			$("#restart").attr("disabled", false);
			inform("Tied!");
			return;
		}

		chess = (chess == 1)? 2 : 1;
	}

	// return 0 if not over, return 1 if X wins, return 2 if O wins, return 3 if tied
	function judgeOver(){
		// row
		for(var i = 0; i < 3; i++){
			if(board[i][0] == board[i][1] && board[i][1] == board[i][2] && board[i][0] != 0)
				return board[i][0];			
		}

		// column
		for(var i = 0; i < 3; i++){
			if(board[0][i] == board[1][i] && board[1][i] == board[2][i] && board[0][i] != 0)
				return board[0][i];			
		}

		// main diagonal
		if(board[0][0] == board[1][1] && board[1][1] == board[2][2] && board[1][1] != 0)
			return board[1][1];

		if(board[2][0] == board[1][1] && board[1][1] == board[0][2] && board[1][1] != 0)
			return board[1][1];

		for(var i = 0; i < 3; i++){
			for(var j = 0; j < 3; j++){
				if(board[i][j] == 0) // not over
					return 0;

				if(i == 2 && j == 2) // full board, tied.
					return 3;
			}
		}	
	}

	// return true if board is empty, else return false
	function isEmpty(){
		for(var i = 0; i < 3; i++)
			for(var j = 0; j < 3; j++)
				if(board[i][j] != 0)
					return false;
		return true;		
	}