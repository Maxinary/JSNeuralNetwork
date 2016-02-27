"use strict";

let draw = true;
let drawHead = 0;
var canvas = document.getElementById("drawing");
canvas.width = document.body.clientWidth;
canvas.height = document.body.clientHeight;
var body = document.getElementsByTagName("body");
canvas.addEventListener('click', function(event) {
  for(var i=0;i<neurons.length;i++){
    if(neurons[i].clicked(event.pageX, event.pageY)){
      neurons[i].output = !neurons[i].output;
      if(draw){
        neurons[i].drawCircle();
      }
    }
  }
}, false);

//right click only draws that
canvas.addEventListener('contextmenu', function(event) {
  for(var i=0;i<neurons.length;i++){
    if(neurons[i].clicked(event.pageX, event.pageY)){
      drawHead = i;
      event.preventDefault();
      draw = !draw;
      ctx.clearRect(0,0,canvas.width,canvas.height);

      neurons[i].drawPrevious();

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
          neurons[i].location.x - neurons[i].radius*Math.cos(angle+Math.PI), 
          neurons[i].location.y - neurons[i].radius*Math.sin(angle+Math.PI)
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
  
  drawPrevious(){
    for(var j=0;j<neurons.length;j++){
      if(this.inputs[j] !== 0 && j!=this.arrLocation){
        neurons[j].drawPrevious();
      }
    }
    this.drawLines();
    this.drawCircle();
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


var drawStuff = function(){
  var cneurons = JSON.parse(JSON.stringify(neurons));
  if(draw){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    
    for(var i=0;i<neurons.length;i++){
      neurons[i].update(cneurons);
      neurons[i].drawLines();
      neurons[i].drawCircle();
    }
  }else{
    for(var j=0;j<neurons.length;j++){
      neurons[drawHead].drawPrevious();
      neurons[j].update(cneurons);
    }
  }
};

setInterval(drawStuff, 50);
