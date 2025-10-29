// run-frontend-dev.js
const { spawn } = require('child_process');
const path = require('path');

try {
  console.log(' Changing directory to frontend...');
  process.chdir(path.join(__dirname, 'frontend'));

  console.log(' Starting frontend development server (npm run dev)...');

  const devProcess = spawn('npm', ['run', 'dev'], { stdio: 'inherit', shell: true });

  devProcess.on('close', (code) => {
    console.log(` Frontend dev process exited with code ${code}`);
  });

} catch (err) {
  console.error('Error running frontend dev:', err.message);
  process.exit(1);
}
