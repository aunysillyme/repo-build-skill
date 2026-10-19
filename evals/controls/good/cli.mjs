#!/usr/bin/env node
if (process.argv.includes('--help')) console.log('tiny-calc-tool: sum integers.');
else console.log(process.argv.slice(2).reduce((total, value) => total + Number(value), 0));
