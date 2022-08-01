#!/usr/bin/env node
const program = require('commander');
const { version } = require('../package.json');

program.version(version, '-v, --version', 'output the current version');

program.command('optimize', 'optimize svg icons');

program.parse(process.argv);
