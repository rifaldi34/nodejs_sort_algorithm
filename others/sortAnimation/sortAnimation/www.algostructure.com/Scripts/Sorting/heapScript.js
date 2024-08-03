/*
 *(c) 2014 by Maik Dreibholz
 */
"use strict";
var arr = []; // array with all keys
var i, j; // variables for sorting algorithm
var width = 1108;

var ind;
var m;

var last;

var s1 = false;
var s2 = false;
var s3 = false;
var s4 = false;

var sorting = false;

var maxKey = 1;

var startTimer;
var milSec;

var canv = document.getElementById("paint");
var ctx = canv.getContext("2d");
ctx.font="bold 20px Serif";

var iIndex = new index(1);
var iiIndex = new index(2);

document.getElementById("buttons2").style.visibility = "hidden";

// regular key object with key value as parameter.
// setKey function should be used to change key's value for visual effects.
// graphics function draws rectangle with height according to the key's value.
function key(key){
    this.key = key;
    
    this.x = 600;
    this.y = 100;
    this.radius = 15;
    this.bottom = 500;
    this.insetX;
    this.insetY = 6;
    this.gap;
    
    this.sorted = false;
    
    this.father;
    this.leftson;
    this.rightson;
    
    this.edge;
    
    this.setKey = setKey;
    this.graphics = graphics;
    
    this.setKey(this.key);
    
    function setKey(value){
    	this.key = value;
    	if(this.key > 9){
        	if(this.key > 99){
        		this.key = 99;	
        	}
        	this.insetX = 9;
        }
        else {
        	if(this.key < 1){
    			this.key = 1;
        	}
    		this.insetX = 4;
        }
    }
    
    function graphics(){
    	

    	var myGradient = ctx.createLinearGradient(this.x-this.radius, this.x-this.radius, this.x+this.radius, this.x-this.radius);
    	myGradient.addColorStop(0,"#BA0000");
    	myGradient.addColorStop(1,"#560000");
    	ctx.fillStyle = myGradient;
    	
    	if(!this.sorted){
    		ctx.fillRect(this.x-this.radius, this.y-this.radius, this.radius*2, this.radius*2);
        	ctx.fillStyle = "black";
    	}
    	else {
    		ctx.fillStyle = "white";
    	}
    	ctx.fillText(this.key, this.x-this.insetX, this.y+this.insetY);
    }
} 

// index to show what exactly the algorithm is currently doing
// graphics function draws the name at the given location, 
// however, not when user selected fast sorting.
function index(type){
	this.type = type;
	this.y = 50;
	this.x = 0;
	this.size = 30;
	this.visible = false;
	
	this.graphics = graphics;
	
	function graphics(){
		if(this.visible && this.type != 0){
			
			if(this.type == 1){
				ctx.strokeStyle = "blue";
			}
			else if(this.type == 2){
				ctx.strokeStyle = "white";
			}
			
			ctx.strokeRect(this.x-15, this.y-15, this.size, this.size);

		}
	}
}

function edge(a){
	this.a = a;
	this.x1;
	this.x2;
	this.x3;
	this.x4;
	this.y1;
	this.y2;
	this.y3;
	this.y4;

	this.updateEdge = updateEdge;
	this.graphics = graphics;
	
	this.updateEdge();
	
	function updateEdge(){
		if(this.a.leftson != undefined){
			this.x1 = this.a.x;
			this.y1 = this.a.y + this.a.radius;
			this.x2 = this.a.leftson.x;
			this.y2 = this.a.leftson.y - this.a.radius;
		}
		if(this.a.rightson != undefined){
			this.x3 = this.a.x;
			this.y3 = this.a.y + this.a.radius;
			this.x4 = this.a.rightson.x;
			this.y4 = this.a.rightson.y - this.a.radius;
		}
		
	}
	
	function graphics(){
	    ctx.strokeStyle = "gray";
	    if(a.leftson != undefined && !a.leftson.sorted){
	    	ctx.beginPath();
		    ctx.moveTo(this.x1, this.y1);
		    ctx.lineTo(this.x2, this.y2);
		    ctx.stroke();
	    }
	    if(a.rightson != undefined && !a.rightson.sorted){
	    	ctx.beginPath();
		    ctx.moveTo(this.x3, this.y3);
		    ctx.lineTo(this.x4, this.y4);
		    ctx.stroke();
	    }
	    
	}
}

// adds a new key to the array with a value of the input field.
function add(){
	if(arr.length < 63){
		var t = Math.floor(Number(document.getElementById("inputField").value));
		t = t || 1;
		
        var x = new key(t);
            
        arr[arr.length] = x;
        updateLocation(20);
    }
	document.getElementById("inputField").value = "";
}

// adds 10 keys with a random value to the array.
function addRandom(){
	var start = arr.length;
	var end = start + 10;
	if (end > 63) {
		end = 63;
	}
	if (start < 63) {
		for ( var index = start; index < end; index++) {
			var x = new key(Math.ceil(Math.random() * 99));

			arr[index] = x;
			updateLocation(20);
		}
	}
}

function setup(mil){
	i = Math.round((arr.length-1)/2)-1;
	milSec = mil;
	
	s1 = true;
	s2 = false;
	s3 = true;
	s4 = true;
	
	iIndex.visible = true;
	iiIndex.visible = true;
}

//Called when new key is added.
//Sets x-cord and y-cord according to position in arr.
function updateLocation(width){
	for(var i = 0; i < arr.length; i++){
		arr[i].x = 100+i*width*2;
		if(i >= 50){
			arr[i].x = 100+(i-50)*width*2;
			arr[i].y = 200;
		}
		else if(i >= 25){
			arr[i].x = 100+(i-25)*width*2;
			arr[i].y = 150;
		}
	}
	paintAllComponents();
}

// paints all components.
function paintAllComponents(){
    ctx.clearRect(0, 0, canv.width, canv.height);
    for(var index = 0; index < arr.length; index++){
    	arr[index].graphics();
    	if(arr[index].edge != undefined){
    		arr[index].edge.graphics();
    	}
    }

    if(sorting){
    	iIndex.graphics();
    	iiIndex.graphics();
    }
}

//initiates the execution of the sorting algorithm.
function initSort(){
    if(arr.length > 1){
    	try{

    	setup(500);
    	
    	setRelations();
    	
    	changeButtonVisibility();
    	sorting = true;
    	
    	last = arr[arr.length-1].y;
    	// timer that calls the heapSort function every 500 milSec. 
    	startTimer = setInterval(function(){heapSort();}, milSec);
    	
    	} catch (error){
    		alert(error + "\n" + error.stack);
    	}
	}
}

//Sets the gaps and all relations (father, left son, right son) for every key of array arr. 
//The gap is important for their x-cords. A father's gap is always 
//twice as high as his children's gaps. 
function setRelations(){
	arr[0].gap = Math.round(width/2);
	for(var i = 0; i < arr.length; i++){
		if((i*2+1) < arr.length)
			arr[i].leftson = arr[i*2+1];
		if((i*2+2) < arr.length)
			arr[i].rightson = arr[i*2+2];
		if(i > 0)
			arr[i].father = arr[Math.ceil(i/2)-1];
		else
			arr[0].father = arr[0];
		arr[i].gap = arr[i].father.gap/2;
	}
	displayHeap();
}

//Sets x-cords, y-cords and edges for every key of array arr. 
//Y-cord starts at 200 at root and increases by 50 for every level.
//The x-cord of a key is father's x-cord minus father's gap for left son and
//father's x-cord plus father's gap for right son.
function displayHeap(){
	for(var i = 0; i < arr.length; i++){
		if(arr[i].father == arr[i]){
			arr[i].x = width/2;
			arr[i].y = 100;
		}
		else{
			if(arr[i] == arr[i].father.leftson)
				arr[i].x = arr[i].father.x - arr[i].father.gap;
			else if(arr[i] == arr[i].father.rightson)
				arr[i].x = arr[i].father.x + arr[i].father.gap;				
			
			arr[i].y = arr[i].father.y + 50;
		}
	}
	
	for(var ii = 0; ii < arr.length; ii++)
		arr[ii].edge = new edge(arr[ii]);
}

function heapSort() {
	if(s1){ // first for loop
		if(i >= 0){	// condition in first for loop
			if(s3){ // initialize parameters 
				ind = i;
				m = arr.length-1;
				iIndex.x = arr[i].x;
				iIndex.y = arr[i].y;
				iiIndex.x = arr[ind].x;
				iiIndex.y = arr[ind].y;
				paintAllComponents();
				s3 = false;
			}
			else if(2*ind+1 <= m){ // start heapify
				j = 2*ind+1; 
				if (j < m) { 
					if (arr[j].key < arr[j+1].key){
						j++; 
					}
				}
				if (arr[ind].key < arr[j].key) {
					swapKeys(arr[ind], arr[j]);
					ind = j;
					iiIndex.x = arr[ind].x;
					iiIndex.y = arr[ind].y;
					paintAllComponents();
				} 
				else {
					ind = m;
				} // end heapify
			}
			else { // one iteration is done
				i--;
				s3 = true;
			} 
		} 
		else{ // loop is done
			i = arr.length-1;
			iIndex.x = arr[0].x;
			iIndex.y = arr[0].y;
			paintAllComponents();
			s1 = false;
			s2 = true;
			s4 = true;
		}
	}
	else if(s2){ // second for loop
		if(i >= 0){ // condition in second for loop
			if(s4){ // swap keys, remove the sorted key and initialize parameters 
				swapKeys(arr[i], arr[0]);
				arr[i].sorted = true;
				removeSortedKey(i, arr.length-1, last);
				ind = 0;
				m = i-1;
				iiIndex.x = arr[ind].x;
				iiIndex.y = arr[ind].y;
				paintAllComponents();
				s4 = false;
			}
			else if(2*ind+1 <= m){ // start heapify
				j = 2*ind+1; 
				if (j < m) { 
					if (arr[j].key < arr[j+1].key){
						j++; 
					}
				}
				if (arr[ind].key < arr[j].key) {
					swapKeys(arr[ind], arr[j]);
					ind = j;
					iiIndex.x = arr[ind].x;
					iiIndex.y = arr[ind].y;
					paintAllComponents();
				} 
				else {
					ind = m;
				} // end heapify
			}
			else { // one iteration is done
				i--;
				s4 = true;
			} 
		}
		else { // second loop done and sorted
			clearInterval(startTimer);
			makeAllButtonsInvisible();
			setTimeout(function(){stopAndClear();}, 3000);
		}
	}
}

// Doesn't actually remove a key from heap, just changes display of heap. 
// Sorted Key is aligned to the right bottom corner.
// 25 keys per row.
function removeSortedKey(i, n, last){ 
	if(n-i < 25){
		arr[i].x = 100+(25-(n-i))*40;
		arr[i].y = last+50;
	}
	else if(n-i < 50){
		arr[i].x = 100+(25-(n-i-25))*40;
		arr[i].y = last;
	}
	else{
		arr[i].x = 100+(25-(n-i-50))*40;
		arr[i].y = last-50;
	}
}

function swapKeys(a, b){
	var tempKey = a.key;
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
		startTimer = setInterval(function(){heapSort();}, milSec);
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
	maxKey = 1;
	arr.splice(0, arr.length);
	
	s1 = true;
	s2 = false;
	s3 = true;
	s4 = true;
	
	iIndex.visible = false;
	iiIndex.visible = false;

	changeButtonVisibility();
	sorting = false;
}

//function heapSort() {
//	var last = arr[arr.length-1].y;
//	for (var i = Math.floor(arr.length/2); i >= 0; i--){	
//		heapify(i, arr.length-1);	
//	}
//	for (var i = arr.length-1; i >= 0; i--) { 		
//		swapKeys(arr[i], arr[0]);
//		arr[i].sorted = true;
//		removeSortedKey(i, arr.length-1, last);
//		heapify(0, i - 1);
//	}
//	paintAllComponents();
//}
//function heapify(i, m) {
//	var j;
//	while (2*i+1 <= m) {
//			j = 2*i+1; 
//		if (j < m) { 
//			if (arr[j].key < arr[j+1].key)
//				j++; 
//		}
//		if (arr[i].key < arr[j].key) {
//			swapKeys(arr[i], arr[j]);
//			paintAllComponents();
//			i = j;
//		} else
//			i = m;
//	}
//}