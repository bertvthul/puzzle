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

var event_fdragstarted = new Event('fdragstarted');
var event_fdragend = new Event('fdragend');

jQuery(document).ready(function(){
	
	jQuery('.fdrag').each(function(){
		
		if ('ontouchstart' in document.documentElement) {
			dragObj=jQuery(this);
			this.addEventListener("touchstart", startDrag, false);
		} else {
			//no touch, setup mouse
			jQuery(this).mousedown(function(e){dragObj=jQuery(this);startDrag(e);});
			
		}
	});
	
});



function startDrag(e) {
	e.preventDefault();
	if ('ontouchstart' in document.documentElement) {
		//touch
		var touch = e.touches[0];
		
		if (e.type == "touchstart"  && !touchstarted) {
			touchstarted=true;
			initDrag(touch);
			
			this.addEventListener("touchmove", startDrag, false);
			this.addEventListener("touchend", startDrag, false);
			
		} else if (e.type == "touchmove") { //in swipe
			
			inDrag(touch);
			
			
			
		} else if (e.type == "touchend" || e.type == "touchcancel") {//einde swipe
			
			endDrag(touch);
			
			this.removeEventListener("touchmove",touchHandler);
			this.removeEventListener("touchend",touchHandler);
			
		}
		
	} else {
		//mouse
		var touch = e;
		initDrag(touch);
		
		jQuery(document).mousemove(function(touch){
			inDrag(touch);
		});
		jQuery(document).mouseup(function(touch){
			endDrag(touch);
			
			jQuery(document).unbind('mousemove');
			jQuery(document).unbind('mouseup');
		});
	}
	
	
	
	
	
}

function endDrag(touch){
	
	
	touchstarted=false;
	
	dragging=false;
	jQuery(dragObj).removeClass('active');
	
	dragObj[0].dispatchEvent(event_fdragend);
	
}


function inDrag(touch){
	
	swipeNowX=touch.pageX;
	swipeNowY=touch.pageY;
	if(swipeNowX<(swipeStartX-20) || swipeNowX>(swipeStartX+20) || swipeNowY<(swipeStartY-20) || swipeNowY>(swipeStartY+20) || dragging){
		
		dragging=true;
		var left=cardx+(swipeNowX-swipeStartX);
		jQuery(dragObj).css('left',left+'px');
		
		var top=cardy+(swipeNowY-swipeStartY);
		jQuery(dragObj).css('top',top+'px');
	}
	
	
}
function initDrag(touch){
	swipeStartX=touch.pageX;
	swipeStartY=touch.pageY;
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
	
	
	dragObj[0].dispatchEvent(event_fdragstarted);
}

// -------------------------

