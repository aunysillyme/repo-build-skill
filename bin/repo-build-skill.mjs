#!/usr/bin/env node
import { main } from '../src/cli.mjs';
const result = await main();
if (result?.message) process.stdout.write(result.message + '\n');
process.exitCode = result?.code ?? 0;
