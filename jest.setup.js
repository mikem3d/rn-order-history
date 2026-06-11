/**
 * Native modules are mocked so tests run in plain Node without a device.
 * The mocks are intentionally simple and inspectable — tests assert against
 * these jest.fn()s to verify the share flow without touching the filesystem.
 */

// In-memory stand-in for the expo-file-system v56 `File`/`Paths` API.
jest.mock('expo-file-system', () => {
  class File {
    constructor(...parts) {
      this.uri = 'file://' + parts.map((p) => (p && p.uri) || p).join('/');
      this.exists = false;
      this.contents = '';
    }
    create() {
      this.exists = true;
    }
    write(data) {
      this.contents = data;
      this.exists = true;
    }
    delete() {
      this.exists = false;
    }
  }
  return {
    File,
    Paths: { cache: { uri: 'cache' }, document: { uri: 'document' } },
  };
});

jest.mock('expo-sharing', () => ({
  isAvailableAsync: jest.fn(async () => true),
  shareAsync: jest.fn(async () => {}),
}));
