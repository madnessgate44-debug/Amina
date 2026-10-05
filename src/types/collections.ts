/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type SavableType = 'reel' | 'explanation' | 'game' | 'quiz' | 'note' | 'concept';

export interface SavedItem {
  id: string;
  studentId: string;
  type: SavableType;
  sourceId: string; // ID of concept, lesson, reel, quiz, etc.
  title: string;
  subject?: string;
  snippet?: string;
  note?: string;
  savedAt: string; // ISO
  collectionIds: string[];
  isLiked?: boolean;
}

export interface Collection {
  id: string;
  studentId: string;
  name: string;
  nameAr?: string;
  isDefault?: boolean;
  itemIds: string[];
  createdAt: string; // ISO
}
