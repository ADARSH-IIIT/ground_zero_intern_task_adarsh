// run-server.js
const { execSync } = require('child_process');

// You can change this to 'v1' or 'v2' as needed
const version = process.argv[2]; // read from command line args

if (!version) {
  console.error(' Please provide a version: v1 or v2');
  console.error('Example: node run_backend.js v1');
  process.exit(1);
}




try {
  if (version === 'v1') {
    (' Starting v1 server...');
     
    console.log("\n\n\nplease enter your desired port and gemini api key in ./backend/.env file\n\n\n");
    execSync('node backend/v1_server.js', { stdio: 'inherit' });
   
  } else if (version === 'v2') {
    (' Starting v2 server...');
    console.log("\n\n\nplease enter your desired port and gemini api key in ./backend/.env file\n\n\n");

    execSync('node backend/v2_server.js', { stdio: 'inherit' });
  } else {
    console.error(' Unknown version. Please use v1 or v2.');
    process.exit(1);
  }
} catch (err) {
  console.error(' Failed to run server:', err.message);
}
