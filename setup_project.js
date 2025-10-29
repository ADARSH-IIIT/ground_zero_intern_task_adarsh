// run-commands.js
const { execSync } = require('child_process');

try {
  console.log(' Changing directory to backend...');
  process.chdir('backend');

  console.log(' Installing backend dependencies...');
  execSync('npm install', { stdio: 'inherit' });

  console.log(' Generating mapping.json...');
  execSync('node ./mapping/generate_mapping.js', { stdio: 'inherit' });

  console.log('⬅ Going back to root directory...');
  process.chdir('..');

  console.log(' Changing directory to frontend...');
  process.chdir('frontend');

  console.log(' Installing frontend dependencies...');
  execSync('npm install', { stdio: 'inherit' });

  console.log('⬅ Going back to root directory...');
  process.chdir('..');

  console.log(' All tasks completed successfully!');
} catch (err) {
  console.error(' Error running commands:', err.message);
  process.exit(1);
}
