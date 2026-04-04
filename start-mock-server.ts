// start-mock-server.ts
// Helper to start the mock server before running tests

import { spawn } from 'child_process';

const server = spawn('node', ['mock-server.ts'], {
  stdio: 'inherit',
  shell: true,
});

process.on('exit', () => server.kill());
