/**
 * App-authored Grade 5 French Science teaching plans for the 2026–2027
 * Egyptian Ministry student book. These are teaching adaptations, not an
 * official Ministry teacher guide and not quotations from the student book.
 */
import {
  ConceptMisconception,
  CurriculumExercise,
  CurriculumTeacherGuide,
} from '../../types/teachingSession';

export type ScienceFrenchTeacherPlan = CurriculumTeacherGuide;

export const SCIENCE_FR_CHAPTER_1_TEACHING_PLANS: Record<number, ScienceFrenchTeacherPlan> = {
  1: {
    provenance: 'app_authored_from_student_book',
    explanationFr: `Ton corps peut bouger grâce au travail de deux parties qui agissent ensemble : les os et les muscles. Les os sont durs. Ils donnent une forme au corps et servent de support. Les muscles sont des parties souples qui peuvent se contracter et se relâcher.

Un muscle ne pousse pas un os : il tire sur lui lorsqu'il se contracte. Au niveau du bras, deux muscles travaillent en alternance. Quand tu plies le coude, le muscle situé devant le bras se contracte et devient plus ferme ; le muscle situé derrière se relâche. Quand tu tends le bras, c'est l'inverse : le muscle de derrière se contracte et celui de devant se relâche.

Le coude est une articulation : c'est l'endroit où des os se rencontrent et où le mouvement est possible. Retenons la chaîne : un muscle se contracte, il tire sur un os, et le bras bouge autour de l'articulation.`,
    demonstrationFr: `Assieds-toi ou reste debout sans porter d'objet. Plie lentement un coude. Avec l'autre main, touche doucement le muscle à l'avant du bras, puis celui de l'arrière : compare leur fermeté. Tends ensuite le bras sans forcer et recommence. Décris ce qui change. Ne demande jamais à l'élève de pousser contre une résistance ou de soulever une charge.`,
    guidedPracticeFr: [
      'Avec le bras plié, montre le muscle situé à l’avant du bras. Est-il plus ferme ou plus relâché ?',
      'Avec le bras tendu, compare de nouveau les deux muscles. Lequel se contracte maintenant ?',
      'Complète oralement : les muscles font bouger les os en les … ; ils ne les … pas.'
    ],
    independentPracticeFr: [
      'Dessine deux petits bras : un bras plié et un bras tendu. Ajoute une flèche sur le muscle qui se contracte dans chaque position.',
      'Écris trois phrases qui expliquent le rôle des muscles, des os et de l’articulation du coude.'
    ],
    practiceExercisesFr: [
      {
        type: 'qa',
        stage: 'guided',
        question: 'Quand tu plies le coude, que fait le muscle situé devant le bras ?',
        expectedAnswer: 'Il se contracte et devient plus ferme.',
        answerExplanation: 'La contraction du muscle situé devant le bras tire sur les os et aide à plier l’avant-bras.'
      },
      {
        type: 'multiple_choice',
        stage: 'guided',
        question: 'Quand tu tends le bras, quel muscle se contracte ?',
        options: ['Celui de l’arrière du bras.', 'Celui de l’avant du bras.', 'Aucun muscle.'],
        expectedAnswer: 'Celui de l’arrière du bras.',
        answerExplanation: 'Pendant l’extension, le muscle de l’arrière se contracte et celui de l’avant se relâche.'
      },
      {
        type: 'fill_blank',
        stage: 'independent',
        question: 'Les muscles font bouger les os en les ______.',
        expectedAnswer: 'tirant',
        answerExplanation: 'Un muscle exerce une traction sur l’os lorsqu’il se contracte.'
      },
      {
        type: 'qa',
        stage: 'independent',
        question: 'Pourquoi le coude est-il important lorsque tu plies et tends le bras ?',
        expectedAnswer: 'Le coude est une articulation où les os se rencontrent et autour de laquelle le bras peut bouger.',
        answerExplanation: 'Une articulation relie les os et permet un mouvement entre eux.'
      },
      {
        type: 'qa',
        stage: 'mastery',
        question: 'Explique, dans l’ordre, comment les muscles permettent de plier puis de tendre le bras.',
        expectedAnswer: 'Pour plier, le muscle de devant se contracte et celui de derrière se relâche. Pour tendre, le muscle de derrière se contracte et celui de devant se relâche. Les muscles tirent sur les os au niveau du coude.',
        answerExplanation: 'La réponse doit nommer les deux positions, l’alternance des muscles et le fait que les muscles tirent sur les os.'
      }
    ],
    answerKeyFr: [
      { prompt: 'Pratique guidée 1 — muscle de devant quand le coude est plié', expectedAnswer: 'Il se contracte et devient plus ferme.', explanation: 'La contraction tire sur les os et participe à la flexion.' },
      { prompt: 'Pratique guidée 2 — muscle qui se contracte pendant l’extension', expectedAnswer: 'Le muscle situé à l’arrière du bras.', explanation: 'Le muscle de derrière se contracte tandis que celui de devant se relâche.' },
      { prompt: 'Pratique indépendante 1 — compléter « les muscles font bouger les os en les… »', expectedAnswer: 'tirant', explanation: 'Les muscles tirent sur les os ; ils ne les poussent pas.' },
      { prompt: 'Pratique indépendante 2 — rôle du coude', expectedAnswer: 'C’est une articulation où les os se rencontrent et qui permet le mouvement.', explanation: 'Le mouvement du bras se produit autour de l’articulation du coude.' }
    ],
    sourceAnswerKeyFr: [
      { page: 10, item: 'Essaye 1(1)', expectedAnswer: 'Réponse B — le muscle de devant se contracte.', explanation: 'Pendant la flexion, le muscle situé à l’avant du bras se contracte et devient plus ferme.' },
      { page: 10, item: 'Essaye 1(2)', expectedAnswer: 'La contraction.', explanation: 'Les muscles tirent sur les os lorsqu’ils se contractent.' },
      { page: 11, item: 'Entraîne-toi 1(1)', expectedAnswer: 'Réponse A — le muscle de l’arrière se contracte et celui de devant se relâche.', explanation: 'Pendant l’extension, le rôle des deux muscles s’inverse.' },
      { page: 11, item: 'Entraîne-toi 1(2)', expectedAnswer: 'Réponse B — les muscles font bouger le corps en tirant sur les os.', explanation: 'Les muscles tirent sur les os ; ils ne les poussent pas.' }
    ],
    misconceptionsFr: [
      {
        id: 'scifr26_ch1_l1_push',
        trigger: 'les muscles poussent les os',
        explanation: 'Tu as inversé le rôle du muscle : il ne pousse pas l’os.',
        remediation: 'Imagine une corde attachée à un objet. Quand la corde se raccourcit, elle tire l’objet vers elle. Un muscle tire sur l’os lorsqu’il se contracte.'
      },
      {
        id: 'scifr26_ch1_l1_both',
        trigger: 'les deux muscles se contractent en même temps',
        explanation: 'Tu n’as pas encore repéré l’alternance des muscles pendant la flexion et l’extension.',
        remediation: 'Refais lentement le mouvement : bras plié, muscle de devant contracté ; bras tendu, muscle de derrière contracté. Compare les deux positions.'
      }
    ],
    masteryCheckFr: {
      prompt: 'Sans regarder le cours, explique à Miss Noor ce qui se passe aux muscles de devant et de derrière quand tu plies puis tends le coude.',
      expectedAnswer: 'Quand le bras se plie, le muscle de devant se contracte et celui de derrière se relâche. Quand le bras se tend, celui de derrière se contracte et celui de devant se relâche. Les muscles tirent sur les os.',
      successCriteria: ['Distingue flexion et extension.', 'Nomme le muscle qui se contracte dans chaque position.', 'Explique que les muscles tirent sur les os.']
    }
  },
  2: {
    provenance: 'app_authored_from_student_book',
    explanationFr: `Les os sont solides. Ils soutiennent le corps, lui donnent sa forme et protègent certains organes importants. Les os ne sont pas tous attachés de la même façon : ils se rencontrent au niveau des articulations.

Une articulation est l'endroit où deux os ou plus se rencontrent. À certaines articulations, un mouvement est surtout possible dans une direction, comme au coude. À d'autres, comme à l'épaule, le mouvement est plus varié.

Les extrémités de certains os sont protégées par du cartilage. Le cartilage est un tissu souple qui agit comme un coussin. Il réduit les frottements entre les os pendant le mouvement et aide à les protéger contre l'usure.`,
    demonstrationFr: `Demande à l'élève de plier doucement le coude, puis de faire tourner lentement l'épaule sans forcer. Comparez les mouvements. Montrez ensuite, sur un dessin du manuel ou un schéma app-authored, les deux os qui se rencontrent et le cartilage placé entre leurs extrémités. Ne demandez pas à l'élève de tester une articulation en la poussant.`,
    guidedPracticeFr: [
      'Montre une articulation sur ton corps : coude, poignet, genou ou cheville.',
      'Compare le mouvement du coude avec celui de l’épaule. Sont-ils identiques ?',
      'Explique pourquoi le cartilage est comparé à un coussin.'
    ],
    independentPracticeFr: [
      'Écris une définition simple du mot « articulation ».',
      'Complète un tableau : partie du corps, articulation repérée, mouvement observé.'
    ],
    practiceExercisesFr: [
      {
        type: 'qa',
        stage: 'guided',
        question: 'Qu’appelle-t-on une articulation ?',
        expectedAnswer: 'L’endroit où deux os ou plus se rencontrent.',
        answerExplanation: 'Les articulations relient les os et permettent certains mouvements.'
      },
      {
        type: 'multiple_choice',
        stage: 'guided',
        question: 'Quel est le rôle du cartilage dans une articulation ?',
        options: ['Réduire les frottements entre les os.', 'Faire contracter les muscles.', 'Remplacer le squelette.'],
        expectedAnswer: 'Réduire les frottements entre les os.',
        answerExplanation: 'Le cartilage agit comme un coussin protecteur entre les extrémités des os.'
      },
      {
        type: 'qa',
        stage: 'independent',
        question: 'Pourquoi le coude et l’épaule ne permettent-ils pas exactement les mêmes mouvements ?',
        expectedAnswer: 'Parce que la forme et l’emplacement des articulations déterminent la direction et l’amplitude du mouvement.',
        answerExplanation: 'Les articulations ont des structures et des mobilités différentes.'
      },
      {
        type: 'qa',
        stage: 'mastery',
        question: 'Explique comment les articulations et le cartilage aident les os à bouger sans se frotter directement.',
        expectedAnswer: 'Les articulations sont les endroits où les os se rencontrent. Le cartilage forme un coussin souple qui réduit les frottements et protège les extrémités des os.',
        answerExplanation: 'La réponse doit nommer l’articulation et le rôle protecteur du cartilage.'
      }
    ],
    answerKeyFr: [
      { prompt: 'Pratique guidée 1 — définition d’une articulation', expectedAnswer: 'L’endroit où deux os ou plus se rencontrent.', explanation: 'C’est la zone de rencontre des os.' },
      { prompt: 'Pratique guidée 2 — rôle du cartilage', expectedAnswer: 'Réduire les frottements et protéger les extrémités des os.', explanation: 'Le cartilage agit comme un coussin.' },
      { prompt: 'Pratique indépendante — comparer coude et épaule', expectedAnswer: 'Le coude se plie surtout dans une direction ; l’épaule permet des mouvements plus variés.', explanation: 'Toutes les articulations n’ont pas la même mobilité.' }
    ],
    sourceAnswerKeyFr: [
      { page: 10, item: 'Essaye 2(1)', expectedAnswer: 'Une articulation.', explanation: 'C’est l’endroit où deux os ou plus se rencontrent.' },
      { page: 10, item: 'Essaye 2(2)', expectedAnswer: 'Réponse B.', explanation: 'La direction et l’amplitude de la flexion dépendent de l’emplacement de l’articulation.' },
      { page: 10, item: 'Essaye 2(3)', expectedAnswer: 'Du cartilage.', explanation: 'Le cartilage agit comme un coussin et réduit le frottement.' },
      { page: 11, item: 'Entraîne-toi 2(1)', expectedAnswer: 'Réponse C — les os ne se contractent pas et ne bougent pas seuls comme les muscles.', explanation: 'Les os soutiennent et protègent le corps ; les muscles se contractent.' },
      { page: 11, item: 'Entraîne-toi 2(2)', expectedAnswer: 'Le cartilage.', explanation: 'Le cartilage protège les extrémités des os dans les articulations.' }
    ],
    misconceptionsFr: [
      {
        id: 'scifr26_ch1_l2_all_joints',
        trigger: 'toutes les articulations tournent dans toutes les directions',
        explanation: 'Tu penses que toutes les articulations ont la même mobilité.',
        remediation: 'Compare ton coude et ton épaule : le coude se plie surtout dans une direction, tandis que l’épaule permet des mouvements plus variés.'
      },
      {
        id: 'scifr26_ch1_l2_cartilage',
        trigger: 'le cartilage est un os dur',
        explanation: 'Tu confonds le cartilage souple avec l’os dur.',
        remediation: 'Retiens l’image du coussin : le cartilage est souple et protège les extrémités des os en réduisant les frottements.'
      }
    ],
    masteryCheckFr: {
      prompt: 'Définis « articulation » et explique le rôle du cartilage avec un exemple du corps.',
      expectedAnswer: 'Une articulation est l’endroit où des os se rencontrent. Le cartilage agit comme un coussin et réduit les frottements, par exemple au niveau du genou.',
      successCriteria: ['Définit correctement une articulation.', 'Décrit le cartilage comme un tissu souple.', 'Explique la réduction des frottements.']
    }
  },
  3: {
    provenance: 'app_authored_from_student_book',
    explanationFr: `L'ensemble des os reliés entre eux forme le squelette. Le squelette soutient le corps, lui donne sa forme et protège des organes fragiles. Le corps humain possède environ deux cents os.

Trois parties sont particulièrement importantes. Le crâne forme une protection autour du cerveau. Les côtes forment une cage qui protège le cœur et les poumons. La colonne vertébrale est composée de nombreux petits os reliés entre eux. Elle soutient le corps et permet au dos de rester souple pour se pencher et bouger dans différentes directions.

Les os ont donc deux grands rôles à retenir : soutenir le corps et protéger des organes. Leur disposition dans le squelette permet aussi au corps de bouger avec l'aide des muscles et des articulations.`,
    demonstrationFr: `À partir d'un schéma du squelette, fais repérer le crâne, les côtes et la colonne vertébrale. L'élève peut toucher doucement le haut de sa tête, les os de sa poitrine et le milieu de son dos pour relier le schéma à son propre corps. Ne demande pas de pression sur la tête, la poitrine ou le dos.`,
    guidedPracticeFr: [
      'Montre le crâne sur le schéma. Quel organe protège-t-il ?',
      'Montre la cage thoracique. Quels deux organes importants protège-t-elle ?',
      'Pourquoi la colonne vertébrale est-elle composée de nombreux petits os reliés ?'
    ],
    independentPracticeFr: [
      'Sur un dessin du squelette, écris les mots « crâne », « côtes » et « colonne vertébrale ».',
      'Associe chaque partie à son rôle : protéger le cerveau ; protéger le cœur et les poumons ; soutenir le corps et permettre de se pencher.'
    ],
    practiceExercisesFr: [
      {
        type: 'matching',
        stage: 'guided',
        question: 'Associe chaque partie à ce qu’elle protège : crâne ; côtes.',
        options: ['Cerveau', 'Cœur et poumons'],
        expectedAnswer: 'Crâne → cerveau ; côtes → cœur et poumons.',
        answerExplanation: 'Le crâne entoure le cerveau ; les côtes forment une cage autour du cœur et des poumons.'
      },
      {
        type: 'qa',
        stage: 'guided',
        question: 'De quoi la colonne vertébrale est-elle composée ?',
        expectedAnswer: 'De nombreux petits os reliés entre eux.',
        answerExplanation: 'Cette organisation soutient le corps tout en permettant de se pencher et de bouger.'
      },
      {
        type: 'qa',
        stage: 'independent',
        question: 'Cite deux fonctions du squelette.',
        expectedAnswer: 'Il soutient le corps et protège des organes importants.',
        answerExplanation: 'Le squelette donne une forme au corps et protège notamment le cerveau, le cœur et les poumons.'
      },
      {
        type: 'qa',
        stage: 'mastery',
        question: 'Explique pourquoi le crâne, les côtes et la colonne vertébrale ont des formes et des positions différentes.',
        expectedAnswer: 'Chaque partie a une fonction : le crâne protège le cerveau, les côtes protègent le cœur et les poumons, et la colonne vertébrale soutient le corps tout en permettant de se pencher.',
        answerExplanation: 'La réponse doit relier chaque structure à sa fonction.'
      }
    ],
    answerKeyFr: [
      { prompt: 'Pratique guidée 1 — crâne et côtes', expectedAnswer: 'Crâne → cerveau ; côtes → cœur et poumons.', explanation: 'Les os protègent des organes fragiles.' },
      { prompt: 'Pratique guidée 2 — composition de la colonne vertébrale', expectedAnswer: 'De nombreux petits os reliés entre eux.', explanation: 'Les vertèbres alignées soutiennent le corps et permettent la flexibilité.' },
      { prompt: 'Pratique indépendante — deux fonctions du squelette', expectedAnswer: 'Soutenir le corps et protéger des organes.', explanation: 'Ce sont les deux fonctions principales étudiées dans cette leçon.' }
    ],
    sourceAnswerKeyFr: [
      { page: 16, item: 'Essaye 1(1)', expectedAnswer: 'Le squelette.', explanation: 'Le squelette est l’ensemble des os qui donnent sa forme au corps.' },
      { page: 16, item: 'Essaye 1(2)', expectedAnswer: 'Le cœur et les poumons.', explanation: 'Les côtes forment une cage qui protège ces deux organes.' },
      { page: 17, item: 'Entraîne-toi 1(1)', expectedAnswer: 'Le cerveau.', explanation: 'Le crâne protège le cerveau.' },
      { page: 17, item: 'Entraîne-toi 1(2)', expectedAnswer: 'Réponse B.', explanation: 'La colonne vertébrale est composée de nombreux petits os reliés entre eux.' }
    ],
    misconceptionsFr: [
      {
        id: 'scifr26_ch1_l3_skull',
        trigger: 'le crâne protège le cœur',
        explanation: 'Tu as associé le mauvais organe à la mauvaise partie du squelette.',
        remediation: 'Le crâne entoure le cerveau. Les côtes forment la cage qui protège le cœur et les poumons.'
      },
      {
        id: 'scifr26_ch1_l3_spine',
        trigger: 'la colonne vertébrale est un seul os',
        explanation: 'Tu imagines la colonne vertébrale comme un os long et rigide.',
        remediation: 'Observe le schéma : elle est formée de nombreux petits os reliés, ce qui permet au corps de se pencher.'
      }
    ],
    masteryCheckFr: {
      prompt: 'Nomme les trois parties du squelette étudiées et explique le rôle de chacune.',
      expectedAnswer: 'Le crâne protège le cerveau ; les côtes protègent le cœur et les poumons ; la colonne vertébrale soutient le corps et permet de se pencher.',
      successCriteria: ['Nomme les trois structures.', 'Associe le crâne au cerveau.', 'Associe les côtes au cœur et aux poumons.', 'Explique le rôle de la colonne vertébrale.']
    }
  },
  4: {
    provenance: 'app_authored_from_student_book',
    explanationFr: `Les êtres humains et de nombreux animaux possèdent des os, des articulations et des muscles. Chez le chien, le chat et le lapin, les muscles se contractent et tirent sur les os pour produire le mouvement, comme chez l'être humain.

Les squelettes ne sont pourtant pas identiques. La longueur et la forme des os, ainsi que la position des articulations, varient selon la façon dont l'animal se déplace. Les membres postérieurs du lapin sont longs et puissants pour l'aider à sauter. Les membres du chien possèdent aussi des articulations qui permettent de plier les pattes.

Le dromadaire donne un exemple d'adaptation à son milieu. Ses genoux portent des callosités épaisses qui amortissent le contact avec le sol. Les os de ses orteils s'écartent quand la patte touche le sable : la surface d'appui augmente et le poids se répartit mieux. Sa bosse contient de la graisse, et non de l'eau. Cette réserve fournit des nutriments que le corps peut utiliser pour produire de l'énergie.`,
    demonstrationFr: `Compare le schéma d'un squelette humain avec les images du chien et du lapin dans le manuel. Repère une articulation sur chaque animal. Fais ensuite observer le dessin du pied du dromadaire : les orteils s'écartent pour élargir la surface d'appui. Pour l'enrichissement, demande à l'élève d'expliquer pourquoi une bosse de graisse n'est pas une réserve d'eau.`,
    enrichmentFr: `Enrichissement du manuel, pages 18–19 : les callosités des genoux amortissent les chocs ; les os des orteils s'écartent sur le sable et répartissent le poids ; la bosse du dromadaire stocke de la graisse, pas de l'eau. La graisse fournit de l'énergie et, parce qu'elle est regroupée dans la bosse, elle n'isole pas uniformément tout le corps.`,
    guidedPracticeFr: [
      'Repère sur l’image du chien la partie qui correspond au coude humain.',
      'Explique pourquoi les longs os des membres postérieurs aident le lapin à sauter.',
      'Sur le dessin du dromadaire, montre comment les orteils s’écartent sur le sable.'
    ],
    independentPracticeFr: [
      'Choisis un animal présenté dans le manuel et décris une partie de son squelette qui l’aide à se déplacer.',
      'Écris deux différences entre le squelette humain et celui d’un animal, puis une ressemblance dans leur mécanisme de mouvement.'
    ],
    practiceExercisesFr: [
      {
        type: 'qa',
        stage: 'guided',
        question: 'Comment les chiens et les lapins font-ils bouger leurs os ?',
        expectedAnswer: 'Leurs muscles se contractent et tirent sur leurs os.',
        answerExplanation: 'Le mécanisme général du mouvement est semblable à celui de l’être humain.'
      },
      {
        type: 'multiple_choice',
        stage: 'guided',
        question: 'Pourquoi les membres postérieurs du lapin sont-ils longs ?',
        options: ['Ils l’aident à sauter.', 'Ils l’aident à voler.', 'Ils remplacent ses muscles.'],
        expectedAnswer: 'Ils l’aident à sauter.',
        answerExplanation: 'La longueur des os des membres postérieurs aide le lapin à effectuer de grands sauts.'
      },
      {
        type: 'qa',
        stage: 'independent',
        question: 'Comment les orteils du dromadaire l’aident-ils à marcher sur le sable ?',
        expectedAnswer: 'Les os des orteils s’écartent, ce qui augmente la surface d’appui et répartit le poids.',
        answerExplanation: 'Une surface d’appui plus grande aide la patte à ne pas s’enfoncer autant dans le sable.'
      },
      {
        type: 'qa',
        stage: 'independent',
        question: 'Que contient la bosse du dromadaire ?',
        expectedAnswer: 'Elle contient de la graisse, pas de l’eau.',
        answerExplanation: 'La graisse est une réserve de nutriments que le corps peut utiliser pour produire de l’énergie.'
      },
      {
        type: 'qa',
        stage: 'mastery',
        question: 'Donne une ressemblance entre le mouvement humain et celui d’un animal, puis une adaptation du dromadaire au désert.',
        expectedAnswer: 'Dans les deux cas, les muscles se contractent et tirent sur les os. Le dromadaire a des orteils qui s’écartent pour répartir son poids sur le sable ; sa bosse stocke de la graisse.',
        answerExplanation: 'La réponse doit distinguer le mécanisme général du mouvement et une adaptation liée au milieu.'
      }
    ],
    answerKeyFr: [
      { prompt: 'Pratique guidée 1 — mouvement des animaux', expectedAnswer: 'Les muscles se contractent et tirent sur les os.', explanation: 'Le mécanisme de mouvement est comparable chez l’être humain et plusieurs animaux.' },
      { prompt: 'Pratique guidée 2 — membres postérieurs du lapin', expectedAnswer: 'Ils sont longs et aident le lapin à sauter.', explanation: 'La forme et la longueur des os varient avec le mode de déplacement.' },
      { prompt: 'Pratique guidée 3 — orteils du dromadaire', expectedAnswer: 'Ils s’écartent pour augmenter la surface d’appui et répartir le poids.', explanation: 'Cela aide le dromadaire à marcher sur le sable.' },
      { prompt: 'Pratique indépendante 2 — ressemblance du mécanisme', expectedAnswer: 'Les muscles se contractent et tirent sur les os.', explanation: 'Les formes des squelettes diffèrent, mais le mécanisme de mouvement est similaire.' }
    ],
    sourceAnswerKeyFr: [
      { page: 16, item: 'Essaye 2(1)', expectedAnswer: 'Les muscles et les os.', explanation: 'Les animaux se déplacent grâce à la contraction des muscles et à la traction des os.' },
      { page: 16, item: 'Essaye 2(2)', expectedAnswer: 'Le mode de vie ou le type de déplacement.', explanation: 'La longueur et la forme des os varient selon que l’animal court, saute ou vole.' },
      { page: 17, item: 'Entraîne-toi 2(1)', expectedAnswer: 'Réponse A.', explanation: 'Les membres antérieurs du chien possèdent des articulations comparables à celles du bras humain.' },
      { page: 17, item: 'Entraîne-toi 2(2)', expectedAnswer: 'Réponse A.', explanation: 'La forme des os varie selon les mouvements auxquels l’animal est adapté.' }
    ],
    misconceptionsFr: [
      {
        id: 'scifr26_ch1_l4_same_skeleton',
        trigger: 'tous les animaux ont le même squelette',
        explanation: 'Tu confonds un mécanisme de mouvement semblable avec une forme de squelette identique.',
        remediation: 'Compare le chien et le lapin : ils utilisent tous deux des os et des muscles, mais la longueur et la forme de leurs os varient avec leurs mouvements.'
      },
      {
        id: 'scifr26_ch1_l4_hump_water',
        trigger: 'la bosse du dromadaire contient de l’eau',
        explanation: 'C’est une idée répandue, mais le contenu de la bosse est de la graisse.',
        remediation: 'Retiens : la bosse stocke de la graisse. Le corps peut utiliser cette réserve de nutriments pour produire de l’énergie.'
      },
      {
        id: 'scifr26_ch1_l4_animals_no_muscles',
        trigger: 'les animaux bougent sans muscles',
        explanation: 'Tu as oublié que les muscles participent aussi au mouvement des animaux.',
        remediation: 'Comme chez l’être humain, les muscles des animaux se contractent et tirent sur les os.'
      }
    ],
    masteryCheckFr: {
      prompt: 'Compare le mouvement de l’être humain et celui d’un animal, puis explique une adaptation du dromadaire au désert.',
      expectedAnswer: 'Chez les deux, les muscles se contractent et tirent sur les os. Les os et les articulations varient selon le déplacement. Chez le dromadaire, les orteils s’écartent pour répartir le poids sur le sable et la bosse contient de la graisse.',
      successCriteria: ['Explique le mécanisme muscles-os.', 'Donne une différence de forme ou de longueur des os.', 'Décrit correctement une adaptation du dromadaire.', 'Ne confond pas graisse et eau dans la bosse.']
    }
  }
};
