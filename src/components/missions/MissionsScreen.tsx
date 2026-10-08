import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MissionList } from './MissionList';
import { MissionRunnerModal } from './MissionRunnerModal';

export const MissionsScreen: React.FC = () => {
  const { language, missionsForToday, startMission, activeMission, activeMissionRunnerOpen, closeMissionRunner } = useApp();
  const isAr = language === 'ar';
  const [homeworkOnly, setHomeworkOnly] = useState(false);
  const visible = homeworkOnly ? missionsForToday.filter((m) => m.type === 'homework') : missionsForToday;

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-5 max-w-lg mx-auto w-full pb-24 space-y-4" dir={isAr ? 'rtl' : 'ltr'}>
      <div className="flex items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black">{homeworkOnly ? (isAr ? 'الواجب' : 'Homework') : (isAr ? 'مهامي' : 'Missions')}</h1>
          <p className="text-xs text-slate-500 mt-1">{isAr ? 'اختاري ما تحتاجينه الآن، ونور تقودك من هنا.' : 'Choose what you need now; Nour takes it from here.'}</p>
        </div>
        <button type="button" onClick={() => setHomeworkOnly((v) => !v)} className="px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-black">
          {homeworkOnly ? (isAr ? 'كل المهام' : 'All missions') : (isAr ? 'الواجب فقط' : 'Homework only')}
        </button>
      </div>
      <MissionList missions={visible} onStartMission={startMission} />
      {activeMissionRunnerOpen && activeMission && <MissionRunnerModal mission={activeMission} onClose={closeMissionRunner} />}
    </div>
  );
};
