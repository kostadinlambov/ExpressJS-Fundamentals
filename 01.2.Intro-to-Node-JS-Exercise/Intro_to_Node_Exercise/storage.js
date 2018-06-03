const fs = require('fs');

let storage = {};

function put(key, value) {
    if (typeof key !== "string") {
        throw new Error('The type of key must be string');
    }

    if (storage.hasOwnProperty(key)) {
        throw new Error('Key already exists');
    }
    storage[key] = value;
}

function get(key) {
    if (typeof key !== "string") {
        throw new Error('The type of key must be string');
    }
    if (!storage.hasOwnProperty(key)) {
        throw new Error('Key does not exists');
    }

    return storage[key];
}

function getAll() {
    if (Object.keys(storage).length === 0) {
        throw new Error('Storage is empty')
    }
    return storage;
}

function update(key, newValue) {
    if (typeof key !== "string") {
        throw new Error('The type of key must be string');
    }
    if (!storage.hasOwnProperty(key)) {
        throw new Error('Key does not exists');
    }
    storage[key] = newValue;

}

function remove(key) {
    if (typeof key !== "string") {
        throw new Error('The type of key must be string');
    }
    if (!storage.hasOwnProperty(key)) {
        throw new Error('Key does not exists');
    }
    delete storage[key];
}

function clear() {
    for (let key in storage) {
        delete storage[key];
    }
}

function load() {
    return new Promise(function (resolve, reject) {
        fs.readFile('./database/storage.json', 'utf8', (err, data) => {
            if (err) {
                reject(err);
                console.dir(err);
            }
            let parsedData = JSON.parse(data);

            for (let key in parsedData) {
                storage[key] = parsedData[key];
            }

            console.log('Loaded successfully')
            resolve(data)
        })
    })
}

function save() {
    return new Promise(function (resolve, reject) {
        fs.writeFile('./database/storage.json', JSON.stringify(storage), err => {
            if (err) {
                reject(err);
            }
            console.log('Saved successfully');
            resolve();
        })
    })
}

function loadSync() {
    let data = JSON.parse(fs.readFileSync('./database/storage.json', 'utf8'));
    console.log(data);
    for (let key in data) {
        storage[key] = data[key];
    }
}


function saveSync() {
    fs.writeFileSync('./database/storage.json', JSON.stringify(storage), err => {
        if (err) {
            console.log(err);
        }
        console.log('Saved successfully')
    })
}

module.exports = {
    put, get, getAll, update,
    remove, clear, saveSync, loadSync,
    save, load, saveSync
}