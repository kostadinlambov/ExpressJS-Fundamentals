const storage = require('./storage');


storage.put('first', 'firstValue');
storage.put('second', 'secondValue');
storage.put('third', 'thirdValue');
storage.put('fouth', 'fourthValue');
storage.saveSync();
console.log(storage.get('first'));
console.log(storage.getAll());
storage.remove('second');
storage.update('first', 'updatedFirst');
storage.saveSync();
// storage.clear();
// console.log(storage.getAll());
storage.loadSync();
console.log(storage.getAll());

// storage.put('first','firstValue');
// storage.put('second','secondValue');
// storage.remove('second');
// storage.remove('second');
// storage.put(2,'someValue');
// storage.put('cat','dog');
// storage.put('cat','anotherDog');

async function loadFile() {
    console.log("before first put");
    storage.put('aaa', 'firstValue####');
    console.log(storage.getAll());
    await storage.save();
    await storage.load()
        .then((res) => {
            console.log(res)
            console.log("after first put");
        }).catch((err) => {
            throw new Error(err)
        });
    console.log("before second put");
    console.log(storage.getAll());
    storage.put('bbbb', 'secondValue####');
    console.log(storage.getAll());
    await storage.save();
    await  storage.load()
        .then((res) => {
            console.log(res)
            console.log("after second put");
            console.log('Loaded 2')
        }).catch((err) => {
            throw new Error(err)
        });
}

loadFile()
    .then(() => console.log("Success"))
    .catch(err => console.log(err));



