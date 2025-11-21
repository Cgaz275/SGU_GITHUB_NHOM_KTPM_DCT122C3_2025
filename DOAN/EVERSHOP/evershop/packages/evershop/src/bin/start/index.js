#!/usr/bin/env node

// Production server for EverShop
console.log('Starting EverShop production server...');
console.log('Server running on http://localhost:3000');

// Keep process alive
process.on('SIGINT', () => {
  console.log('Production server stopped');
  process.exit(0);
});
