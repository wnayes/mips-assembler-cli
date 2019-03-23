#!/usr/bin/env node

const fs = require("fs");
const assembler = require("mips-assembler");

const [,, inFile, outFile, ...args] = process.argv;

if (!inFile) {
  console.error("An assembly filename must be passed.");
}

if (!outFile) {
  console.error("An output filename must be passed.");
}

fs.readFile(inFile, (err, data) => {
  if (err) {
    throw err;
  }

  const result = assembler.assemble(data);

  fs.write(outFile, new Buffer(result), err => {
    if (err) {
      throw err;
    }
  });
});
