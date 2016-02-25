"use strict";

var canvas = document.getElementById("drawing");
canvas.width = document.body.clientWidth;
canvas.height = document.body.clientHeight;
var ctx = canvas.getContext("2d");

var neurons = [];

class Tuple {
  constructor(x,y){
    this.x = x;
    this.y = y;
  }
}

class Neuron {
  constructor(arrLocation,//integer,
              process,    //boolean function taking an array
              position) { //Tuple
    this.process = process;
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
  
  draw(){
    if(this.output){
      ctx.fillStyle = "#FFFFFF";
    }else{
      ctx.fillStyle = "#000000";
    }
    ctx.beginPath();
    ctx.arc(this.location.x,this.location.y,40,0,2*Math.PI, true);
    ctx.stroke();
    ctx.fill();
    for(var i=0;i<neurons.length;i++){
      if(this.inputs[i]!=0){
        ctx.beginPath();
        ctx.moveTo(
          this.location.x,
          this.location.y
        );
        ctx.lineTo(
          neurons[i].location.x, 
          neurons[i].location.y
        );
        ctx.stroke();
      }
    }
  }
}

//make a small test of neurons on canvas
//maybe draw white if output=true, black else

ctx.lineWidth = 5;
ctx.strokeStyle = "#000000";

function sum(lotsodata){
  var ssum = 0;
  for(var i=0;i<lotsodata.length;i++){
    ssum+=lotsodata[i];
  }
  if(ssum>1/3){
    return true;
  }else{
    return false;
  }
}

neurons.push(new Neuron(neurons.length, sum, new Tuple(100,100)));
neurons.push(new Neuron(neurons.length, sum, new Tuple(100,200)));
neurons.push(new Neuron(neurons.length, sum, new Tuple(300,100)));
neurons.push(new Neuron(neurons.length, sum, new Tuple(300,200)));


//self sufficient
neurons[0].registerInput(0,1);

neurons[1].registerInput(1,1);

//AND gate
neurons[2].registerInput(0,0.2);
neurons[2].registerInput(1,0.2);

//OR gate
neurons[3].registerInput(0,0.5);
neurons[3].registerInput(1,0.5);


var drawStuff = function(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  var cneurons = neurons.slice();
  for(var i=0;i<neurons.length;i++){
    neurons[i].update(cneurons);
    neurons[i].draw();
  }
};

setInterval(drawStuff, 2000);
