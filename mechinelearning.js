const brain = require('brain.js');
const data = require('./data.json');







var network = new brain.recurrent.LSTM();


const trainingData=data.map(item=>({
    input:item.text,
    output:item.category
}));

network.train(trainingData,{
    iterations:100
});

const output=network.run('i fix the power supply');

console.log(output);
