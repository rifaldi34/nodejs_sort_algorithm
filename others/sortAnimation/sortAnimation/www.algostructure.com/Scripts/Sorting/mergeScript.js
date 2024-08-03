/*
 *(c) 2014 by Maik Dreibholz
 */

"use strict";
var arr = []; // array with all keys

var tempKey;

var l, m, r;

var left, right, position;
var b = [];

var stack = [];

var s1 = false;
var s2 = false;
var s2a = false;
var s2b = false;
var s3 = false;

var sorting = false;

var mem1, mem2, mem3; // for pause/play button

var maxKey = 1;
var sx = 553;

var startTimer;
var milSec;

var canv = document.getElementById("paint");
var ctx = canv.getContext("2d");
ctx.font = "18px Serif";

var lIndex = new index("l", 60);
var mIndex = new index("m", 80);
var rIndex = new index("r", 60);

var indArr = []; //array with indices, representing key values. The ones below the rectangles

document.getElementById("buttons2").style.visibility = "hidden";

// regular key object with key value as parameter.
// setKey function should be used to change key's value for visual effects.
// graphics function draws rectangle with height according to the key's value.
function key(key){
    this.key = key;
    this.x = 0;
    this.bottom = 400;
    this.inset = 0;
    this.visible = true; // rectangles invisible when being merged
    
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
    	if(this.visible){
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
} 

//key object used for fast sorting.
//key's value between 1 and 99, random.
//graphics function draws rectangle with height according to the key's value.
function fastKey(){
	this.key = Math.ceil(Math.random()*99);
    this.x = 0;
    this.bottom = 400;
    this.visible = true;
    
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
	
	s1 = true;
	s2 = false;
	s2a = false;
	s2b = false;
	s3 = false;
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
		mIndex.graphics();
		lIndex.graphics();
		rIndex.graphics();
		if(sorting){
			for(var i = 0; i < indArr.length; i++){
				indArr[i].graphics();
			}
		}
		
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
		
		indexSetup(); // for key values below rectangles. 
		
		changeButtonVisibility();
		sorting = true;

		initMergeSort(0, arr.length-1);
		mergeSort();
}

//initiates the execution of the sorting algorithm.
function initSort(){
    if(arr.length > 1){

    	setup(300);
    	
    	mIndex.visible = true;
    	lIndex.visible = true;
    	rIndex.visible = true;
    	
    	indexSetup();
    	
    	changeButtonVisibility();
    	sorting = true;
    	
    	initMergeSort(0, arr.length-1);
    	mergeSort();
    	

	}
}

// inserts all needed boundaries into the array/stack
function initMergeSort(l, r){
	if (l < r) { 		
		var m = Math.floor((l + r) / 2);
		initMergeSort(l, m);
		initMergeSort(m + 1, r); 
		stack.splice(0, 0, l, m, r);
	}
}

// gets boundaries from stack and executes merge algorithm.
function mergeSort(){
	if(sorting){
		r = stack.pop();
		m = stack.pop();
		l = stack.pop();
		lIndex.x = arr[l].x;
		mIndex.x = arr[m].x;
		rIndex.x = arr[r].x;
		for(var i = l; i <= r; i++){ // all indices in between boundaries 
			indArr[i].name = arr[i].key; // name gets updated.
			indArr[i].visible = true; // index visible
			arr[i].visible = false; // rectangle invisible
		}
		startTimer = setInterval(function(){merge();}, milSec);
	}
		
}

//sorts all keys with mergeSort.
function merge() {
	if(s1){
		left = l;
		right = m + 1;
		position = left;
		
		for(var i = 0; i < arr.length; i++){
			b[i] = new key(arr[i].key);
		}
		
		s1 = false;
		s2 = true;
		paintAllComponents();
	}
	else if(s2){
		if(left <= m || right <= r){
			if(left <= m && right <= r){
				if (b[left].key <= b[right].key) {
					arr[position].setKey(b[left].key);
					indArr[left].visible = false; // index invisible
					left++;
				} else {
					arr[position].setKey(b[right].key);
					indArr[right].visible = false; // index invisible
					right++;
				}
			}
			else if(left <= m){
				arr[position].setKey(b[left].key);
				indArr[left].visible = false; // index invisible
				left++;
			}
			else if(right <= r){
				arr[position].setKey(b[right].key);
				indArr[right].visible = false; // index invisible
				right++;
			}
			arr[position].visible = true; // rectangle visible again after inserted at correct position
			position++;
		}
		else {
			s2 = false;
			s3 = true;
		}
		paintAllComponents();
	}
	else if (s3){
		if(stack.length >= 3){
			clearInterval(startTimer);
			for(var i = l; i <= r; i++){
				indArr[i].visible = false;
			}
			s3 = false;
			s1 = true;
			mergeSort();
		}
		else {
			clearInterval(startTimer);
			makeAllButtonsInvisible();
			setTimeout(function(){stopAndClear();}, 3000);
		}
	}
}
	
//function mergeSort(l, r){
//	if (l < r) { 						
//		var m = (l + r) / 2;
//		mergesort(l, m);			
//		mergesort(m + 1, r); 	
//		merge(l, m, r); 		
//	}
//}
//function merge(l, m, r){
//	var left = l;
//	var right = m + 1;
//	var position = left;
//	var b = [];
//	
//	for(var i = 0; i < arr.length; i++){
//		b[i] = new key(arr[i].key);
//	}
//	while (left <= m || right <= r) {
//		if(left <= m && right <= r){
//			if (b[left].key <= b[right].key) {
//				arr[position].setKey(b[left].key);
//				left++;
//			} else {
//				arr[position].setKey(b[right].key);
//				right++;
//			}
//		}
//		else if(left <= m){
//			arr[position].setKey(b[left].key);
//			left++;
//		}
//		else if(right <= r){
//			arr[position].setKey(b[right].key);
//			right++;
//		}
//		position++;
//	}
//}

function indexSetup(){
	for(var i = 0; i < arr.length; i++){
		var height;
		if(i % 2 == 0){
			height = 20;
		}
		else {
			height = 40;
		}
		indArr[i] = new index(arr[i].key, height);
		indArr[i].x = arr[i].x;
	}
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
		if(s1)
			mem1 = true;
		else if(s2)
			mem2 = true;
		else if(s3)
			mem3 = true;
		
		sorting = false;
		s1 = false;
		s2 = false;
		s3 = false;
	}
	else{
		if(mem1)
			s1 = true;
		else if(mem2)
			s2 = true;
		else if(mem3)
			s3 = true;
		
		sorting = true;
		mem1 = false;
		mem2 = false;
		mem3 = false;
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
	
	maxKey = 1;
	sx = 553;
	arr.splice(0, arr.length);
	stack.splice(0, stack.length);
	
	s1 = false;
	s2 = false;
	s2a = false;
	s2b = false;
	s3 = false;
	
	mem1 = false;
	mem2 = false;
	mem3 = false;
	
	mIndex.visible = false;
	lIndex.visible = false;
	rIndex.visible = false;

	changeButtonVisibility();
	sorting = false;
}