/**
 * Vitest Setup File
 */

import { Buffer } from 'buffer';

// Make Buffer available globally for crypto operations
if (typeof global !== 'undefined') {
  global.Buffer = Buffer;
}
