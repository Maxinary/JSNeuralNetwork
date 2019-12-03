//This is a neural network simulating a 3 bit binary full adder chain
var repeatNeurons = 12;
var repeats = 3;
var size = 40;
for(var i=0;i<repeats;i++){
  neurons.push(new Neuron(neurons.length, Comparators.GT, new Tuple(5*size/4+10*size/4 *i,5*size/4), size));
  neurons.push(new Neuron(neurons.length, Comparators.GT, new Tuple(75*size/4+10*size/4 *i,5*size/4), size));
  neurons.push(new Neuron(neurons.length, Comparators.GT, new Tuple(25*size/4+35*size/4 *i,30*size/4), size));
  
  //half adder
  neurons.push(new Neuron(neurons.length, Comparators.LT, new Tuple(5*size/4+35*size/4 *i,20*size/4), size));
  neurons.push(new Neuron(neurons.length, Comparators.GT, new Tuple(15*size/4+35*size/4 *i,20*size/4), size));
  neurons.push(new Neuron(neurons.length, Comparators.GT, new Tuple(5*size/4+35*size/4 *i,30*size/4), size));
  neurons.push(new Neuron(neurons.length, Comparators.GT, new Tuple(15*size/4+35*size/4*i,30*size/4), size));
  
  //second level
  neurons.push(new Neuron(neurons.length, Comparators.GT, new Tuple(5*size/4+35*size/4*i,10*size), size));
  neurons.push(new Neuron(neurons.length, Comparators.LT, new Tuple(15*size/4+35*size/4*i,10*size), size));
  neurons.push(new Neuron(neurons.length, Comparators.GT, new Tuple(25*size/4+35*size/4*i,10*size), size));
  neurons.push(new Neuron(neurons.length, Comparators.GT, new Tuple(15*size/4+35*size/4*i,15*size), size));
  neurons.push(new Neuron(neurons.length, Comparators.GT, new Tuple(5*size/4+35*size/4*i,10*size), size));

  //self sufficient
  neurons[0+repeatNeurons*i].registerInput(0+repeatNeurons*i,1.1);
  neurons[1+repeatNeurons*i].registerInput(1+repeatNeurons*i,1.1);
  if(i!==0){
    neurons[2+repeatNeurons*i].registerInput(6+repeatNeurons*(i-1),1.1);
    neurons[2+repeatNeurons*i].registerInput(11+repeatNeurons*(i-1),1.1);
  }
  
  //half adder
  
  //NAND
  neurons[3+repeatNeurons*i].registerInput(0+repeatNeurons*i, 0.75);
  neurons[3+repeatNeurons*i].registerInput(1+repeatNeurons*i, 0.75);
  
  //OR
  neurons[4+repeatNeurons*i].registerInput(0+repeatNeurons*i, 1.1);
  neurons[4+repeatNeurons*i].registerInput(1+repeatNeurons*i, 1.1);
  
  //AND
  neurons[5+repeatNeurons*i].registerInput(3+repeatNeurons*i,0.75);
  neurons[5+repeatNeurons*i].registerInput(4+repeatNeurons*i,0.75);
  
  //AND
  neurons[6+repeatNeurons*i].registerInput(0+repeatNeurons*i,0.75);
  neurons[6+repeatNeurons*i].registerInput(1+repeatNeurons*i,0.75);
  
  //second level
  
  //AND
  neurons[7+repeatNeurons*i].registerInput(2+repeatNeurons*i, 0.75);
  neurons[7+repeatNeurons*i].registerInput(5+repeatNeurons*i, 0.75);
  
  //XOR
  
  //NAND
  neurons[8+repeatNeurons*i].registerInput(2+repeatNeurons*i, 0.75);
  neurons[8+repeatNeurons*i].registerInput(5+repeatNeurons*i, 0.75);
  
  //OR
  neurons[9+repeatNeurons*i].registerInput(2+repeatNeurons*i, 1.1);
  neurons[9+repeatNeurons*i].registerInput(5+repeatNeurons*i, 1.1);
  
  //AND
  neurons[10+repeatNeurons*i].registerInput(8+repeatNeurons*i,0.75);
  neurons[10+repeatNeurons*i].registerInput(9+repeatNeurons*i,0.75);
  
  //AND
  neurons[11+repeatNeurons*i].registerInput(2+repeatNeurons*i,0.75);
  neurons[11+repeatNeurons*i].registerInput(5+repeatNeurons*i,0.75);
}
//final carry over
neurons.push(new Neuron(neurons.length, Comparators.GT, new Tuple(15*size/4+35*size/4*repeats, 15*size), size));

neurons[repeatNeurons*repeats].registerInput(6+repeatNeurons*(repeats-1),1.1);
neurons[repeatNeurons*repeats].registerInput(11+repeatNeurons*(repeats-1),1.1);
