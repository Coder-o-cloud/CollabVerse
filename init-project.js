// Script to initialize the CollabVerse project
// This script will install dependencies for both frontend and backend

const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

async function initProject() {
  console.log('Initializing CollabVerse project...');
  
  try {
    // Install backend dependencies
    console.log('Installing backend dependencies...');
    await execAsync('cd backend && npm install');
    console.log('Backend dependencies installed successfully!');
    
    // Install frontend dependencies
    console.log('Installing frontend dependencies...');
    await execAsync('cd frontend && npm install');
    console.log('Frontend dependencies installed successfully!');
    
    console.log('\nProject initialization complete!');
    console.log('\nNext steps:');
    console.log('1. cd backend && cp .env.example .env');
    console.log('2. Update the .env file with your configuration');
    console.log('3. npm run seed (to seed the database with demo data)');
    console.log('4. npm run dev (to start the development servers)');
  } catch (error) {
    console.error('Error initializing project:', error);
  }
}

initProject();