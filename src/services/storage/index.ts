/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { IStorageService } from './IStorageService';
import { IndexedDBStorageService } from './IndexedDBStorageService';

export * from './IStorageService';
export * from './IndexedDBStorageService';

// Singleton instance used across the application
export const storageService: IStorageService = new IndexedDBStorageService();
