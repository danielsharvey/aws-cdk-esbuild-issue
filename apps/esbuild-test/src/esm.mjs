
const { performance } = require('perf_hooks');
const start = performance.now();

/*
 * load 'main.js' and bootstrap
 */

console.info('INFO: performBootstrap: starting');

// await performBootstrap();

const ms = performance.now() - start;

console.info('INFO: performBootstrap: complete', ms, 'ms');
