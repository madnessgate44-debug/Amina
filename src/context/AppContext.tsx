/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';
import {
  Student,
  Timetable,
  AppSettings,
  NavigationTab,
  Language,
  DayRecord,
  MicPermissionState,
  MasteryRecord,
  EvidenceCorrectness,
  EvidenceIndependence,
  EvidenceModality,
  Mission,
  MissionOutcome,
  HomeworkSubmission,
  DailyReview,
  WeeklyReview,
  SavedItem,
  Collection,
  ParentAccount,
  ParentPreferences,
  StudentGamification,
  SpacedReviewSchedule,
  SpacedReviewSummary,
  SavableType,
} from '../types';
import { storageService } from '../services/storage';
import { translations } from '../i18n/translations';
import { voiceService } from '../services/voice/voiceService';
import {
  createInitialMasteryRecord,
  addEvidenceToMastery,
  applyDecay,
} from '../services/mastery/masteryEngine';
import { planDailyMissions } from '../services/missions/missionPlanner';
import { processMissionCompletion } from '../services/missions/missionCompletion';
import { generateDailyReview } from '../services/review/dailyReviewGenerator';
import {
  getAllSpacedReviewSchedules,
  getOverdueReviewNudges,
} from '../services/review/spacedReviewScheduler';
import { generateWeeklyReview } from '../services/review/weeklyReviewGenerator';
import {
  ensureDefaultCollections,
  saveItem,
  toggleLike,
  updateItemNote,
} from '../services/collections/collectionService';
import {
  linkParentAccount,
  verifyPin,
} from '../services/parent/parentService';
import {
  getOrInitGamification,
  awardMissionGamification,
} from '../services/gamification/gamificationService';
import { curriculumService } from '../services/curriculum/curriculumService';

export interface CompanionContext {
  source: 'home_next_action' | 'lesson' | 'weakness' | 'homework' | 'review' | 'general';
  lessonId?: string;
  conceptId?: string;
  missionId?: string;
  subjectId?: string;
  subjectName?: string;
  topic?: string;
  notes?: string;
  whyNow?: string;
  schoolDaySummary?: string;
  masterySummary?: string;
  reasonWhyRecommended?: string;
}

interface AppContextValue {
  student: Student | null;
  timetable: Timetable | null;
  settings: AppSettings;
  activeTab: NavigationTab;
  isLoading: boolean;
  toastMessage: string | null;
  t: typeof translations.ar;
  language: Language;
  currentDayRecord: DayRecord | null;
  isWelcomeHomeDismissed: boolean;
  isReconstructingDay: boolean;
  masteryRecords: Record<string, MasteryRecord>;
  missionsForToday: Mission[];
  activeMission: Mission | null;
  activeMissionRunnerOpen: boolean;
  plannerExplanation: {
    droppedCount: number;
    droppedMessage?: string;
    isMinimumViableDay: boolean;
    usedTimetableFallback: boolean;
    totalEstimatedMinutes: number;
    budgetMinutes: number;
    parentOverrideApplied?: boolean;
    parentOverrideMessage?: string;
  } | null;
  dismissWelcomeHome: () => void;
  setIsReconstructingDay: (val: boolean) => void;
  setActiveTab: (tab: NavigationTab) => void;
  saveStudent: (student: Student) => Promise<void>;
  saveTimetable: (timetable: Timetable) => Promise<void>;
  saveDayRecord: (record: DayRecord) => Promise<void>;
  deleteDayRecord: (id: string) => Promise<void>;
  setLanguage: (lang: Language) => Promise<void>;
  setSimulatedTimeOfDay: (mode: 'school_hours' | 'after_school') => Promise<void>;
  toggleDemoTimeSimulator: (active: boolean) => Promise<void>;
  toggleCompanionVoice: (enabled: boolean) => Promise<void>;
  updateMicPermission: (status: MicPermissionState) => Promise<void>;
  toggleShowEvidenceLog: (show: boolean) => Promise<void>;
  recordEvidence: (
    conceptId: string,
    params: {
      correctness: EvidenceCorrectness;
      difficulty: number;
      independence: EvidenceIndependence;
      modality: EvidenceModality;
      notes?: string;
    }
  ) => Promise<MasteryRecord>;
  simulateDecayDays: (days: number) => Promise<void>;
  resetSimulatedDecay: () => Promise<void>;
  getMasteryForConcept: (conceptId: string) => MasteryRecord | null;
  startMission: (mission: Mission) => void;
  closeMissionRunner: () => void;
  completeMission: (missionId: string, outcomeParams?: { score?: number; modality?: 'quiz' | 'reel_check' | 'practice' | 'homework' }) => Promise<void>;
  skipMission: (missionId: string, reason?: string) => Promise<void>;
  regenerateMissionsForToday: (declaredMinutes?: number) => Promise<void>;
  currentDailyReview: DailyReview | null;
  isDailyReviewOpen: boolean;
  openDailyReview: () => Promise<DailyReview>;
  closeDailyReview: () => void;
  homeworkSubmissions: Record<string, HomeworkSubmission>;
  getHomeworkSubmission: (homeworkItemId: string) => Promise<HomeworkSubmission | null>;
  saveHomeworkSubmission: (sub: HomeworkSubmission) => Promise<void>;
  exportProgressData: () => Promise<void>;
  resetProfile: () => Promise<void>;
  clearAllData: () => Promise<void>;
  showToast: (msg: string) => void;

  // Phase 7 Deliberables
  allReviewSchedules: SpacedReviewSummary;
  dueReviewNudges: SpacedReviewSchedule[];
  triggerManualReview: (conceptId: string) => void;
  weeklyReviews: WeeklyReview[];
  generateAndOpenWeeklyReview: (manualTrigger?: boolean) => Promise<WeeklyReview>;
  savedItems: SavedItem[];
  collections: Collection[];
  saveContent: (payload: {
    type: SavableType;
    sourceId: string;
    title: string;
    subject?: string;
    snippet?: string;
    note?: string;
    collectionIds: string[];
    isLiked?: boolean;
  }) => Promise<SavedItem>;
  toggleLikeContent: (
    sourceId: string,
    meta: {
      type: SavableType;
      title: string;
      subject?: string;
      snippet?: string;
    }
  ) => Promise<boolean>;
  createCollection: (name: string, nameAr?: string) => Promise<Collection>;
  updateSavedNote: (itemId: string, note: string) => Promise<void>;
  removeSavedItem: (itemId: string) => Promise<void>;
  parentAccount: ParentAccount | null;
  isParentModeActive: boolean;
  linkParent: (data: {
    parentEmail: string;
    parentName: string;
    pin: string;
    preferences?: Partial<ParentPreferences>;
  }) => Promise<void>;
  verifyAndEnterParentMode: (pin: string) => Promise<boolean>;
  exitParentMode: () => void;
  updateParentPrefs: (pin: string, newPrefs: Partial<ParentPreferences>) => Promise<boolean>;
  unlinkParent: (pin: string) => Promise<boolean>;
  gamification: StudentGamification | null;
  gentleCompanionNudge: string | null;
  dismissGentleNudge: () => void;
  selectedCurriculumLessonId: string | null;
  setSelectedCurriculumLessonId: (id: string | null) => void;
  companionContext: CompanionContext | null;
  setCompanionContext: (ctx: CompanionContext | null) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [student, setStudent] = useState<Student | null>(null);
  const [timetable, setTimetable] = useState<Timetable | null>(null);
  const [currentDayRecord, setCurrentDayRecord] = useState<DayRecord | null>(null);
  const [isWelcomeHomeDismissed, setIsWelcomeHomeDismissed] = useState<boolean>(false);
  const [isReconstructingDay, setIsReconstructingDay] = useState<boolean>(false);
  const [settings, setSettings] = useState<AppSettings>({
    language: 'ar',
    demoTimeSimulatorActive: true,
    simulatedTimeOfDay: 'after_school',
    simulatedTime: '14:30',
    companionVoiceEnabled: true,
    micPermissionStatus: 'prompt',
    showEvidenceLog: false,
    simulatedDaysOffset: 0,
  });
  const [masteryRecords, setMasteryRecords] = useState<Record<string, MasteryRecord>>({});
  const [missionsForToday, setMissionsForToday] = useState<Mission[]>([]);
  const [activeMission, setActiveMission] = useState<Mission | null>(null);
  const [activeMissionRunnerOpen, setActiveMissionRunnerOpen] = useState<boolean>(false);
  const [currentDailyReview, setCurrentDailyReview] = useState<DailyReview | null>(null);
  const [isDailyReviewOpen, setIsDailyReviewOpen] = useState<boolean>(false);
  const [homeworkSubmissions, setHomeworkSubmissions] = useState<Record<string, HomeworkSubmission>>({});
  const [plannerExplanation, setPlannerExplanation] = useState<{
    droppedCount: number;
    droppedMessage?: string;
    isMinimumViableDay: boolean;
    usedTimetableFallback: boolean;
    totalEstimatedMinutes: number;
    budgetMinutes: number;
    parentOverrideApplied?: boolean;
    parentOverrideMessage?: string;
  } | null>(null);
  const [activeTab, setActiveTab] = useState<NavigationTab>('home');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [selectedCurriculumLessonId, setSelectedCurriculumLessonId] = useState<string | null>(null);
  const [companionContext, setCompanionContext] = useState<CompanionContext | null>(null);

  // Phase 7 States
  const [weeklyReviews, setWeeklyReviews] = useState<WeeklyReview[]>([]);
  const [savedItems, setSavedItems] = useState<SavedItem[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [parentAccount, setParentAccount] = useState<ParentAccount | null>(null);
  const [isParentModeActive, setIsParentModeActive] = useState<boolean>(false);
  const [gamification, setGamification] = useState<StudentGamification | null>(null);
  const [gentleCompanionNudge, setGentleCompanionNudge] = useState<string | null>(null);
  const [missionRejectionCounts, setMissionRejectionCounts] = useState<Record<string, number>>({});

  // Synchronize document dir and lang attributes
  const updateDocumentDirection = (lang: Language) => {
    if (typeof document !== 'undefined') {
      const isRtl = lang === 'ar';
      document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
      document.documentElement.lang = lang;
      if (isRtl) {
        document.documentElement.classList.add('font-sans');
      }
    }
  };

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3500);
  }, []);

  // Initial Load from Storage
  useEffect(() => {
    async function loadInitialData() {
      try {
        const storedSettings = await storageService.getSettings();
        
        // Detect mic permission status
        const initialMicStatus = await voiceService.getMicPermissionStatus();
        const settingsWithMic: AppSettings = {
          ...storedSettings,
          companionVoiceEnabled: storedSettings.companionVoiceEnabled ?? true,
          micPermissionStatus: initialMicStatus,
        };

        setSettings(settingsWithMic);
        updateDocumentDirection(storedSettings.language);

        const storedStudent = await storageService.getStudent();
        setStudent(storedStudent);

        if (storedStudent) {
          // Student exists: safely load their timetable if previously saved by user
          let storedTimetable = await storageService.getTimetable(storedStudent.id);
          if (!storedTimetable) {
            storedTimetable = await storageService.getTimetable();
          }
          // If student has no saved timetable, do NOT silently invent a fake one!
          setTimetable(storedTimetable || null);

          // Load today's day record
          const todayDate = new Date().toISOString().split('T')[0];
          const record = await storageService.getDayRecord(todayDate);
          setCurrentDayRecord(record);

          // Load mastery records for student
          const studentId = storedStudent.id;
          const rawMastery = await storageService.getAllMasteryRecords(studentId);
          const map: Record<string, MasteryRecord> = {};
          const daysOffset = storedSettings.simulatedDaysOffset || 0;
          for (const item of rawMastery) {
            map[item.conceptId] = daysOffset > 0 ? applyDecay(item, new Date(), daysOffset) : item;
          }
          setMasteryRecords(map);

          // Load today's missions or generate if empty
          const storedMissions = await storageService.getMissions(studentId, todayDate);
          if (storedMissions && storedMissions.length > 0) {
            setMissionsForToday(storedMissions);
          } else {
            const planned = planDailyMissions({
              student: storedStudent,
              dayRecord: record,
              timetable: storedTimetable,
              masteryRecords: map,
              availableMinutes: 45,
              language: storedSettings.language,
            });
            setMissionsForToday(planned.missions);
            setPlannerExplanation(planned.explanation);
            await storageService.saveMissions(planned.missions);
          }

          // Load Phase 7 Collections, Saved items, Weekly Reviews, Parent, Gamification
          const userCollections = await ensureDefaultCollections(studentId, storageService);
          setCollections(userCollections);

          const userSaved = await storageService.getSavedItems(studentId);
          setSavedItems(userSaved);

          const userReviews = await storageService.getWeeklyReviews(studentId);
          setWeeklyReviews(userReviews);

          const userParent = await storageService.getParentAccount(studentId);
          setParentAccount(userParent);

          const userGamification = await getOrInitGamification(studentId, storageService);
          setGamification(userGamification);
        } else {
          // Genuinely empty installation: No student exists.
          // Do NOT create Amina automatically. Onboarding will be displayed.
          setTimetable(null);
          setCurrentDayRecord(null);
          setMasteryRecords({});
          setMissionsForToday([]);
          setCollections([]);
          setSavedItems([]);
          setWeeklyReviews([]);
          setParentAccount(null);
          setGamification(null);
        }
      } catch (err) {
        console.error('Failed to load initial data:', err);
      } finally {
        setIsLoading(false);
      }
    }

    loadInitialData();
  }, []);

  const handleSaveStudent = async (newStudent: Student) => {
    // 1. Persist the newly created student profile
    await storageService.saveStudent(newStudent);
    setStudent(newStudent);

    // 2. Load timetable if already saved, otherwise leave null until set up by user
    let studentTimetable = await storageService.getTimetable(newStudent.id);
    if (!studentTimetable) {
      studentTimetable = await storageService.getTimetable();
    }
    setTimetable(studentTimetable || null);

    // 3. Initialize required student-scoped baseline data
    const studentId = newStudent.id;
    const userCollections = await ensureDefaultCollections(studentId, storageService);
    setCollections(userCollections);

    const userGamification = await getOrInitGamification(studentId, storageService);
    setGamification(userGamification);

    const todayDate = new Date().toISOString().split('T')[0];
    const planned = planDailyMissions({
      student: newStudent,
      dayRecord: null,
      timetable: studentTimetable,
      masteryRecords: {},
      availableMinutes: 45,
      language: settings.language,
    });
    setMissionsForToday(planned.missions);
    setPlannerExplanation(planned.explanation);
    await storageService.saveMissions(planned.missions);
  };

  const handleSaveTimetable = async (newTimetable: Timetable) => {
    await storageService.saveTimetable(newTimetable);
    setTimetable(newTimetable);
    showToast(settings.language === 'ar' ? 'تم حفظ جدول الحصص بنجاح' : 'Timetable saved successfully');
  };

  const handleSaveDayRecord = async (record: DayRecord) => {
    await storageService.saveDayRecord(record);
    setCurrentDayRecord(record);
    if (record.confirmed) {
      showToast(settings.language === 'ar' ? 'تم اعتماد وتثبيت سجل اليوم بنجاح!' : 'Day record confirmed and saved successfully!');
      // Re-plan missions from newly confirmed Day Record
      if (student) {
        const planned = planDailyMissions({
          student,
          dayRecord: record,
          timetable,
          masteryRecords,
          availableMinutes: 45,
          language: settings.language,
        });
        setMissionsForToday(planned.missions);
        setPlannerExplanation(planned.explanation);
        await storageService.saveMissions(planned.missions);
      }
    }
  };

  const handleDeleteDayRecord = async (id: string) => {
    await storageService.deleteDayRecord(id);
    setCurrentDayRecord(null);
    showToast(settings.language === 'ar' ? 'تم حذف سجل اليوم' : 'Day record deleted');
  };

  const handleDismissWelcomeHome = () => {
    setIsWelcomeHomeDismissed(true);
  };

  const handleSetLanguage = async (newLang: Language) => {
    const updated: AppSettings = { ...settings, language: newLang };
    setSettings(updated);
    updateDocumentDirection(newLang);
    await storageService.saveSettings(updated);
  };

  const handleSetSimulatedTimeOfDay = async (mode: 'school_hours' | 'after_school') => {
    const updated: AppSettings = {
      ...settings,
      simulatedTimeOfDay: mode,
      simulatedTime: mode === 'school_hours' ? '10:00' : '14:30',
    };
    setSettings(updated);
    await storageService.saveSettings(updated);
  };

  const handleToggleDemoTimeSimulator = async (active: boolean) => {
    const updated: AppSettings = { ...settings, demoTimeSimulatorActive: active };
    setSettings(updated);
    await storageService.saveSettings(updated);
  };

  const handleToggleCompanionVoice = async (enabled: boolean) => {
    const updated: AppSettings = { ...settings, companionVoiceEnabled: enabled };
    setSettings(updated);
    await storageService.saveSettings(updated);
    if (!enabled) {
      voiceService.cancelSpeech();
    }
  };

  const handleUpdateMicPermission = async (status: MicPermissionState) => {
    const updated: AppSettings = { ...settings, micPermissionStatus: status };
    setSettings(updated);
    await storageService.saveSettings(updated);
  };

  const handleToggleShowEvidenceLog = async (show: boolean) => {
    const updated: AppSettings = { ...settings, showEvidenceLog: show };
    setSettings(updated);
    await storageService.saveSettings(updated);
  };

  const handleGetMasteryForConcept = (conceptId: string): MasteryRecord | null => {
    return masteryRecords[conceptId] || null;
  };

  const handleRecordEvidence = async (
    conceptId: string,
    params: {
      correctness: EvidenceCorrectness;
      difficulty: number;
      independence: EvidenceIndependence;
      modality: EvidenceModality;
      notes?: string;
    }
  ): Promise<MasteryRecord> => {
    if (!student?.id) {
      console.warn('Cannot record evidence: no active student profile');
      return null as any;
    }

    const flatConcepts = curriculumService.getFlatConcepts();
    const conceptExists = flatConcepts.some((c) => c.id === conceptId);
    if (!conceptExists) {
      console.warn(`Cannot record evidence: concept "${conceptId}" not found in authoritative curriculum`);
      return null as any;
    }

    const studentId = student.id;
    const existing =
      masteryRecords[conceptId] || createInitialMasteryRecord(studentId, conceptId);

    const { updatedRecord, newEntry } = addEvidenceToMastery(existing, params);

    await storageService.saveMasteryRecord(updatedRecord);
    setMasteryRecords((prev) => ({
      ...prev,
      [conceptId]: updatedRecord,
    }));

    const deltaSign = newEntry.deltaApplied >= 0 ? '+' : '';
    const deltaDisplay = `${deltaSign}${(newEntry.deltaApplied * 100).toFixed(1)}%`;
    showToast(
      settings.language === 'ar'
        ? `تم تسجيل الدليل بنجاح (${deltaDisplay})`
        : `Evidence recorded (${deltaDisplay})`
    );

    return updatedRecord;
  };

  const handleSimulateDecayDays = async (days: number) => {
    if (!student?.id) return;
    const newOffset = (settings.simulatedDaysOffset || 0) + days;
    const updated: AppSettings = {
      ...settings,
      simulatedDaysOffset: newOffset,
    };
    setSettings(updated);
    await storageService.saveSettings(updated);

    const studentId = student.id;
    const persistedRecords = await storageService.getAllMasteryRecords(studentId);
    const updatedMap: Record<string, MasteryRecord> = {};

    for (const r of persistedRecords) {
      updatedMap[r.conceptId] = applyDecay(r, new Date(), newOffset);
    }

    setMasteryRecords(updatedMap);
    showToast(
      settings.language === 'ar'
        ? `تمت محاكاة مرور ${days} يوماً وتطبيق التلاشي الزمني`
        : `Simulated ${days} days decay on mastery records`
    );
  };

  const handleResetSimulatedDecay = async () => {
    if (!student?.id) return;
    const updated: AppSettings = {
      ...settings,
      simulatedDaysOffset: 0,
    };
    setSettings(updated);
    await storageService.saveSettings(updated);

    const studentId = student.id;
    const persistedRecords = await storageService.getAllMasteryRecords(studentId);
    const updatedMap: Record<string, MasteryRecord> = {};
    for (const r of persistedRecords) {
      updatedMap[r.conceptId] = r;
    }
    setMasteryRecords(updatedMap);
    showToast(
      settings.language === 'ar'
        ? 'تمت إعادة ضبط محاكي التلاشي للوقت الحقيقي'
        : 'Reset simulated decay to real time'
    );
  };

  const handleStartMission = (mission: Mission) => {
    setActiveMission(mission);
    setActiveMissionRunnerOpen(true);
    // Mark mission as started
    const updated = missionsForToday.map((m) =>
      m.id === mission.id ? { ...m, status: 'started' as const } : m
    );
    setMissionsForToday(updated);
    storageService.saveMission({ ...mission, status: 'started' });
  };

  const handleCloseMissionRunner = () => {
    setActiveMissionRunnerOpen(false);
    setActiveMission(null);
  };

  const handleCompleteMission = async (
    missionId: string,
    outcomeParams?: { score?: number; modality?: 'quiz' | 'reel_check' | 'practice' | 'homework' }
  ) => {
    const mission = missionsForToday.find((m) => m.id === missionId);

    const result = await processMissionCompletion({
      student,
      mission,
      outcomeParams,
      storage: storageService,
      masteryRecords,
      onRecordEvidence: handleRecordEvidence,
    });

    if (!result.success || !result.completedMission) {
      return;
    }

    setMissionsForToday((prev) =>
      prev.map((m) => (m.id === missionId ? result.completedMission! : m))
    );

    if (result.updatedGamification) {
      setGamification(result.updatedGamification);
    }

    setActiveMissionRunnerOpen(false);
    setActiveMission(null);
    if (mission) {
      showToast(
        settings.language === 'ar'
          ? `أحسنت يا بطل! تم إنجاز المهمة: ${mission.title}`
          : `Well done! Completed mission: ${mission.title}`
      );
    }
  };

  const handleOpenDailyReview = async (): Promise<DailyReview> => {
    if (!student?.id) return null as any;
    const studentId = student.id;
    const today = new Date().toISOString().split('T')[0];
    const stored = await storageService.getDailyReview(studentId, today);
    if (stored) {
      setCurrentDailyReview(stored);
      setIsDailyReviewOpen(true);
      return stored;
    }

    const newReview = generateDailyReview({
      student,
      missions: missionsForToday,
      masteryRecords,
      date: today,
      language: settings.language,
    });
    setCurrentDailyReview(newReview);
    setIsDailyReviewOpen(true);
    await storageService.saveDailyReview(newReview);
    return newReview;
  };

  const handleCloseDailyReview = () => {
    setIsDailyReviewOpen(false);
  };

  const handleGetHomeworkSubmission = async (homeworkItemId: string): Promise<HomeworkSubmission | null> => {
    if (!student?.id) return null;
    const studentId = student.id;
    if (homeworkSubmissions[homeworkItemId]) return homeworkSubmissions[homeworkItemId];
    const stored = await storageService.getHomeworkSubmission(homeworkItemId, studentId);
    if (stored) {
      setHomeworkSubmissions((prev) => ({ ...prev, [homeworkItemId]: stored }));
    }
    return stored;
  };

  const handleSaveHomeworkSubmission = async (sub: HomeworkSubmission) => {
    await storageService.saveHomeworkSubmission(sub);
    setHomeworkSubmissions((prev) => ({ ...prev, [sub.homeworkItemId]: sub }));
  };

  const handleSkipMission = async (missionId: string, reason?: string) => {
    const mission = missionsForToday.find((m) => m.id === missionId);
    if (!mission) return;

    const skippedAt = new Date().toISOString();
    const updatedMissions = missionsForToday.map((m) =>
      m.id === missionId ? { ...m, status: 'skipped' as const, skippedAt } : m
    );
    setMissionsForToday(updatedMissions);
    await storageService.saveMission({ ...mission, status: 'skipped', skippedAt });

    const outcome: MissionOutcome = {
      id: `out_${mission.id}_${Date.now()}`,
      missionId: mission.id,
      studentId: mission.studentId,
      completedAt: skippedAt,
      status: 'skipped',
    };
    await storageService.saveMissionOutcome(outcome);

    // Track mission rejection count (Failure mode 1c: "Mission rejected 3 times -> Companion asks why once gently, planner adapts/drops, no nagging")
    const prevCount = missionRejectionCounts[missionId] || 0;
    const newCount = prevCount + 1;
    setMissionRejectionCounts((prev) => ({ ...prev, [missionId]: newCount }));

    if (newCount >= 3) {
      const isArabic = settings.language === 'ar';
      const nudge = isArabic
        ? `لاحظت أنك تخطيت مهمة «${mission.title}» ٣ مرات. هل تشعر أنها ثقيلة أو صعبة اليوم؟ أسقطناها من خطة اليوم لتستريح تماماً دون أي إلحاح.`
        : `I noticed you skipped "${mission.title}" 3 times. Does it feel too heavy? We dropped it from today's plan so you can rest, without nagging.`;
      setGentleCompanionNudge(nudge);
      const droppedFromToday = missionsForToday.filter((m) => m.id !== missionId);
      setMissionsForToday(droppedFromToday);
    }

    setActiveMissionRunnerOpen(false);
    setActiveMission(null);
    showToast(
      settings.language === 'ar'
        ? `تم تخطي المهمة. يمكنك العودة إليها في أي وقت دون ضغط.`
        : `Mission skipped. You can revisit it later anytime.`
    );
  };

  const handleRegenerateMissionsForToday = async (declaredMinutes?: number) => {
    if (!student) return;
    const todayDate = new Date().toISOString().split('T')[0];
    const planned = planDailyMissions({
      student,
      dayRecord: currentDayRecord,
      timetable,
      masteryRecords,
      availableMinutes: declaredMinutes ?? 45,
      language: settings.language,
      parentPreferences: parentAccount?.preferences,
    });
    setMissionsForToday(planned.missions);
    setPlannerExplanation(planned.explanation);
    await storageService.saveMissions(planned.missions);
    showToast(
      settings.language === 'ar'
        ? `تم تحديث خطة مهام اليوم (${planned.missions.length} مهام)`
        : `Updated missions plan for today (${planned.missions.length} missions)`
    );
  };

  const handleExportProgressData = async () => {
    if (!student?.id) {
      showToast(
        settings.language === 'ar'
          ? 'لا يوجد حساب طالب نشط لتصدير بياناته'
          : 'No active student account to export data'
      );
      return;
    }
    try {
      const studentId = student.id;
      const jsonStr = await storageService.exportAllData(studentId);
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ai_school_companion_progress_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast(
        settings.language === 'ar'
          ? 'تم تصدير وتحميل ملف بيانات التقدم بنجاح!'
          : 'Progress data exported and downloaded successfully!'
      );
    } catch (err) {
      console.error('Failed to export data:', err);
      showToast(
        settings.language === 'ar' ? 'فشل تصدير البيانات' : 'Failed to export data'
      );
    }
  };

  const handleResetProfile = async () => {
    await storageService.resetProfile();
    setStudent(null);
    setTimetable(null);
    setCurrentDayRecord(null);
    setActiveTab('home');
    showToast(settings.language === 'ar' ? 'تمت إعادة تعيين الملف الشخصي' : 'Student profile reset');
  };

  const handleClearAllData = async () => {
    await storageService.clearAllData();
    setStudent(null);
    setTimetable(null);
    setCurrentDayRecord(null);
    setMasteryRecords({});
    setCurrentDailyReview(null);
    setIsDailyReviewOpen(false);
    setHomeworkSubmissions({});
    setWeeklyReviews([]);
    setSavedItems([]);
    setParentAccount(null);
    setIsParentModeActive(false);
    setGamification(null);
    const defaultSettings: AppSettings = {
      language: 'ar',
      demoTimeSimulatorActive: true,
      simulatedTimeOfDay: 'after_school',
      simulatedTime: '14:30',
      companionVoiceEnabled: true,
      micPermissionStatus: 'prompt',
      showEvidenceLog: false,
      simulatedDaysOffset: 0,
    };
    setSettings(defaultSettings);
    updateDocumentDirection('ar');
    setActiveTab('home');
    showToast(settings.language === 'ar' ? 'تم مسح كافة البيانات بنجاح' : 'All data wiped successfully');
  };

  // Phase 7 Computed Spaced Review Schedules
  const allReviewSchedules = useMemo(() => {
    if (!student?.id) return { dueCount: 0, overdueCount: 0, upcomingCount: 0, items: [] };
    return getAllSpacedReviewSchedules(student.id, masteryRecords, {
      language: settings.language,
    });
  }, [student, masteryRecords, settings.language]);

  const dueReviewNudges = useMemo(() => {
    if (!student?.id) return [];
    return getOverdueReviewNudges(student.id, masteryRecords, {
      language: settings.language,
    });
  }, [student, masteryRecords, settings.language]);

  // Phase 7 Manual Review Trigger
  const handleTriggerManualReview = (conceptId: string) => {
    if (!student?.id) return;
    const flatConcepts = curriculumService.getFlatConcepts();
    const concept = flatConcepts.find((c) => c.id === conceptId);
    const isAr = settings.language === 'ar';
    const subjName = isAr
      ? concept?.subjectNameAr || 'المادة الدراسية'
      : concept?.subjectNameEn || 'Subject';

    const revMission: Mission = {
      id: `manual_rev_${Date.now()}`,
      studentId: student.id,
      date: new Date().toISOString().split('T')[0],
      subject: subjName,
      lessonId: concept?.lessonId,
      conceptId: concept?.id,
      title: isAr ? `مراجعة فورية: ${concept?.nameAr || ''}` : `Review Now: ${concept?.nameEn || ''}`,
      type: 'review',
      estimatedMinutes: 8,
      whyNow: isAr ? 'مراجعة فورية بطلب من الطالب لتثبيت الفهم.' : 'Immediate review requested by student.',
      originTag: concept?.origin || 'official',
      successCriterion: isAr ? 'إتمام أسئلة المراجعة واستعادة الثقة' : 'Complete review questions',
      status: 'pending',
    };

    setActiveMission(revMission);
    setActiveMissionRunnerOpen(true);
  };

  // Phase 7 Weekly Review Trigger
  const handleGenerateAndOpenWeeklyReview = async (manualTrigger?: boolean): Promise<WeeklyReview> => {
    if (!student) return null as any;
    const newRev = generateWeeklyReview({
      student,
      dayRecords: currentDayRecord ? [currentDayRecord] : [],
      masteryRecords,
      completedMissions: missionsForToday.filter((m) => m.status === 'completed'),
      homeworkItems: currentDayRecord?.homeworkAssigned || [],
      savedItems,
      language: settings.language,
    });

    await storageService.saveWeeklyReview(newRev);
    setWeeklyReviews((prev) => [newRev, ...prev.filter((r) => r.id !== newRev.id)]);
    setActiveTab('review');
    showToast(settings.language === 'ar' ? 'تم تجهيز تقرير الأسبوع بنجاح!' : 'Weekly review ready!');
    return newRev;
  };

  // Phase 7 Saved Items & Collections
  const handleSaveContent = async (payload: {
    type: SavableType;
    sourceId: string;
    title: string;
    subject?: string;
    snippet?: string;
    note?: string;
    collectionIds: string[];
    isLiked?: boolean;
  }) => {
    if (!student?.id) return null as any;
    const studentId = student.id;
    const item = await saveItem(studentId, storageService, payload);
    const updatedAll = await storageService.getSavedItems(studentId);
    setSavedItems(updatedAll);
    const updatedCols = await storageService.getCollections(studentId);
    setCollections(updatedCols);
    showToast(settings.language === 'ar' ? 'تم الحفظ في مجموعتك الخاصة' : 'Saved to collection');
    return item;
  };

  const handleToggleLikeContent = async (
    sourceId: string,
    meta: {
      type: SavableType;
      title: string;
      subject?: string;
      snippet?: string;
    }
  ) => {
    if (!student?.id) return false;
    const studentId = student.id;
    const res = await toggleLike(studentId, storageService, sourceId, meta);
    const updatedAll = await storageService.getSavedItems(studentId);
    setSavedItems(updatedAll);
    showToast(
      res.isLiked
        ? settings.language === 'ar' ? 'تمت الإضافة للمفضلة ❤️' : 'Added to favorites ❤️'
        : settings.language === 'ar' ? 'تمت الإزالة من المفضلة' : 'Removed from favorites'
    );
    return res.isLiked;
  };

  const handleCreateCollection = async (name: string, nameAr?: string) => {
    if (!student?.id) return null as any;
    const studentId = student.id;
    const newCol: Collection = {
      id: `col_${Date.now()}`,
      studentId,
      name,
      nameAr,
      isDefault: false,
      itemIds: [],
      createdAt: new Date().toISOString(),
    };
    await storageService.saveCollection(newCol);
    setCollections((prev) => [...prev, newCol]);
    showToast(settings.language === 'ar' ? 'تم إنشاء المجموعة بنجاح' : 'Collection created successfully');
    return newCol;
  };

  const handleUpdateSavedNote = async (itemId: string, note: string) => {
    const item = savedItems.find((i) => i.id === itemId);
    if (!item) return;
    await updateItemNote(storageService, item, note);
    if (!student?.id) return;
    const studentId = student.id;
    const updatedAll = await storageService.getSavedItems(studentId);
    setSavedItems(updatedAll);
    showToast(settings.language === 'ar' ? 'تم تحديث الملاحظة بنجاح' : 'Note updated successfully');
  };

  const handleRemoveSavedItem = async (itemId: string) => {
    await storageService.deleteSavedItem(itemId);
    if (!student?.id) return;
    const studentId = student.id;
    const updatedAll = await storageService.getSavedItems(studentId);
    setSavedItems(updatedAll);
    showToast(settings.language === 'ar' ? 'تم حذف العنصر من المحفوظات' : 'Removed from saved items');
  };

  // Phase 7 Parent Account
  const handleLinkParent = async (data: {
    parentEmail: string;
    parentName: string;
    pin: string;
    preferences?: Partial<ParentPreferences>;
  }) => {
    if (!student?.id) return null as any;
    const studentId = student.id;
    const acc = await linkParentAccount(storageService, studentId, data);
    setParentAccount(acc);
    showToast(settings.language === 'ar' ? 'تم ربط حساب ولي الأمر بنجاح!' : 'Parent account linked successfully!');
  };

  const handleVerifyAndEnterParentMode = async (pin: string): Promise<boolean> => {
    if (!parentAccount) return false;
    const ok = verifyPin(parentAccount, pin);
    if (ok) {
      setIsParentModeActive(true);
      showToast(settings.language === 'ar' ? 'مرحباً بك في لوحة ولي الأمر' : 'Welcome to Parent Dashboard');
    }
    return ok;
  };

  const handleExitParentMode = () => {
    setIsParentModeActive(false);
  };

  const handleUpdateParentPrefs = async (pin: string, newPrefs: Partial<ParentPreferences>): Promise<boolean> => {
    if (!parentAccount) return false;
    const ok = verifyPin(parentAccount, pin);
    if (!ok) return false;

    const updated: ParentAccount = {
      ...parentAccount,
      preferences: {
        ...parentAccount.preferences,
        ...newPrefs,
      },
    };
    await storageService.saveParentAccount(updated);
    setParentAccount(updated);
    showToast(settings.language === 'ar' ? 'تم تحديث تفضيلات ولي الأمر' : 'Parent preferences updated');
    return true;
  };

  const handleUnlinkParent = async (pin: string): Promise<boolean> => {
    if (!parentAccount) return false;
    const ok = verifyPin(parentAccount, pin);
    if (!ok) return false;

    await storageService.deleteParentAccount(parentAccount.id);
    setParentAccount(null);
    setIsParentModeActive(false);
    showToast(settings.language === 'ar' ? 'تم إلغاء ربط حساب ولي الأمر' : 'Parent account unlinked');
    return true;
  };

  const t = useMemo(() => {
    return settings.language === 'ar' ? translations.ar : translations.en;
  }, [settings.language]);

  const value = useMemo(
    () => ({
      student,
      timetable,
      settings,
      activeTab,
      isLoading,
      toastMessage,
      t,
      language: settings.language,
      currentDayRecord,
      isWelcomeHomeDismissed,
      isReconstructingDay,
      masteryRecords,
      missionsForToday,
      activeMission,
      activeMissionRunnerOpen,
      currentDailyReview,
      isDailyReviewOpen,
      openDailyReview: handleOpenDailyReview,
      closeDailyReview: handleCloseDailyReview,
      homeworkSubmissions,
      getHomeworkSubmission: handleGetHomeworkSubmission,
      saveHomeworkSubmission: handleSaveHomeworkSubmission,
      plannerExplanation,
      dismissWelcomeHome: handleDismissWelcomeHome,
      setIsReconstructingDay,
      setActiveTab,
      saveStudent: handleSaveStudent,
      saveTimetable: handleSaveTimetable,
      saveDayRecord: handleSaveDayRecord,
      deleteDayRecord: handleDeleteDayRecord,
      setLanguage: handleSetLanguage,
      setSimulatedTimeOfDay: handleSetSimulatedTimeOfDay,
      toggleDemoTimeSimulator: handleToggleDemoTimeSimulator,
      toggleCompanionVoice: handleToggleCompanionVoice,
      updateMicPermission: handleUpdateMicPermission,
      toggleShowEvidenceLog: handleToggleShowEvidenceLog,
      recordEvidence: handleRecordEvidence,
      simulateDecayDays: handleSimulateDecayDays,
      resetSimulatedDecay: handleResetSimulatedDecay,
      getMasteryForConcept: handleGetMasteryForConcept,
      startMission: handleStartMission,
      closeMissionRunner: handleCloseMissionRunner,
      completeMission: handleCompleteMission,
      skipMission: handleSkipMission,
      regenerateMissionsForToday: handleRegenerateMissionsForToday,
      exportProgressData: handleExportProgressData,
      resetProfile: handleResetProfile,
      clearAllData: handleClearAllData,
      showToast,

      // Phase 7 Value Exports
      allReviewSchedules,
      dueReviewNudges,
      triggerManualReview: handleTriggerManualReview,
      weeklyReviews,
      generateAndOpenWeeklyReview: handleGenerateAndOpenWeeklyReview,
      savedItems,
      collections,
      saveContent: handleSaveContent,
      toggleLikeContent: handleToggleLikeContent,
      createCollection: handleCreateCollection,
      updateSavedNote: handleUpdateSavedNote,
      removeSavedItem: handleRemoveSavedItem,
      parentAccount,
      isParentModeActive,
      linkParent: handleLinkParent,
      verifyAndEnterParentMode: handleVerifyAndEnterParentMode,
      exitParentMode: handleExitParentMode,
      updateParentPrefs: handleUpdateParentPrefs,
      unlinkParent: handleUnlinkParent,
      gamification,
      gentleCompanionNudge,
      dismissGentleNudge: () => setGentleCompanionNudge(null),
      selectedCurriculumLessonId,
      setSelectedCurriculumLessonId,
      companionContext,
      setCompanionContext,
    }),
    [
      student,
      timetable,
      settings,
      activeTab,
      isLoading,
      toastMessage,
      t,
      currentDayRecord,
      isWelcomeHomeDismissed,
      isReconstructingDay,
      masteryRecords,
      missionsForToday,
      activeMission,
      activeMissionRunnerOpen,
      currentDailyReview,
      isDailyReviewOpen,
      homeworkSubmissions,
      plannerExplanation,
      showToast,
      allReviewSchedules,
      dueReviewNudges,
      weeklyReviews,
      savedItems,
      collections,
      parentAccount,
      isParentModeActive,
      gamification,
      gentleCompanionNudge,
      selectedCurriculumLessonId,
      companionContext,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
