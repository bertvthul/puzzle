// Author: Bert
// Script doesnt work on older IE - no support added
(function fDrag(){
	
	//global variables
	var swipeStartX, swipeNowX, swipeStartY, swipeNowY, cardy, cardx;
	var touchstarted=false;
	var dragObj, curDragObj;
	var dragging=false;
	

	//events
	var event_fdragstart = new Event('fdragstart');
	var event_fdragend = new Event('fdragend');


	document.addEventListener('DOMContentLoaded', function(){ 
		
		fdragStartListeners();
		
		document.addEventListener('fdragremove', function (e) { 
			removeDrag();
		});
		
		document.addEventListener('fdragreset', function (e) { 
			removeDrag();
			fdragStartListeners();
		});
		
	}, false);
	
	
	
	this.removeDrag=function(){
		console.log('=== remove drag listeners - TODO: NOT WORKING!!! ===');
		//each .fdrag add listener for start drag
			var dragelements = document.getElementsByClassName('fdrag');
			
			if(dragelements.length>0){
				//general listener for mouse up
				if ('ontouchstart' in document.documentElement) {
					//touch
					
				} else {
					//mouse
					document.removeEventListener("mouseup", this.fdragEnd,false);
				}
				
				
				for (var i = 0, len = dragelements.length; i < len; i++) {
					
					dragObj = dragelements[i];
					
					if ('ontouchstart' in document.documentElement) {
						//touch
						dragObj.removeEventListener("touchstart", this.fdragInit, false);
						
					} else {
						
						//mouse
						dragObj.removeEventListener("mousedown", this.fdragInit,false);
						
					}
				}
			}
	}.bind(this);
	
	

	this.fdragStartListeners=function(){
		
		
		//each .fdrag add listener for start drag
		var dragelements = document.getElementsByClassName('fdrag');
		
		if(dragelements.length>0){
			//general listener for mouse up
			if ('ontouchstart' in document.documentElement) {
				//touch
				
			} else {
				//mouse
				document.addEventListener("mouseup", this.fdragEnd.bind(this),false);
			}
			
			for (var i = 0, len = dragelements.length; i < len; i++) {
				
				dragObj = dragelements[i];
				
				if ('ontouchstart' in document.documentElement) {
					
					//touch
					dragObj.addEventListener("touchstart", this.fdragInit.bind(this), false);
					
				} else {
					
					//mouse
					console.log('listeners for touch');
					dragObj.addEventListener("mousedown", this.fdragInit.bind(this),false);
					
				}
			}
		}
	}



	this.fdragInit=function(e) {
		e.preventDefault();
		console.log('drag init');
		
		if(!dragging){//check if not allready dragging to prevent dragging 2 objects simultaneously
			curDragObj=e.target;
		}
		
		if ('ontouchstart' in document.documentElement) {
			//touch
			var touch = e.touches[0];
			
			if (e.type == "touchstart"  && !touchstarted) {
				touchstarted=true;
				fdragStart(touch);
				
				this.addEventListener("touchmove", this.fdragInit, false);
				this.addEventListener("touchend", this.fdragInit, false);
				
			} else if (e.type == "touchmove") { //in swipe
				
				this.fdragDragging(touch);
				
			} else if (e.type == "touchend" || e.type == "touchcancel") {//einde swipe
				
				this.fdragEnd(touch);
				
				this.removeEventListener("touchmove",this.fdragInit,false);
				this.removeEventListener("touchend",this.fdragInit,false);
				
			}
			
		} else {
			//mouse
			var touch = e;
			this.fdragStart(touch);
			
			
			document.addEventListener("mousemove", this.fdragDragging,false);
			
			
			
		}
	}

	this.fdragEnd=function(){
		if(curDragObj!=undefined && dragging){
			console.log('drag ended');
			
			touchstarted=false;
			
			dragging=false;
			
			if ('ontouchstart' in document.documentElement) {
				//touch
			} else {
				//mouse
			
				document.removeEventListener('mousemove', this.fdragDragging, false);
			}
			
			
			curDragObj.dispatchEvent(event_fdragend);
		}
	}


	this.fdragDragging=function(touch){
		console.log('drag');
		swipeNowX=touch.pageX;
		swipeNowY=touch.pageY;
		if(swipeNowX<(swipeStartX-20) || swipeNowX>(swipeStartX+20) || swipeNowY<(swipeStartY-20) || swipeNowY>(swipeStartY+20) || dragging){
			
			var left = cardx+(swipeNowX-swipeStartX);
			curDragObj.style.left = left+'px';
			
			var top=cardy+(swipeNowY-swipeStartY);
			curDragObj.style.top = top+'px';
			
		}
		
	}.bind(this);
	
	this.fdragStart=function(touch){
		if(!dragging){
			log('start drag');
			swipeStartX=touch.pageX;
			swipeStartY=touch.pageY;
			swipeNowX=swipeStartX;
			swipeNowY=swipeStartY;
			
			cardx = curDragObj.offsetLeft;
			cardy = curDragObj.offsetTop;
			
			dragging=true;
			
			this.fdragDragging(touch);
			
			curDragObj.dispatchEvent(event_fdragstart);
		}
	}
	
	function log(msg){
		var logobj = document.getElementById('log');
		if(logobj!=undefined){
			logobj.innerHTML+='<br />'+msg;
		}
		console.log(msg);
	}
	
})()