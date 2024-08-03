/*
 *(c) 2014 by Maik Dreibholz
 */

"use strict";
var arr = []; // array with all keys
var i, j, n; // variables for sorting algorithm
var item;
var tempKey;
var temp;
var temp2;

var s1 = false;
var s2 = false;
var s3 = false;
var s4 = false;
var s5 = false;
var s6 = false;
var s6aa = false;
var s6a = false;
var s6b = false;
var s6c = false;
var s6d = false;

var sorting = false;

var maxKey = 1;
var sx = 553;

var startTimer;
var milSec;

var canv = document.getElementById("paint");
var ctx = canv.getContext("2d");
ctx.font = "18px Serif";

var nIndex = new index("n", 20);
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
	i = 0;
    n = 0;
    j = arr.length-1;
	milSec = mil;
	s1 = true;
	s2 = false;
	s3 = false;
	s4 = false;
	s5 = false;
	s6 = false;
	s6aa = false;
	s6a = false;
	s6b = false;
	s6c = false;
	s6d = false;
	iIndex.x = arr[i].x;
	nIndex.x = arr[n].x;
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
		nIndex.graphics();
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

    	// timer that calls the cycleSort function every 2 milSec. 
		startTimer = setInterval(function(){cycleSort();}, milSec);
		
		changeButtonVisibility();
		sorting = true;
	
}

//initiates the execution of the sorting algorithm.
function initSort(){
    if(arr.length > 1){

    	setup(150);
    	
    	iIndex.visible = true;
    	nIndex.visible = true;
    	jIndex.visible = true;
    	
    	// timer that calls the cycleSort function every 150 milSec. 
    	startTimer = setInterval(function(){cycleSort();}, milSec);
    	
    	changeButtonVisibility();
    	sorting = true;
	}
}

// sorts all keys with cycleSort.
function cycleSort(){

	if(n < arr.length-1){
		if(s1){
			item = arr[n].key;
			i = n;
			s1 = false;
			s2 = true;
			j = n+1;
		}
		else if(s2){
			if(j < arr.length){
				if(arr[j].key < item){
					i++;
				}
				j++;
			}
			else {
				s2 = false;
				s3 = true;
			}
		}
		else if (s3){
			if(i == n){
				s3 = false;
				s1 = true;
				n++;
			}
			else {
				s3 = false;
				s4 = true;
			}
		}
		else if (s4){
			if(item == arr[i].key){
				i++;
			}
			else {
				s4 = false;
				s5 = true;
			}
		}
		else if (s5){
			if(item != arr[i].key){
				temp = arr[i].key;
				arr[i].setKey(item);
				item = temp;
			}
			s5 = false;
			s6 = true;
			s6aa = true;
		}
		else if (s6){
			if(s6aa){
				if(i != n){
					s6aa = false;
					s6a = true;
				}
				else {
					s6aa = false;
					s6 = false;
					s1 = true;
					n++;
				}
			}
			else if(s6a){
				i = n;
				s6a = false;
				s6b = true;
				j = n+1;
			}
			else if(s6b){
				if(j < arr.length){
					if(arr[j].key < item){
						i++;
					}
					j++;
				}
				else {
					s6b = false;
					s6c = true;
				}
			}
			else if(s6c){
				if(item == arr[i].key){
					i++;
				}
				else {
					s6c = false;
					s6d = true;
				}
			}
			else if (s6d){
				if(item != arr[i].key){
					temp2 = arr[i].key;
					arr[i].setKey(item);
					item = temp2;
				}
				s6d = false;
				s6aa = true;
			}
		}
		iIndex.x = arr[i].x;
		nIndex.x = arr[n].x;
		jIndex.x = arr[j].x;
	}
	else {
		clearInterval(startTimer);
		makeAllButtonsInvisible();
		setTimeout(function(){stopAndClear();}, 3000);
	}

	paintAllComponents();
	
//	for(n = 0; n < arr.length-1; n++){
//		item = arr[n].key;
//		j = n;
//		for(i = n+1; i < arr.length; i++)
//			if(arr[i].key < item)
//				j++;
//		if(j == n)
//			continue;
//		while(item == arr[j].key)
//			j++;
//		if(item != arr[j].key){
//			temp = arr[j].key;
//			arr[j].setKey(item);
//			item = temp;
//		}
//		while(j != n){
//			j = n;
//			for(i = n+1; i < arr.length; i++)
//				if(arr[i].key < item)
//					j++;
//			while(item == arr[j].key)
//				j++;
//			if(item != arr[j].key){
//				temp2 = arr[j].key;
//				arr[j].setKey(item);
//				item = temp2;
//			}
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
		startTimer = setInterval(function(){cycleSort();}, milSec);
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
    n = 0;
    j = arr.length-1;
	maxKey = 1;
	sx = 553;
	arr.splice(0, arr.length);
	
	s1 = false;
	s2 = false;
	s3 = false;
	s4 = false;
	s5 = false;
	s6 = false;
	s6aa = false;
	s6a = false;
	s6b = false;
	s6c = false;
	s6d = false;
	
	
	iIndex.visible = false;
	nIndex.visible = false;
	jIndex.visible = false;

	changeButtonVisibility();
	sorting = false;
}
