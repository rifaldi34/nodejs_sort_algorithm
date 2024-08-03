/*
 *(c) 2014 by Maik Dreibholz
 */

"use strict";
var arr = []; // array with all keys
var k, i, j; // variables for sorting algorithm
var tempKey;

var gaps = [5, 3, 1];

var s0 = false;
var s1 = false;
var s2 = false;
var s3 = false;

var sorting = false;

var maxKey = 1;
var sx = 553;

var startTimer;
var milSec;

var canv = document.getElementById("paint");
var ctx = canv.getContext("2d");
ctx.font = "18px Serif";

var gapIndex = new index("gap: ", 20);
var iIndex = new index("i", 40);
var jIndex = new index("j", 60);

document.getElementById("buttons2").style.visibility = "hidden";

// regular key object with key value as parameter.
// setKey function should be used to change key's value for visual effects.
// graphics function draws rectangle with height according to the key's value.
function key(key){
    this.key = key;
    this.x = 0;
    this.bottom = 400;
    this.inset = 0;
    
    this.setKey = setKey;
    this.graphics = graphics;
    
    function setKey(value){
    	this.key = value;
    	if(value > 9)
    		this.inset = 4;
    	else
    		this.inset = 0;
    }
    
    function graphics(){
    	var grd = ctx.createLinearGradient(0,350,0,150);
    	grd.addColorStop(0,"darkred");
    	grd.addColorStop(1,"red");
    	ctx.fillStyle = grd;
    	ctx.fillRect(this.x, this.bottom-this.key*300/maxKey, 10, this.key*300/maxKey);
    	ctx.fillStyle = "white";
    	ctx.fillRect(this.x, this.bottom-this.key*300/maxKey, 10, 2);
    	ctx.fillText(this.key, this.x-this.inset, this.bottom-10-this.key*300/maxKey);
    }
} 

//key object used for fast sorting.
//key's value between 1 and 99, random.
//graphics function draws rectangle with height according to the key's value.
function fastKey(){
	this.key = Math.ceil(Math.random()*99);
    this.x = 0;
    this.bottom = 400;
    
    this.setKey = setKey;
    this.graphics = graphics;
    
    if(this.key > maxKey){
		 maxKey = this.key;
	 }
    
    function setKey(value){
    	this.key = value;
    }
    
    function graphics(){
    	var grd = ctx.createLinearGradient(0,350,0,150);
    	grd.addColorStop(0,"darkred");
    	grd.addColorStop(1,"red");
    	ctx.fillStyle = grd;
    	ctx.fillRect(this.x, this.bottom-this.key*300/maxKey, 5, this.key*300/maxKey);
    	ctx.fillStyle = "white";
    	ctx.fillRect(this.x, this.bottom-this.key*300/maxKey, 5, 2);
    }
}

// index to show what exactly the algorithm is currently doing
// graphics function draws the name at the given location, 
// however, not when user selected fast sorting.
function index(name, height){
	this.name = name;
	this.height = height;
	this.bottom = 400;
	this.x = 0;
	this.visible = false;
	
	this.graphics = graphics;
	
	function graphics(){
		if(this.visible){
			ctx.fillStyle = "white";
	    	ctx.fillText(this.name, this.x, this.bottom+this.height);
		}
	}
}

// adds a new key to the array with a value of the input field.
function add(){
	if(arr.length < 50 && !sorting){
		var t = Math.floor(Number(document.getElementById("inputField").value));
		t = t || 1;
		
        var x = new key(t);
        check(x);
            
        arr[arr.length] = x;
        sx -= 10;
        updateLocation(20);
    }
	document.getElementById("inputField").value = "";
}

// adds 10 keys with a random value to the array.
function addRandom(){
	if(!sorting){
	    var start = arr.length;
	    var end = start + 10;
	    if(end > 50){
	        end = 50;
	    }
	    if(start < 50){
	        for(var index = start; index < end; index++){
	            var x = new key(Math.ceil(Math.random()*99));
	            check(x);
	            
	            arr[index] = x;
	            sx -= 10;
	            updateLocation(20);
	        }
	    }
	}
}

// checks for valid input.
function check(k){
	 if(k.key < 1)
		 k.key = 1;
	 else if(k.key > 99)
		 k.key = 99;
	    
	 if(k.key > 9)
		 k.inset = 4;
	 else
		 k.inset = 0;
	 
	 if(k.key > maxKey){
		 maxKey = k.key;
	 }
}

function setup(mil){
	k = 0;
	i = 0;
    j = arr.length-1;
    s0 = true;
    s1 = false;
    s2 = false;
    s3 = false;
	milSec = mil;
	gapIndex.name = "gap: " + gaps[0];
	gapIndex.x = arr[0].x;
	iIndex.x = arr[i].x;
	jIndex.x = arr[j].x;
}

// updates the location of all rectangles.
function updateLocation(width){
	for(var index = 0; index < arr.length; index++){
		arr[index].x = sx+(index+1)*width;	
	}
	paintAllComponents();
}

// paints all components.
function paintAllComponents(){
    ctx.clearRect(0, 0, canv.width, canv.height);
    for(var index = 0; index < arr.length; index++){
    	arr[index].graphics();
    }
    if(milSec > 2){
		iIndex.graphics();
		gapIndex.graphics();
		jIndex.graphics();
    }
}

// initiates the execution of the sorting algorithm.
function initFastSort(){
		
		stopAndClear();
		
		for(var index = 0; index < 100; index++){
			arr[index] = new fastKey();
		}
		
		setup(2);
		
		sx -= 300;
		updateLocation(6);

    	// timer that calls the shellSort function every 2 milSec. 
		startTimer = setInterval(function(){shellSort();}, milSec);
		
		changeButtonVisibility();
		sorting = true;
	
}

//initiates the execution of the sorting algorithm.
function initSort(){
    if(arr.length > 1){

    	setup(300);
    	
    	iIndex.visible = true;
    	gapIndex.visible = true;
    	jIndex.visible = true;
    	
    	// timer that calls the shellSort function every 300 milSec. 
    	startTimer = setInterval(function(){shellSort();}, milSec);
    	
    	changeButtonVisibility();
    	sorting = true;
	}
}

// sorts all keys with shellSort.
function shellSort(){
	if(s0){
		if(k < gaps.length){
			s0 = false;
			s1 = true;
			i = gaps[k];
			iIndex.x = arr[i].x;
			jIndex.x = arr[i].x;
		}
		else {
			s0 = false;
			s3 = true;
		}
	}
	else if(s1){
		if(i < arr.length){
			tempKey = arr[i].key;
			s1 = false;
			s2 = true;
			j = i;
			jIndex.x = arr[j].x;
		}
		else {
			s1 = false;
			s0 = true;
			k++;
			if(k < gaps.length)
				gapIndex.name = "gap: " + gaps[k];
		}
	}
	else if(s2){
		if(j >= gaps[k] && arr[j-gaps[k]].key > tempKey){
			arr[j].setKey(arr[j-gaps[k]].key);
			j -= gaps[k];
			jIndex.x = arr[j].x;
		}
		else {
			s2 = false;
			s1 = true;
			arr[j].setKey(tempKey);
			i++;
			iIndex.x = arr[i].x;
			jIndex.x = arr[i].x;
		}
	}
	else if(s3) {
		clearInterval(startTimer);
		makeAllButtonsInvisible();
		setTimeout(function(){stopAndClear();}, 3000);
	}
	
	paintAllComponents();
	
//	var gaps = [57, 23, 10, 4, 1];
//	var temp;
//	var i, j;
//	for(var k = 0; k < gaps.length; k++){
//		for(i = gaps[k]; i < arr.length; i++){
//			temp = arr[i].key;
//			for(j = i; j >= gaps[k] && arr[j-gaps[k]].key > temp; j -= gaps[k]){ 
//				arr[j].setKey(arr[j-gaps[k]].key);
//			}
//			arr[j].setKey(temp);
//		}
//	}
}

function swapKeys(a, b){
	tempKey = a.key;
	a.setKey(b.key);
	b.setKey(tempKey);
}

// makes certain buttons invisible to prevent the user from causing any errors.
function changeButtonVisibility(){
	if(!sorting){
		document.getElementById("buttons").style.visibility = "hidden";
		document.getElementById("buttons2").style.visibility = "visible";
	}
	else {
		document.getElementById("buttons").style.visibility = "visible";
		document.getElementById("buttons2").style.visibility = "hidden";
	}
}

function makeAllButtonsInvisible(){
	document.getElementById("buttons").style.visibility = "hidden";
	document.getElementById("buttons2").style.visibility = "hidden";
}

// pauses the algorithm or continues it. 
function pausePlay(){

	if(sorting){
		clearInterval(startTimer);
		sorting = false;
	}
	else{
		sorting = true;
		startTimer = setInterval(function(){shellSort();}, milSec);
	}
}

// resets everything. 
function stopButton(){
	sorting = true;
	stopAndClear();
}

// stops the timer and resets all variables to their initial settings. 
function stopAndClear(){
	clearInterval(startTimer);
	ctx.clearRect(0, 0, canv.width, canv.height);
	
	k = 0;
	i = 0;
    j = arr.length-1;
	maxKey = 1;
	sx = 553;
	arr.splice(0, arr.length);
	
	s0 = true;
	s1 = false;
	s2 = false;
	s3 = false;
	
	iIndex.visible = false;
	gapIndex.visible = false;
	jIndex.visible = false;

	changeButtonVisibility();
	sorting = false;
}
