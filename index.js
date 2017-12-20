#!/usr/local/bin/node

console.log("hello-cli")

const fs = require('fs')
const path = require('path')

const PATH = "."
const templatePath = path.join(__dirname, 'template')
let config = {}

/*process.argv.slice(2).forEach(item => {
    switch (item) {
        case "-antd":
            config.antd = true;
            break;
    }
});*/

function copyTemplate(from, to) {
    // from = path.join(templatePath, from)
    write(to, fs.readFileSync(from, 'utf-8'))
}

function write(path, str, mode) {
    // console.log(path);
    fs.writeFileSync(path, str)
}

function mkdir(path, fn) {
    fs.mkdir(path, err => {
        if (err) throw err
        fn && fn()
    })
}

function readdir(path, fn) {
    // console.log(path);
    fs.readdir(path, (err, files) => {
        if (err) throw err
        fn && fn(files)
    })
}

const pipeFile = (from, to) => readdir(from, files => {
    files.filter(fileName => fileName !== '.DS_Store')
        .forEach(fileName => {
            console.log(path.join(to, fileName));
            fs.stat(path.join(from, fileName), (err, stats) => {
                if (err) throw err
                if (stats.isFile()) {
                    copyTemplate(path.join(from, fileName), path.join(to, fileName))
                } else if (stats.isDirectory()) {
                    mkdir(path.join(to, fileName), () => pipeFile(path.join(from, fileName), path.join(to, fileName)))
                }
            })
        })
})

pipeFile(templatePath, PATH)

/*
console.log("build complete.");
console.log(" use \"npm run sass\" to watch the sass file changes.");*/
