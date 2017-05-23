autowatch = 1;

var ajaxreq;
var payload;
var imageurl;
var api_string;
var imagepath;
var numfiles=0;
var accessToken = "5374649619.bdb4aed.1cc2c9d72aba4e199c300588b4d75384";
outlets = 2;

init();

function bang(){
	//create a XMLHttpRequest object
	ajaxreq = new XMLHttpRequest();
	//set the HTTP message to be sent (usually a special formatted URL)
	ajaxreq.open("GET",api_string);
	//set the callback function
	ajaxreq.onreadystatechange = getPictures;
	//send the request
	ajaxreq.send();
}

var lastImageCreatedTime = 0;
var currentImageCreatedTime;

function getPictures(){
	payload = JSON.parse(ajaxreq.response);
	imageurl = new Array();
	
	post(payload.data.length);
	
	for (i = (payload.data.length - 1); i >= 0; i--){
		
		currentImageCreatedTime = payload.data[i].created_time;
		
		if (lastImageCreatedTime < currentImageCreatedTime){
			
			imageurl[i] = payload.data[i].images.standard_resolution.url;
			getImageURL(i);
			lastImageCreatedTime = currentImageCreatedTime;
			
			} else {
				// do nothing
				post("\n There are no new images at this time.")
		}		
	}	
}

function getrecent(){	
	api_string = "https://api.instagram.com/v1/users/self/media/recent/?access_token="+accessToken;
	bang();
}

function tagsearch(tag){	
	api_string = "https://api.instagram.com/v1/tags/"+tag+"/media/recent?access_token="+accessToken;
	bang();
}

function popular(){
	api_string = "https://api.instagram.com/v1/media/popular?access_token="+accessToken;
	bang();
}

function filewriteCallback(){
}

function init(){
	imagepath = this.patcher.filepath.replace("patchers/InstaFeed.maxpat","media/");
	outlet(1,imagepath);
}

function getImageURL(image){
	var pname = imageurl[image].replace(/^.*(\\|\/|\:)/, '');
	var pp = new XMLHttpRequest();
	pp.open("GET",imageurl[image]);
	pp._setRequestKey("filename_out",imagepath+pname);
	pp.onreadystatechange = filewriteCallback;
	pp.send();
	//outlet(0,pname);
	outlet(0,"bang");
}