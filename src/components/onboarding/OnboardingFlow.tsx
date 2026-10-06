/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Student, InterviewAnswers, Language, LearningStylePreference, SessionDurationPreference } from '../../types';
import { curriculumService } from '../../services/curriculum/curriculumService';
import { Badge } from '../common/Badge';
import { Sparkles, Bot, Check, ArrowRight, ArrowLeft, BookOpen, Clock, Heart, Award, ShieldAlert } from 'lucide-react';

export const OnboardingFlow: React.FC = () => {
  const { t, language, setLanguage, saveStudent } = useApp();
  const isArabic = language === 'ar';

  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Step 1: Registration State
  const [name, setName] = useState('');
  const [age, setAge] = useState(10);
  const [grade, setGrade] = useState('الصف الخامس الابتدائي (Grade 5)');
  const [country, setCountry] = useState('مصر (Egypt)');
  const [curriculum, setCurriculum] = useState('Demo — Egyptian Grade 5');
  const [academicYear, setAcademicYear] = useState('2026 – 2027');
  const [preferredLang, setPreferredLang] = useState<Language>(language);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>(['اللغة العربية', 'الرياضيات', 'العلوم']);

  // Step 2: Companion Interview State
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [interviewAnswers, setInterviewAnswers] = useState<InterviewAnswers>({
    enjoyMost: 'العلوم',
    hardest: 'الرياضيات',
    learningStyle: 'games',
    sessionDuration: '10min',
    upcomingExams: 'اختبارات شهرية قريبة',
  });
  const [customAnswerInput, setCustomAnswerInput] = useState('');

  const questions = [
    {
      id: 'enjoyMost',
      icon: <Heart className="w-5 h-5 text-rose-500" />,
      text: t.onboarding.q1,
      hint: t.onboarding.q1Hint,
      presetOptions: isArabic
        ? ['العلوم 🔬', 'الرياضيات 📐', 'اللغة العربية 📖', 'الرسم والأنشطة 🎨']
        : ['Science 🔬', 'Mathematics 📐', 'Arabic Language 📖', 'Arts & Activities 🎨'],
      currentValue: interviewAnswers.enjoyMost,
    },
    {
      id: 'hardest',
      icon: <ShieldAlert className="w-5 h-5 text-amber-500" />,
      text: t.onboarding.q2,
      hint: t.onboarding.q2Hint,
      presetOptions: isArabic
        ? ['الرياضيات والكسور', 'النحو والإعراب', 'حفظ مصطلحات العلوم', 'كل المواد ماشية تمام الحمد لله']
        : ['Fractions & Math', 'Grammar & Syntax', 'Science Terminology', 'All subjects feel manageable!'],
      currentValue: interviewAnswers.hardest,
    },
    {
      id: 'learningStyle',
      icon: <Sparkles className="w-5 h-5 text-purple-500" />,
      text: t.onboarding.q3,
      hint: isArabic ? 'اختر الطريقة التي تفضلها في الفهم' : 'Select how you grasp concepts best',
      presetOptions: [
        { key: 'games', label: t.onboarding.q3Options.games },
        { key: 'videos', label: t.onboarding.q3Options.videos },
        { key: 'questions', label: t.onboarding.q3Options.questions },
        { key: 'talking', label: t.onboarding.q3Options.talking },
      ],
      currentValue: interviewAnswers.learningStyle,
    },
    {
      id: 'sessionDuration',
      icon: <Clock className="w-5 h-5 text-sky-500" />,
      text: t.onboarding.q4,
      hint: isArabic ? 'نحدد وقت الجلسة حتى لا تشعر بالإرهاق' : 'Set your ideal session length to avoid fatigue',
      presetOptions: [
        { key: '10min', label: t.onboarding.q4Options['10min'] },
        { key: '30min', label: t.onboarding.q4Options['30min'] },
      ],
      currentValue: interviewAnswers.sessionDuration,
    },
    {
      id: 'upcomingExams',
      icon: <Award className="w-5 h-5 text-emerald-500" />,
      text: t.onboarding.q5,
      hint: isArabic ? 'حتى نستعد في وقت مناسب بدون ضغط مفاجئ' : 'So we can prepare early without last-minute stress',
      presetOptions: [
        { key: 'soon', label: t.onboarding.q5Options.soon },
        { key: 'monthly', label: t.onboarding.q5Options.monthly },
        { key: 'later', label: t.onboarding.q5Options.later },
      ],
      currentValue: interviewAnswers.upcomingExams,
    },
  ];

  const handleSelectOption = (value: string) => {
    const qKey = questions[currentQuestionIndex].id as keyof InterviewAnswers;
    setInterviewAnswers((prev) => ({
      ...prev,
      [qKey]: value,
    }));
    setCustomAnswerInput('');

    // Advance to next question automatically after a brief moment or let student click next
    if (currentQuestionIndex < questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestionIndex((prev) => prev + 1);
      }, 250);
    }
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customAnswerInput.trim()) return;
    const qKey = questions[currentQuestionIndex].id as keyof InterviewAnswers;
    setInterviewAnswers((prev) => ({
      ...prev,
      [qKey]: customAnswerInput.trim(),
    }));
    setCustomAnswerInput('');
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handleFinishOnboarding = async () => {
    const studentName = name.trim();
    if (!studentName) return;

    const newStudent: Student = {
      id: 'student_' + Date.now(),
      name: studentName,
      age: Number(age) || 10,
      grade,
      country,
      curriculum,
      academicYear,
      preferredLanguage: preferredLang,
      subjects: selectedSubjects,
      interviewAnswers,
      isOnboarded: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (preferredLang !== language) {
      await setLanguage(preferredLang);
    }
    await saveStudent(newStudent);
  };

  return (
    <div className="flex flex-col min-h-[85vh] p-4 sm:p-6 max-w-lg mx-auto w-full">
      {/* Step Progress Tracker */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-xs font-medium text-slate-500 mb-2">
          <span>{isArabic ? `الخطوة ${step} من 3` : `Step ${step} of 3`}</span>
          <Badge variant="demo">{t.app.demoBadge}</Badge>
        </div>
        <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
          <div
            className="bg-indigo-600 h-full transition-all duration-300 rounded-full"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>
      </div>

      {/* STEP 1: Registration Form */}
      {step === 1 && (
        <div className="flex-1 flex flex-col justify-between">
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                {t.onboarding.step1Title}
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                {t.onboarding.step1Subtitle}
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {t.onboarding.nameLabel}
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t.onboarding.namePlaceholder}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {t.onboarding.ageLabel}
                  </label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(Number(e.target.value))}
                    min={6}
                    max={18}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-sm font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {t.onboarding.gradeLabel}
                  </label>
                  <input
                    type="text"
                    value={grade}
                    readOnly
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-medium cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {t.onboarding.countryLabel}
                  </label>
                  <input
                    type="text"
                    value={country}
                    readOnly
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-medium cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {t.onboarding.academicYearLabel}
                  </label>
                  <input
                    type="text"
                    value={academicYear}
                    readOnly
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-medium cursor-not-allowed"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {t.onboarding.curriculumLabel}
                </label>
                <div className="flex items-center justify-between px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900">
                  <span className="text-xs font-medium text-slate-800 dark:text-slate-200">{curriculum}</span>
                  <Badge variant="demo">origin: demo</Badge>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {t.onboarding.preferredLanguageLabel}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setPreferredLang('ar');
                      setLanguage('ar');
                    }}
                    className={`py-2 px-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      preferredLang === 'ar'
                        ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 shadow-sm'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <span>العربية 🇪🇬</span>
                    {preferredLang === 'ar' && <Check className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setPreferredLang('en');
                      setLanguage('en');
                    }}
                    className={`py-2 px-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      preferredLang === 'en'
                        ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 shadow-sm'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <span>English 🇬🇧</span>
                    {preferredLang === 'en' && <Check className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setPreferredLang('fr');
                      setLanguage('fr');
                    }}
                    className={`py-2 px-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      preferredLang === 'fr'
                        ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 shadow-sm'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <span>Français 🇫🇷</span>
                    {preferredLang === 'fr' && <Check className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {t.onboarding.subjectsLabel}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {curriculumService.getSubjectsSummary().map((sub) => (
                    <div
                      key={sub.subjectId}
                      className="p-2.5 rounded-xl border border-indigo-200 dark:border-indigo-900 bg-indigo-50/50 dark:bg-indigo-950/30 text-center flex flex-col items-center justify-center gap-1"
                    >
                      <span className="text-sm">{sub.icon}</span>
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate max-w-full">
                        {isArabic ? sub.subjectNameAr : sub.subjectNameEn}
                      </span>
                      <Badge variant="official" size="sm">
                        {isArabic ? 'رسمي' : 'Official'}
                      </Badge>
                    </div>
                  ))}
                </div>
                <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
                  {isArabic
                    ? 'منهج الصف الخامس الابتدائي الرسمي المعتمد لأمينة (القسم الفرنسي التجريبي).'
                    : "Authoritative Egyptian Ministry Grade 5 Curriculum for Amina (French Section)."}
                </p>
              </div>
            </div>
          </div>

          <div className="pt-6">
            <button
              type="button"
              disabled={!name.trim()}
              onClick={() => setStep(2)}
              className="w-full py-3.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm shadow-md flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
            >
              <span>{t.onboarding.nextStepButton}</span>
              {isArabic ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Companion-Led Interview (Conversational, Not a form) */}
      {step === 2 && (
        <div className="flex-1 flex flex-col justify-between">
          <div className="space-y-4">
            {/* AI Companion Intro Banner (Explicitly identifies as AI, not human) */}
            <div className="p-3.5 rounded-2xl bg-indigo-50 border border-indigo-200 dark:bg-indigo-950/40 dark:border-indigo-800/60 flex items-start gap-3">
              <div className="p-2 rounded-xl bg-indigo-600 text-white shrink-0 mt-0.5 shadow-sm">
                <Bot className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-indigo-900 dark:text-indigo-200">
                    {t.app.name}
                  </span>
                  <Badge variant="ai">AI Companion</Badge>
                </div>
                <p className="text-xs leading-relaxed text-indigo-800 dark:text-indigo-300">
                  {t.onboarding.aiIntro}
                </p>
              </div>
            </div>

            {/* Conversational Question Box */}
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                  {isArabic ? `السؤال ${currentQuestionIndex + 1} من 5` : `Question ${currentQuestionIndex + 1} of 5`}
                </span>
                <span className="text-[11px] bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                  {Math.round(((currentQuestionIndex + 1) / questions.length) * 100)}%
                </span>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 shrink-0">
                  {questions[currentQuestionIndex].icon}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                    {questions[currentQuestionIndex].text}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {questions[currentQuestionIndex].hint}
                  </p>
                </div>
              </div>

              {/* Preset Quick Options */}
              <div className="space-y-2 pt-2">
                <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 block">
                  {isArabic ? 'اختر خياراً سريعاً أو اكتب إجابتك بحرية:' : 'Pick a quick choice or write freely:'}
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {questions[currentQuestionIndex].presetOptions.map((opt: any) => {
                    const optVal = typeof opt === 'string' ? opt : opt.key || opt.label;
                    const optLabel = typeof opt === 'string' ? opt : opt.label;
                    const isSelected = questions[currentQuestionIndex].currentValue === optVal;

                    return (
                      <button
                        key={optVal}
                        type="button"
                        onClick={() => handleSelectOption(optVal)}
                        className={`text-left rtl:text-right px-3.5 py-2.5 rounded-xl border text-xs font-medium transition-all flex items-center justify-between ${
                          isSelected
                            ? 'border-indigo-600 bg-indigo-50/80 dark:bg-indigo-950/50 text-indigo-900 dark:text-indigo-200 font-bold ring-2 ring-indigo-500/20'
                            : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <span>{optLabel}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-indigo-600 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Free Text Input Form */}
              <form onSubmit={handleCustomSubmit} className="pt-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customAnswerInput}
                    onChange={(e) => setCustomAnswerInput(e.target.value)}
                    placeholder={t.onboarding.answerPlaceholder}
                    className="flex-1 px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    type="submit"
                    disabled={!customAnswerInput.trim()}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 disabled:opacity-40 text-white text-xs font-semibold transition-all"
                  >
                    {t.onboarding.sendAnswer}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Navigation Controls for Interview */}
          <div className="pt-4 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => {
                if (currentQuestionIndex > 0) {
                  setCurrentQuestionIndex((prev) => prev - 1);
                } else {
                  setStep(1);
                }
              }}
              className="px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all flex items-center gap-1.5"
            >
              {isArabic ? <ArrowRight className="w-3.5 h-3.5" /> : <ArrowLeft className="w-3.5 h-3.5" />}
              <span>{t.common.back}</span>
            </button>

            {currentQuestionIndex < questions.length - 1 ? (
              <button
                type="button"
                onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
                className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition-all flex items-center gap-1.5"
              >
                <span>{t.onboarding.nextQuestion}</span>
                {isArabic ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setStep(3)}
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-md transition-all flex items-center gap-1.5"
              >
                <span>{t.onboarding.finishInterview}</span>
                {isArabic ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
              </button>
            )}
          </div>
        </div>
      )}

      {/* STEP 3: Profile Confirmation + Save */}
      {step === 3 && (
        <div className="flex-1 flex flex-col justify-between">
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                {t.onboarding.step3Title}
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                {t.onboarding.step3Subtitle}
              </p>
            </div>

            {/* Profile Summary Card */}
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-sm shadow-sm">
                    {name.charAt(0) || 'ط'}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">{name}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {age} {isArabic ? 'سنوات' : 'years old'} • {grade}
                    </p>
                  </div>
                </div>
                <Badge variant="demo">origin: demo</Badge>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <span className="text-slate-400 block text-[10px] uppercase tracking-wider font-semibold">
                    {t.onboarding.curriculumLabel}
                  </span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200 block mt-0.5">
                    {curriculum}
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <span className="text-slate-400 block text-[10px] uppercase tracking-wider font-semibold">
                    {t.onboarding.countryLabel}
                  </span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200 block mt-0.5">
                    {country}
                  </span>
                </div>
              </div>

              {/* Interview Results Summary */}
              <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <h5 className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {isArabic ? 'تفضيلات المقابلة الشخصية للرفيق:' : 'AI Companion Interview Insights:'}
                </h5>

                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between items-center py-1">
                    <span className="text-slate-500">{isArabic ? 'المادة المفضلة:' : 'Favorite Subject:'}</span>
                    <span className="font-semibold text-rose-600 dark:text-rose-400">{interviewAnswers.enjoyMost}</span>
                  </div>
                  <div className="flex justify-between items-center py-1">
                    <span className="text-slate-500">{isArabic ? 'المادة الأكثر صعوبة:' : 'Needs Focus:'}</span>
                    <span className="font-semibold text-amber-600 dark:text-amber-400">{interviewAnswers.hardest}</span>
                  </div>
                  <div className="flex justify-between items-center py-1">
                    <span className="text-slate-500">{isArabic ? 'الأسلوب المفضل:' : 'Learning Style:'}</span>
                    <span className="font-semibold text-purple-600 dark:text-purple-400">{interviewAnswers.learningStyle}</span>
                  </div>
                  <div className="flex justify-between items-center py-1">
                    <span className="text-slate-500">{isArabic ? 'مدة الجلسة:' : 'Session Length:'}</span>
                    <span className="font-semibold text-sky-600 dark:text-sky-400">{interviewAnswers.sessionDuration}</span>
                  </div>
                  <div className="flex justify-between items-center py-1">
                    <span className="text-slate-500">{isArabic ? 'حالة الاختبارات:' : 'Exam Readiness:'}</span>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">{interviewAnswers.upcomingExams}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 space-y-2">
            <button
              type="button"
              onClick={handleFinishOnboarding}
              className="w-full py-3.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
            >
              <span>{t.onboarding.confirmButton}</span>
              <Sparkles className="w-4 h-4 text-amber-300" />
            </button>
            <button
              type="button"
              onClick={() => setStep(2)}
              className="w-full py-2.5 px-4 text-xs font-semibold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 text-center"
            >
              {isArabic ? 'تعديل إجابات المقابلة' : 'Edit Interview Answers'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
