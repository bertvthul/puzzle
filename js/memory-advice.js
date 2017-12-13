var swipeStartX;
var swipeNowX;
var swipeStartY;
var swipeNowY;
var cardy=0;
var cardx=0;
var grid=170;
var rasterx=4;
var rastery=4;
var tableleft=0;
var tabletop=0;
var positions=new Array();
var goreset=false;
var image;
var started=false;
var touchstarted=false;
var dragObj;
var positions=new Array();
var orientatie="landscape";

jQuery(document).ready(function(){
	
	//-------------------------
	// Drag on iPad / iPhone
	//setup();
	
	
	jQuery('.puzzleimage').click(function(){
		var imageurl=jQuery(this).attr('src');
		startpuzzle(imageurl);
		jQuery('#startscreen').hide();
	});
	jQuery('#reset').click(function(){resetpuzzle();});
	jQuery('#back').click(function(){jQuery('#startscreen').show();});
	/*jQuery('.card').click(function(){
		jQuery('.card').toggleClass('draai');
	});
	*/
	
	
});
function startpuzzle(imageurl){
	image=imageurl;
	rasterx=jQuery("#rows").val();
	rastery=rasterx;
	var windowWidth=jQuery(window).width();
	var windowHeight=jQuery(window).height();
	//alert(windowWidth+'x'+windowHeight);
	
	if((windowWidth/windowHeight)<1){
		orientatie="portrait";
		grid = (windowWidth-40)/rasterx;
	} else {
		orientatie="landscape";
		grid = (windowHeight-40)/rasterx;
	}
	
	if(started){
		resetpuzzle();
	} else {
		started=true;
		setup();
	}
}

function resetpuzzle(){
	
	goreset=true;
	destroy();
}

function destroy(){
	jQuery('.line').remove();
	jQuery('#preview img').attr('src','');
	positions=new Array();
	var i=0;
	jQuery('.card').each(function(){
		i++;
		this.removeEventListener("touchstart",touchHandler);
		jQuery(this).remove();
		if(i==(rasterx*rastery)){
			destroyed();
		}
	});
}
function destroyed(){
	if(goreset){
		goreset=false;
		setup();
	}
}
function setup(){
	tableleft= jQuery('#table').offset().left;
	tabletop= jQuery('#table').offset().top;
	
	jQuery('#tablebg').width((grid*rasterx)+'px');
	jQuery('#tablebg').height((grid*rastery)+'px');
	
	
	//image= jQuery('#tablebg').css('background-image');
	//var imagesrc=image.replace('url(','');
	//imagesrc=imagesrc.replace(')','');
	
	//load image
	jQuery('#preview img[src]').bind('load',function() {
		//image loaded
		jQuery(this).unbind('load');
		imageloaded();
		
	}).attr('src', image);
	
	
}
function imageloaded(){
	jQuery('#tablebg').css('background-image','url('+image+')');
	var widthImage = jQuery('#preview').width();
	var heightImage = jQuery('#preview').height();
	var heightTeaser=jQuery('#table').height();
	var widthTeaser=jQuery('#table').width();
	if ((heightImage/widthImage)<(heightTeaser/widthTeaser)){ //afbeelding breder als teaser
		widthImage=heightTeaser*(widthImage/heightImage);
		heightImage=heightTeaser;
	} else { // afbeelding hoger als teaser
		heightImage=widthTeaser*(heightImage/widthImage);
		widthImage=widthTeaser;
	}
	jQuery('#tablebg').css('background-size',widthImage+'px '+heightImage+'px');
	
	
	var imagesize= jQuery('#tablebg').css('background-size');
	
	for (var k=1;k<rasterx;k++){
		jQuery('#table').append('<div class="line current"></div>');
		jQuery('.line.current').css('left',(grid*k)+'px');
		jQuery('.line.current').height(jQuery('#table').height()+'px');
		jQuery('.line.current').removeClass('current');
	}
	for (var j=1;j<rastery;j++){
		jQuery('#table').append('<div class="line current"></div>');
		jQuery('.line.current').css('top',(grid*j)+'px');
		jQuery('.line.current').width(jQuery('#table').width()+'px');
		jQuery('.line.current').removeClass('current');
	}
	
	//add the blocks
	for (var i=0;i<(rasterx*rastery);i++){
		var row = 1+Math.floor(((i)/rasterx));
		var col = 1+(i-((row-1)*rasterx));
		
		jQuery('#content').append('<div class="card drag current"></div>');
		jQuery('.card.current').width(grid+'px');
		jQuery('.card.current').height(grid+'px');
		jQuery('.card.current').addClass('pos'+(i+1));
		jQuery('.card.current').addClass('row'+(row));
		jQuery('.card.current').addClass('col'+(col));
		jQuery('.card.current').css('background-image','url('+image+')');
		jQuery('.card.current').css('background-size',imagesize);
		jQuery('.card.current').css('background-position','-'+((col-1)*grid)+'px -'+((row-1)*grid)+'px');
		
		if(orientatie=='landscape'){
			jQuery('.card.current').css('left',jQuery('#table').width()+tableleft+Math.floor(Math.random()*((jQuery(window).width()-jQuery('#table').width()-jQuery('.card.current').width())))+'px');
			jQuery('.card.current').css('top',Math.floor(Math.random()*(jQuery(window).height()-jQuery('.card.current').height()))+'px');
		} else {
			jQuery('.card.current').css('left',Math.floor(Math.random()*(jQuery(window).width()-jQuery('.card.current').width()))+'px');
			jQuery('.card.current').css('top',jQuery('#table').height()+tabletop+Math.floor(Math.random()*((jQuery(window).height()-jQuery('#table').height()-jQuery('.card.current').height())))+'px');
		}
		
		jQuery('.card.current').removeClass('current');
		
	}
	
	jQuery('.drag').each(function(){
		
		
		
		
		if ('ontouchstart' in document.documentElement) {this.addEventListener("touchstart", touchHandler, false);} else {
			//no touch, setup mouse
			jQuery(this).mousedown(function(e){dragObj=jQuery(this);mouseDown(e);});
			
		}
	});
	
}



// -------------------------

function mouseDown(e){
	swipeStartX=e.pageX;
	swipeStartY=e.pageY;
	e.preventDefault();
	swipeNowX=swipeStartX;
	swipeNowY=swipeStartY;
	cardx = jQuery(dragObj).css('left');
	cardy = jQuery(dragObj).css('top');
	cardx=parseInt(cardx.replace('px',''));
	cardy=parseInt(cardy.replace('px',''));
	dragging=true;
	
	if(jQuery(dragObj).hasClass('positioned')){
		var left=jQuery(dragObj).offset().left;
		var top=jQuery(dragObj).offset().top;
		jQuery(dragObj).removeClass('positioned');
		positions[left+'_'+top]=undefined;
		delete positions[left+'_'+top];
	}
	
	jQuery(dragObj).addClass('active');
	
	jQuery(document).mousemove(function(e){
		drag(e);
	});
	jQuery(document).mouseup(function(e){
		mouseup(e);
	});
}

function drag(e){
	swipeNowX=e.pageX;
	swipeNowY=e.pageY;e.preventDefault();
	if(swipeNowX<(swipeStartX-20) || swipeNowX>(swipeStartX+20) || swipeNowY<(swipeStartY-20) || swipeNowY>(swipeStartY+20) || dragging){
		
		
		dragging=true;
		var left=cardx+(swipeNowX-swipeStartX);
		jQuery(dragObj).css('left',left+'px');
		
		var top=cardy+(swipeNowY-swipeStartY);
		jQuery(dragObj).css('top',top+'px');
	}
}
function mouseup(e){
	jQuery(document).unbind('mousemove');
	jQuery(document).unbind('mouseup');
	dragging=false;
	
	//--
	//snap to grid
		var left=cardx+(swipeNowX-swipeStartX);
		var top=cardy+(swipeNowY-swipeStartY);
		left = Math.round((left)/grid)*grid;
		left+=tableleft;
			if(left<tableleft){left=tableleft;}
			if(left>=jQuery(window).width()){left=left-grid;}
		top = Math.round((top)/grid)*grid;
		top+=tabletop;
			if(top<tabletop){top=tabletop;}
			if(top>=jQuery(window).height()){top=top-grid;}
		
		if(left>=tableleft && left<(tableleft+jQuery('#table').outerWidth()-2) && top>=tabletop && top<(tabletop+jQuery('#table').outerHeight()-2)){
			
			
			
			
			jQuery(dragObj).css('left',left+'px');
			jQuery(dragObj).css('top',top+'px');
			checkIfOverlap(dragObj);
		}
		
		touchstarted=false;
		
		swipeEndX=swipeNowX;
		if(swipeEndX<(swipeStartX-20)){ //to right
			/*if((currentitem+1)<=total){
				loadTeaserItem(currentitem+1);
			} else {
				displayItem(currentitem);
			}*/
		} else if (swipeEndX>(swipeStartX+20)){ //to left
			/*if((currentitem-1)>=1){
				loadTeaserItem(currentitem-1);
			} else {
				displayItem(1);
			}*/
		} else {
			//not enough swipe
			//displayItem(currentitem);
		}

		jQuery(dragObj).removeClass('active');
	
}





function touchHandler(e) {
	e.preventDefault();
	/*
	var coors;
	if (e.touches) { 			// iPhone
		coors = e.touches[0].clientX;
	} else { 				// all others
		coors = e.clientX;
	}
	return coors;
	*/
	 var touch = e.touches[0];
	 
	if (e.type == "touchstart"  && !touchstarted) { //start swipe
		this.addEventListener("touchmove", touchHandler, false);
		this.addEventListener("touchend", touchHandler, false);
		touchstarted=true;
		jQuery(this).addClass('active');
		/*if(specs.animationType == "slide"){
			swipeStartMarginLeft=parseInt(jQuery('#'+specs.uniqueId+' ul.fTeaser').css('margin-left').replace('px',''));
		}*/
		if(jQuery(this).hasClass('positioned')){
			var left=jQuery(this).offset().left;
			var top=jQuery(this).offset().top;
			jQuery(this).removeClass('positioned');
			positions[left+'_'+top]=undefined;
			delete positions[left+'_'+top];
		}
		swipeStartX=touch.pageX;
		swipeStartY=touch.pageY;
		swipeNowX=swipeStartX;
		swipeNowY=swipeStartY;
		
		cardx = jQuery(this).css('left');
		cardy = jQuery(this).css('top');
		cardx=parseInt(cardx.replace('px',''));
		cardy=parseInt(cardy.replace('px',''));
		
		
	} else if (e.type == "touchmove") { //in swipe
		swipeNowX=touch.pageX;
		swipeNowY=touch.pageY;
		if(swipeNowX<(swipeStartX-20) || swipeNowX>(swipeStartX+20) || swipeNowY<(swipeStartY-20) || swipeNowY>(swipeStartY+20) || dragging){
			
			e.preventDefault();
			dragging=true;
			var left=cardx+(swipeNowX-swipeStartX);
			jQuery(this).css('left',left+'px');
			
			var top=cardy+(swipeNowY-swipeStartY);
			jQuery(this).css('top',top+'px');
		}
		
		
		
	} else if (e.type == "touchend" || e.type == "touchcancel") {//einde swipe
		
		//swipeStartX=touch.pageX;
		
		
		//snap to grid
		var left=cardx+(swipeNowX-swipeStartX);
		var top=cardy+(swipeNowY-swipeStartY);
		left = Math.round((left)/grid)*grid;
		left+=tableleft;
			if(left<tableleft){left=tableleft;}
			if(left>=jQuery(window).width()){left=left-grid;}
		top = Math.round((top)/grid)*grid;
		top+=tabletop;
			if(top<tabletop){top=tabletop;}
			if(top>=jQuery(window).height()){top=top-grid;}
		
		if(left>=tableleft && left<(tableleft+jQuery('#table').outerWidth()-2) && top>=tabletop && top<(tabletop+jQuery('#table').outerHeight()-2)){
			
			
			jQuery(this).css('left',left+'px');
			jQuery(this).css('top',top+'px');
			checkIfOverlap(this);
		}
		
		touchstarted=false;
		
		swipeEndX=swipeNowX;
		if(swipeEndX<(swipeStartX-20)){ //to right
			/*if((currentitem+1)<=total){
				loadTeaserItem(currentitem+1);
			} else {
				displayItem(currentitem);
			}*/
		} else if (swipeEndX>(swipeStartX+20)){ //to left
			/*if((currentitem-1)>=1){
				loadTeaserItem(currentitem-1);
			} else {
				displayItem(1);
			}*/
		} else {
			//not enough swipe
			//displayItem(currentitem);
		}
		dragging=false;
		jQuery(this).removeClass('active');
		this.removeEventListener("touchmove",touchHandler);
		this.removeEventListener("touchend",touchHandler);
		
	}
}

function checkIfCorrect(){
	
	var goed=0;
	
	for (var i=0;i<(rasterx*rastery);i++){
		var row = 1+Math.floor(((i)/rasterx));
		var col = 1+(i-((row-1)*rasterx));
		
		var expectedtop = tabletop + ((row-1)*grid);
		var expectedleft = tableleft + ((col-1)*grid);
		
		var cardleft = jQuery('.card.row'+row+'.col'+col).offset().left;
		var cardtop = jQuery('.card.row'+row+'.col'+col).offset().top;
		
		if(expectedtop==cardtop && expectedleft==cardleft){
			jQuery('.card.row'+row+'.col'+col).addClass('goed');
			goed=goed+1;
		} else {
			jQuery('.card.row'+row+'.col'+col).removeClass('goed');
		}
	}
	if(goed == (rasterx*rastery)){
		alert('Goed gedaan!');
	}
	
}
function checkIfOverlap(dragObj2){
	
	dragObj=dragObj2;
	var left=jQuery(dragObj).offset().left;
	var top=jQuery(dragObj).offset().top;

	if(positions[left+'_'+top]==undefined){
		positions[left+'_'+top]=1;
		jQuery(dragObj).addClass('positioned');
		checkIfCorrect();
	} else {
		//allready someone at that pos, so move away
		jQuery(dragObj).animate({left:jQuery('#table').width()+tableleft+Math.floor(Math.random()*((jQuery(window).width()-jQuery('#table').width()-jQuery(dragObj).width())))+'px',top:Math.floor(Math.random()*(jQuery(window).height()-jQuery(dragObj).height()))+'px'},500);
		
		//jQuery(dragObj).css('top',Math.floor(Math.random()*(jQuery(window).height()-jQuery(dragObj).height()))+'px');
	}
	
}

function moveAway(){
	
}