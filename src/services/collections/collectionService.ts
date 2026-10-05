/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Collection, SavedItem, SavableType } from '../../types';
import { IStorageService } from '../storage/IStorageService';

export const DEFAULT_COLLECTIONS: Array<{ id: string; nameEn: string; nameAr: string }> = [
  { id: 'col_arabic', nameEn: 'Arabic', nameAr: 'اللغة العربية' },
  { id: 'col_math', nameEn: 'Mathematics', nameAr: 'الرياضيات' },
  { id: 'col_exam', nameEn: 'Before Exam', nameAr: 'قبل الامتحان' },
  { id: 'col_not_understood', nameEn: "I Don't Understand", nameAr: 'مش فاهم' },
  { id: 'col_important', nameEn: 'Important', nameAr: 'مهم' },
  { id: 'col_review_later', nameEn: 'Review Later', nameAr: 'أراجع لاحقاً' },
];

/**
 * Initializes default collections for a new student if none exist yet.
 */
export async function ensureDefaultCollections(
  studentId: string,
  storage: IStorageService
): Promise<Collection[]> {
  const existing = await storage.getCollections(studentId);
  if (existing.length > 0) return existing;

  const createdCols: Collection[] = [];
  const now = new Date().toISOString();

  for (const def of DEFAULT_COLLECTIONS) {
    const col: Collection = {
      id: `${def.id}_${studentId}`,
      studentId,
      name: def.nameEn,
      nameAr: def.nameAr,
      isDefault: true,
      itemIds: [],
      createdAt: now,
    };
    await storage.saveCollection(col);
    createdCols.push(col);
  }

  return createdCols;
}

/**
 * Saves or updates an item in collections with optional notes.
 */
export async function saveItem(
  studentId: string,
  storage: IStorageService,
  payload: {
    type: SavableType;
    sourceId: string;
    title: string;
    subject?: string;
    snippet?: string;
    note?: string;
    collectionIds: string[];
    isLiked?: boolean;
  }
): Promise<SavedItem> {
  const existingItems = await storage.getSavedItems(studentId);
  let item = existingItems.find((i) => i.sourceId === payload.sourceId);

  const now = new Date().toISOString();

  if (!item) {
    item = {
      id: `saved_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      studentId,
      type: payload.type,
      sourceId: payload.sourceId,
      title: payload.title,
      subject: payload.subject,
      snippet: payload.snippet,
      note: payload.note,
      savedAt: now,
      collectionIds: payload.collectionIds,
      isLiked: payload.isLiked ?? false,
    };
  } else {
    item.collectionIds = Array.from(new Set([...item.collectionIds, ...payload.collectionIds]));
    if (payload.note !== undefined) item.note = payload.note;
    if (payload.isLiked !== undefined) item.isLiked = payload.isLiked;
  }

  await storage.saveSavedItem(item);

  // Sync item ID into the chosen collections
  const allCollections = await storage.getCollections(studentId);
  for (const col of allCollections) {
    const shouldContain = payload.collectionIds.includes(col.id);
    const hasItem = col.itemIds.includes(item.id);

    if (shouldContain && !hasItem) {
      col.itemIds.push(item.id);
      await storage.saveCollection(col);
    } else if (!shouldContain && hasItem && payload.collectionIds.length > 0) {
      col.itemIds = col.itemIds.filter((id) => id !== item.id);
      await storage.saveCollection(col);
    }
  }

  return item;
}

/**
 * Toggles like on any content piece.
 */
export async function toggleLike(
  studentId: string,
  storage: IStorageService,
  sourceId: string,
  meta: {
    type: SavableType;
    title: string;
    subject?: string;
    snippet?: string;
  }
): Promise<{ isLiked: boolean; item: SavedItem }> {
  const existingItems = await storage.getSavedItems(studentId);
  let item = existingItems.find((i) => i.sourceId === sourceId);

  if (!item) {
    item = {
      id: `saved_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      studentId,
      type: meta.type,
      sourceId,
      title: meta.title,
      subject: meta.subject,
      snippet: meta.snippet,
      savedAt: new Date().toISOString(),
      collectionIds: [],
      isLiked: true,
    };
  } else {
    item.isLiked = !item.isLiked;
  }

  await storage.saveSavedItem(item);
  return { isLiked: Boolean(item.isLiked), item };
}

/**
 * Updates an attached note on a saved item.
 */
export async function updateItemNote(
  storage: IStorageService,
  item: SavedItem,
  note: string
): Promise<SavedItem> {
  const updated = { ...item, note: note.trim() };
  await storage.saveSavedItem(updated);
  return updated;
}
