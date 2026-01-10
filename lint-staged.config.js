const path = require('path');

module.exports = {
  'frontend/**/*.{js,jsx,ts,tsx}': (filenames) => {
    const relativeFiles = filenames.map((file) => path.relative(path.join(process.cwd(), 'frontend'), file));
    return [
      `npm run lint --prefix frontend -- ${relativeFiles.join(' ')}`,
      `npm run format --prefix frontend -- ${relativeFiles.join(' ')}`,
    ];
  },
  'frontend/**/*.{json,css,scss,md}': (filenames) => {
    const relativeFiles = filenames.map((file) => path.relative(path.join(process.cwd(), 'frontend'), file));
    return [
      `npm run format --prefix frontend -- ${relativeFiles.join(' ')}`,
    ];
  },
  'backend/src/**/*.java': () => {
    return [
      `cmd /c "cd backend && mvnw.cmd spotless:apply"`,
      `cmd /c "cd backend && mvnw.cmd checkstyle:check"`,
    ];
  },
};
