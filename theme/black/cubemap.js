
var cubemap = function(){};

cubemap.Load = function(app_id, pmk_id, div, divwidth, divheight, zoom, resize) {
    cubemap.pmk_id = pmk_id;
    cubemap.app_id = app_id;
    cubemap.div = div;
    
    // NOTE: this should be a relative path, but for the time being is hardcoded for ducheng testing purposes
    var jpg_path = baseurl + "/view/"+app_id+"/pmk/"+pmk_id+"/";

    // var jpg_path = pmk_id+"/";
    // var jpg_path = "http://www.dev.conveno.com/view/"+app_id+"/pmk/"+pmk_id+"/";
    var imagesSize = (divheight > divwidth) ? divheight : divwidth;
    
    // add in the vr structures
    cubemap.Clear(div);
    
    // vr
    var vr = document.createElement("DIV");
    vr.id="vr";
    vr.setAttribute("class", "container");
    div.appendChild(vr);
    
    // vr-bounding
    var vr_bounding = document.createElement("DIV");
    vr_bounding.id="vr-bounding";
    vr.appendChild(vr_bounding);
    // vr-container
    var vr_container = document.createElement("DIV");
    vr_container.id="vr-container";
    vr_bounding.appendChild(vr_container);
    
    // vr-position
    var vr_position = document.createElement("DIV");
    vr_position.id="vr-position";
    vr_container.appendChild(vr_position);
    
    var rotor_x = document.createElement("DIV");
    rotor_x.id="rotor-x";
    vr_position.appendChild(rotor_x);
    
    var rotateX = document.createElement("DIV");
    rotateX.id="rotateX";
    rotor_x.appendChild(rotateX);
    
    var rotor_y = document.createElement("DIV");
    rotor_y.id="rotor-y";
    rotateX.appendChild(rotor_y);
    
    var rotateY = document.createElement("DIV");
    rotateY.id="rotateY";
    rotor_y.appendChild(rotateY);
    
    var cube = document.createElement("DIV");
    cube.id="cube";
    rotateY.appendChild(cube);
    
    // start of chim stuff
    
    // NOTE: ordering of the pic is very important
    var images =  ["front.jpg", "right.jpg", "back.jpg", "left.jpg", "top.jpg", "bottom.jpg"];

    window.kRingRadius = 150; // this affects the sensitivity of looking around
    var container = document.getElementById('vr-container');
    var imageDocumentFragment = document.createDocumentFragment();
    
    // event handlers to stop rotation on mousedown / touch
    vr.addEventListener('touchstart', cubemap.StopRotate);
    vr.addEventListener('mousedown', cubemap.StopRotate);
    
    // default rotation speed for auto rotate of cubemap
    if (cubemap.RotateAngle==undefined) cubemap.RotateAngle=0.004;
    if (cubemap.RotateInterval==undefined) cubemap.RotateInterval=33;
    
    // decide whether should add rotate handler
    var img_do_onload = (!resize && !cubemap.rotate);
    if (img_do_onload) cubemap.rotate=true;
    cubemap.imagec=0; // to keep track of how many images have been loaded
    for (var i = 0, countI = images.length, img;
        (imageURL = images[i]);
        i++) {
        img = new Image();
		// var img = document.getElementById("face"+(i+1));
		// if (!img) img = new Image();
        img.src = jpg_path+imageURL;
        img.id = "face" + (i + 1);
        img.className = "face";
        img.width = imagesSize;
        img.height = imagesSize;
        if (img_do_onload) {
            // once all images are loaded, start autorotate
            img.onload = function() { 
							cubemap.imagec++; 
							if (cubemap.imagec==6) {
								cubemap.AutoRotate(); 
							}
						};
        }
        imageDocumentFragment.appendChild(img);
    }
    cube.appendChild(imageDocumentFragment);
    cubemap.SetStyle(divwidth, divheight, zoom);
    cubemap._gSpinner = new Spinner(document.getElementById('rotateX'), document.getElementById('rotor-x'), document.getElementById('rotateY'), document.getElementById('rotor-y'), container);
    container = null;
    imageDocumentFragment = null;   
};

cubemap.Resize = function(w,h,p) {
    // save view
    var xt = document.getElementById("rotor-x").style.webkitTransform;
    var yt = document.getElementById("rotor-y").style.webkitTransform;
    var startRotationX = this._gSpinner.startRotationX;
    var startRotationY = this._gSpinner.startRotationY;
    var staticRotationX = this._gSpinner.staticRotationX;
    var staticRotationY = this._gSpinner.staticRotationY;
    
    var wasrotating=cubemap.rotate;
    if (wasrotating) {
        cubemap.StopRotate();
    }
    
    cubemap.Load(this.app_id,this.pmk_id,this.div,w,h,p,true);
    
    // load view
    document.getElementById("rotor-x").style.webkitTransform=xt;
    document.getElementById("rotor-y").style.webkitTransform=yt;
    this._gSpinner.startRotationX = startRotationX;
    this._gSpinner.startRotationY = startRotationY;
    this._gSpinner.staticRotationX = staticRotationX;
    this._gSpinner.staticRotationY = staticRotationY;
    
    if (wasrotating) {
        setTimeout(cubemap.setrotatetrue, cubemap.RotateInterval*5);
        setTimeout(cubemap.AutoRotate, cubemap.RotateInterval*10);
    }
}

cubemap.setrotatetrue = function() {
    cubemap.rotate=true;
}

cubemap.SetStyle = function(w,h,p) {
    var s = w > h ? w : h;
    var spx = s+"px";
    var half = s/2;
    var halfpx = half+"px";
    var nhalfpx = "-"+halfpx;
    
    var vr = document.getElementById("vr");
    var vr_container = document.getElementById("vr-container");
    var vr_position = document.getElementById("vr-position");
    var rotor_x = document.getElementById("rotor-x");
    var rotor_y = document.getElementById("rotor-y");
    var rotateX = document.getElementById("rotateX");
    var rotateY = document.getElementById("rotateY");
    var face1 = document.getElementById("face1");
    var face2 = document.getElementById("face2");
    var face3 = document.getElementById("face3");
    var face4 = document.getElementById("face4");
    var face5 = document.getElementById("face5");
    var face6 = document.getElementById("face6");
    var cube = document.getElementById("cube");
    
    vr.style.height=h+"px";
    vr.style.width=w+"px";
    if (h<w) vr_container.style.top="-"+parseInt((s-h)/2)+"px";
    else vr_container.style.left="-"+parseInt((s-w)/2)+"px";
    vr_container.style.height=spx;
    vr_container.style.width=spx;
    vr_position.style.height=spx;
    vr_position.style.width=spx;
    vr_position.style.webkitTransform="translateZ("+half*p+"px)";
    rotateX.style.height=spx;
    rotateX.style.width=spx;
    rotateY.style.height=spx;
    rotateY.style.width=spx;
    face1.style.height=spx;
    face1.style.width=spx;
    face2.style.height=spx;
    face2.style.width=spx;
    face3.style.height=spx;
    face3.style.width=spx;
    face4.style.height=spx;
    face4.style.width=spx;
    face5.style.height=spx;
    face5.style.width=spx;
    face6.style.height=spx;
    face6.style.width=spx;
    vr_container.style.webkitPerspective=half*p;
    cube.style.top=halfpx;
    face1.style.left=nhalfpx;
    face1.style.top=nhalfpx;
    face2.style.left=nhalfpx;
    face2.style.top=nhalfpx;
    face3.style.left=nhalfpx;
    face3.style.top=nhalfpx;
    face4.style.left=nhalfpx;
    face4.style.top=nhalfpx;
    face5.style.left=nhalfpx;
    face5.style.top=nhalfpx;
    face6.style.left=nhalfpx;
    face6.style.top=nhalfpx;
    face1.style.webkitTransform="translate3d(0, 0, -"+(half-.5)+"px)";
    face2.style.webkitTransform="translate3d("+(half-.5)+"px, 0, 0) rotate3d(0, 1, 0, -90deg)";
    face3.style.webkitTransform="rotate3d(0, 1, 0, 180deg) translate3d(0, 0, -"+(half-.5)+"px)";
    face4.style.webkitTransform="translate3d(-"+(half-.5)+"px, 0, 0) rotate3d(0, 1, 0, 90deg)";
    face5.style.webkitTransform="translate3d(0, -"+(half-.5)+"px, 0) rotate3d(1, 0, 0, -90deg) rotate3d(0, 0, 1, 0deg)";
    face6.style.webkitTransform="translate3d(0, "+(half-.5)+"px, 0) rotate3d(1, 0, 0, 90deg) rotate3d(0, 0, 1, 0deg)";
};

cubemap.Clear = function(div) {
    // kill auto rotating
    //if (cubemap.rotate) cubemap.rotate=false;
    // clear div
    for (i=1; i<=6; i++) {
        var f = document.getElementById("face"+i);
        if (f) {
            var pixel = 'R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==';
            f.src = 'data:image/gif;base64,' + pixel;
        }
    }
    if (this._gSpinner) {
        try { this._gSpinner.recycle(); }
        catch (exc) {}
    }
	if (div) {
		cubemap.removeChild(div);
	}
};

cubemap.removeChild= function(div) {
    while (div.hasChildNodes()) {
		cubemap.removeChild(div.firstChild);
        div.removeChild(div.firstChild);
	}
}

cubemap.AutoRotate = function() {
    if (cubemap.rotate) {
        //alert("watchout! rotating");
        cubemap._gSpinner.staticRotationY = cubemap._gSpinner.staticRotationY + cubemap.RotateAngle;
        cubemap._gSpinner.setRotation(cubemap._gSpinner.staticRotationX, cubemap._gSpinner.staticRotationY);
        setTimeout(cubemap.AutoRotate, cubemap.RotateInterval);
    }
}

cubemap.StopRotate = function() {
    var vr = document.getElementById("vr");
    vr.removeEventListener('touchstart', cubemap.StopRotate);
    vr.removeEventListener('mousedown', cubemap.StopRotate);
    cubemap.rotate=false;
}
