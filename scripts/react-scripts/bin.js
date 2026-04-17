#!/usr/bin/env node

const { spawn } = require('node:child_process');

const [, , command = 'start', ...args] = process.argv;

const mapping = {
  start: ['vite', ...args],
  build: ['vite', 'build', ...args],
  test: ['vite', '--help'],
};

const [binary, ...binaryArgs] = mapping[command] ?? ['vite', ...args];

const child = spawn(binary, binaryArgs, {
  stdio: 'inherit',
  shell: process.platform === 'win32',
});

child.on('exit', (code) => {
  process.exit(code ?? 0);
});
