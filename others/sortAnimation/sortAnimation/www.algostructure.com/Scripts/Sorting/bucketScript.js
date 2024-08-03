/*
 *(c) 2014 by Maik Dreibholz
 */
"use strict";
var arr = []; // array with all keys
var i, j; // variables for sorting algorithm
var tempKey;

var digits = [];

var s1 = false;
var s2 = false;

var sorting = false;

var step1 = true;
var sortingBreak = false;

var maxKey = 1;
var sx = 553;

var startTimer;
var milSec;

var canv = document.getElementById("paint");
var ctx = canv.getContext("2d");
ctx.font = "18px Serif";

var iIndex = new index("i", 25);

document.getElementById("buttons2").style.visibility = "hidden";

for(var i = 0; i < 10; i++){		// sets up the digit array.
	digits[i] = new digit(i*10);
	digits[i].x = 200+80*i;
}
// regular key object with key value as parameter.
// setKey function should be used to change key's value for visual effects.
// graphics function draws rectangle with height according to the key's value.
function key(key){
    this.key = key;
    this.x = 0;
    this.y = 50;
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
    	ctx.fillStyle = "white";
    	ctx.fillText(this.key, this.x-this.inset, this.y);
    }
} 

// index to show what exactly the algorithm is currently doing
// graphics function draws the name at the given location, 
// however, not when user selected fast sorting.
function index(name, height){
	this.name = name;
	this.height = height;
	this.y = 50;
	this.x = 0;
	this.visible = false;
	
	this.graphics = graphics;
	
	function graphics(){
		if(this.visible){
			ctx.fillStyle = "white";
	    	ctx.fillText(this.name, this.x, this.y+this.height);
		}
	}
}

function digit(dig){
	this.dig = dig;
	this.inset = 25;
	this.y = 125;
	this.x;
	this.digList = [];

	this.graphics = graphics;
	
	if(this.dig == 0){
		this.inset = 15;
	}
	
	function graphics(){
	    ctx.fillStyle = "white";

	    ctx.fillText(this.dig + " - " + Number(this.dig+9), this.x-this.inset, this.y);
	    	
	    if(this.digList.length > 0){
	    	for(var i = 0; i < this.digList.length; i++){
	       		ctx.fillText(this.digList[i].key, this.x-this.digList[i].inset, this.y+50+20*i);
	       	}
	    }
	    ctx.fillStyle = "gray";
		ctx.fillRect(this.x+40, this.y-25, 3, 125);
		ctx.fillRect(this.x-40, this.y-25, 3, 125);
	}
}

// adds a new key to the array with a value of the input field.
function add(){
	if(arr.length < 20 && !sorting){
		var t = Math.floor(Number(document.getElementById("inputField").value));
		t = t || 1;
		
        var x = new key(t);
        check(x);
            
        arr[arr.length] = x;
        sx -= 21;
        updateLocation(40);
    }
	document.getElementById("inputField").value = "";
}

// adds 10 keys with a random value to the array.
function addRandom(){
	var start = arr.length;
	var end = start + 10;
	if (end > 20) {
		end = 20;
	}
	if (start < 20) {
		for ( var index = start; index < end; index++) {
			var x = new key(Math.ceil(Math.random() * 99));
			check(x);

			arr[index] = x;
			sx -= 21;
			updateLocation(40);
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
	i = -1;
	j = 1;
	milSec = mil;
	
	s1 = true;
	s2 = false;
	
	iIndex.visible = false;
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

    if(sorting){
    	iIndex.graphics();
    	for(var i = 0; i < 10; i++){
    		digits[i].graphics();
    	}
    }
}

//initiates the execution of the sorting algorithm.
function initSort(){
    if(arr.length > 1){

    	setup(300);
    	
    	changeButtonVisibility();
    	sorting = true;
    	
    	// timer that calls the bucketSort function every 300 milSec. 
    	startTimer = setInterval(function(){bucketSort();}, milSec);
	}
}

// sorts all keys with bucketSort.
function bucketSort(){	
	if(i < 0){
		i++;
		updateLocation(40);
		iIndex.visible = true;
	}
	else if(i < arr.length){
		var j = Math.floor(getDigit(1, arr[i].key));
		digits[j].digList.push(arr[i]);
		iIndex.x = arr[i].x;
		i++;
		updateLocation(40);
	}
	else {
		step1 = false;
		sortingBreak = true;
		iIndex.x = arr[1].x;
		clearInterval(startTimer);
		updateLocation(40);
		setTimeout(function(){saveChanges();}, 1000);
	}
}

//saves newly arranged keys in arr.
function saveChanges(){
	var counter = 0;
	for(var i = 0; i < 10; i++){		
		for(var j = 0; j < digits[i].digList.length; j++){
			arr[counter] = digits[i].digList[j];
			counter++;
		}
	}
	updateLocation(40);
	sortingBreak = false;
	startTimer = setInterval(function(){insertionSort();}, milSec);
}

// Method gets called after first part of bucketSort is done. 
// Once the keys are put into the buckets they get sorted via the insertionSort algorithm.
function insertionSort() {
	try{
		if (j < arr.length){
			if(s1){
				tempKey = arr[j].key;
				i = j - 1;
				iIndex.x = arr[j].x;
				s1 = false;
				s2 = true;
			}
			if(s2){
				if ((i >= 0) && (arr[i].key > tempKey)) {	
					arr[i + 1].setKey(arr[i].key);
					iIndex.x = arr[i].x;
					i--;
				}
				else {
					arr[i + 1].setKey(tempKey);
					j++;
					s2 = false;
					s1 = true;
					if(j < arr.length){
						iIndex.x = arr[j].x;
					}
				}
			}
			updateLocation(40);
		}
		else {
			clearInterval(startTimer);
			makeAllButtonsInvisible();
			setTimeout(function(){stopAndClear();}, 3000);
		}
	} catch (error){
		alert(error);
		alert(j);
	}
	
}

//Returns a specified digit of a given key.
function getDigit(pos, key) {
	if (pos == 0)
		return key % 10;
	else
		return (key / (pos * 10)) % 10;
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
	if(!sortingBreak){
		if(sorting){
			clearInterval(startTimer);
			sorting = false;
		}
		else{
			if(step1){
				sorting = true;
				startTimer = setInterval(function(){bucketSort();}, milSec);
			}
			else{
				sorting = true;
				startTimer = setInterval(function(){insertionSort();}, milSec);
			}
		}
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
	j = 1;
	maxKey = 1;
	sx = 553;
	arr.splice(0, arr.length);
	
	s1 = true;
	s2 = false;
	
	step1 = true;
	sortingBreak = false;
	
	iIndex.visible = false;
	
	digits.splice(0, digits.length);
	
	for(var i = 0; i < 10; i++){		// sets up the digit array.
		digits[i] = new digit(i*10);
		digits[i].x = 200+80*i;
	}

	changeButtonVisibility();
	sorting = false;
}
