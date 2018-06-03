
const data = [];

function getById(id){
return data[id];

}

function getAll(){
return data;
    
}

function update(id, value){
    data[id] = value;
        
}

module.exports = {
    getById, getAll, update
}