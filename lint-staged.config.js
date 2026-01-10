const path = require('path');

module.exports = {
  'frontend/**/*.{js,jsx,ts,tsx}': (filenames) => {
    const relativeFiles = filenames.map((file) => path.relative(path.join(process.cwd(), 'frontend'), file));
    return [
      `npm.cmd run lint --prefix frontend -- ${relativeFiles.join(' ')}`,
      `npm.cmd run format --prefix frontend -- ${relativeFiles.join(' ')}`,
    ];
  },
  'frontend/**/*.{json,css,scss,md}': (filenames) => {
    const relativeFiles = filenames.map((file) => path.relative(path.join(process.cwd(), 'frontend'), file));
    return [
      `npm.cmd run format --prefix frontend -- ${relativeFiles.join(' ')}`,
    ];
  },
};
