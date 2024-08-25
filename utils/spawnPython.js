const child = require('child_process');

const spawnPython = (args) => {

    return new Promise((resolve, reject) => {

        const python = child.spawn('python', args);

        python.stdout.on('data', (data) => {
            console.log(data.toString())
            resolve(data.toString())
        });

        python.stderr.on('data', (data) => {
            console.log(data.toString())
            reject(data.toString())
        });

    })

}

module.exports = spawnPython;