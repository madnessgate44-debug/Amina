/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Timetable, DaySchedule, SchoolDayKey } from '../types';

/**
 * Default realistic school timetable for Amina (Egyptian Grade 5 — Section Bilingue / Français):
 * Subjects:
 * - اللغة العربية (Arabic)
 * - الرياضيات بالفرنسية (Mathématiques)
 * - العلوم بالفرنسية (Sciences)
 * - اللغة الفرنسية (Français)
 * - اللغة الإنجليزية (English Connect 5)
 * - الدراسات الاجتماعية (Social Studies)
 * - تكنولوجيا المعلومات والاتصالات (ICT)
 * - التربية الدينية الإسلامية (Islamic Education)
 */
export function createDefaultTimetable(studentId: string = 'demo_student'): Timetable {
  const days: DaySchedule[] = [
    {
      day: 'sunday' as SchoolDayKey,
      dayNameAr: 'الأحد',
      dayNameEn: 'Sunday',
      periods: [
        { id: 'sun_1', periodNumber: 1, startTime: '08:00', endTime: '08:45', subject: 'اللغة العربية' },
        { id: 'sun_2', periodNumber: 2, startTime: '08:50', endTime: '09:35', subject: 'الرياضيات بالفرنسية (Maths)' },
        { id: 'sun_3', periodNumber: 3, startTime: '09:40', endTime: '10:25', subject: 'العلوم بالفرنسية (Sciences)' },
        { id: 'sun_break', periodNumber: 0, startTime: '10:25', endTime: '11:00', subject: 'فسحة / استراحة', isBreak: true },
        { id: 'sun_4', periodNumber: 4, startTime: '11:00', endTime: '11:45', subject: 'اللغة الفرنسية' },
        { id: 'sun_5', periodNumber: 5, startTime: '11:50', endTime: '12:35', subject: 'اللغة الإنجليزية' },
        { id: 'sun_6', periodNumber: 6, startTime: '12:40', endTime: '13:25', subject: 'أنشطة مدرسية' },
      ],
    },
    {
      day: 'monday' as SchoolDayKey,
      dayNameAr: 'الإثنين',
      dayNameEn: 'Monday',
      periods: [
        { id: 'mon_1', periodNumber: 1, startTime: '08:00', endTime: '08:45', subject: 'الرياضيات بالفرنسية (Maths)' },
        { id: 'mon_2', periodNumber: 2, startTime: '08:50', endTime: '09:35', subject: 'اللغة الفرنسية' },
        { id: 'mon_3', periodNumber: 3, startTime: '09:40', endTime: '10:25', subject: 'اللغة العربية' },
        { id: 'mon_break', periodNumber: 0, startTime: '10:25', endTime: '11:00', subject: 'فسحة / استراحة', isBreak: true },
        { id: 'mon_4', periodNumber: 4, startTime: '11:00', endTime: '11:45', subject: 'الدراسات الاجتماعية' },
        { id: 'mon_5', periodNumber: 5, startTime: '11:50', endTime: '12:35', subject: 'العلوم بالفرنسية (Sciences)' },
        { id: 'mon_6', periodNumber: 6, startTime: '12:40', endTime: '13:25', subject: 'تربية رياضية' },
      ],
    },
    {
      day: 'tuesday' as SchoolDayKey,
      dayNameAr: 'الثلاثاء',
      dayNameEn: 'Tuesday',
      periods: [
        { id: 'tue_1', periodNumber: 1, startTime: '08:00', endTime: '08:45', subject: 'العلوم بالفرنسية (Sciences)' },
        { id: 'tue_2', periodNumber: 2, startTime: '08:50', endTime: '09:35', subject: 'اللغة العربية' },
        { id: 'tue_3', periodNumber: 3, startTime: '09:40', endTime: '10:25', subject: 'الرياضيات بالفرنسية (Maths)' },
        { id: 'tue_break', periodNumber: 0, startTime: '10:25', endTime: '11:00', subject: 'فسحة / استراحة', isBreak: true },
        { id: 'tue_4', periodNumber: 4, startTime: '11:00', endTime: '11:45', subject: 'تكنولوجيا المعلومات والاتصالات' },
        { id: 'tue_5', periodNumber: 5, startTime: '11:50', endTime: '12:35', subject: 'اللغة الفرنسية' },
        { id: 'tue_6', periodNumber: 6, startTime: '12:40', endTime: '13:25', subject: 'تربية فنية' },
      ],
    },
    {
      day: 'wednesday' as SchoolDayKey,
      dayNameAr: 'الأربعاء',
      dayNameEn: 'Wednesday',
      periods: [
        { id: 'wed_1', periodNumber: 1, startTime: '08:00', endTime: '08:45', subject: 'اللغة العربية' },
        { id: 'wed_2', periodNumber: 2, startTime: '08:50', endTime: '09:35', subject: 'الرياضيات بالفرنسية (Maths)' },
        { id: 'wed_3', periodNumber: 3, startTime: '09:40', endTime: '10:25', subject: 'اللغة الفرنسية' },
        { id: 'wed_break', periodNumber: 0, startTime: '10:25', endTime: '11:00', subject: 'فسحة / استراحة', isBreak: true },
        { id: 'wed_4', periodNumber: 4, startTime: '11:00', endTime: '11:45', subject: 'العلوم بالفرنسية (Sciences)' },
        { id: 'wed_5', periodNumber: 5, startTime: '11:50', endTime: '12:35', subject: 'اللغة الإنجليزية' },
        { id: 'wed_6', periodNumber: 6, startTime: '12:40', endTime: '13:25', subject: 'مكتبة وقراءة' },
      ],
    },
    {
      day: 'thursday' as SchoolDayKey,
      dayNameAr: 'الخميس',
      dayNameEn: 'Thursday',
      periods: [
        { id: 'thu_1', periodNumber: 1, startTime: '08:00', endTime: '08:45', subject: 'الرياضيات بالفرنسية (Maths)' },
        { id: 'thu_2', periodNumber: 2, startTime: '08:50', endTime: '09:35', subject: 'اللغة العربية' },
        { id: 'thu_3', periodNumber: 3, startTime: '09:40', endTime: '10:25', subject: 'التربية الدينية الإسلامية' },
        { id: 'thu_break', periodNumber: 0, startTime: '10:25', endTime: '11:00', subject: 'فسحة / استراحة', isBreak: true },
        { id: 'thu_4', periodNumber: 4, startTime: '11:00', endTime: '11:45', subject: 'الدراسات الاجتماعية' },
        { id: 'thu_5', periodNumber: 5, startTime: '11:50', endTime: '12:35', subject: 'مراجعة أسبوعية' },
        { id: 'thu_6', periodNumber: 6, startTime: '12:40', endTime: '13:25', subject: 'نشاط حر' },
      ],
    },
  ];

  return {
    id: `timetable_${studentId}`,
    studentId,
    days,
    updatedAt: new Date().toISOString(),
    isDemo: true,
  };
}
