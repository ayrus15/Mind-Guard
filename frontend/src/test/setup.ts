import '@testing-library/jest-dom'

// Add any global test setup here
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock TensorFlow.js if needed
vi.mock('@tensorflow/tfjs', () => ({
  ready: vi.fn(() => Promise.resolve()),
}));

vi.mock('@tensorflow-models/face-landmarks-detection', () => ({
  load: vi.fn(() => Promise.resolve({})),
}));