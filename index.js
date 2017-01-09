const fs = require('fs')
const path = require('path')
const States = {
    OPEN: 0,
    CLOSED: 1
}


/**
 * Promise based FileReader.
 */
class FileReader {


    /**
     * Creates a new stream reader
     * @param filename
     */
    constructor(filename) {
        this.filename = filename
        this.fileIndex = 0
    }


    /**
     * Opens the classic node stream and resolves the returned promise when the stream opens
     * @param mode [Optional] <'r' | 'w'>  [Default = r]
     */
    open(mode = 'r') {
        return new Promise((resolve, reject) => {
            fs.open(this.filename, mode, (err, fd) => {
                if (err) {
                    this.state = States.CLOSED
                    return reject(err)
                }
                
                this.state = States.OPEN
                this.fd = fd
                resolve(fd)
            })
        });
    }

    /**
     * Reads one byte and resolve promise with the given byte
     */
    readByte() {
        return this.read(1)
    }

    /**
     * Reads a string with the given length
     * @param length - string length [Required]
     * @param encoding - encoding [Default = 'ascii']
     */
    readString(length, encoding) {
        if (!length) throw new Error('readString requires a length')
        return this.read(length).toString(encoding)
    }

    /**
     * Reads four bytes and converts them to an int
     */
    readInt32() {
        return parseInt(this.read(4))
    }


    /**
     * Reads two bytes and converts them to an int
     */
    readInt16() {
        return parseInt(this.read(2))
    }


    /**
     * Reads specified bytes from stream
     * @param length - number of bytes to read [Required] [Default = 1]
     */
    read(length = 1) {
        return new Promise((resolve, reject) => {      
            if (this.state !== States.OPEN)
                return reject(new Error("Stream is not open for reading"))

            let buffer = new Buffer(length)

            fs.read(this.fd, buffer, 0, length, this.fileIndex, (err, bytesRead, data) => {
                if (err) {
                    this.state = States.CLOSED
                    return this.close().then(()=> reject(err)).catch(reject)
                } 
                
                if (bytesRead === 0) {
                    resolve(null)
                } else {
                    this.fileIndex += bytesRead
                    resolve(data)
                }
            })
        })
    }


    /**
     * Closes the file stream
     */
    close() {
        return new Promise((resolve, reject) => {
            fs.close(this.fd, (err) => {
                if (err) {
                    this.state = States.CLOSED
                    return reject(err)
                } else {
                    this.state = States.CLOSED
                    resolve()
                }
            })
        })
    }

}

module.exports = {
    FileReader
}