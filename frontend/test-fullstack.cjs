#!/usr/bin/env node

const http = require('http');
const { spawn } = require('child_process');
const path = require('path');

console.log('=== Testing Full Stack Integration ===\n');

const backendDir = path.join(__dirname, '../backend');
const frontendDir = __dirname;

// Start backend server
console.log('Starting backend server...');
const backendProcess = spawn('npm', ['run', 'dev'], {
  cwd: backendDir,
  detached: false,
  shell: true
});

// Start frontend server
console.log('Starting frontend server...');
const frontendProcess = spawn('npm', ['run', 'dev'], {
  cwd: frontendDir,
  detached: false,
  shell: true
});

// Wait for both servers to start
setTimeout(() => {
  console.log('\nTesting backend API...');
  
  http.get('http://localhost:3000/api/messages', (res) => {
    console.log(`Backend status: ${res.statusCode}`);
    if (res.statusCode === 200) {
      console.log('✓ Backend API is running!');
    }
    
    setTimeout(() => {
      console.log('\nTesting frontend server...');
      
      http.get('http://localhost:5173', (res2) => {
        console.log(`Frontend status: ${res2.statusCode}`);
        if (res2.statusCode === 200) {
          console.log('✓ Frontend is running!');
          console.log('\n=== Full Stack Integration Test Passed ===');
          console.log('Both servers are running successfully!');
          console.log('Frontend: http://localhost:5173');
          console.log('Backend API: http://localhost:3000/api/messages');
        }
        
        // Cleanup
        backendProcess.kill('SIGTERM');
        frontendProcess.kill('SIGTERM');
        setTimeout(() => {
          backendProcess.kill('SIGKILL');
          frontendProcess.kill('SIGKILL');
          process.exit(0);
        }, 1000);
      }).on('error', (err) => {
        console.error('Error testing frontend:', err.message);
        backendProcess.kill('SIGKILL');
        frontendProcess.kill('SIGKILL');
        process.exit(1);
      });
    }, 2000);
  }).on('error', (err) => {
    console.error('Error testing backend:', err.message);
    backendProcess.kill('SIGKILL');
    frontendProcess.kill('SIGKILL');
    process.exit(1);
  });
}, 8000);

// Timeout safety
setTimeout(() => {
  console.error('Test timeout');
  backendProcess.kill('SIGKILL');
  frontendProcess.kill('SIGKILL');
  process.exit(1);
}, 20000);
