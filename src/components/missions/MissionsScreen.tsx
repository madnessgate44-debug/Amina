/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useApp } from '../../context/AppContext';
import { HomeworkItem } from '../../types';
import { filterMissionsForScreen, MissionScreenMode } from '../../services/missions/missionScreenFilters';
import { MissionList } from './MissionList';
import { MissionRunnerModal } from './MissionRunnerModal';

interface MissionsScreenProps {
  mode: MissionScreenMode;
}

const HomeworkAssignments: React.FC<{ items: HomeworkItem[]; language: 'ar' | 'en' | 'fr' }> = ({ items, language }) => {
  const isAr = language === 'ar';
  const isFr = language === 'fr';

  if (items.length === 0) {
    return (
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-2">
        <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100">
          {isAr ? 'لا يوجد واجب مسجل لهذا اليوم' : isFr ? 'Aucun devoir enregistré pour aujourd’hui' : 'No homework recorded for today'}
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {isAr ? 'سيظهر هنا أي واجب تسجلينه في ملخص يومك المدرسي.' : isFr ? 'Les devoirs ajoutés au récapitulatif de ta journée apparaîtront ici.' : 'Assignments added to your school-day record will appear here.'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <article
          key={item.id || `${item.date || 'today'}-${item.subject}-${index}`}
          className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2"
        >
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] font-bold px-2 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300">
              {item.subject}
            </span>
            {item.status && (
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                {item.status === 'completed'
                  ? isAr ? 'مكتمل' : isFr ? 'Terminé' : 'Completed'
                  : item.status === 'in_progress'
                  ? isAr ? 'قيد التنفيذ' : isFr ? 'En cours' : 'In progress'
                  : isAr ? 'لم يبدأ' : isFr ? 'À faire' : 'To do'}
              </span>
            )}
          </div>
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 leading-relaxed">
            {item.description}
          </p>
          {item.dueDate && (
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {isAr ? 'موعد التسليم: ' : isFr ? 'À rendre le : ' : 'Due: '}{item.dueDate}
            </p>
          )}
        </article>
      ))}
    </div>
  );
};

export const MissionsScreen: React.FC<MissionsScreenProps> = ({ mode }) => {
  const {
    language,
    missionsForToday,
    currentDayRecord,
    startMission,
    activeMission,
    activeMissionRunnerOpen,
    closeMissionRunner,
  } = useApp();
  const isAr = language === 'ar';
  const isFr = language === 'fr';
  const visibleMissions = filterMissionsForScreen(missionsForToday, mode);
  const homeworkAssignments = currentDayRecord?.homeworkAssigned || [];

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-5 max-w-lg mx-auto w-full pb-24 space-y-4" dir={isAr ? 'rtl' : 'ltr'}>
      <div>
        <h1 className="text-2xl font-black">
          {mode === 'homework'
            ? isAr ? 'الواجب' : isFr ? 'Devoirs' : 'Homework'
            : isAr ? 'مهامي' : isFr ? 'Missions' : 'Missions'}
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          {mode === 'homework'
            ? isAr ? 'واجبات المدرسة المسجلة لهذا اليوم.' : isFr ? 'Les devoirs enregistrés pour aujourd’hui.' : 'School assignments recorded for today.'
            : isAr ? 'اختاري مهمة تحتاجينها الآن، ونور تقودك من هنا.' : isFr ? 'Choisis une mission ; Noor te guide.' : 'Choose a learning mission; Noor guides you from here.'}
        </p>
      </div>

      {mode === 'homework' && visibleMissions.length === 0 ? (
        <HomeworkAssignments items={homeworkAssignments} language={language} />
      ) : (
        <MissionList missions={visibleMissions} onStartMission={startMission} />
      )}

      {activeMissionRunnerOpen && activeMission && (
        <MissionRunnerModal mission={activeMission} onClose={closeMissionRunner} />
      )}
    </div>
  );
};
