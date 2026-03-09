#!/usr/bin/env node

const http = require('http');
const { spawn } = require('child_process');

console.log('=== Testing Frontend Server ===\n');

// Start the vite dev server
const serverProcess = spawn('npm', ['run', 'dev'], {
  cwd: __dirname,
  detached: false,
  shell: true
});

let serverOutput = '';
serverProcess.stdout.on('data', (data) => {
  serverOutput += data.toString();
  console.log(data.toString());
});

serverProcess.stderr.on('data', (data) => {
  serverOutput += data.toString();
  console.log(data.toString());
});

// Wait for server to start, then test it
setTimeout(() => {
  console.log('\nTesting frontend server...');
  
  http.get('http://localhost:5173', (res) => {
    console.log(`Status: ${res.statusCode}`);
    if (res.statusCode === 200) {
      console.log('✓ Frontend server is running successfully!');
    }
    
    serverProcess.kill('SIGTERM');
    setTimeout(() => {
      serverProcess.kill('SIGKILL');
      process.exit(0);
    }, 1000);
  }).on('error', (err) => {
    console.error('Error testing frontend:', err.message);
    serverProcess.kill('SIGKILL');
    process.exit(1);
  });
}, 5000);

// Timeout safety
setTimeout(() => {
  console.error('Test timeout');
  serverProcess.kill('SIGKILL');
  process.exit(1);
}, 15000);
