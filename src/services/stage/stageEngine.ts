/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  StageLessonSequence,
  StageSessionState,
  BeatDefinition,
  NourState,
  SubjectOutfit,
} from '../../types/stage';
import { PROVING_LESSON_BEAT_SEQUENCE } from './provingLessonBeats';
import { curriculumService } from '../curriculum/curriculumService';

export interface AdvanceBeatResult {
  nextBeat: BeatDefinition | null;
  nourState: NourState;
  isLessonCompleted: boolean;
  masteryEvidence?: {
    conceptId: string;
    correctness: 'full' | 'partial' | 'wrong';
    independence: 'unassisted' | 'hinted' | 'revealed';
    modality: 'quiz' | 'reel_check' | 'game';
  };
}

/**
 * Stage Engine (Sub-Phase 11.3 & 11.6)
 * Pure TypeScript adaptive runtime engine executing beat sequences.
 */
export class StageEngine {
  /**
   * Retrieve sequence for a lesson (returns proving sequence for off_ar_u1_l2 or dynamically generates for all other lessons)
   */
  public getSequenceForLesson(lessonId: string): StageLessonSequence {
    if (lessonId === 'off_ar_u1_l2') {
      return PROVING_LESSON_BEAT_SEQUENCE;
    }

    const officialLesson = curriculumService.getLessonById(lessonId);
    if (!officialLesson) {
      return {
        ...PROVING_LESSON_BEAT_SEQUENCE,
        lessonId,
      };
    }

    const outfitMap: Record<string, SubjectOutfit> = {
      subj_arabic: 'arabic',
      subj_math: 'math',
      subj_science: 'science',
      subj_ict: 'science',
      subj_social_studies: 'social_studies',
      subj_islamic: 'islamic',
      subj_english: 'english',
      subj_calligraphy: 'calligraphy',
    };
    const outfit: SubjectOutfit = outfitMap[officialLesson.subjectId] || 'arabic';

    const beats: BeatDefinition[] = [];

    // Beat 1: Scene open & welcome
    beats.push({
      id: `${lessonId}_b1_open`,
      type: 'scene_open',
      conceptId: officialLesson.concepts[0]?.id,
      sourcePage: officialLesson.sourceRef.page || 1,
      nourState: 'excited',
      nourTextAr: `مرحباً بكِ يا أمينة! اليوم سنعيش معاً تجربة ممتعة ورائعة في درس: «${officialLesson.titleAr}» من ${officialLesson.sourceRef.bookAr}! جاهزة ننطلق سوا؟`,
      nourTextEn: `Welcome Amina! Today we explore an exciting lesson: "${officialLesson.titleEn}" from ${officialLesson.sourceRef.bookEn}! Ready?`,
      scenePayload: {
        clipId: `${officialLesson.subjectId}_open`,
        backgroundTheme: outfit,
      },
    });

    // Beat 2: Core explanation from textbook text
    const cleanReading = (officialLesson.readingText || '')
      .split('\n')
      .filter((line) => line.trim().length > 10)
      .slice(0, 2)
      .join(' ') || (officialLesson.objectives[0] || '');

    beats.push({
      id: `${lessonId}_b2_explain`,
      type: 'character_speak',
      conceptId: officialLesson.concepts[0]?.id,
      sourcePage: officialLesson.sourceRef.page || 1,
      nourState: 'talking',
      nourTextAr: `${cleanReading} يا أمينة، هل الفكرة دي واضحة ليكي ولا تحبي أوضحهالك أكتر بمثال؟`,
      nourTextEn: `${cleanReading} Amina, does this make sense to you or would you like another example?`,
      interactionPayload: {
        simplifiedAnalogyAr: officialLesson.objectives[0]
          ? `ببساطة يا أمينة: الهدف الأساسي في درسنا هو إننا ${officialLesson.objectives[0]}`
          : 'الفكرة بسيطة جداً ومترابطة مع حياتنا اليومية!',
        simplifiedAnalogyEn: officialLesson.objectives[0] || 'A simple concept connecting with everyday life!',
        vocabularyHighlight: officialLesson.vocabulary[0] ? {
          word: officialLesson.vocabulary[0].word,
          meaningAr: officialLesson.vocabulary[0].definition,
          meaningEn: officialLesson.vocabulary[0].definition,
        } : undefined,
      },
    });

    // Beat 3: Vocabulary check (if available)
    if (officialLesson.vocabulary.length > 0) {
      beats.push({
        id: `${lessonId}_b3_vocab`,
        type: 'child_tap_word',
        conceptId: officialLesson.concepts[0]?.id,
        sourcePage: officialLesson.sourceRef.page || 1,
        nourState: 'encouraging',
        nourTextAr: `يا سلام يا أمينة! تعالي نركز على أهم المفردات والمصطلحات في الدرس: «${officialLesson.vocabulary[0].word}» معناها: ${officialLesson.vocabulary[0].definition}. اضغطي عليها لتثبيت المعلومة!`,
        nourTextEn: `Great job, Amina! Let's check key vocabulary: "${officialLesson.vocabulary[0].word}": ${officialLesson.vocabulary[0].definition}.`,
        interactionPayload: {
          word: officialLesson.vocabulary[0].word,
          definition: officialLesson.vocabulary[0].definition,
          options: officialLesson.vocabulary.slice(0, 3).map((v) => v.word),
        },
      });
    }

    // Beat 4: Exercise question (if available)
    if (officialLesson.exercises.length > 0) {
      const ex = officialLesson.exercises[0];
      beats.push({
        id: `${lessonId}_b4_quiz`,
        type: 'child_choose_answer',
        conceptId: officialLesson.concepts[0]?.id,
        sourcePage: ex.page || officialLesson.sourceRef.page || 1,
        nourState: 'thinking',
        nourTextAr: `سؤال الشطارة والتركيز من كتاب الوزارة: «${ex.question}»! اختاري الإجابة الصحيحة يا أمينة!`,
        nourTextEn: `Textbook exercise question: "${ex.question}"! Choose the correct answer, Amina!`,
        interactionPayload: {
          questionText: ex.question,
          options: ex.options || ['نعم', 'لا'],
          correctAnswer: ex.expectedAnswer,
          correctExplanation: `أحسنتِ يا أمينة! الإجابة الصحيحة هي: «${ex.expectedAnswer}» تماماً كما ورد في كتاب الوزارة.`,
        },
      });
    }

    // Beat 5: Explain back / reflection
    beats.push({
      id: `${lessonId}_b5_reflect`,
      type: 'explain_back',
      conceptId: officialLesson.concepts[0]?.id,
      sourcePage: officialLesson.sourceRef.page || 1,
      nourState: 'celebrating',
      nourTextAr: `والآن يا أمينة يا بطلة، احكي لنور بأسلوبك الجميل: إيه أهم نقطة أو معلومة جديدة عرفتيها النهاردة من درس «${officialLesson.titleAr}»؟`,
      nourTextEn: `Now Amina, tell Miss Nour in your own words: what was the most important takeaway from "${officialLesson.titleEn}"?`,
      interactionPayload: {
        conceptTitle: officialLesson.titleAr,
        promptAr: 'احكي لنور فكرتك أو سجلي بصوتك...',
        promptEn: 'Speak or type your explanation to Miss Nour...',
      },
    });

    return {
      lessonId: officialLesson.id,
      lessonTitleAr: officialLesson.titleAr,
      lessonTitleEn: officialLesson.titleEn,
      subjectId: officialLesson.subjectId,
      outfit,
      sourceRefText: officialLesson.sourceRef.bookAr,
      beats,
    };
  }

  /**
   * Initialize a new Stage session state
   */
  public initSession(lessonId: string): StageSessionState {
    const sequence = this.getSequenceForLesson(lessonId);
    return {
      lessonId,
      currentBeatIndex: 0,
      totalBeats: sequence.beats.length,
      nourCurrentState: sequence.beats[0]?.nourState || 'idle',
      isAudioPlaying: false,
      isMuted: false,
      currentConceptId: sequence.beats[0]?.conceptId,
      beatsCompleted: [],
      explainBackPassed: {},
      offBookQuestions: [],
    };
  }

  /**
   * Advance to the next beat with adaptive response handling
   */
  public advanceBeat(
    currentState: StageSessionState,
    childSuccess: boolean = true
  ): {
    newState: StageSessionState;
    result: AdvanceBeatResult;
  } {
    const sequence = this.getSequenceForLesson(currentState.lessonId);
    const currentBeat = sequence.beats[currentState.currentBeatIndex];

    // Check if current beat logged mastery
    let masteryEvidence: AdvanceBeatResult['masteryEvidence'];
    if (currentBeat?.conceptId) {
      if (currentBeat.type === 'explain_back') {
        masteryEvidence = {
          conceptId: currentBeat.conceptId,
          correctness: childSuccess ? 'full' : 'partial',
          independence: childSuccess ? 'unassisted' : 'hinted',
          modality: 'quiz', // High-weight
        };
      } else if (currentBeat.type === 'child_trace') {
        masteryEvidence = {
          conceptId: currentBeat.conceptId,
          correctness: 'full',
          independence: 'unassisted',
          modality: 'game',
        };
      } else if (
        currentBeat.type === 'child_match_pairs' ||
        currentBeat.type === 'child_drag_drop' ||
        currentBeat.type === 'child_choose_answer'
      ) {
        masteryEvidence = {
          conceptId: currentBeat.conceptId,
          correctness: childSuccess ? 'full' : 'partial',
          independence: 'hinted',
          modality: 'reel_check',
        };
      }
    }

    const nextIdx = currentState.currentBeatIndex + 1;
    const isCompleted = nextIdx >= sequence.beats.length;
    const nextBeat = isCompleted ? null : sequence.beats[nextIdx];

    const updatedExplainBack = { ...currentState.explainBackPassed };
    if (currentBeat?.type === 'explain_back' && currentBeat.conceptId && childSuccess) {
      updatedExplainBack[currentBeat.conceptId] = true;
    }

    const newState: StageSessionState = {
      ...currentState,
      currentBeatIndex: isCompleted ? currentState.currentBeatIndex : nextIdx,
      nourCurrentState: nextBeat ? nextBeat.nourState : 'celebrating',
      currentConceptId: nextBeat?.conceptId || currentState.currentConceptId,
      beatsCompleted: currentBeat
        ? [...currentState.beatsCompleted, currentBeat.id]
        : currentState.beatsCompleted,
      explainBackPassed: updatedExplainBack,
    };

    return {
      newState,
      result: {
        nextBeat,
        nourState: nextBeat ? nextBeat.nourState : 'celebrating',
        isLessonCompleted: isCompleted,
        masteryEvidence,
      },
    };
  }
}

export const stageEngine = new StageEngine();
