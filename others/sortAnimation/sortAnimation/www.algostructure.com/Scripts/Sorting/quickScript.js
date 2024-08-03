/*
 *(c) 2014 by Maik Dreibholz
 */

"use strict";
var arr = []; // array with all keys
var i, j; // variables for sorting algorithm

var tempKey;

var v, t;
var left, right;

var stack = [];

var s1 = false;
var s2 = false;
var s2a = false;
var s2b = false;
var s3 = false;
var s4 = false;

var sorting = false;

var maxKey = 1;
var sx = 553;

var startTimer;
var milSec;

var canv = document.getElementById("paint");
var ctx = canv.getContext("2d");
ctx.font = "18px Serif";

var lIndex = new index("l", 20);
var iIndex = new index("i", 40);
var jIndex = new index("j", 60);
var rIndex = new index("r", 80);

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
	milSec = mil;
	
	i = 0;
    j = arr.length-1;
	
	stack.push(0);
	stack.push(arr.length-1);
	
	s1 = true;
	s2 = false;
	s2a = false;
	s2b = false;
	s3 = false;
	s4 = false;
	
	iIndex.x = arr[i].x;
	jIndex.x = arr[j].x;
	lIndex.x = arr[0].x;
	rIndex.x = arr[arr.length-1].x;
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
		jIndex.graphics();
		lIndex.graphics();
		rIndex.graphics();
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

    	// timer that calls the quickSort function every 2 milSec. 
		startTimer = setInterval(function(){quickSort();}, milSec);
		
		changeButtonVisibility();
		sorting = true;
	
}

//initiates the execution of the sorting algorithm.
function initSort(){
    if(arr.length > 1){

    	setup(300);
    	
    	iIndex.visible = true;
    	jIndex.visible = true;
    	lIndex.visible = true;
    	rIndex.visible = true;
    	
    	// timer that calls the quickSort function every 300 milSec. 
    	startTimer = setInterval(function(){quickSort();}, milSec);
    	
    	changeButtonVisibility();
    	sorting = true;
	}
}

// sorts all keys with quickSort.
function quickSort(){

	if(s2 || s3 || s4 || stack.length > 0){
		if(s1){
			right = stack.pop();	
			left = stack.pop();		
			j = right;					
			i = left - 1;				
			v = arr[j].key;					
			s1 = false;
			s2 = true;
			s2a = true;
			iIndex.x = arr[left].x;
			jIndex.x = arr[j].x;
			lIndex.x = arr[left].x;
			rIndex.x = arr[right].x;
		}
		else if(s2){
			if(s2a){
				i++;
				iIndex.x = arr[i].x;
				if(!(arr[i].key < v) || !(i < j)){
					s2a = false;
					s2b = true;
				}
			}
			else if(s2b){
				j--;
				jIndex.x = arr[j].x;
				if(!(arr[j].key > v) || !(i < j)){
					s2b = false;
				}
			}
			else if(i >= j){
				s2 = false;
				s3 = true;
			}
			else{
				swapKeys(arr[i], arr[j]);
				s2a = true;
			}
		}
		else if(s3){
			swapKeys(arr[i], arr[right]);
			s3 = false;
			s4 = true;
		}
		else if(s4){
			if ((i - 1 - left) <= (right - i - 1)) {
				if (right > i+1) {			
					stack.push(i+1);			
					stack.push(right);
				}
				if (left < i-1) {			
					stack.push(left);			
					stack.push(i-1);			
				}
			} 
			else {
				if (left < i-1) {			
					stack.push(left);			
					stack.push(i-1);			
				}
				if (right > i+1) {			
					stack.push(i+1);			
					stack.push(right);
				}
			}
			s4 = false;
			s1 = true;
		}
	}
	else {
		clearInterval(startTimer);
		makeAllButtonsInvisible();
		setTimeout(function(){stopAndClear();}, 3000);
	}

	paintAllComponents();
	
//	var i, j, t, v;
//	var left, right;
//	var stack = [];
//	stack.push(0);
//	stack.push(arr.length-1);
//	while (stack.length > 0) {
//		right = stack.pop();		
//		left = stack.pop();		
//		j = right;					
//		i = left - 1;				
//		v = arr[j].key;					
//		while (true) {
//			do {
//				i++;
//			} while (arr[i].key < v && i < j);
//			do {
//				j--;
//			} while (arr[j].key > v && i < j);
//			if (i >= j)
//				break;
//			swapKeys(arr[i], arr[j]);
//		}
//		swapKeys(arr[i], arr[right]);
//		if (left < i-1) {			
//			stack.push(left);			
//			stack.push(i-1);			
//		}
//		if (right > i+1) {			
//			stack.push(i+1);			
//			stack.push(right);
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
		startTimer = setInterval(function(){quickSort();}, milSec);
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
	
	i = 0;
    j = arr.length-1;
	maxKey = 1;
	sx = 553;
	arr.splice(0, arr.length);
	
	s1 = false;
	s2 = false;
	s2a = false;
	s2b = false;
	s3 = false;
	s4 = false;
	
	
	iIndex.visible = false;
	jIndex.visible = false;
	lIndex.visible = false;
	rIndex.visible = false;

	changeButtonVisibility();
	sorting = false;
}
