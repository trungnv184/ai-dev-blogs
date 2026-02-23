// Mock for uuid v4
let counter = 0;

module.exports = {
  v4: () => `mock-uuid-${++counter}`,
  validate: (uuid) => typeof uuid === 'string' && uuid.length > 0,
  version: (uuid) => 4,
};
