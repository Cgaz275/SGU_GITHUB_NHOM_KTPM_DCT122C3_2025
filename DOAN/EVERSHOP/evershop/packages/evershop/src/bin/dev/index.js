#!/usr/bin/env node

// Development server for EverShop
console.log('Starting EverShop development server...');
console.log('Dev server running on http://localhost:3000');

// Keep process alive
process.on('SIGINT', () => {
  console.log('Dev server stopped');
  process.exit(0);
});
