/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Noor-led onboarding.
 *
 * Four screens, about 60 seconds, with Miss Noor present on every one. Noor is
 * a teacher who already holds the Grade 5 curriculum, so onboarding does not
 * interview the child about the curriculum: it confirms the books Noor has,
 * asks three real curriculum questions to gauge level, and collects a few
 * preferences.
 *
 * S1  language + name + "Noor calls you…" boy/girl + age
 * S2  Noor already has the Grade 5 books (display only) + today's real lessons
 * S3  three warm-up questions from REAL curriculum exercises (recorded as evidence)
 * S4  liked subjects (multi) + learning style (multi) + session length (single)
 *
 * Deliberately removed: the exams question (exams come from the parent exam
 * calendar), any pre-filled answers (empty means no data), and every raw key,
 * "demo" badge or "AI Companion" badge in the child's view.
 */

import React, { useMemo, useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Student,
  AddressForm,
  LearningStylePreference,
  SessionLengthMinutes,
  InterviewAnswers,
} from '../../types';
import { curriculumService } from '../../services/curriculum/curriculumService';
import { buildWarmupQuestions, WarmupQuestion } from '../../services/onboarding/warmupService';
import { tutorSpeechService } from '../../services/voice/tutorSpeechService';
import { NoorSpeechBubble } from './NoorSpeechBubble';
import { Check, ArrowRight, ArrowLeft, BookOpen } from 'lucide-react';

const AGES = [9, 10, 11, 12];
const SESSION_LENGTHS: SessionLengthMinutes[] = [5, 10, 20];

interface WarmupResult {
  question: WarmupQuestion;
  correct: boolean;
}

export const OnboardingFlow: React.FC = () => {
  const { t, language, setLanguage, saveStudent, recordEvidence, currentDayRecord } = useApp();
  const isArabic = language === 'ar';
  const isFrench = language === 'fr';

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  const [name, setName] = useState('');
  const [addressForm, setAddressForm] = useState<AddressForm | null>(null);
  const [age, setAge] = useState<number | null>(null);
  const canContinueStep1 = Boolean(name.trim() && addressForm && age !== null);

  // Rebuild warm-up questions when the language changes so prompts follow it.
  const warmupQuestions = useMemo<WarmupQuestion[]>(
    () => buildWarmupQuestions(language, 3, 1),
    [language]
  );
  const [warmupIndex, setWarmupIndex] = useState(0);
  const [pickedOption, setPickedOption] = useState<number | null>(null);
  const [warmupResults, setWarmupResults] = useState<WarmupResult[]>([]);

  const [likedSubjects, setLikedSubjects] = useState<string[]>([]);
  const [learningStyles, setLearningStyles] = useState<LearningStylePreference[]>([]);
  const [sessionLength, setSessionLength] = useState<SessionLengthMinutes | null>(null);

  const [isSaving, setIsSaving] = useState(false);

  const subjects = useMemo(() => curriculumService.getSubjectsSummary(), []);
  const todayLessons = useMemo(() => {
    const covered = currentDayRecord?.lessonsCovered || [];
    return covered
      .map((c) => c.topic || c.subject)
      .filter((x): x is string => Boolean(x));
  }, [currentDayRecord]);

  const speak = async (text: string) => {
    await tutorSpeechService.speakTaskInstruction(text, name || undefined, { language });
  };

  const toggle = <T,>(list: T[], value: T): T[] =>
    list.includes(value) ? list.filter((v) => v !== value) : [...list, value];

  const subjectLabel = (sub: {
    subjectNameAr: string;
    subjectNameEn: string;
    subjectNameFr?: string;
  }) =>
    isArabic ? sub.subjectNameAr : isFrench ? sub.subjectNameFr || sub.subjectNameEn : sub.subjectNameEn;

  const handleAnswer = (optionIndex: number) => {
    if (pickedOption !== null) return;
    const q = warmupQuestions[warmupIndex];
    if (!q) return;
    setPickedOption(optionIndex);
    setWarmupResults((prev) => [...prev, { question: q, correct: optionIndex === q.correctIndex }]);
  };

  const advanceWarmup = () => {
    setPickedOption(null);
    if (warmupIndex < warmupQuestions.length - 1) {
      setWarmupIndex((i) => i + 1);
    } else {
      setStep(4);
    }
  };

  const handleFinish = async () => {
    const studentName = name.trim();
    if (!studentName || isSaving) return;
    setIsSaving(true);
    try {
      const nowIso = new Date().toISOString();
      const legacyAnswers: InterviewAnswers = {
        enjoyMost: '',
        hardest: '',
        learningStyle: learningStyles[0] || '',
        sessionDuration: sessionLength ? `${sessionLength}min` : '',
        upcomingExams: '',
      };

      const newStudent: Student = {
        id: 'student_' + Date.now(),
        name: studentName,
        age: age ?? 10,
        grade: 'الصف الخامس الابتدائي (Grade 5)',
        country: 'مصر (Egypt)',
        curriculum: 'Girard French Track — Egyptian National + French Curriculum',
        academicYear: '2026 – 2027',
        school: 'École Girard',
        location: 'Alexandria, Egypt',
        curriculumTrack: 'french_bilingual',
        preferredLanguage: language,
        // Display-only subject list; the child does not choose the curriculum.
        subjects: subjects.map((s) => s.subjectNameEn),
        interviewAnswers: legacyAnswers,
        addressForm: addressForm || 'f',
        onboarding: {
          likedSubjects: likedSubjects.length ? likedSubjects : undefined,
          learningStyles: learningStyles.length ? learningStyles : undefined,
          sessionLengthMinutes: sessionLength || undefined,
        },
        isOnboarded: true,
        createdAt: nowIso,
        updatedAt: nowIso,
      };

      await saveStudent(newStudent);

      // Warm-up evidence needs a student id. `saveStudent` has just persisted
      // the profile but the context's `student` state has not flushed, so we
      // pass the new id explicitly instead of relying on it. A missing concept
      // must never block onboarding.
      for (const result of warmupResults) {
        try {
          await recordEvidence(
            result.question.conceptId,
            {
              correctness: result.correct ? 'full' : 'wrong',
              difficulty: 0.4,
              independence: 'unassisted',
              modality: 'quiz',
              notes: 'Onboarding warm-up',
            },
            newStudent.id
          );
        } catch {
          // Ignore: the profile is saved regardless.
        }
      }
    } finally {
      setIsSaving(false);
    }
  };

  const BackIcon = isArabic ? ArrowRight : ArrowLeft;
  const FwdIcon = isArabic ? ArrowLeft : ArrowRight;

  const noorGreeting = isArabic
    ? 'أهلاً! أنا مس نور، معلمتك في الصف الخامس. يلا نتعرف بسرعة!'
    : isFrench
    ? 'Salut ! Je suis Mademoiselle Noor, ta maîtresse de 5e année. Faisons connaissance vite !'
    : 'Hi! I am Miss Noor, your Grade 5 teacher. Let us get to know each other quickly!';

  return (
    <div className="flex flex-col min-h-[85vh] p-4 sm:p-6 max-w-lg mx-auto w-full">
      <div className="mb-5">
        <h1 className="text-lg font-black text-slate-900 dark:text-slate-100 mb-2">
          {step === 1
            ? t.onboarding.step1Title
            : step === 2
            ? t.onboarding.step2Title
            : step === 3
            ? t.onboarding.step3Title
            : t.onboarding.step4Title}
        </h1>
        <div className="flex items-center justify-between text-xs font-medium text-slate-500 mb-2">
          <span>
            {isArabic ? `الخطوة ${step} من 4` : isFrench ? `Étape ${step} sur 4` : `Step ${step} of 4`}
          </span>
        </div>
        <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
          <div
            className="bg-indigo-600 h-full transition-all duration-300 rounded-full"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>
      </div>

      {/* ---------------- S1: language, name, address form, age ---------------- */}
      {step === 1 && (
        <div className="flex-1 flex flex-col justify-between gap-5">
          <div className="space-y-5">
            <NoorSpeechBubble text={noorGreeting} language={language} onSpeak={() => speak(noorGreeting)} />

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">
                {t.onboarding.langLabel}
              </label>
              <div className="grid grid-cols-3 gap-2">
                {([
                  ['ar', 'العربية 🇪🇬'],
                  ['en', 'English 🇬🇧'],
                  ['fr', 'Français 🇫🇷'],
                ] as const).map(([code, label]) => (
                  <button
                    key={code}
                    type="button"
                    onClick={() => setLanguage(code)}
                    aria-pressed={language === code}
                    className={`min-h-[44px] py-2.5 px-2 rounded-xl border text-sm font-semibold transition-all ${
                      language === code
                        ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label
                htmlFor="student-name"
                className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2"
              >
                {t.onboarding.nameLabel}
              </label>
              <input
                id="student-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t.onboarding.namePlaceholder}
                className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-base font-medium"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">
                {t.onboarding.addressTitle}
              </label>
              <div className="grid grid-cols-2 gap-2">
                {([
                  ['f', t.onboarding.addressGirl],
                  ['m', t.onboarding.addressBoy],
                ] as const).map(([form, label]) => (
                  <button
                    key={form}
                    type="button"
                    onClick={() => setAddressForm(form)}
                    aria-pressed={addressForm === form}
                    className={`min-h-[44px] py-2.5 rounded-xl border text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                      addressForm === form
                        ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    <span aria-hidden="true">{form === 'f' ? '👧' : '👦'}</span>
                    <span>{label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">
                {t.onboarding.ageLabel}
              </label>
              <div className="grid grid-cols-4 gap-2">
                {AGES.map((a) => (
                  <button
                    key={a}
                    type="button"
                    onClick={() => setAge(a)}
                    aria-pressed={age === a}
                    className={`min-h-[44px] rounded-xl border text-sm font-bold transition-all ${
                      age === a
                        ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {a}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <button
              type="button"
              disabled={!canContinueStep1}
              onClick={() => setStep(2)}
              className="w-full min-h-[48px] py-3.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-base shadow-md flex items-center justify-center gap-2 transition-all"
            >
              <span>{t.onboarding.next}</span>
              <FwdIcon className="w-4 h-4" />
            </button>
            {!canContinueStep1 && (
              <p
                role="status"
                aria-live="polite"
                className="text-center text-xs font-semibold text-slate-500 dark:text-slate-400"
              >
                {t.onboarding.step1Hint}
              </p>
            )}
          </div>
        </div>
      )}

      {/* ---------------- S2: Noor already has the books ---------------- */}
      {step === 2 && (
        <div className="flex-1 flex flex-col justify-between gap-5">
          <div className="space-y-5">
            <NoorSpeechBubble
              text={t.onboarding.step2Subtitle}
              language={language}
              state="excited"
              onSpeak={() => speak(t.onboarding.step2Subtitle)}
            />

            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
              <div className="flex items-center gap-2 mb-3">
                <BookOpen className="w-4 h-4 text-indigo-600 dark:text-indigo-300" />
                <span className="text-sm font-bold text-slate-800 dark:text-slate-100">
                  {t.onboarding.booksIntro}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {subjects.map((sub) => (
                  <span
                    key={sub.subjectId}
                    className="inline-flex items-center gap-1.5 rounded-full border border-indigo-200 dark:border-indigo-900 bg-indigo-50/60 dark:bg-indigo-950/30 px-3 py-1.5 text-xs font-bold text-slate-800 dark:text-slate-200"
                  >
                    <span aria-hidden="true">{sub.icon}</span>
                    <span>{subjectLabel(sub)}</span>
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
              <div className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-2">
                {t.onboarding.todayLessons}
              </div>
              {todayLessons.length ? (
                <ul className="space-y-1.5">
                  {todayLessons.map((lesson, i) => (
                    <li
                      key={`${lesson}-${i}`}
                      className="text-sm text-slate-700 dark:text-slate-200 flex items-start gap-2"
                    >
                      <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                      <span>{lesson}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-slate-500 dark:text-slate-400">{t.onboarding.todayNone}</p>
              )}
            </div>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="min-h-[48px] px-4 py-3.5 rounded-xl border border-slate-300 dark:border-slate-700 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all flex items-center gap-1.5"
            >
              <BackIcon className="w-4 h-4" />
              <span>{isArabic ? 'رجوع' : isFrench ? 'Retour' : 'Back'}</span>
            </button>
            <button
              type="button"
              onClick={() => setStep(3)}
              className="flex-1 min-h-[48px] py-3.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-base shadow-md flex items-center justify-center gap-2 transition-all"
            >
              <span>{t.onboarding.continueButton}</span>
              <FwdIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ---------------- S3: three real warm-up questions ---------------- */}
      {step === 3 && (
        <div className="flex-1 flex flex-col justify-between gap-5">
          {warmupQuestions.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-4">
              <p className="text-sm text-slate-500">{t.onboarding.warmupDone}</p>
              <button
                type="button"
                onClick={() => setStep(4)}
                className="min-h-[48px] px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-base shadow-md"
              >
                {t.onboarding.continueButton}
              </button>
            </div>
          ) : (
            <>
              <div className="space-y-5">
                <div className="text-xs font-semibold text-slate-500">
                  {t.onboarding.questionOf} {warmupIndex + 1} / {warmupQuestions.length}
                </div>
                <NoorSpeechBubble
                  text={warmupQuestions[warmupIndex].prompt}
                  language={language}
                  state={pickedOption === null ? 'talking' : 'encouraging'}
                  onSpeak={() => speak(warmupQuestions[warmupIndex].prompt)}
                />
                <div className="space-y-2">
                  {warmupQuestions[warmupIndex].options.map((opt, i) => {
                    const q = warmupQuestions[warmupIndex];
                    const isPicked = pickedOption === i;
                    const revealCorrect = pickedOption !== null && i === q.correctIndex;
                    const revealWrong = isPicked && i !== q.correctIndex;
                    return (
                      <button
                        key={i}
                        type="button"
                        disabled={pickedOption !== null}
                        onClick={() => handleAnswer(i)}
                        className={`w-full min-h-[48px] text-start px-3.5 py-3 rounded-xl border text-sm font-medium transition-all ${
                          revealCorrect
                            ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200'
                            : revealWrong
                            ? 'border-rose-400 bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-200'
                            : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:border-indigo-400'
                        }`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>

                {pickedOption !== null && (
                  <NoorSpeechBubble
                    text={
                      pickedOption === warmupQuestions[warmupIndex].correctIndex
                        ? t.onboarding.correctReaction
                        : t.onboarding.wrongReaction
                    }
                    language={language}
                    state={
                      pickedOption === warmupQuestions[warmupIndex].correctIndex
                        ? 'celebrating'
                        : 'gentle_correct'
                    }
                    onSpeak={() =>
                      speak(
                        pickedOption === warmupQuestions[warmupIndex].correctIndex
                          ? t.onboarding.correctReaction
                          : t.onboarding.wrongReaction
                      )
                    }
                  />
                )}
              </div>

              {pickedOption !== null && (
                <button
                  type="button"
                  onClick={advanceWarmup}
                  className="w-full min-h-[48px] py-3.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-base shadow-md flex items-center justify-center gap-2 transition-all"
                >
                  <span>
                    {warmupIndex < warmupQuestions.length - 1
                      ? t.onboarding.nextQuestion
                      : t.onboarding.continueButton}
                  </span>
                  <FwdIcon className="w-4 h-4" />
                </button>
              )}
            </>
          )}
        </div>
      )}

      {/* ---------------- S4: preferences (multi-select) ---------------- */}
      {step === 4 && (
        <div className="flex-1 flex flex-col justify-between gap-5">
          <div className="space-y-5">
            <NoorSpeechBubble
              text={t.onboarding.step4Subtitle}
              language={language}
              state="thinking"
              onSpeak={() => speak(t.onboarding.step4Subtitle)}
            />

            <div>
              <div className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">
                {t.onboarding.likedSubjectsLabel}
              </div>
              <div className="flex flex-wrap gap-2">
                {subjects.map((sub) => {
                  const label = subjectLabel(sub);
                  const selected = likedSubjects.includes(label);
                  return (
                    <button
                      key={sub.subjectId}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => setLikedSubjects((prev) => toggle(prev, label))}
                      className={`min-h-[44px] inline-flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-sm font-semibold transition-all ${
                        selected
                          ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300'
                          : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      <span aria-hidden="true">{sub.icon}</span>
                      <span>{label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <div className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">
                {t.onboarding.learningStyleLabel}
              </div>
              <div className="grid grid-cols-2 gap-2">
                {([
                  ['games', t.onboarding.styleGames, '🎮'],
                  ['videos', t.onboarding.styleVideos, '🎬'],
                  ['questions', t.onboarding.styleQuestions, '❓'],
                  ['talking', t.onboarding.styleTalking, '💬'],
                ] as const).map(([key, label, icon]) => {
                  const selected = learningStyles.includes(key);
                  return (
                    <button
                      key={key}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => setLearningStyles((prev) => toggle(prev, key))}
                      className={`min-h-[44px] py-2.5 rounded-xl border text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                        selected
                          ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300'
                          : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      <span aria-hidden="true">{icon}</span>
                      <span>{label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <div className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">
                {t.onboarding.sessionLengthLabel}
              </div>
              <div className="grid grid-cols-3 gap-2">
                {SESSION_LENGTHS.map((len) => {
                  const label =
                    len === 5
                      ? t.onboarding.length5
                      : len === 10
                      ? t.onboarding.length10
                      : t.onboarding.length20;
                  const selected = sessionLength === len;
                  return (
                    <button
                      key={len}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => setSessionLength(len)}
                      className={`min-h-[44px] rounded-xl border text-sm font-bold transition-all ${
                        selected
                          ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300'
                          : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setStep(3)}
              className="min-h-[48px] px-4 py-3.5 rounded-xl border border-slate-300 dark:border-slate-700 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all flex items-center gap-1.5"
            >
              <BackIcon className="w-4 h-4" />
              <span>{isArabic ? 'رجوع' : isFrench ? 'Retour' : 'Back'}</span>
            </button>
            <button
              type="button"
              disabled={isSaving}
              onClick={handleFinish}
              className="flex-1 min-h-[48px] py-3.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-semibold text-base shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 transition-all"
            >
              <span>{t.onboarding.finish}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
