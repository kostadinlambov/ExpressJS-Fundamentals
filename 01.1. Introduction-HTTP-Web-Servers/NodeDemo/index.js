const fs = require('fs');

const text = fs.readFile('./package.json', 'utf8',function(err, text){
    const data = JSON.parse(text)

    console.log(data.name);
    data.name = 'new Name';
    
    fs.writeFile('./package.json', JSON.stringify(data), function(err){
        console.log('Complete');
    });
    console.log('Read operation finished(stack empty)');
});

console.log('index.js finished(stack empty)');

//const Person = require('./Peeson');
//const {update, getAll} = require('./api');

//const myPerson = new Person('Pesho', 22);

//console.log(myPerson.age);
//console.log(myPerson.name);

//update(0, myPerson);
//update(1, new Person('Gosho', 25)); 

//const util = require('./util');
//console.log(getAll());

//fs.writeFileSync('./data.json', JSON.stringify(getAll()));

