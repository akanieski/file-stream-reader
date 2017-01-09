# file-stream-reader
A set of promise-based classes for reading file contents

[![NPM](https://nodei.co/npm/file-stream-reader.png)](https://nodei.co/npm/file-stream-reader/)

Node has very specific ways of reading files through streams. Given my particular set of experience some of these methods felt rather alien to me. I've written this package to make available at least to myself a method for processing large files byte by byte, char by char etc.

## Usage

Using `co` to write simple code. It should also work with ES7/TS async/await since it returns promises.
```
const co = require('co);
const FileReader = require('file-stream-reader').FileReader;

let reader = new FileReader('test.txt');

co(function*(){

    try {
        yield reader.open();

        // read 10 bytes from stream and return as string
        yield reader.readString(10);

        // read 4 bytes from stream and return as number
        yield reader.readInt32();

        // read 2 bytes from stream and return as number
        yield reader.readInt16();

        // read arbitrary number of bytes and return as a Buffer
        yield reader.read(13);

        yield reader.close();

    } catch(err) {
        console.log(err)
    }

});


```