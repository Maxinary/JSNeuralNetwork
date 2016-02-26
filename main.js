"use strict";

let draw = true;
var canvas = document.getElementById("drawing");
canvas.width = document.body.clientWidth;
canvas.height = document.body.clientHeight;
var body = document.getElementsByTagName("body");
canvas.addEventListener('click', function(event) {
  if(draw){
    for(var i=0;i<neurons.length;i++){
      if(neurons[i].clicked(event.pageX, event.pageY)){
        neurons[i].output = !neurons[i].output;
        neurons[i].drawCircle();
      }
    }
  }
}, false);

//right click only draws that
canvas.addEventListener('contextmenu', function(event) {
  for(var i=0;i<neurons.length;i++){
    if(neurons[i].clicked(event.pageX, event.pageY)){
      event.preventDefault();
      draw = !draw;
      ctx.clearRect(0,0,canvas.width,canvas.height);
      neurons[i].drawLines();
      neurons[i].drawCircle();
      for(var j=0;j<neurons.length;j++){
        if(neurons[i].inputs[j] !== 0){
          neurons[j].drawCircle();
        }
      }
      return false;
    }
  }
}, false);

var ctx = canvas.getContext("2d");

var neurons = [];

function distance(x1, y1, x2, y2){
  return Math.sqrt(Math.pow(x1-x2,2)+Math.pow(y1-y2,2));
}

var Comparators = {
    LT : "LT",
    GT : "GT"
};

class Tuple {
  constructor(x,y){
    this.x = x;
    this.y = y;
  }
}

class Neuron {
  constructor(arrLocation,//integer,
              process,    //enum to be put into func func
              position,   //Tuple
              radius) {   //radius
    this.radius = radius;
    this.process = chooseF(process);
    this.name = process;
    this.output = false;
    this.inputs = [];//every tick read all input multipliers (Which correspond to neurons)
    for(var i=0; i<neurons.length; i++){
      this.inputs.push(0);
    }
    this.arrLocation = arrLocation;
    this.location = position;
  }
  
  registerInput(input,value){
    this.inputs[input] = value;
  }
  
  update(neuronstructure){
    var invalues = [];
    for(var i=0;i<this.inputs.length;i++){
      invalues[i] = neuronstructure[i].output * this.inputs[i];
    }
    this.output = this.process(invalues);
    while(this.inputs.length<neurons.length){
      this.inputs.push(0);
    }
  }
  
  drawCircle(){
    if(this.output){
      ctx.fillStyle = "#FFFFFF";
    }else{
      ctx.fillStyle = "#000000";
    }
    ctx.beginPath();
    ctx.arc(this.location.x,this.location.y,40,0,2*Math.PI, true);
    ctx.stroke();
    ctx.fill();
  }
  
  drawLines(){
    for(var i=0;i<neurons.length;i++){
      if(this.inputs[i]!==0 && 
        distance(neurons[i].location.x, neurons[i].location.y,
        this.location.x, this.location.y)>0
      ){
        var angle = Math.atan2(
          this.location.y-neurons[i].location.y,
          this.location.x-neurons[i].location.x
        );
        var c = new Tuple(
          this.location.x - this.radius*Math.cos(angle),
          this.location.y - this.radius*Math.sin(angle)
         );

        ctx.beginPath();
        ctx.moveTo(          
          neurons[i].location.x, 
          neurons[i].location.y
        );
        ctx.lineWidth = 1.5+(this.inputs[i]-0.75)*6;
        ctx.lineTo(
            c.x,
            c.y
        );
        ctx.stroke();
        //arrow
        ctx.beginPath();
        ctx.lineWidth = 5;
        ctx.moveTo(          
          c.x, 
          c.y
        );
        ctx.lineTo(
            c.x + 10*Math.cos(angle+5*Math.PI/6),
            c.y + 10*Math.sin(angle+5*Math.PI/6)
        );
        ctx.lineTo(
            c.x + 10*Math.cos(angle-5*Math.PI/6),
            c.y + 10*Math.sin(angle-5*Math.PI/6)
        );
        ctx.lineTo(
            c.x,
            c.y
        );
        ctx.stroke();
      }
    }
  }
  
  clicked(x, y){
    if(distance(this.location.x, this.location.y, x, y) <= this.radius){
      return true;
    }else{
      return false;
    }
  }
}

//maybe draw white if output=true, black else
ctx.lineWidth = 5;
ctx.strokeStyle = "#000000";

var chooseF = function(enumVal){
  if(enumVal == Comparators.LT){
    return function(lotsodata){
      var ssum = 0;
      for(var i=0;i<lotsodata.length;i++){
        ssum+=lotsodata[i];
      }
      if(ssum<1){
        return true;
      }else{
        return false;
      }
    };
  } else {//GT and
  return function(lotsodata){
      var ssum = 0;
      for(var i=0;i<lotsodata.length;i++){
        ssum+=lotsodata[i];
      }
      if(ssum>1){
        return true;
      }else{
        return false;
      }
    };
  }
};

//inputs
neurons.push(new Neuron(neurons.length, Comparators.GT, new Tuple(100,200), 40));
neurons.push(new Neuron(neurons.length, Comparators.GT, new Tuple(100,300), 40));

//xors
neurons.push(new Neuron(neurons.length, Comparators.LT, new Tuple(500,100), 40));
neurons.push(new Neuron(neurons.length, Comparators.GT, new Tuple(500,200), 40));
neurons.push(new Neuron(neurons.length, Comparators.GT, new Tuple(900,150), 40));

//NOR
neurons.push(new Neuron(neurons.length, Comparators.LT, new Tuple(500,300), 40));

//NOT
neurons.push(new Neuron(neurons.length, Comparators.LT, new Tuple(500,400), 40));

//self sufficient
neurons[0].registerInput(0,1.1);

neurons[1].registerInput(1,1.1);

//NAND
neurons[2].registerInput(0,0.75);
neurons[2].registerInput(1,0.75);

//OR
neurons[3].registerInput(0,1.1);
neurons[3].registerInput(1,1.1);

//AND
neurons[4].registerInput(2,0.75);
neurons[4].registerInput(3,0.75);

//NOR
neurons[5].registerInput(0,1.1);
neurons[5].registerInput(1,1.1);

//NOT
neurons[6].registerInput(1,1.1);


var drawStuff = function(){
  if(draw){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    var cneurons = JSON.parse(JSON.stringify(neurons));
    
    for(var i=0;i<neurons.length;i++){
      neurons[i].update(cneurons);
      neurons[i].drawLines();
    }
    
    for(var i=0;i<neurons.length;i++){
        neurons[i].drawCircle();
    }
  }
};

setInterval(drawStuff, 500);
