/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  Student,
  Timetable,
  AIConversation,
  AppSettings,
  DayRecord,
  MasteryRecord,
  Mission,
  MissionOutcome,
  HomeworkItem,
  HomeworkSubmission,
  DailyReview,
  WeeklyReview,
  SavedItem,
  Collection,
  ParentAccount,
  StudentGamification,
  TeachingSession,
} from '../../types';
import { IStorageService } from './IStorageService';

const DB_NAME = 'ai_school_companion_v2';
const DB_VERSION = 7;

const STORES = {
  STUDENT: 'student',
  TIMETABLE: 'timetable',
  CONVERSATION: 'conversation',
  SETTINGS: 'settings',
  DAY_RECORDS: 'day_records',
  MASTERY_RECORDS: 'mastery_records',
  MISSIONS: 'missions',
  MISSION_OUTCOMES: 'mission_outcomes',
  HOMEWORK_ITEMS: 'homework_items',
  HOMEWORK_SUBMISSIONS: 'homework_submissions',
  DAILY_REVIEWS: 'daily_reviews',
  WEEKLY_REVIEWS: 'weekly_reviews',
  SAVED_ITEMS: 'saved_items',
  COLLECTIONS: 'collections',
  PARENT_ACCOUNTS: 'parent_accounts',
  GAMIFICATION: 'gamification',
  TEACHING_SESSIONS: 'teaching_sessions',
} as const;

const DEFAULT_SETTINGS: AppSettings = {
  language: 'ar',
  demoTimeSimulatorActive: true,
  simulatedTimeOfDay: 'after_school',
  simulatedTime: '14:30',
  companionVoiceEnabled: true,
  micPermissionStatus: 'prompt',
  showEvidenceLog: false,
  simulatedDaysOffset: 0,
};

export class IndexedDBStorageService implements IStorageService {
  private dbPromise: Promise<IDBDatabase | null> | null = null;
  private fallbackMemory: Map<string, any> = new Map();

  constructor() {
    this.initFallbackFromLocalStorage();
  }

  private initFallbackFromLocalStorage() {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        for (const key of Object.values(STORES)) {
          const item = localStorage.getItem(`aisc_${key}`);
          if (item) {
            this.fallbackMemory.set(key, JSON.parse(item));
          }
        }
      }
    } catch {
      // LocalStorage access might be blocked in strict sandboxes; memory map will still work
    }
  }

  private saveToLocalStorage(key: string, val: any) {
    this.fallbackMemory.set(key, val);
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        if (val === null || val === undefined) {
          localStorage.removeItem(`aisc_${key}`);
        } else {
          localStorage.setItem(`aisc_${key}`, JSON.stringify(val));
        }
      }
    } catch {
      // Ignore fallback write errors
    }
  }

  private getDB(): Promise<IDBDatabase | null> {
    if (typeof window === 'undefined' || !window.indexedDB) {
      return Promise.resolve(null);
    }

    if (this.dbPromise) return this.dbPromise;

    this.dbPromise = new Promise((resolve) => {
      try {
        const request = window.indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = (event) => {
          const db = (event.target as IDBOpenDBRequest).result;
          if (!db.objectStoreNames.contains(STORES.STUDENT)) {
            db.createObjectStore(STORES.STUDENT, { keyPath: 'id' });
          }
          if (!db.objectStoreNames.contains(STORES.TIMETABLE)) {
            db.createObjectStore(STORES.TIMETABLE, { keyPath: 'id' });
          }
          if (!db.objectStoreNames.contains(STORES.CONVERSATION)) {
            db.createObjectStore(STORES.CONVERSATION, { keyPath: 'id' });
          }
          if (!db.objectStoreNames.contains(STORES.SETTINGS)) {
            db.createObjectStore(STORES.SETTINGS, { keyPath: 'id' });
          }
          if (!db.objectStoreNames.contains(STORES.DAY_RECORDS)) {
            const drStore = db.createObjectStore(STORES.DAY_RECORDS, { keyPath: 'id' });
            drStore.createIndex('date', 'date', { unique: false });
          }
          if (!db.objectStoreNames.contains(STORES.MASTERY_RECORDS)) {
            const mStore = db.createObjectStore(STORES.MASTERY_RECORDS, { keyPath: 'id' });
            mStore.createIndex('studentId', 'studentId', { unique: false });
            mStore.createIndex('conceptId', 'conceptId', { unique: false });
          }
          if (!db.objectStoreNames.contains(STORES.MISSIONS)) {
            const misStore = db.createObjectStore(STORES.MISSIONS, { keyPath: 'id' });
            misStore.createIndex('studentId', 'studentId', { unique: false });
            misStore.createIndex('date', 'date', { unique: false });
          }
          if (!db.objectStoreNames.contains(STORES.MISSION_OUTCOMES)) {
            const outStore = db.createObjectStore(STORES.MISSION_OUTCOMES, { keyPath: 'id' });
            outStore.createIndex('missionId', 'missionId', { unique: false });
          }
          if (!db.objectStoreNames.contains(STORES.HOMEWORK_ITEMS)) {
            const hwStore = db.createObjectStore(STORES.HOMEWORK_ITEMS, { keyPath: 'id' });
            hwStore.createIndex('studentId', 'studentId', { unique: false });
            hwStore.createIndex('date', 'date', { unique: false });
          }
          if (!db.objectStoreNames.contains(STORES.HOMEWORK_SUBMISSIONS)) {
            const subStore = db.createObjectStore(STORES.HOMEWORK_SUBMISSIONS, { keyPath: 'id' });
            subStore.createIndex('homeworkItemId', 'homeworkItemId', { unique: false });
            subStore.createIndex('studentId', 'studentId', { unique: false });
          }
          if (!db.objectStoreNames.contains(STORES.DAILY_REVIEWS)) {
            const drvStore = db.createObjectStore(STORES.DAILY_REVIEWS, { keyPath: 'id' });
            drvStore.createIndex('studentId', 'studentId', { unique: false });
            drvStore.createIndex('date', 'date', { unique: false });
          }
          if (!db.objectStoreNames.contains(STORES.WEEKLY_REVIEWS)) {
            const wrvStore = db.createObjectStore(STORES.WEEKLY_REVIEWS, { keyPath: 'id' });
            wrvStore.createIndex('studentId', 'studentId', { unique: false });
            wrvStore.createIndex('weekStartDate', 'weekStartDate', { unique: false });
          }
          if (!db.objectStoreNames.contains(STORES.SAVED_ITEMS)) {
            const siStore = db.createObjectStore(STORES.SAVED_ITEMS, { keyPath: 'id' });
            siStore.createIndex('studentId', 'studentId', { unique: false });
            siStore.createIndex('type', 'type', { unique: false });
          }
          if (!db.objectStoreNames.contains(STORES.COLLECTIONS)) {
            const colStore = db.createObjectStore(STORES.COLLECTIONS, { keyPath: 'id' });
            colStore.createIndex('studentId', 'studentId', { unique: false });
          }
          if (!db.objectStoreNames.contains(STORES.PARENT_ACCOUNTS)) {
            const paStore = db.createObjectStore(STORES.PARENT_ACCOUNTS, { keyPath: 'id' });
            paStore.createIndex('studentId', 'studentId', { unique: false });
          }
          if (!db.objectStoreNames.contains(STORES.GAMIFICATION)) {
            db.createObjectStore(STORES.GAMIFICATION, { keyPath: 'studentId' });
          }
          if (!db.objectStoreNames.contains(STORES.TEACHING_SESSIONS)) {
            const tsStore = db.createObjectStore(STORES.TEACHING_SESSIONS, { keyPath: 'sessionId' });
            tsStore.createIndex('studentId', 'studentId', { unique: false });
            tsStore.createIndex('lessonId', 'lessonId', { unique: false });
          }
        };

        request.onsuccess = () => {
          resolve(request.result);
        };

        request.onerror = () => {
          console.warn('IndexedDB unavailable or blocked; relying on fallback storage.');
          resolve(null);
        };
      } catch (err) {
        console.warn('Error opening IndexedDB; falling back to memory/localStorage:', err);
        resolve(null);
      }
    });

    return this.dbPromise;
  }

  async getStudent(): Promise<Student | null> {
    const db = await this.getDB();
    if (!db) {
      return this.fallbackMemory.get(STORES.STUDENT) || null;
    }

    return new Promise((resolve) => {
      try {
        const tx = db.transaction(STORES.STUDENT, 'readonly');
        const store = tx.objectStore(STORES.STUDENT);
        const request = store.getAll();

        request.onsuccess = () => {
          const results = request.result;
          const student = results && results.length > 0 ? (results[0] as Student) : null;
          if (student) this.saveToLocalStorage(STORES.STUDENT, student);
          resolve(student || this.fallbackMemory.get(STORES.STUDENT) || null);
        };

        request.onerror = () => {
          resolve(this.fallbackMemory.get(STORES.STUDENT) || null);
        };
      } catch {
        resolve(this.fallbackMemory.get(STORES.STUDENT) || null);
      }
    });
  }

  async saveStudent(student: Student): Promise<void> {
    this.saveToLocalStorage(STORES.STUDENT, student);
    const db = await this.getDB();
    if (!db) return;

    return new Promise((resolve) => {
      try {
        const tx = db.transaction(STORES.STUDENT, 'readwrite');
        const store = tx.objectStore(STORES.STUDENT);
        store.put(student);
        tx.oncomplete = () => resolve();
        tx.onerror = () => resolve();
      } catch {
        resolve();
      }
    });
  }

  async getTimetable(studentId?: string): Promise<Timetable | null> {
    const db = await this.getDB();
    if (!db) {
      const timetable = this.fallbackMemory.get(STORES.TIMETABLE) || null;
      return studentId && timetable?.studentId === studentId ? timetable : null;
    }

    return new Promise((resolve) => {
      try {
        const tx = db.transaction(STORES.TIMETABLE, 'readonly');
        const store = tx.objectStore(STORES.TIMETABLE);
        const request = store.getAll();

        request.onsuccess = () => {
          const results = request.result as Timetable[];
          const timetable = studentId ? (results.find((item) => item.studentId === studentId) || null) : null;
          if (timetable) this.saveToLocalStorage(STORES.TIMETABLE, timetable);
          resolve(timetable || (studentId ? null : this.fallbackMemory.get(STORES.TIMETABLE) || null));
        };

        request.onerror = () => {
          const fallback = this.fallbackMemory.get(STORES.TIMETABLE) || null;
          resolve(studentId && fallback?.studentId === studentId ? fallback : null);
        };
      } catch {
        resolve(this.fallbackMemory.get(STORES.TIMETABLE) || null);
      }
    });
  }

  async saveTimetable(timetable: Timetable): Promise<void> {
    this.saveToLocalStorage(STORES.TIMETABLE, timetable);
    const db = await this.getDB();
    if (!db) return;

    return new Promise((resolve) => {
      try {
        const tx = db.transaction(STORES.TIMETABLE, 'readwrite');
        const store = tx.objectStore(STORES.TIMETABLE);
        store.put(timetable);
        tx.oncomplete = () => resolve();
        tx.onerror = () => resolve();
      } catch {
        resolve();
      }
    });
  }

  async getConversation(studentId: string): Promise<AIConversation | null> {
    const db = await this.getDB();
    if (!db) {
      const conversations = (this.fallbackMemory.get(STORES.CONVERSATION) || []) as AIConversation[];
      return conversations.find((item) => item.studentId === studentId) || null;
    }

    return new Promise((resolve) => {
      try {
        const tx = db.transaction(STORES.CONVERSATION, 'readonly');
        const store = tx.objectStore(STORES.CONVERSATION);
        const request = store.getAll();

        request.onsuccess = () => {
          const results = request.result as AIConversation[];
          const conv = results?.find((item) => item.studentId === studentId) || null;
          if (conv) this.saveToLocalStorage(STORES.CONVERSATION, conv);
          resolve(conv || this.fallbackMemory.get(STORES.CONVERSATION) || null);
        };

        request.onerror = () => {
          resolve(this.fallbackMemory.get(STORES.CONVERSATION) || null);
        };
      } catch {
        resolve(this.fallbackMemory.get(STORES.CONVERSATION) || null);
      }
    });
  }

  async saveConversation(conversation: AIConversation): Promise<void> {
    this.saveToLocalStorage(STORES.CONVERSATION, conversation);
    const db = await this.getDB();
    if (!db) return;

    return new Promise((resolve) => {
      try {
        const tx = db.transaction(STORES.CONVERSATION, 'readwrite');
        const store = tx.objectStore(STORES.CONVERSATION);
        store.put(conversation);
        tx.oncomplete = () => resolve();
        tx.onerror = () => resolve();
      } catch {
        resolve();
      }
    });
  }

  async getSettings(): Promise<AppSettings> {
    const db = await this.getDB();
    if (!db) {
      return this.fallbackMemory.get(STORES.SETTINGS) || DEFAULT_SETTINGS;
    }

    return new Promise((resolve) => {
      try {
        const tx = db.transaction(STORES.SETTINGS, 'readonly');
        const store = tx.objectStore(STORES.SETTINGS);
        const request = store.get('app_settings');

        request.onsuccess = () => {
          const result = request.result;
          if (result && result.settings) {
            resolve(result.settings as AppSettings);
          } else {
            resolve(this.fallbackMemory.get(STORES.SETTINGS) || DEFAULT_SETTINGS);
          }
        };

        request.onerror = () => {
          resolve(this.fallbackMemory.get(STORES.SETTINGS) || DEFAULT_SETTINGS);
        };
      } catch {
        resolve(this.fallbackMemory.get(STORES.SETTINGS) || DEFAULT_SETTINGS);
      }
    });
  }

  async saveSettings(settings: AppSettings): Promise<void> {
    this.saveToLocalStorage(STORES.SETTINGS, settings);
    const db = await this.getDB();
    if (!db) return;

    return new Promise((resolve) => {
      try {
        const tx = db.transaction(STORES.SETTINGS, 'readwrite');
        const store = tx.objectStore(STORES.SETTINGS);
        store.put({ id: 'app_settings', settings });
        tx.oncomplete = () => resolve();
        tx.onerror = () => resolve();
      } catch {
        resolve();
      }
    });
  }

  async getDayRecord(date: string, studentId?: string): Promise<DayRecord | null> {
    const db = await this.getDB();
    if (!db) {
      const all: Record<string, DayRecord> = this.fallbackMemory.get(STORES.DAY_RECORDS) || {};
      const record = all[date] || null;
      return studentId && record?.studentId === studentId ? record : null;
    }

    return new Promise((resolve) => {
      try {
        const tx = db.transaction(STORES.DAY_RECORDS, 'readonly');
        const store = tx.objectStore(STORES.DAY_RECORDS);
        const index = store.index('date');
        const request = index.getAll(date);

        request.onsuccess = () => {
          const results = request.result;
          const list = (results || []) as DayRecord[];
          const record = studentId ? (list.filter((item) => item.studentId === studentId).at(-1) || null) : null;
          resolve(record);
        };

        request.onerror = () => {
          const all: Record<string, DayRecord> = this.fallbackMemory.get(STORES.DAY_RECORDS) || {};
          const record = all[date] || null;
          resolve(studentId && record?.studentId === studentId ? record : null);
        };
      } catch {
        const all: Record<string, DayRecord> = this.fallbackMemory.get(STORES.DAY_RECORDS) || {};
        const record = all[date] || null;
        resolve(studentId && record?.studentId === studentId ? record : null);
      }
    });
  }

  async saveDayRecord(record: DayRecord): Promise<void> {
    const all: Record<string, DayRecord> = this.fallbackMemory.get(STORES.DAY_RECORDS) || {};
    all[record.date] = record;
    this.saveToLocalStorage(STORES.DAY_RECORDS, all);

    const db = await this.getDB();
    if (!db) return;

    return new Promise((resolve) => {
      try {
        const tx = db.transaction(STORES.DAY_RECORDS, 'readwrite');
        const store = tx.objectStore(STORES.DAY_RECORDS);
        store.put(record);
        tx.oncomplete = () => resolve();
        tx.onerror = () => resolve();
      } catch {
        resolve();
      }
    });
  }

  async deleteDayRecord(id: string): Promise<void> {
    const all: Record<string, DayRecord> = this.fallbackMemory.get(STORES.DAY_RECORDS) || {};
    const keyToDelete = Object.keys(all).find((k) => all[k].id === id);
    if (keyToDelete) {
      delete all[keyToDelete];
      this.saveToLocalStorage(STORES.DAY_RECORDS, all);
    }

    const db = await this.getDB();
    if (!db) return;

    return new Promise((resolve) => {
      try {
        const tx = db.transaction(STORES.DAY_RECORDS, 'readwrite');
        const store = tx.objectStore(STORES.DAY_RECORDS);
        store.delete(id);
        tx.oncomplete = () => resolve();
        tx.onerror = () => resolve();
      } catch {
        resolve();
      }
    });
  }

  async getMasteryRecord(studentId: string, conceptId: string): Promise<MasteryRecord | null> {
    const compositeId = `${studentId}_${conceptId}`;
    const db = await this.getDB();
    if (!db) {
      const records = this.fallbackMemory.get(STORES.MASTERY_RECORDS) || {};
      return records[compositeId] || null;
    }

    return new Promise((resolve) => {
      try {
        const tx = db.transaction(STORES.MASTERY_RECORDS, 'readonly');
        const store = tx.objectStore(STORES.MASTERY_RECORDS);
        const req = store.get(compositeId);
        req.onsuccess = () => resolve(req.result || null);
        req.onerror = () => resolve(null);
      } catch {
        const records = this.fallbackMemory.get(STORES.MASTERY_RECORDS) || {};
        resolve(records[compositeId] || null);
      }
    });
  }

  async getAllMasteryRecords(studentId: string): Promise<MasteryRecord[]> {
    const db = await this.getDB();
    if (!db) {
      const recordsMap = this.fallbackMemory.get(STORES.MASTERY_RECORDS) || {};
      return Object.values(recordsMap).filter((r: any) => r.studentId === studentId) as MasteryRecord[];
    }

    return new Promise((resolve) => {
      try {
        const tx = db.transaction(STORES.MASTERY_RECORDS, 'readonly');
        const store = tx.objectStore(STORES.MASTERY_RECORDS);
        const index = store.index('studentId');
        const req = index.getAll(studentId);
        req.onsuccess = () => resolve(req.result || []);
        req.onerror = () => {
          const recordsMap = this.fallbackMemory.get(STORES.MASTERY_RECORDS) || {};
          resolve(Object.values(recordsMap).filter((r: any) => r.studentId === studentId) as MasteryRecord[]);
        };
      } catch {
        const recordsMap = this.fallbackMemory.get(STORES.MASTERY_RECORDS) || {};
        resolve(Object.values(recordsMap).filter((r: any) => r.studentId === studentId) as MasteryRecord[]);
      }
    });
  }

  async saveMasteryRecord(record: MasteryRecord): Promise<void> {
    const compositeId = `${record.studentId}_${record.conceptId}`;
    const normalized: MasteryRecord = {
      ...record,
      id: compositeId,
    };

    const recordsMap = this.fallbackMemory.get(STORES.MASTERY_RECORDS) || {};
    recordsMap[compositeId] = normalized;
    this.saveToLocalStorage(STORES.MASTERY_RECORDS, recordsMap);

    const db = await this.getDB();
    if (!db) return;

    return new Promise((resolve) => {
      try {
        const tx = db.transaction(STORES.MASTERY_RECORDS, 'readwrite');
        const store = tx.objectStore(STORES.MASTERY_RECORDS);
        store.put(normalized);
        tx.oncomplete = () => resolve();
        tx.onerror = () => resolve();
      } catch {
        resolve();
      }
    });
  }

  async deleteMasteryRecord(studentId: string, conceptId: string): Promise<void> {
    const compositeId = `${studentId}_${conceptId}`;
    const recordsMap = this.fallbackMemory.get(STORES.MASTERY_RECORDS) || {};
    delete recordsMap[compositeId];
    this.saveToLocalStorage(STORES.MASTERY_RECORDS, recordsMap);

    const db = await this.getDB();
    if (!db) return;

    return new Promise((resolve) => {
      try {
        const tx = db.transaction(STORES.MASTERY_RECORDS, 'readwrite');
        const store = tx.objectStore(STORES.MASTERY_RECORDS);
        store.delete(compositeId);
        tx.oncomplete = () => resolve();
        tx.onerror = () => resolve();
      } catch {
        resolve();
      }
    });
  }

  async getMissions(studentId: string, date: string): Promise<Mission[]> {
    const db = await this.getDB();
    if (!db) {
      const all: Record<string, Mission> = this.fallbackMemory.get(STORES.MISSIONS) || {};
      return Object.values(all).filter((m) => m.studentId === studentId && m.date === date);
    }

    return new Promise((resolve) => {
      try {
        const tx = db.transaction(STORES.MISSIONS, 'readonly');
        const store = tx.objectStore(STORES.MISSIONS);
        const index = store.index('date');
        const req = index.getAll(date);
        req.onsuccess = () => {
          const list = (req.result || []) as Mission[];
          resolve(list.filter((m) => m.studentId === studentId));
        };
        req.onerror = () => {
          const all: Record<string, Mission> = this.fallbackMemory.get(STORES.MISSIONS) || {};
          resolve(Object.values(all).filter((m) => m.studentId === studentId && m.date === date));
        };
      } catch {
        const all: Record<string, Mission> = this.fallbackMemory.get(STORES.MISSIONS) || {};
        resolve(Object.values(all).filter((m) => m.studentId === studentId && m.date === date));
      }
    });
  }

  async saveMission(mission: Mission): Promise<void> {
    const missionsMap = this.fallbackMemory.get(STORES.MISSIONS) || {};
    missionsMap[mission.id] = mission;
    this.saveToLocalStorage(STORES.MISSIONS, missionsMap);

    const db = await this.getDB();
    if (!db) return;

    return new Promise((resolve) => {
      try {
        const tx = db.transaction(STORES.MISSIONS, 'readwrite');
        const store = tx.objectStore(STORES.MISSIONS);
        store.put(mission);
        tx.oncomplete = () => resolve();
        tx.onerror = () => resolve();
      } catch {
        resolve();
      }
    });
  }

  async saveMissions(missions: Mission[]): Promise<void> {
    const missionsMap = this.fallbackMemory.get(STORES.MISSIONS) || {};
    missions.forEach((m) => {
      missionsMap[m.id] = m;
    });
    this.saveToLocalStorage(STORES.MISSIONS, missionsMap);

    const db = await this.getDB();
    if (!db) return;

    return new Promise((resolve) => {
      try {
        const tx = db.transaction(STORES.MISSIONS, 'readwrite');
        const store = tx.objectStore(STORES.MISSIONS);
        missions.forEach((m) => store.put(m));
        tx.oncomplete = () => resolve();
        tx.onerror = () => resolve();
      } catch {
        resolve();
      }
    });
  }

  async saveMissionOutcome(outcome: MissionOutcome): Promise<void> {
    const outcomesMap = this.fallbackMemory.get(STORES.MISSION_OUTCOMES) || {};
    outcomesMap[outcome.id] = outcome;
    this.saveToLocalStorage(STORES.MISSION_OUTCOMES, outcomesMap);

    const db = await this.getDB();
    if (!db) return;

    return new Promise((resolve) => {
      try {
        const tx = db.transaction(STORES.MISSION_OUTCOMES, 'readwrite');
        const store = tx.objectStore(STORES.MISSION_OUTCOMES);
        store.put(outcome);
        tx.oncomplete = () => resolve();
        tx.onerror = () => resolve();
      } catch {
        resolve();
      }
    });
  }

  async getHomeworkItems(studentId: string, date?: string): Promise<HomeworkItem[]> {
    const memoryItems: Record<string, HomeworkItem> = this.fallbackMemory.get(STORES.HOMEWORK_ITEMS) || {};
    const fallbackList = Object.values(memoryItems).filter(
      (h) => Boolean(h.studentId) && h.studentId === studentId && (!date || h.date === date)
    );

    const db = await this.getDB();
    if (!db) return fallbackList;

    return new Promise((resolve) => {
      try {
        const tx = db.transaction(STORES.HOMEWORK_ITEMS, 'readonly');
        const store = tx.objectStore(STORES.HOMEWORK_ITEMS);
        const req = store.getAll();
        req.onsuccess = () => {
          const results = (req.result as HomeworkItem[]) || [];
          const filtered = results.filter(
            (h) => Boolean(h.studentId) && h.studentId === studentId && (!date || h.date === date)
          );
          resolve(filtered.length > 0 ? filtered : fallbackList);
        };
        req.onerror = () => resolve(fallbackList);
      } catch {
        resolve(fallbackList);
      }
    });
  }

  async getHomeworkItem(id: string): Promise<HomeworkItem | null> {
    const memoryItems: Record<string, HomeworkItem> = this.fallbackMemory.get(STORES.HOMEWORK_ITEMS) || {};
    if (memoryItems[id]) return memoryItems[id];

    const db = await this.getDB();
    if (!db) return memoryItems[id] || null;

    return new Promise((resolve) => {
      try {
        const tx = db.transaction(STORES.HOMEWORK_ITEMS, 'readonly');
        const store = tx.objectStore(STORES.HOMEWORK_ITEMS);
        const req = store.get(id);
        req.onsuccess = () => resolve((req.result as HomeworkItem) || memoryItems[id] || null);
        req.onerror = () => resolve(memoryItems[id] || null);
      } catch {
        resolve(memoryItems[id] || null);
      }
    });
  }

  async saveHomeworkItem(item: HomeworkItem): Promise<void> {
    const itemId = item.id || `hw_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const safeItem = { ...item, id: itemId };
    const memoryItems = this.fallbackMemory.get(STORES.HOMEWORK_ITEMS) || {};
    memoryItems[itemId] = safeItem;
    this.saveToLocalStorage(STORES.HOMEWORK_ITEMS, memoryItems);

    const db = await this.getDB();
    if (!db) return;

    return new Promise((resolve) => {
      try {
        const tx = db.transaction(STORES.HOMEWORK_ITEMS, 'readwrite');
        const store = tx.objectStore(STORES.HOMEWORK_ITEMS);
        store.put(safeItem);
        tx.oncomplete = () => resolve();
        tx.onerror = () => resolve();
      } catch {
        resolve();
      }
    });
  }

  async saveHomeworkItems(items: HomeworkItem[]): Promise<void> {
    const memoryItems = this.fallbackMemory.get(STORES.HOMEWORK_ITEMS) || {};
    const safeList = items.map((item, idx) => ({
      ...item,
      id: item.id || `hw_${Date.now()}_${idx}`,
    }));
    safeList.forEach((item) => {
      memoryItems[item.id] = item;
    });
    this.saveToLocalStorage(STORES.HOMEWORK_ITEMS, memoryItems);

    const db = await this.getDB();
    if (!db) return;

    return new Promise((resolve) => {
      try {
        const tx = db.transaction(STORES.HOMEWORK_ITEMS, 'readwrite');
        const store = tx.objectStore(STORES.HOMEWORK_ITEMS);
        safeList.forEach((item) => store.put(item));
        tx.oncomplete = () => resolve();
        tx.onerror = () => resolve();
      } catch {
        resolve();
      }
    });
  }

  async deleteHomeworkItem(id: string): Promise<void> {
    const memoryItems = this.fallbackMemory.get(STORES.HOMEWORK_ITEMS) || {};
    delete memoryItems[id];
    this.saveToLocalStorage(STORES.HOMEWORK_ITEMS, memoryItems);

    const db = await this.getDB();
    if (!db) return;

    return new Promise((resolve) => {
      try {
        const tx = db.transaction(STORES.HOMEWORK_ITEMS, 'readwrite');
        const store = tx.objectStore(STORES.HOMEWORK_ITEMS);
        store.delete(id);
        tx.oncomplete = () => resolve();
        tx.onerror = () => resolve();
      } catch {
        resolve();
      }
    });
  }

  async getHomeworkSubmission(homeworkItemId: string, studentId: string): Promise<HomeworkSubmission | null> {
    const memorySubs: Record<string, HomeworkSubmission> =
      this.fallbackMemory.get(STORES.HOMEWORK_SUBMISSIONS) || {};
    const fallback =
      Object.values(memorySubs).find(
        (s) => s.homeworkItemId === homeworkItemId && s.studentId === studentId
      ) || null;

    const db = await this.getDB();
    if (!db) return fallback;

    return new Promise((resolve) => {
      try {
        const tx = db.transaction(STORES.HOMEWORK_SUBMISSIONS, 'readonly');
        const store = tx.objectStore(STORES.HOMEWORK_SUBMISSIONS);
        const req = store.getAll();
        req.onsuccess = () => {
          const all = (req.result as HomeworkSubmission[]) || [];
          const match = all.find(
            (s) => s.homeworkItemId === homeworkItemId && s.studentId === studentId
          );
          resolve(match || fallback);
        };
        req.onerror = () => resolve(fallback);
      } catch {
        resolve(fallback);
      }
    });
  }

  async saveHomeworkSubmission(submission: HomeworkSubmission): Promise<void> {
    const memorySubs = this.fallbackMemory.get(STORES.HOMEWORK_SUBMISSIONS) || {};
    memorySubs[submission.id] = submission;
    this.saveToLocalStorage(STORES.HOMEWORK_SUBMISSIONS, memorySubs);

    const db = await this.getDB();
    if (!db) return;

    return new Promise((resolve) => {
      try {
        const tx = db.transaction(STORES.HOMEWORK_SUBMISSIONS, 'readwrite');
        const store = tx.objectStore(STORES.HOMEWORK_SUBMISSIONS);
        store.put(submission);
        tx.oncomplete = () => resolve();
        tx.onerror = () => resolve();
      } catch {
        resolve();
      }
    });
  }

  async deleteHomeworkSubmission(id: string): Promise<void> {
    const memorySubs = this.fallbackMemory.get(STORES.HOMEWORK_SUBMISSIONS) || {};
    delete memorySubs[id];
    this.saveToLocalStorage(STORES.HOMEWORK_SUBMISSIONS, memorySubs);

    const db = await this.getDB();
    if (!db) return;

    return new Promise((resolve) => {
      try {
        const tx = db.transaction(STORES.HOMEWORK_SUBMISSIONS, 'readwrite');
        const store = tx.objectStore(STORES.HOMEWORK_SUBMISSIONS);
        store.delete(id);
        tx.oncomplete = () => resolve();
        tx.onerror = () => resolve();
      } catch {
        resolve();
      }
    });
  }

  async deleteHomeworkPhoto(submissionId: string): Promise<void> {
    const memorySubs = this.fallbackMemory.get(STORES.HOMEWORK_SUBMISSIONS) || {};
    if (memorySubs[submissionId]) {
      delete memorySubs[submissionId].photoDataUrl;
      memorySubs[submissionId].photoConsentGiven = false;
      this.saveToLocalStorage(STORES.HOMEWORK_SUBMISSIONS, memorySubs);
    }

    const db = await this.getDB();
    if (!db) return;

    return new Promise((resolve) => {
      try {
        const tx = db.transaction(STORES.HOMEWORK_SUBMISSIONS, 'readwrite');
        const store = tx.objectStore(STORES.HOMEWORK_SUBMISSIONS);
        const req = store.get(submissionId);
        req.onsuccess = () => {
          const sub = req.result as HomeworkSubmission;
          if (sub) {
            delete sub.photoDataUrl;
            sub.photoConsentGiven = false;
            store.put(sub);
          }
          resolve();
        };
        req.onerror = () => resolve();
      } catch {
        resolve();
      }
    });
  }

  async getDailyReview(studentId: string, date: string): Promise<DailyReview | null> {
    const memoryReviews: Record<string, DailyReview> = this.fallbackMemory.get(STORES.DAILY_REVIEWS) || {};
    const fallback =
      Object.values(memoryReviews).find((r) => r.studentId === studentId && r.date === date) || null;

    const db = await this.getDB();
    if (!db) return fallback;

    return new Promise((resolve) => {
      try {
        const tx = db.transaction(STORES.DAILY_REVIEWS, 'readonly');
        const store = tx.objectStore(STORES.DAILY_REVIEWS);
        const req = store.getAll();
        req.onsuccess = () => {
          const all = (req.result as DailyReview[]) || [];
          const match = all.find((r) => r.studentId === studentId && r.date === date);
          resolve(match || fallback);
        };
        req.onerror = () => resolve(fallback);
      } catch {
        resolve(fallback);
      }
    });
  }

  async saveDailyReview(review: DailyReview): Promise<void> {
    const memoryReviews = this.fallbackMemory.get(STORES.DAILY_REVIEWS) || {};
    memoryReviews[review.id] = review;
    this.saveToLocalStorage(STORES.DAILY_REVIEWS, memoryReviews);

    const db = await this.getDB();
    if (!db) return;

    return new Promise((resolve) => {
      try {
        const tx = db.transaction(STORES.DAILY_REVIEWS, 'readwrite');
        const store = tx.objectStore(STORES.DAILY_REVIEWS);
        store.put(review);
        tx.oncomplete = () => resolve();
        tx.onerror = () => resolve();
      } catch {
        resolve();
      }
    });
  }

  async getAllDailyReviews(studentId: string): Promise<DailyReview[]> {
    const memoryReviews: Record<string, DailyReview> = this.fallbackMemory.get(STORES.DAILY_REVIEWS) || {};
    const fallbackList = Object.values(memoryReviews).filter((r) => r.studentId === studentId);

    const db = await this.getDB();
    if (!db) return fallbackList;

    return new Promise((resolve) => {
      try {
        const tx = db.transaction(STORES.DAILY_REVIEWS, 'readonly');
        const store = tx.objectStore(STORES.DAILY_REVIEWS);
        const req = store.getAll();
        req.onsuccess = () => {
          const all = (req.result as DailyReview[]) || [];
          const filtered = all.filter((r) => r.studentId === studentId);
          resolve(filtered.length > 0 ? filtered : fallbackList);
        };
        req.onerror = () => resolve(fallbackList);
      } catch {
        resolve(fallbackList);
      }
    });
  }

  // --- PHASE 7: WEEKLY REVIEWS ---
  async getWeeklyReviews(studentId: string): Promise<WeeklyReview[]> {
    const memoryReviews: Record<string, WeeklyReview> = this.fallbackMemory.get(STORES.WEEKLY_REVIEWS) || {};
    const fallbackList = Object.values(memoryReviews).filter((r) => r.studentId === studentId);

    const db = await this.getDB();
    if (!db) return fallbackList;

    return new Promise((resolve) => {
      try {
        const tx = db.transaction(STORES.WEEKLY_REVIEWS, 'readonly');
        const store = tx.objectStore(STORES.WEEKLY_REVIEWS);
        const req = store.getAll();
        req.onsuccess = () => {
          const all = (req.result as WeeklyReview[]) || [];
          const filtered = all.filter((r) => r.studentId === studentId);
          resolve(filtered.length > 0 ? filtered : fallbackList);
        };
        req.onerror = () => resolve(fallbackList);
      } catch {
        resolve(fallbackList);
      }
    });
  }

  async getWeeklyReview(id: string): Promise<WeeklyReview | null> {
    const memoryReviews: Record<string, WeeklyReview> = this.fallbackMemory.get(STORES.WEEKLY_REVIEWS) || {};
    if (memoryReviews[id]) return memoryReviews[id];

    const db = await this.getDB();
    if (!db) return null;

    return new Promise((resolve) => {
      try {
        const tx = db.transaction(STORES.WEEKLY_REVIEWS, 'readonly');
        const store = tx.objectStore(STORES.WEEKLY_REVIEWS);
        const req = store.get(id);
        req.onsuccess = () => resolve((req.result as WeeklyReview) || null);
        req.onerror = () => resolve(null);
      } catch {
        resolve(null);
      }
    });
  }

  async saveWeeklyReview(review: WeeklyReview): Promise<void> {
    const memoryReviews: Record<string, WeeklyReview> = this.fallbackMemory.get(STORES.WEEKLY_REVIEWS) || {};
    memoryReviews[review.id] = review;
    this.fallbackMemory.set(STORES.WEEKLY_REVIEWS, memoryReviews);
    this.saveToLocalStorage(STORES.WEEKLY_REVIEWS, memoryReviews);

    const db = await this.getDB();
    if (!db) return;

    return new Promise((resolve) => {
      try {
        const tx = db.transaction(STORES.WEEKLY_REVIEWS, 'readwrite');
        const store = tx.objectStore(STORES.WEEKLY_REVIEWS);
        store.put(review);
        tx.oncomplete = () => resolve();
        tx.onerror = () => resolve();
      } catch {
        resolve();
      }
    });
  }

  // --- PHASE 7: SAVED ITEMS ---
  async getSavedItems(studentId: string): Promise<SavedItem[]> {
    const memoryItems: Record<string, SavedItem> = this.fallbackMemory.get(STORES.SAVED_ITEMS) || {};
    const fallbackList = Object.values(memoryItems).filter((i) => i.studentId === studentId);

    const db = await this.getDB();
    if (!db) return fallbackList;

    return new Promise((resolve) => {
      try {
        const tx = db.transaction(STORES.SAVED_ITEMS, 'readonly');
        const store = tx.objectStore(STORES.SAVED_ITEMS);
        const req = store.getAll();
        req.onsuccess = () => {
          const all = (req.result as SavedItem[]) || [];
          const filtered = all.filter((i) => i.studentId === studentId);
          resolve(filtered.length > 0 ? filtered : fallbackList);
        };
        req.onerror = () => resolve(fallbackList);
      } catch {
        resolve(fallbackList);
      }
    });
  }

  async saveSavedItem(item: SavedItem): Promise<void> {
    const memoryItems: Record<string, SavedItem> = this.fallbackMemory.get(STORES.SAVED_ITEMS) || {};
    memoryItems[item.id] = item;
    this.fallbackMemory.set(STORES.SAVED_ITEMS, memoryItems);
    this.saveToLocalStorage(STORES.SAVED_ITEMS, memoryItems);

    const db = await this.getDB();
    if (!db) return;

    return new Promise((resolve) => {
      try {
        const tx = db.transaction(STORES.SAVED_ITEMS, 'readwrite');
        const store = tx.objectStore(STORES.SAVED_ITEMS);
        store.put(item);
        tx.oncomplete = () => resolve();
        tx.onerror = () => resolve();
      } catch {
        resolve();
      }
    });
  }

  async deleteSavedItem(id: string): Promise<void> {
    const memoryItems: Record<string, SavedItem> = this.fallbackMemory.get(STORES.SAVED_ITEMS) || {};
    delete memoryItems[id];
    this.fallbackMemory.set(STORES.SAVED_ITEMS, memoryItems);
    this.saveToLocalStorage(STORES.SAVED_ITEMS, memoryItems);

    const db = await this.getDB();
    if (!db) return;

    return new Promise((resolve) => {
      try {
        const tx = db.transaction(STORES.SAVED_ITEMS, 'readwrite');
        const store = tx.objectStore(STORES.SAVED_ITEMS);
        store.delete(id);
        tx.oncomplete = () => resolve();
        tx.onerror = () => resolve();
      } catch {
        resolve();
      }
    });
  }

  // --- PHASE 7: COLLECTIONS ---
  async getCollections(studentId: string): Promise<Collection[]> {
    const memoryCols: Record<string, Collection> = this.fallbackMemory.get(STORES.COLLECTIONS) || {};
    const fallbackList = Object.values(memoryCols).filter((c) => c.studentId === studentId);

    const db = await this.getDB();
    if (!db) return fallbackList;

    return new Promise((resolve) => {
      try {
        const tx = db.transaction(STORES.COLLECTIONS, 'readonly');
        const store = tx.objectStore(STORES.COLLECTIONS);
        const req = store.getAll();
        req.onsuccess = () => {
          const all = (req.result as Collection[]) || [];
          const filtered = all.filter((c) => c.studentId === studentId);
          resolve(filtered.length > 0 ? filtered : fallbackList);
        };
        req.onerror = () => resolve(fallbackList);
      } catch {
        resolve(fallbackList);
      }
    });
  }

  async saveCollection(collection: Collection): Promise<void> {
    const memoryCols: Record<string, Collection> = this.fallbackMemory.get(STORES.COLLECTIONS) || {};
    memoryCols[collection.id] = collection;
    this.fallbackMemory.set(STORES.COLLECTIONS, memoryCols);
    this.saveToLocalStorage(STORES.COLLECTIONS, memoryCols);

    const db = await this.getDB();
    if (!db) return;

    return new Promise((resolve) => {
      try {
        const tx = db.transaction(STORES.COLLECTIONS, 'readwrite');
        const store = tx.objectStore(STORES.COLLECTIONS);
        store.put(collection);
        tx.oncomplete = () => resolve();
        tx.onerror = () => resolve();
      } catch {
        resolve();
      }
    });
  }

  async deleteCollection(id: string): Promise<void> {
    const memoryCols: Record<string, Collection> = this.fallbackMemory.get(STORES.COLLECTIONS) || {};
    delete memoryCols[id];
    this.fallbackMemory.set(STORES.COLLECTIONS, memoryCols);
    this.saveToLocalStorage(STORES.COLLECTIONS, memoryCols);

    const db = await this.getDB();
    if (!db) return;

    return new Promise((resolve) => {
      try {
        const tx = db.transaction(STORES.COLLECTIONS, 'readwrite');
        const store = tx.objectStore(STORES.COLLECTIONS);
        store.delete(id);
        tx.oncomplete = () => resolve();
        tx.onerror = () => resolve();
      } catch {
        resolve();
      }
    });
  }

  // --- PHASE 7: PARENT ACCOUNTS ---
  async getParentAccount(studentId: string): Promise<ParentAccount | null> {
    const memoryAccounts: Record<string, ParentAccount> = this.fallbackMemory.get(STORES.PARENT_ACCOUNTS) || {};
    const fallback = Object.values(memoryAccounts).find((a) => a.studentId === studentId) || null;

    const db = await this.getDB();
    if (!db) return fallback;

    return new Promise((resolve) => {
      try {
        const tx = db.transaction(STORES.PARENT_ACCOUNTS, 'readonly');
        const store = tx.objectStore(STORES.PARENT_ACCOUNTS);
        const req = store.getAll();
        req.onsuccess = () => {
          const all = (req.result as ParentAccount[]) || [];
          const found = all.find((a) => a.studentId === studentId);
          resolve(found || fallback);
        };
        req.onerror = () => resolve(fallback);
      } catch {
        resolve(fallback);
      }
    });
  }

  async saveParentAccount(account: ParentAccount): Promise<void> {
    const memoryAccounts: Record<string, ParentAccount> = this.fallbackMemory.get(STORES.PARENT_ACCOUNTS) || {};
    memoryAccounts[account.id] = account;
    this.fallbackMemory.set(STORES.PARENT_ACCOUNTS, memoryAccounts);
    this.saveToLocalStorage(STORES.PARENT_ACCOUNTS, memoryAccounts);

    const db = await this.getDB();
    if (!db) return;

    return new Promise((resolve) => {
      try {
        const tx = db.transaction(STORES.PARENT_ACCOUNTS, 'readwrite');
        const store = tx.objectStore(STORES.PARENT_ACCOUNTS);
        store.put(account);
        tx.oncomplete = () => resolve();
        tx.onerror = () => resolve();
      } catch {
        resolve();
      }
    });
  }

  async deleteParentAccount(id: string): Promise<void> {
    const memoryAccounts: Record<string, ParentAccount> = this.fallbackMemory.get(STORES.PARENT_ACCOUNTS) || {};
    delete memoryAccounts[id];
    this.fallbackMemory.set(STORES.PARENT_ACCOUNTS, memoryAccounts);
    this.saveToLocalStorage(STORES.PARENT_ACCOUNTS, memoryAccounts);

    const db = await this.getDB();
    if (!db) return;

    return new Promise((resolve) => {
      try {
        const tx = db.transaction(STORES.PARENT_ACCOUNTS, 'readwrite');
        const store = tx.objectStore(STORES.PARENT_ACCOUNTS);
        store.delete(id);
        tx.oncomplete = () => resolve();
        tx.onerror = () => resolve();
      } catch {
        resolve();
      }
    });
  }

  // --- PHASE 7: GAMIFICATION ---
  async getGamification(studentId: string): Promise<StudentGamification | null> {
    const memoryGam: Record<string, StudentGamification> = this.fallbackMemory.get(STORES.GAMIFICATION) || {};
    if (memoryGam[studentId]) return memoryGam[studentId];

    const db = await this.getDB();
    if (!db) return null;

    return new Promise((resolve) => {
      try {
        const tx = db.transaction(STORES.GAMIFICATION, 'readonly');
        const store = tx.objectStore(STORES.GAMIFICATION);
        const req = store.get(studentId);
        req.onsuccess = () => resolve((req.result as StudentGamification) || null);
        req.onerror = () => resolve(null);
      } catch {
        resolve(null);
      }
    });
  }

  async saveGamification(data: StudentGamification): Promise<void> {
    const memoryGam: Record<string, StudentGamification> = this.fallbackMemory.get(STORES.GAMIFICATION) || {};
    memoryGam[data.studentId] = data;
    this.fallbackMemory.set(STORES.GAMIFICATION, memoryGam);
    this.saveToLocalStorage(STORES.GAMIFICATION, memoryGam);

    const db = await this.getDB();
    if (!db) return;

    return new Promise((resolve) => {
      try {
        const tx = db.transaction(STORES.GAMIFICATION, 'readwrite');
        const store = tx.objectStore(STORES.GAMIFICATION);
        store.put(data);
        tx.oncomplete = () => resolve();
        tx.onerror = () => resolve();
      } catch {
        resolve();
      }
    });
  }

  async getTeachingSession(sessionId: string): Promise<TeachingSession | null> {
    const memorySessions = (this.fallbackMemory.get(STORES.TEACHING_SESSIONS) || []) as TeachingSession[];
    const inMem = memorySessions.find((s) => s.sessionId === sessionId);
    if (inMem) return inMem;

    const db = await this.getDB();
    if (!db) return null;

    return new Promise((resolve) => {
      try {
        const tx = db.transaction(STORES.TEACHING_SESSIONS, 'readonly');
        const store = tx.objectStore(STORES.TEACHING_SESSIONS);
        const req = store.get(sessionId);
        req.onsuccess = () => resolve(req.result || null);
        req.onerror = () => resolve(null);
      } catch {
        resolve(null);
      }
    });
  }

  async getTeachingSessionsForStudent(studentId: string): Promise<TeachingSession[]> {
    const memorySessions = (this.fallbackMemory.get(STORES.TEACHING_SESSIONS) || []) as TeachingSession[];
    const inMem = memorySessions.filter((s) => s.studentId === studentId);

    const db = await this.getDB();
    if (!db) return inMem;

    return new Promise((resolve) => {
      try {
        const tx = db.transaction(STORES.TEACHING_SESSIONS, 'readonly');
        const store = tx.objectStore(STORES.TEACHING_SESSIONS);
        const idx = store.index('studentId');
        const req = idx.getAll(studentId);
        req.onsuccess = () => {
          const results = req.result || [];
          resolve(results.length > 0 ? results : inMem);
        };
        req.onerror = () => resolve(inMem);
      } catch {
        resolve(inMem);
      }
    });
  }

  async saveTeachingSession(session: TeachingSession): Promise<void> {
    const memorySessions = (this.fallbackMemory.get(STORES.TEACHING_SESSIONS) || []) as TeachingSession[];
    const filtered = memorySessions.filter((s) => s.sessionId !== session.sessionId);
    filtered.push(session);
    this.saveToLocalStorage(STORES.TEACHING_SESSIONS, filtered);

    const db = await this.getDB();
    if (!db) return;

    return new Promise((resolve) => {
      try {
        const tx = db.transaction(STORES.TEACHING_SESSIONS, 'readwrite');
        const store = tx.objectStore(STORES.TEACHING_SESSIONS);
        store.put(session);
        tx.oncomplete = () => resolve();
        tx.onerror = () => resolve();
      } catch {
        resolve();
      }
    });
  }

  async deleteTeachingSession(sessionId: string): Promise<void> {
    const memorySessions = (this.fallbackMemory.get(STORES.TEACHING_SESSIONS) || []) as TeachingSession[];
    const filtered = memorySessions.filter((s) => s.sessionId !== sessionId);
    this.saveToLocalStorage(STORES.TEACHING_SESSIONS, filtered);

    const db = await this.getDB();
    if (!db) return;

    return new Promise((resolve) => {
      try {
        const tx = db.transaction(STORES.TEACHING_SESSIONS, 'readwrite');
        const store = tx.objectStore(STORES.TEACHING_SESSIONS);
        store.delete(sessionId);
        tx.oncomplete = () => resolve();
        tx.onerror = () => resolve();
      } catch {
        resolve();
      }
    });
  }

  async exportAllData(studentId: string): Promise<string> {
    const today = new Date().toISOString().split('T')[0];
    const [
      student,
      timetable,
      conversation,
      settings,
      masteryRecords,
      todayMissions,
      homeworkItems,
      dailyReviews,
      weeklyReviews,
      savedItems,
      collections,
      parentAccount,
      gamification,
      teachingSessions,
    ] = await Promise.all([
      this.getStudent(),
      this.getTimetable(),
      this.getConversation(),
      this.getSettings(),
      this.getAllMasteryRecords(studentId),
      this.getMissions(studentId, today),
      this.getHomeworkItems(studentId),
      this.getAllDailyReviews(studentId),
      this.getWeeklyReviews(studentId),
      this.getSavedItems(studentId),
      this.getCollections(studentId),
      this.getParentAccount(studentId),
      this.getGamification(studentId),
      this.getTeachingSessionsForStudent(studentId),
    ]);

    const exportPayload = {
      exportMetadata: {
        exportedAt: new Date().toISOString(),
        appName: 'AI School Companion',
        version: 'Phase 9 - The Teaching Session (The Real Tutor)',
        schemaVersion: 9,
      },
      student,
      timetable,
      conversation,
      settings,
      masteryRecords,
      totalMasteryRecordsCount: masteryRecords.length,
      todayMissions,
      homeworkItems,
      dailyReviews,
      weeklyReviews,
      savedItems,
      collections,
      parentAccount: parentAccount ? { ...parentAccount, pin: '****' } : null,
      gamification,
      teachingSessions,
    };

    return JSON.stringify(exportPayload, null, 2);
  }

  async resetProfile(): Promise<void> {
    this.saveToLocalStorage(STORES.STUDENT, null);
    this.saveToLocalStorage(STORES.CONVERSATION, null);
    const db = await this.getDB();
    if (!db) return;

    return new Promise((resolve) => {
      try {
        const tx = db.transaction([STORES.STUDENT, STORES.CONVERSATION], 'readwrite');
        tx.objectStore(STORES.STUDENT).clear();
        tx.objectStore(STORES.CONVERSATION).clear();
        tx.oncomplete = () => resolve();
        tx.onerror = () => resolve();
      } catch {
        resolve();
      }
    });
  }

  async clearAllData(): Promise<void> {
    for (const key of Object.values(STORES)) {
      this.saveToLocalStorage(key, null);
    }
    const db = await this.getDB();
    if (!db) return;

    return new Promise((resolve) => {
      try {
        const tx = db.transaction(
          [
            STORES.STUDENT,
            STORES.TIMETABLE,
            STORES.CONVERSATION,
            STORES.SETTINGS,
            STORES.DAY_RECORDS,
            STORES.MASTERY_RECORDS,
            STORES.MISSIONS,
            STORES.MISSION_OUTCOMES,
            STORES.HOMEWORK_ITEMS,
            STORES.HOMEWORK_SUBMISSIONS,
            STORES.DAILY_REVIEWS,
            STORES.WEEKLY_REVIEWS,
            STORES.SAVED_ITEMS,
            STORES.COLLECTIONS,
            STORES.PARENT_ACCOUNTS,
            STORES.GAMIFICATION,
            STORES.TEACHING_SESSIONS,
          ],
          'readwrite'
        );
        tx.objectStore(STORES.STUDENT).clear();
        tx.objectStore(STORES.TIMETABLE).clear();
        tx.objectStore(STORES.CONVERSATION).clear();
        tx.objectStore(STORES.SETTINGS).clear();
        tx.objectStore(STORES.DAY_RECORDS).clear();
        tx.objectStore(STORES.MASTERY_RECORDS).clear();
        tx.objectStore(STORES.MISSIONS).clear();
        tx.objectStore(STORES.MISSION_OUTCOMES).clear();
        tx.objectStore(STORES.HOMEWORK_ITEMS).clear();
        tx.objectStore(STORES.HOMEWORK_SUBMISSIONS).clear();
        tx.objectStore(STORES.DAILY_REVIEWS).clear();
        tx.objectStore(STORES.WEEKLY_REVIEWS).clear();
        tx.objectStore(STORES.SAVED_ITEMS).clear();
        tx.objectStore(STORES.COLLECTIONS).clear();
        tx.objectStore(STORES.PARENT_ACCOUNTS).clear();
        tx.objectStore(STORES.GAMIFICATION).clear();
        tx.objectStore(STORES.TEACHING_SESSIONS).clear();
        tx.oncomplete = () => resolve();
        tx.onerror = () => resolve();
      } catch {
        resolve();
      }
    });
  }
}
