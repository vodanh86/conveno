var touch_x,touch_y;//coordinates of finger touch
var labelsText =  new Array();
var pin=0;
var pin_start;
var time_start;
var currentslide=0;
var N;
var playing = false;
var slidetimer=0;
var framewidth=320;
var offset_y=0;
var hasshowninstruction=false;
function showinstruction()
{
	if(!hasshowninstruction)
	{
		setTimeout(function(){
			document.getElementById("instruction").style.opacity="0.8";
		},100);
		setTimeout(function(){
			document.getElementById("instruction").style.opacity="0.0";
		},4000);
		//logic
		
		hasshowninstruction = true;
	}
}
function translate(x,y)
{
	if(isWebKit())
	{
		return "translate3d("+x+"px,"+y+"px,0)";
	}
	else
	{
		return "translate("+x+"px,"+y+"px)";
	}
}
function reset(turns)
{
	pin=0;
	pin_start=0;
	time_start=0;
	currentslide=0;
	N = turns.length;
	playing = false;
	slidetimer=0;
}
function gotoslide(to,time,from)
{
	var ret;
	var frame = document.getElementById("map-frame");
	var slider= document.getElementById("slider");

	if (!frame ||!slider) return false;

	var v = new viewport();
	if(to<0)
	{
		currentslide=0;
		ret = false;
	}
	else if (to>N-1)
	{
		currentslide=N-1;
		ret = false;
	}
	else
	{
		currentslide=to;
		pin = currentslide* framewidth;
		frame.style.webkitTransform = translate(-pin,offset_y);
		frame.style.webkitTransition = "-webkit-transform "+time/1000+"s ease-out";

		if (!isWebKit()) {
			frame.style.marginLeft = -pin + "px";
		}
		
		slider.style.webkitTransform = translate(  (269.0 / (N - 1) * currentslide) ,0);
		slider.style.webkitTransition = "-webkit-transform " + time / 1000 + "s ease-out";
		setTimeout("document.getElementById('map-frame').style.webkitTransition='';document.getElementById('slider').style.webkitTransition='';", time);
		if (currentslide == 0) {
			document.getElementById("div_previous").style.opacity = "0.2";
			document.getElementById("div_begin").style.opacity = "0.2";
		}
		else {
			document.getElementById("div_previous").style.opacity = "1.0";
			document.getElementById("div_begin").style.opacity = "1.0";
		}
		if (currentslide == N - 1) {
			document.getElementById("div_next").style.opacity = "0.2";
			document.getElementById("div_end").style.opacity = "0.2";
			document.getElementById("div_play").style.opacity = "0.2";
		}
		else {
		
			document.getElementById("div_next").style.opacity = "1.0";
			document.getElementById("div_end").style.opacity = "1.0";
			document.getElementById("div_play").style.opacity = "1.0";
		}
		
		ret = true;
		document.getElementById("label").innerHTML='<p>'+labelsText[to]+'</p>';
	}
	return ret;
	
	
}

function handlecontrol(target_id)
{
	switch(target_id)
	{
		case "next":
		case "div_next":
			if(playing)
			{
				stopSlideshow();
			}
		 	goright();
		 	break;
		case "previous":
		case "div_previous":
			if(playing)
			{
				stopSlideshow();
			}
			goleft();
			break;
		case "begin":
		case "div_begin":
			if(playing)
			{
				stopSlideshow();
			}
			gobegin();
			break;
		case "end":
		case "div_end":
			if(playing)
			{
				stopSlideshow();
			}
			goend();
			break;
		case "play":
		case "div_play":

		if(!playing)
		{
			startSlideshow();
		}
		else
		{
			stopSlideshow();
		}
		break;
	}
}
function startSlideshow()
{
	document.getElementById("play").src="theme/black/images/pause.png";
	if (goright()&&currentslide!=N-1) 
	{
		if (slidetimer == 0) 
		{
			slidetimer = setInterval("timerfunc()", 2000);
			playing = true;
			//console.log('timer started');
		}
	}
	else
	{
		setTimeout('document.getElementById("play").src = "theme/black/images/play.png"',100);
		//console.log('timer didnt start');
	}
}
function stopSlideshow()
{
	if (slidetimer != 0) 
	{
		document.getElementById("play").src = "theme/black/images/play.png";
		clearInterval(slidetimer);
		slidetimer = 0;
		playing = false;
		//console.log('timer stopped');
	}
	else
	{
		//console.log('timer didnt stop');
	}
}
function timerfunc()
{
	
	if(playing)
	{
		if(!goright()||currentslide==N-1)
		{
			stopSlideshow();
		}
	}
}
function touchStart(event)
{
	event.preventDefault();
	if (event.touches.count = 1)//disallow multitouch while panning
	{
		touch_x = event.targetTouches[0].clientX;
		time_start = new Date().getTime();
		handlecontrol(event.touches[0].target.id);
		pin_start=pin;
	}

}
function touchMove(event)
{
	event.preventDefault();
	if(playing)
	{
		stopSlideshow();
	}
	if(event.touches.count>1)// no reason to proceed if it is multitouch/not panning
		return;

	
	pin-= event.targetTouches[0].clientX - touch_x;
	var v = new viewport;
	if(pin<0)pin=0;
	if(pin>(N-1)*framewidth)pin = (N-1)*framewidth;
	var frame = document.getElementById("map-frame");
	var slider = document.getElementById("slider");
	frame.style.webkitTransform = translate(-pin,offset_y,0);
	slider.style.webkitTransform = translate(  (pin / ((N - 1) * (framewidth)) * 269) ,0,0);
	
	
	touch_x=event.targetTouches[0].clientX;

}
function touchEnd(event)
{
	var v = new viewport();
	var speed = (pin-pin_start)/(new Date().getTime() - time_start);
	if (speed > 0.5) {
		goright();
	}
	else if (speed < -0.5) 
	{
		goleft();
	}
	else 
	{
		gotoslide(Math.floor((pin + framewidth / 2) / (framewidth)),200,currentslide);
	}
	//console.log(n);
}
function gobegin()
{
	return gotoslide(0,500,currentslide);
}
function goend()
{
	return gotoslide(N-1,500,currentslide);
}
function goleft()
{
	return gotoslide(currentslide-1,200,currentslide);
}
function goright()
{
	return gotoslide(currentslide+1,200,currentslide);
	
}

function touchCancel(event)
{
	//alert("touchCancel");
}
function viewport()
{
	/*
	if(window.navigator.standalone)
	{
		if(window.orientation==0)
		{
			this.x=320;
			this.y=460;
		}
		else
		{
			this.x=480;
			this.y=300;
		}
		this.standalone = true;
	}
	else
	{
		if(window.orientation==0)
		{
			this.x=320;
			this.y=416;
		}
		else
		{
			this.x=480;
			this.y=268;
		}
		this.standalone = false;
	}
	*/
	this.x = window.innerWidth;
	this.y = window.innerHeight;
	this.standalone = (window.orientation==0);
}
function orientChangeHandler()
{
	hideURLbar();
	return;

/*
	var orientation=window.orientation;
	switch(orientation)
	{
	case 0:
		isPortrait = true;
		document.body.style.minHeight = "416px";
		offset_y=0;
		document.getElementById("controller").style.display="block";
		document.getElementById("wrap").style.left="0px";
		document.getElementById("wrap").style.height="370px";
		if (window.navigator.standalone) 
		{
			document.getElementById("controller").style.left=((320 - 287) / 2) + "px";
			document.getElementById("controller").style.bottom = "-44px";
		}
		else
		{
			document.getElementById("controller").style.left=((320 - 287) / 2) + "px";
			document.getElementById("controller").style.bottom = "0px";
		}
		break;	
		
	case 90:
	case -90: 
		isPortrait = false;
		if (window.navigator.standalone) 
		{
			document.body.style.minHeight = "300px";
			document.getElementById("controller").style.display = "none";
			offset_y = -35;
			document.getElementById("wrap").style.left = "80px";
			document.getElementById("wrap").style.height = "268px";
		}
		else 
		{
			document.body.style.minHeight = "268px";
			document.getElementById("controller").style.display = "none";
			offset_y = -51;
			document.getElementById("wrap").style.left = "80px";
			document.getElementById("wrap").style.height = "236px";
		}
		break;
	}
	pin = currentslide* framewidth;
	document.getElementById("map-frame").style.webkitTransform = translate(-pin,offset_y);
	
	setTimeout(scrollTo, 100, 0, 1);
*/
}
