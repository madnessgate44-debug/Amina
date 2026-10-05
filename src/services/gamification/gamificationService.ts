/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  StudentGamification,
  AchievementBadge,
  ForgivingStreak,
  MasteryRecord,
  Mission,
} from '../../types';
import { IStorageService } from '../storage/IStorageService';
import { getFlatConcepts } from '../../data/demoCurriculum';

export const INITIAL_BADGES: AchievementBadge[] = [
  {
    id: 'badge_first_mission',
    titleAr: 'الخطوة الأولى',
    titleEn: 'First Step',
    descriptionAr: 'إكمال أول مهمة دراسية بنجاح.',
    descriptionEn: 'Completed your first study mission.',
    icon: 'Sparkles',
    progressTarget: 1,
    progressCurrent: 0,
  },
  {
    id: 'badge_mastery_5',
    titleAr: 'خماسية الإتقان',
    titleEn: 'Mastery Quintet',
    descriptionAr: 'ترسيخ وتثبيت 5 مفاهيم علمية بثقة.',
    descriptionEn: 'Mastered 5 curriculum concepts with high confidence.',
    icon: 'Award',
    progressTarget: 5,
    progressCurrent: 0,
  },
  {
    id: 'badge_mastery_10',
    titleAr: 'عشرة مفاهيم متقنة',
    titleEn: 'Deca-Master',
    descriptionAr: 'الوصول إلى إتقان 10 مفاهيم دراسية كاملة.',
    descriptionEn: 'Mastered 10 curriculum concepts.',
    icon: 'ShieldCheck',
    progressTarget: 10,
    progressCurrent: 0,
  },
  {
    id: 'badge_homework_champion',
    titleAr: 'نجم الواجبات المدرسية',
    titleEn: 'Homework Star',
    descriptionAr: 'حل وتثبيت 3 واجبات مدرسية دون طلب كشف الإجابات.',
    descriptionEn: 'Solved 3 school assignments independently.',
    icon: 'CheckCircle2',
    progressTarget: 3,
    progressCurrent: 0,
  },
  {
    id: 'badge_curious_mind',
    titleAr: 'المستكشف الفضولي',
    titleEn: 'Curious Explorer',
    descriptionAr: 'استكشاف مفاهيم من كافة المواد الدراسية.',
    descriptionEn: 'Explored concepts across all school subjects.',
    icon: 'Compass',
    progressTarget: 3,
    progressCurrent: 0,
  },
];

/**
 * Initializes or loads the forgiving gamification profile for a student.
 */
export async function getOrInitGamification(
  studentId: string,
  storage: IStorageService
): Promise<StudentGamification> {
  const existing = await storage.getGamification(studentId);
  if (existing) return existing;

  const initial: StudentGamification = {
    studentId,
    xp: 0,
    level: 1,
    xpToNextLevel: 100,
    streak: {
      currentDays: 1,
      lastActiveDate: new Date().toISOString().split('T')[0],
      restDayUsedThisWeek: false,
      isPaused: false,
      totalActiveDays: 1,
    },
    badges: INITIAL_BADGES,
    milestones: [
      {
        id: 'ms_welcome',
        titleAr: 'انطلاق رحلة المذاكرة الممتعة',
        titleEn: 'Started Learning Journey',
        achievedAt: new Date().toISOString(),
      },
    ],
    subjectMasteryPercentages: {},
  };

  await storage.saveGamification(initial);
  return initial;
}

/**
 * Forgiving streak updater:
 * - 1 automatic rest day per week
 * - Missing a day PAUSES streak, NEVER resets to zero
 * - No streak-loss guilt
 */
export function updateForgivingStreak(
  currentStreak: ForgivingStreak,
  todayDate: string = new Date().toISOString().split('T')[0]
): ForgivingStreak {
  if (currentStreak.lastActiveDate === todayDate) {
    return { ...currentStreak, isPaused: false };
  }

  const lastTime = new Date(currentStreak.lastActiveDate).getTime();
  const todayTime = new Date(todayDate).getTime();
  const diffDays = Math.round((todayTime - lastTime) / (1000 * 3600 * 24));

  if (diffDays === 1) {
    return {
      currentDays: currentStreak.currentDays + 1,
      lastActiveDate: todayDate,
      restDayUsedThisWeek: currentStreak.restDayUsedThisWeek,
      isPaused: false,
      totalActiveDays: currentStreak.totalActiveDays + 1,
    };
  }

  // If 2 days difference and rest day is available: forgive automatically!
  if (diffDays === 2 && !currentStreak.restDayUsedThisWeek) {
    return {
      currentDays: currentStreak.currentDays + 1,
      lastActiveDate: todayDate,
      restDayUsedThisWeek: true,
      isPaused: false,
      totalActiveDays: currentStreak.totalActiveDays + 1,
    };
  }

  // If more days or rest day already used: PAUSE (preserve earned days, never wipe out!)
  return {
    currentDays: currentStreak.currentDays,
    lastActiveDate: todayDate,
    restDayUsedThisWeek: false,
    isPaused: true,
    totalActiveDays: currentStreak.totalActiveDays + 1,
  };
}

/**
 * Awards XP for completing a mission and recalculates personal level and badges.
 */
export async function awardMissionGamification(
  studentId: string,
  storage: IStorageService,
  mission: Mission,
  masteryRecords: Record<string, MasteryRecord>
): Promise<StudentGamification> {
  const profile = await getOrInitGamification(studentId, storage);
  const earnedXp = 25; // small, gentle, personal reward
  const newXp = profile.xp + earnedXp;

  // Level formula: 100 XP per level
  const newLevel = Math.floor(newXp / 100) + 1;
  const xpToNextLevel = newLevel * 100 - newXp;

  // Update forgiving streak
  const newStreak = updateForgivingStreak(profile.streak);

  // Recalculate badge progress
  const flatConcepts = getFlatConcepts();
  const masteredCount = Object.values(masteryRecords).filter((r) => r.score >= 0.75).length;

  const updatedBadges = profile.badges.map((b) => {
    let current = b.progressCurrent || 0;
    if (b.id === 'badge_first_mission') current = 1;
    if (b.id === 'badge_mastery_5') current = masteredCount;
    if (b.id === 'badge_mastery_10') current = masteredCount;
    if (b.id === 'badge_curious_mind') current = 3;

    const isUnlocked = current >= (b.progressTarget || 1);
    return {
      ...b,
      progressCurrent: current,
      unlockedAt: isUnlocked && !b.unlockedAt ? new Date().toISOString() : b.unlockedAt,
    };
  });

  // Calculate subject mastery percentages
  const subjectTotals: Record<string, number> = {};
  const subjectMastered: Record<string, number> = {};

  flatConcepts.forEach((c) => {
    subjectTotals[c.subjectId] = (subjectTotals[c.subjectId] || 0) + 1;
    const rec = masteryRecords[c.id];
    if (rec && rec.score >= 0.75) {
      subjectMastered[c.subjectId] = (subjectMastered[c.subjectId] || 0) + 1;
    }
  });

  const subjectMasteryPercentages: Record<string, number> = {};
  Object.keys(subjectTotals).forEach((sId) => {
    const total = subjectTotals[sId] || 1;
    const count = subjectMastered[sId] || 0;
    subjectMasteryPercentages[sId] = Math.round((count / total) * 100);
  });

  const updatedProfile: StudentGamification = {
    ...profile,
    xp: newXp,
    level: newLevel,
    xpToNextLevel,
    streak: newStreak,
    badges: updatedBadges,
    subjectMasteryPercentages,
  };

  await storage.saveGamification(updatedProfile);
  return updatedProfile;
}
