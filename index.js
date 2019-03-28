#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const assembler = require("mips-assembler");

const [,, inFile, outFile, ...args] = process.argv;

if (!inFile) {
  console.error("An assembly filename must be passed.");
  printUsage();
  return;
}

if (!outFile) {
  console.error("An output filename must be passed.");
  printUsage();
  return;
}

fs.readFile(inFile, "utf8", (err, data) => {
  if (err) {
    throw err;
  }

  const result = assembler.assemble(data, {
    files: createFileProxy()
  });

  fs.writeFile(outFile, Buffer.from(result), err => {
    if (err) {
      throw err;
    }
  });
});

function printUsage() {
  console.log("mips-assembler-cli input.s output.bin");
}

function createFileProxy() {
  var syms = {};
  var proxy = new Proxy(syms, {
    get: function(obj, propName) {
      const baseDir = path.dirname(inFile);
      const requestedFile = path.join(baseDir, propName);
      return fs.readFileSync(requestedFile, { encoding: "utf8" });
    },
  });
  return proxy;
}
