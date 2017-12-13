function fPuzzle(){
	
	var params = {
		"imageurl":"http://cdn2us.denofgeek.com/sites/denofgeekus/files/2017/07/rick-and-morty-portal.jpg",
		"raster":6
	};
	
	
	var imgheight;
	var imgwidth;
	var resetfDrag = new Event('fdragreset');
	var removefDrag = new Event('fdragremove');
	var elstartx, elstarty;
	
	
	var widthboard; 
	
	var widthpiece;
	
	var positions=new Array();
	
		
	
	
	this.initPuzzle=function(externalparams){
		
		//setUp menu
		document.getElementById('showMenuBtn').addEventListener("click",function(){
			if(document.getElementById('menuWrap').classList.contains('active')){
				hideMenu();
				
			} else {
				showMenu();
			}
		});
		
		
		document.getElementById('bodyOverlay').addEventListener("click",function(){
			hideMenu();
		});
		
		
		//change raster
		document.getElementById('raster').addEventListener('change',function(e){
			params.raster=e.target.value;
			restartPuzzle();
		});
		
		//upload local image
		document.getElementById('imgInp').onchange = function() {
			readURL(this);
		}
		
		
		
		
		// resetPuzzle
		document.getElementById('resetPuzzle').addEventListener("click", function(){
			restartPuzzle();
		});
		
		// newPuzzle
		var btnelements= document.getElementsByClassName('newPuzzle');
		
		for (var i = 0; i < btnelements.length; i++) {
			btnelements[i].addEventListener("click", newPuzzle);
		}
		
		
		
		//set variables
		console.log("-- SETUP");
		var newparams = JSON.parse(externalparams);
		for (var key in newparams) {
			if (newparams.hasOwnProperty(key)) {
				if (typeof params[key] !== 'undefined') {
					//variable exists, change its value
					params[key]=newparams[key];
					console.log(key+": "+params[key]);
				}
				
			}
		}
		console.log("--");
		
		startPuzzle();
		
	};
	
	function startPuzzle(){
		//set width pieces and board
		
		widthboard=document.getElementById('puzzleBoard').offsetWidth;
		widthpiece=widthboard/params.raster;//100 default
		console.log(widthpiece);
		
		//set pieces
		document.getElementById('raster').value=params.raster;
		
		//get image dimensions
		
		var img = new Image();

		img.onload = function(){
			imgheight = img.height;
			imgwidth = img.width;
		
			document.getElementById("loading").classList.remove("active");
			console.log("Image dimensions (width/height): "+imgwidth+"/"+imgheight);
		
			// continue; we have the dimensions
			setupPuzzle();
		  
		}
		
		img.src = params.imageurl;
		
		//set preview
		document.getElementById("puzzleExample").style.backgroundImage="url('"+params.imageurl+"')";
	}
	
	function setupPuzzle(){
		
		//setup the image
		var board = document.getElementById('puzzleBoard');
		var boardbg = document.getElementById('puzzleBoardBg');
		
		boardbg.style.backgroundImage = "url('"+params.imageurl+"')";
		
		var widthImage;
		var heightImage;
		var offsettop=0;
		var offsetleft=0;
		var heightTeaser=1*board.offsetHeight;
		var widthTeaser=1*board.offsetWidth;
		
		if ((imgheight/imgwidth)<(heightTeaser/widthTeaser)){ //afbeelding breder als teaser
			
			widthImage=heightTeaser*(imgwidth/imgheight);
			heightImage=heightTeaser;
			offsetleft=-((widthImage-widthTeaser)/2);
			
		} else { // afbeelding hoger als teaser
			
			heightImage=widthTeaser*(imgheight/imgwidth);
			widthImage=widthTeaser;
			offsettop=-((heightImage-heightTeaser)/2);
			
		}
		
		boardbg.style.backgroundSize=widthImage+'px '+heightImage+'px';
		boardbg.style.backgroundPosition=offsetleft+'px '+offsettop+'px';
		
		
		//set raster
		//--rows
		for (var i=-1;i<(params.raster);i++){
			var offset=0;
			if(i==(params.raster-1)){
				offset=1;//position last line 1px higher because of own height
			}
			
			board.innerHTML += '<div class="rasterLine horiz" style="top:'+(((i+1)*widthpiece)-offset)+'px;"></div>';
		}
		//--cols
		for (var i=-1;i<(params.raster);i++){
			board.innerHTML += '<div class="rasterLine vert" style="left:'+((i+1)*widthpiece)+'px;"></div>';
		}
		
		
		
		//set the pieces
		var puzzlePiecesWrap = document.getElementById('puzzlePieces');
		
		var wrapleft = puzzlePiecesWrap.getBoundingClientRect().left;
		var wrapwidth = puzzlePiecesWrap.offsetWidth;

		for (var i=0;i<(params.raster*params.raster);i++){
			
			var row = 1+Math.floor(((i)/params.raster));
			var col = 1+(i-((row-1)*params.raster));
			
			puzzlePiecesWrap.innerHTML += '<div class="puzzlePiece fdrag" id="puzzleCurrentPiece"></div>';
			var currentPiece = document.getElementById('puzzleCurrentPiece');
			
			currentPiece.classList.add("pos"+(i+1));
			currentPiece.classList.add("row"+(row));
			currentPiece.classList.add("col"+(col));
			
			currentPiece.style.backgroundImage="url('"+params.imageurl+"')";
			currentPiece.style.backgroundSize=widthImage+'px '+heightImage+'px';
			currentPiece.style.backgroundPosition=(offsetleft-(widthpiece*(col-1)))+'px '+(offsettop-(widthpiece*(row-1)))+'px';
			currentPiece.style.width=widthpiece+"px";
			currentPiece.style.height=widthpiece+"px";
			
			
			
			currentPiece.style.top=(Math.random()*(widthboard-widthpiece))+'px';
			currentPiece.style.left=wrapleft+(Math.random()*(wrapwidth-widthpiece))+'px';
			
			
			
			
			currentPiece.removeAttribute("id");
			
			
			
			
		}
		
		//add listeners for drag
		var dragelements = document.getElementsByClassName('fdrag');
		for (var i = 0, len = dragelements.length; i < len; i++) {
			
			var dragObj = dragelements[i];
			
			dragObj.addEventListener('fdragstart', dragStart);
			dragObj.addEventListener('fdragend', dragEnd);
		}
		
		resetDrag();
		
	}
	
	
	
	
	
	
	
	
	
	
	
	
	//Drag and drop
	dragStart=function(e){
		e.target.classList.remove("wrong");
		
		if(e.target.classList.contains("positioned")){
			//element is positioned, so remove all references to position
			e.target.classList.remove("positioned");
			e.target.classList.remove("correct");
			
			
			var boardleftpos = document.getElementById('puzzleBoard').getBoundingClientRect().left;
			var boardtoppos = document.getElementById('puzzleBoard').getBoundingClientRect().top;
			var pieceleft = e.target.getBoundingClientRect().left;
			var piecetop = e.target.getBoundingClientRect().top;
			
			var rastposy = Math.round((piecetop-boardtoppos)/widthpiece)+1;
			var rastposx = Math.round((pieceleft-boardleftpos)/widthpiece)+1;
			
			
			positions[rastposx+'_'+rastposy]=undefined;
			delete positions[rastposx+'_'+rastposy];
		} else {
			elstartx = e.target.getBoundingClientRect().left;
			elstarty = e.target.getBoundingClientRect().top;
		}
		
		
		e.target.classList.add("active");
	};
	dragEnd=function(e){
		
		//board bounds
		var boardleftpos = document.getElementById('puzzleBoard').getBoundingClientRect().left ;
		var boardtoppos = document.getElementById('puzzleBoard').getBoundingClientRect().top;
		var boardleft = boardleftpos - (widthpiece/2);
		var boardtop = boardtoppos - (widthpiece/2);
		var boardright = boardleft+widthboard ;
		var boardbottom = boardtop+widthboard ;
		
		
		var pieceleft = e.target.getBoundingClientRect().left;
		var piecetop = e.target.getBoundingClientRect().top;
		
		//check if element is on the board
		if((pieceleft >= boardleft && pieceleft <= boardright) && (piecetop >= boardtop && piecetop <= boardbottom)){
			//move element to board
			
			//get the row and col to position piece
			var rastposy = Math.round((((piecetop - (widthpiece/2))-boardtop))/widthpiece);
			var rastposx = Math.round((((pieceleft - (widthpiece/2))-boardleft))/widthpiece);
			
			var rastposy = Math.round((piecetop-boardtoppos)/widthpiece)+1;
			var rastposx = Math.round((pieceleft-boardleftpos)/widthpiece)+1;
			
			//check if position is filled
			if(positions[rastposx+"_"+rastposy]==1 || positions[rastposx+"_"+rastposy]==2){
				//position is taken
				
				movePiecesFromBoard(e.target);
				
				return false;
			}
			
			
			e.target.classList.add("positioned");
			
			//snap to grid
			
			e.target.style.left=boardleftpos + ((rastposx-1)*widthpiece)+'px';
			e.target.style.top=boardtoppos + ((rastposy-1)*widthpiece)+'px';
			
			
			
			//set position as filled
			positions[rastposx+"_"+rastposy]=1;
			
			//check if correct
			if(e.target.classList.contains("row"+rastposy) && e.target.classList.contains("col"+rastposx)){
				e.target.classList.add("correct");
				positions[rastposx+"_"+rastposy]=2;
			}
			
			//check if win
			var totalval =0;
			for (var key in positions) {
			if (positions.hasOwnProperty(key)) {
				totalval+=positions[key];
			}
			}
			if(totalval==(params.raster*params.raster)*2){
				//all positions filled correct! we have a winner!
				document.getElementById('puzzleBoard').classList.add('finished');
				
			}
			
		} else {
			//move element from board
			
			movePiecesFromBoard(e.target);
			
			
		}
		
		e.target.classList.remove("active");
	};
	
	function movePiecesFromBoard(el){
		
		el.classList.remove("positioned");
		el.classList.remove("active");
		el.classList.add("wrong");
		
		el.style.left=elstartx+'px';
		el.style.top=elstarty+'px';
			
	}
	
	
	function newPuzzle(e){
		var newimageurl = e.target.dataset.imageurl;
		var newimageraster = e.target.dataset.raster;
		
		hideMenu();
		
		
		if(newimageraster!=undefined){
			params.raster=newimageraster;
		}
		
		params.imageurl=newimageurl;
		
		
		console.log('## NEW PUZZLE: '+newimageurl);
		
		restartPuzzle();
	}
	
	function restartPuzzle (){
		//hide menu
		hideMenu();
		
		
		//reset current
		resetPuzzle();
		
		
		//start new
		startPuzzle();
	}
	
	
	function resetPuzzle(){
		console.log("** RESET **");
		positions=new Array();
		
		document.getElementById('puzzleBoard').classList.remove('finished');
		document.dispatchEvent(removefDrag);
		
		clearPieces();
		
		
		resetDrag();
		
	}
	
	
	function resetDrag(){
		
		document.dispatchEvent(resetfDrag);
		
	}
	function clearPieces(){
		
		//clear pieces
		var dragelements = document.getElementsByClassName('fdrag');
		while(dragelements.length > 0){
			
			var dragObj = dragelements[0];
			
			dragObj.removeEventListener('fdragstart',dragStart);
			dragObj.removeEventListener('fdragend', dragEnd);
			
			dragObj.parentNode.removeChild(dragObj);
			
		}
		
		//clear lines
		var rasterelements = document.getElementsByClassName('rasterLine');
		while(rasterelements.length > 0){
			
			rasterelements[0].parentNode.removeChild(rasterelements[0]);
			
		}
		
		
	}
	
	function hideMenu(){
		document.getElementById('menuWrap').classList.remove('active');
	}
	
	function showMenu(){
		document.getElementById('menuWrap').classList.add('active');
	}
	
	function readURL(input) {
	
		if (input.files && input.files[0]) {
			document.getElementById("loading").classList.add("active");
			var reader = new FileReader();

			reader.onload = function (e) {
				params.imageurl = e.target.result;
				
				
				restartPuzzle();
			}

			reader.readAsDataURL(input.files[0]);
		}
	}
	
	
}