/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Miss Noor-authored teacher-ready plans for the Egypt Ministry Grade 5
 * Sciences en français student book, Term 1, 2026–2027.
 *
 * This is original teaching material derived from the inspected student book.
 * It is NOT an Egyptian Ministry teacher guide and does not reproduce textbook
 * paragraphs. Printed page ranges identify the source material for each lesson.
 */
import type { CurriculumTeacherGuide } from '../../types/teachingSession';

const EDITION = 'Égypte — Ministère de l’Éducation, Sciences en français, 5e primaire, semestre 1, 2026–2027';

const makeGuide = (
  sourcePages: string,
  explanationFr: string,
  workedExampleFr: string,
  guidedPracticeFr: CurriculumTeacherGuide['guidedPracticeFr'],
  independentPracticeFr: CurriculumTeacherGuide['independentPracticeFr'],
  answerKeyFr: string[],
  misconceptionDiagnosisFr: CurriculumTeacherGuide['misconceptionDiagnosisFr'],
  remediationFr: string[],
  masteryCheckFr: CurriculumTeacherGuide['masteryCheckFr'],
): CurriculumTeacherGuide => ({
  provenance: 'app_authored',
  sourceEdition: EDITION,
  sourcePages,
  explanationFr,
  workedExampleFr,
  guidedPracticeFr,
  independentPracticeFr,
  answerKeyFr,
  misconceptionDiagnosisFr,
  remediationFr,
  masteryCheckFr,
});

export const SCIENCE_FR_TEACHER_GUIDE_2026: Record<string, CurriculumTeacherGuide> = {
  '1-1': makeGuide(
    '6–7',
    'Le bras bouge grâce à des muscles qui travaillent ensemble. Quand tu plies le coude, le muscle fléchisseur situé à l’avant du bras se contracte et devient plus ferme, tandis que le muscle extenseur situé à l’arrière se relâche. Quand tu tends le bras, leurs rôles s’inversent : l’extenseur se contracte et le fléchisseur se relâche. Les muscles tirent sur les os pour produire le mouvement ; ils ne poussent pas les os. Le coude est une articulation.',
    'Plie lentement ton coude sans forcer. Touche doucement l’avant du bras : le muscle devient plus ferme. Tends ensuite le bras et remarque le changement à l’arrière. N’appuie pas sur l’articulation et ne porte pas de charge lourde pour cette démonstration.',
    [
      { prompt: 'Pendant la flexion du coude, quel muscle se contracte : le fléchisseur ou l’extenseur ?', expectedAnswer: 'Le muscle fléchisseur, situé à l’avant du bras.' },
      { prompt: 'Pendant l’extension, que devient le muscle fléchisseur ?', expectedAnswer: 'Il se relâche tandis que le muscle extenseur se contracte.' },
    ],
    [
      { prompt: 'Complète : pendant la flexion, le muscle fléchisseur se ______ et le muscle extenseur se ______.', expectedAnswer: 'contracte ; relâche.' },
      { prompt: 'Explique en une phrase comment les muscles font bouger les os.', expectedAnswer: 'Les muscles se contractent et tirent sur les os.' },
    ],
    ['contracte ; relâche.', 'Les muscles se contractent et tirent sur les os.'],
    [
      { observedResponse: 'Les muscles poussent les os.', diagnosis: 'L’élève confond la traction musculaire avec une poussée.', correctivePrompt: 'Imagine deux personnes qui tirent doucement les deux côtés d’une corde : le muscle tire-t-il ou pousse-t-il ?' },
      { observedResponse: 'Les deux muscles font toujours la même action.', diagnosis: 'L’élève ne voit pas l’action alternée des muscles antagonistes.', correctivePrompt: 'Compare séparément ce qui arrive au muscle de devant et à celui de derrière pendant la flexion.' },
    ],
    [
      'Rejoue lentement la flexion puis l’extension et nomme à voix haute le muscle qui se contracte et celui qui se relâche.',
      'Dessine un coude très simple avec deux muscles étiquetés « fléchisseur » et « extenseur », puis ajoute deux flèches montrant l’action de chacun.',
    ],
    [
      { prompt: 'Décris les actions des deux muscles lorsque le bras se plie.', expectedAnswer: 'Le fléchisseur se contracte ; l’extenseur se relâche.', successCriterion: 'Les deux actions sont attribuées au bon muscle.' },
      { prompt: 'Pourquoi dit-on que les muscles tirent les os ?', expectedAnswer: 'Leur contraction exerce une traction qui déplace les os au niveau des articulations.', successCriterion: 'L’élève explique la traction sans parler de poussée.' },
    ],
  ),
  '1-2': makeGuide(
    '8–11',
    'Les os sont durs. Ils donnent une forme au corps, le soutiennent et protègent des organes importants. Une articulation est l’endroit où deux os ou plus se rencontrent. Elle permet un mouvement, mais toutes les articulations ne bougent pas de la même façon : le coude se plie surtout dans une direction, alors que l’épaule permet des mouvements plus variés. Dans certaines articulations, le cartilage forme un coussin entre les extrémités des os. Il réduit leur frottement et les protège pendant le mouvement.',
    'Compare doucement ton coude et ton épaule : plie et tends le coude, puis fais un petit cercle avec le bras au niveau de l’épaule. Explique pourquoi les deux articulations ne produisent pas le même mouvement.',
    [
      { prompt: 'Où se trouve une articulation ?', expectedAnswer: 'À l’endroit où deux os ou plus se rencontrent.' },
      { prompt: 'À quoi sert le cartilage entre les extrémités des os ?', expectedAnswer: 'Il agit comme un coussin et réduit les frottements.' },
    ],
    [
      { prompt: 'Donne une fonction des os et un exemple d’organe qu’ils protègent.', expectedAnswer: 'Les os soutiennent le corps ou protègent un organe ; le crâne protège le cerveau et les côtes protègent le cœur.' },
      { prompt: 'Pourquoi le coude et l’épaule ne permettent-ils pas exactement les mêmes mouvements ?', expectedAnswer: 'Parce que leur emplacement et leur structure sont différents.' },
    ],
    ['Les os soutiennent le corps et/ou protègent les organes ; par exemple, le crâne protège le cerveau.', 'Le mouvement dépend de la structure et de l’emplacement de chaque articulation.'],
    [
      { observedResponse: 'Le cartilage est un muscle.', diagnosis: 'L’élève confond un tissu de protection avec un organe qui se contracte.', correctivePrompt: 'Le cartilage tire-t-il sur les os ou sert-il de coussin entre eux ?' },
      { observedResponse: 'Toutes les articulations tournent dans toutes les directions.', diagnosis: 'L’élève généralise le mouvement de l’épaule à toutes les articulations.', correctivePrompt: 'Compare la flexion du coude avec le mouvement de l’épaule.' },
    ],
    [
      'Utilise deux crayons qui se rejoignent pour représenter deux os ; place une petite bande de papier souple entre eux pour représenter le cartilage.',
      'Classe des exemples : os = soutien/protection ; articulation = rencontre des os ; cartilage = coussin qui réduit le frottement.',
    ],
    [
      { prompt: 'Définis une articulation.', expectedAnswer: 'C’est l’endroit où deux os ou plus se rencontrent.', successCriterion: 'La réponse mentionne la rencontre des os.' },
      { prompt: 'Explique le rôle du cartilage pendant le mouvement.', expectedAnswer: 'Il réduit le frottement entre les extrémités des os et les protège.', successCriterion: 'La réponse relie cartilage, frottement et protection.' },
    ],
  ),
  '1-3': makeGuide(
    '12–13',
    'Le squelette est l’ensemble des os qui soutiennent le corps et lui donnent sa forme. Le corps humain possède environ deux cents os reliés entre eux. Le crâne protège le cerveau. Les côtes forment une cage qui protège le cœur et les poumons. La colonne vertébrale est formée de nombreux petits os reliés ; elle soutient le corps et permet de se pencher et de bouger dans différentes directions. Les os ont donc un rôle de soutien et un rôle de protection.',
    'Observe un dessin du squelette. Repère le crâne, les côtes et la colonne vertébrale. Relie chaque partie à l’organe ou à la fonction qu’elle protège ou soutient.',
    [
      { prompt: 'Quelle partie du squelette protège le cerveau ?', expectedAnswer: 'Le crâne.' },
      { prompt: 'Quels organes sont protégés par les côtes ?', expectedAnswer: 'Le cœur et les poumons.' },
    ],
    [
      { prompt: 'Explique pourquoi la colonne vertébrale permet au corps de se pencher.', expectedAnswer: 'Elle est composée de nombreux petits os reliés entre eux.' },
      { prompt: 'Cite deux fonctions du squelette.', expectedAnswer: 'Il soutient le corps et protège des organes importants.' },
    ],
    ['La colonne vertébrale est composée de nombreux petits os reliés.', 'Le squelette soutient le corps et protège les organes.'],
    [
      { observedResponse: 'La colonne vertébrale est un seul os long.', diagnosis: 'L’élève ne comprend pas que la colonne est formée de plusieurs petits os.', correctivePrompt: 'Compte les petites pièces d’un modèle de colonne plutôt que de regarder la colonne comme une seule barre.' },
      { observedResponse: 'Les côtes protègent le cerveau.', diagnosis: 'L’élève échange les fonctions du crâne et des côtes.', correctivePrompt: 'Associe le casque au crâne et la cage thoracique au cœur et aux poumons.' },
    ],
    [
      'Reprends un schéma simple du squelette et colorie séparément le crâne, les côtes et la colonne vertébrale.',
      'Fais trois associations orales : crâne–cerveau, côtes–cœur et poumons, colonne vertébrale–soutien et flexibilité.',
    ],
    [
      { prompt: 'Quelle est la fonction du crâne ?', expectedAnswer: 'Il protège le cerveau.', successCriterion: 'L’organe protégé est nommé correctement.' },
      { prompt: 'Pourquoi la colonne vertébrale est-elle flexible ?', expectedAnswer: 'Parce qu’elle est constituée de nombreux petits os reliés.', successCriterion: 'L’élève mentionne plusieurs petits os reliés.' },
    ],
  ),
  '1-4': makeGuide(
    '14–18',
    'Les humains et de nombreux animaux possèdent des os, des articulations et des muscles. Ces éléments travaillent ensemble : les muscles se contractent et tirent sur les os pour produire le mouvement. Les animaux n’ont pas tous la même forme de squelette. La longueur et la forme de leurs os ainsi que la disposition de leurs articulations varient selon leur manière de se déplacer. Par exemple, les longues pattes arrière du lapin l’aident à sauter. Les chiens, les chats et les lapins utilisent eux aussi leurs muscles pour tirer sur leurs os.',
    'Compare un dessin du membre antérieur d’un chien avec un bras humain. Repère l’articulation qui correspond au coude. Compare ensuite les longues pattes arrière du lapin avec celles d’un animal qui saute moins.',
    [
      { prompt: 'Quel mécanisme permet au chien de déplacer ses pattes ?', expectedAnswer: 'Ses muscles se contractent et tirent sur les os.' },
      { prompt: 'Pourquoi les pattes arrière du lapin sont-elles longues ?', expectedAnswer: 'Elles facilitent le saut.' },
    ],
    [
      { prompt: 'Donne une ressemblance entre le squelette humain et celui de nombreux animaux.', expectedAnswer: 'Ils possèdent des os, des articulations et des muscles qui permettent le mouvement.' },
      { prompt: 'Relie une caractéristique du corps d’un animal à son mode de déplacement.', expectedAnswer: 'Les longues pattes arrière du lapin l’aident à sauter.' },
    ],
    ['De nombreux animaux utilisent des os, des articulations et des muscles pour bouger.', 'Les longues pattes arrière du lapin facilitent le saut.'],
    [
      { observedResponse: 'Les animaux bougent sans muscles.', diagnosis: 'L’élève sépare le mouvement des muscles et du squelette.', correctivePrompt: 'Que se passe-t-il si les muscles ne tirent pas sur les os ?' },
      { observedResponse: 'Tous les animaux ont exactement les mêmes os.', diagnosis: 'L’élève confond un mécanisme commun avec des formes identiques.', correctivePrompt: 'Compare les pattes d’un lapin avec celles d’un chien : qu’est-ce qui change ?' },
    ],
    [
      'Construis un tableau à deux colonnes : « points communs » et « différences » entre le corps humain, le chien et le lapin.',
      'Demande à l’élève d’expliquer le mouvement en trois étapes : muscle, traction sur l’os, mouvement à l’articulation.',
    ],
    [
      { prompt: 'Comment les muscles participent-ils au mouvement chez de nombreux animaux ?', expectedAnswer: 'Ils se contractent et tirent sur les os.', successCriterion: 'La réponse relie contraction, traction et os.' },
      { prompt: 'Pourquoi les os des animaux peuvent-ils avoir des formes différentes ?', expectedAnswer: 'Leur forme dépend notamment du mode de déplacement de l’animal.', successCriterion: 'L’élève relie forme et locomotion.' },
    ],
  ),
  '2-1': makeGuide(
    '20–21',
    'La température change au cours de l’année avec les saisons. Dans l’exemple du luffa présenté dans le manuel, les graines germent lorsque les conditions deviennent chaudes. La tige grandit, les feuilles s’étalent, puis les fleurs apparaissent et les fruits se développent. Les fruits contiennent des graines qui pourront donner de nouvelles plantes. Pendant la saison froide, la plante peut se faner ; cela ne signifie pas que son cycle est terminé, car des graines restent pour la génération suivante.',
    'Place dans l’ordre quatre cartes : graine, jeune plante, fleur, fruit contenant des graines. Demande ensuite à l’élève de raconter ce qui arrive au luffa pendant une période chaude puis pendant une période froide.',
    [
      { prompt: 'Quelle étape suit la germination dans le cycle présenté ?', expectedAnswer: 'La jeune plante grandit : la tige et les feuilles se développent.' },
      { prompt: 'Que peut-il rester après le flétrissement de la plante ?', expectedAnswer: 'Des graines qui pourront germer plus tard.' },
    ],
    [
      { prompt: 'Mets dans l’ordre : fruit, graine qui germe, fleur, jeune plante.', expectedAnswer: 'Graine qui germe → jeune plante → fleur → fruit.' },
      { prompt: 'Pourquoi le flétrissement ne signifie-t-il pas toujours la fin du cycle de vie ?', expectedAnswer: 'Parce que la plante peut avoir produit des graines pour la génération suivante.' },
    ],
    ['Graine qui germe → jeune plante → fleur → fruit.', 'La plante a produit des graines qui pourront donner une nouvelle génération.'],
    [
      { observedResponse: 'Quand la plante se fane, aucune nouvelle plante ne peut apparaître.', diagnosis: 'L’élève oublie le rôle des graines produites avant le flétrissement.', correctivePrompt: 'Ouvre un fruit mûr ou observe son dessin : que contient-il ?' },
      { observedResponse: 'Les fleurs apparaissent avant la germination.', diagnosis: 'L’élève mélange les étapes du cycle végétal.', correctivePrompt: 'Reconstitue le cycle à partir de la graine, puis avance étape par étape.' },
    ],
    [
      'Utilise des images séquentielles du luffa et fais verbaliser chaque transition avant de passer à la suivante.',
      'Fais comparer deux observations datées d’une même plante pour repérer ce qui change au fil des saisons.',
    ],
    [
      { prompt: 'Quelle est la séquence générale entre la graine et le fruit ?', expectedAnswer: 'Germination, croissance de la plante, floraison, formation du fruit.', successCriterion: 'Les quatre étapes sont ordonnées.' },
      { prompt: 'À quoi servent les graines produites par le fruit ?', expectedAnswer: 'Elles peuvent germer et produire une nouvelle génération de plantes.', successCriterion: 'La réponse relie les graines à la continuité du cycle.' },
    ],
  ),
  '2-2': makeGuide(
    '22–25',
    'La température influence l’activité de certains animaux. Dans le manuel, les lézards, les serpents et les grenouilles deviennent plus actifs lorsque la température est élevée. Quand il fait froid, leurs mouvements ralentissent. Certains restent immobiles dans le sol ou dans les fissures des roches pour économiser leur énergie : ce repos prolongé est appelé hibernation. D’autres animaux, comme certains oiseaux qui viennent en Égypte en hiver, se déplacent vers une région plus favorable : ce déplacement saisonnier est une migration. Hibernation et migration ne désignent donc pas le même comportement.',
    'Présente deux situations : un lézard immobile dans une fissure pendant une période froide et des oiseaux qui arrivent en Égypte pendant l’hiver. Demande si chaque situation montre une hibernation ou une migration et pourquoi.',
    [
      { prompt: 'Que devient l’activité de nombreux lézards quand la température baisse ?', expectedAnswer: 'Leurs mouvements deviennent plus lents et ils peuvent rester immobiles.' },
      { prompt: 'Comment appelle-t-on le déplacement saisonnier de certains oiseaux ?', expectedAnswer: 'La migration.' },
    ],
    [
      { prompt: 'Explique la différence entre hibernation et migration.', expectedAnswer: 'L’hibernation est un repos prolongé ; la migration est un déplacement saisonnier vers une autre région.' },
      { prompt: 'Pourquoi certains animaux restent-ils immobiles pendant une période froide ?', expectedAnswer: 'Pour conserver leur énergie lorsque la température est basse.' },
    ],
    ['L’hibernation est un repos prolongé ; la migration est un déplacement saisonnier.', 'Ils restent immobiles pour conserver leur énergie pendant la période froide.'],
    [
      { observedResponse: 'Un oiseau qui voyage vers l’Égypte hiberne.', diagnosis: 'L’élève confond repos et déplacement.', correctivePrompt: 'L’oiseau dort-il sur place ou change-t-il de région ?' },
      { observedResponse: 'Tous les animaux hibernent en hiver.', diagnosis: 'L’élève généralise le comportement de certains animaux à toutes les espèces.', correctivePrompt: 'Compare un lézard, un oiseau migrateur et un animal qui reste actif.' },
    ],
    [
      'Fais classer des cartes-situations en trois groupes : activité ralentie, hibernation, migration.',
      'Reprends les mots « rester » et « se déplacer » pour faire distinguer les deux comportements.',
    ],
    [
      { prompt: 'Définis l’hibernation.', expectedAnswer: 'Un repos prolongé pendant une période froide ou défavorable.', successCriterion: 'La réponse décrit un repos, pas un déplacement.' },
      { prompt: 'Définis la migration.', expectedAnswer: 'Un déplacement saisonnier vers une autre région.', successCriterion: 'La réponse mentionne le déplacement saisonnier.' },
    ],
  ),
  '3-1': makeGuide(
    '28–29',
    'Une graine de haricot contient une petite partie vivante appelée embryon. L’embryon donnera une nouvelle plante. Les deux cotylédons contiennent des réserves nutritives, notamment de l’amidon, qui nourrissent la jeune plantule au début de son développement. Pour rechercher l’amidon, on peut déposer une goutte de solution d’iode sur un cotylédon : en présence d’amidon, la couleur devient bleu foncé. La germination est le début du développement de la plantule à partir de la graine.',
    'Fais tremper un haricot selon les consignes du manuel, retire délicatement son enveloppe et sépare les deux cotylédons. Repère l’embryon. Sous la supervision d’un adulte, dépose une goutte de solution d’iode sur un échantillon et observe le changement de couleur. Ne goûte jamais la solution.',
    [
      { prompt: 'Quelle partie de la graine donnera la nouvelle plante ?', expectedAnswer: 'L’embryon.' },
      { prompt: 'Quel rôle jouent les cotylédons ?', expectedAnswer: 'Ils stockent des réserves nutritives comme l’amidon.' },
    ],
    [
      { prompt: 'Comment reconnaît-on la présence d’amidon avec la solution d’iode ?', expectedAnswer: 'La solution devient bleu foncé.' },
      { prompt: 'Définis la germination.', expectedAnswer: 'C’est la sortie de la plantule de la graine et le début de sa croissance.' },
    ],
    ['La couleur devient bleu foncé.', 'La germination est la sortie de la plantule de la graine et le début de sa croissance.'],
    [
      { observedResponse: 'Les cotylédons sont les futures feuilles adultes.', diagnosis: 'L’élève confond les réserves nutritives avec l’embryon.', correctivePrompt: 'Quelle partie ressemble à une petite plante et quelle partie stocke la nourriture ?' },
      { observedResponse: 'L’iode devient bleu foncé avec toutes les substances.', diagnosis: 'L’élève ne relie pas le test à la présence d’amidon.', correctivePrompt: 'Quel nutriment le test à l’iode permet-il de rechercher ?' },
    ],
    [
      'Utilise un dessin agrandi d’une graine et fais pointer séparément l’enveloppe, les cotylédons et l’embryon.',
      'Présente deux résultats d’observation à l’iode et demande lequel indique la présence d’amidon.',
    ],
    [
      { prompt: 'Quelle est la différence entre l’embryon et les cotylédons ?', expectedAnswer: 'L’embryon donnera la nouvelle plante ; les cotylédons stockent des réserves nutritives.', successCriterion: 'Les deux rôles sont distingués.' },
      { prompt: 'Que signifie un changement vers le bleu foncé lors du test à l’iode ?', expectedAnswer: 'La présence d’amidon.', successCriterion: 'L’élève associe correctement couleur et amidon.' },
    ],
  ),
  '3-2': makeGuide(
    '30–33',
    'Pour savoir si l’eau est nécessaire à la germination, on compare deux groupes de graines semblables. On place les graines sur du coton dans deux gobelets. Le coton du gobelet A est humidifié ; celui du gobelet B reste sec. Les deux gobelets sont placés au même endroit chaud et restent exposés à l’air. On observe les graines chaque jour. La seule condition que l’on change est la présence d’eau. Les graines du gobelet humide peuvent germer ; celles du gobelet sec ne disposent pas de l’eau nécessaire. Il ne faut pas inonder les graines, car elles doivent aussi rester en contact avec l’air.',
    'Prépare deux gobelets transparents avec le même type et le même nombre de graines sur du coton. Humidifie le coton du premier, laisse le second sec, puis place-les côte à côte. Note chaque jour les changements sans déplacer les conditions.',
    [
      { prompt: 'Quelle condition change entre les gobelets A et B ?', expectedAnswer: 'La présence ou l’absence d’eau.' },
      { prompt: 'Quelles conditions faut-il garder comparables ?', expectedAnswer: 'La température, l’air, la lumière, le type et le nombre de graines.' },
    ],
    [
      { prompt: 'Quel résultat prévois-tu pour le gobelet dont le coton est humide ?', expectedAnswer: 'Les graines peuvent germer si l’air et la température conviennent aussi.' },
      { prompt: 'Pourquoi ne faut-il pas verser trop d’eau ?', expectedAnswer: 'Les graines doivent rester en contact avec l’air.' },
    ],
    ['Les graines du coton humide peuvent germer ; l’eau est la variable testée.', 'Un excès d’eau peut empêcher les graines de rester en contact avec l’air.'],
    [
      { observedResponse: 'On change l’eau et la température en même temps.', diagnosis: 'L’élève ne maîtrise pas la règle du test équitable.', correctivePrompt: 'Si les deux conditions changent, comment sauras-tu laquelle a produit la différence ?' },
      { observedResponse: 'Plus il y a d’eau, mieux les graines germent.', diagnosis: 'L’élève confond présence d’eau et immersion complète.', correctivePrompt: 'La graine doit-elle être mouillée tout en restant exposée à l’air ?' },
    ],
    [
      'Dessine les deux gobelets et entoure en rouge la seule variable qui change ; souligne en bleu les conditions constantes.',
      'Fais compléter un tableau « variable modifiée / conditions constantes / résultat attendu » avant de commencer l’expérience.',
    ],
    [
      { prompt: 'Quelle est la variable modifiée dans cette expérience ?', expectedAnswer: 'La présence ou l’absence d’eau.', successCriterion: 'Une seule variable est nommée.' },
      { prompt: 'Pourquoi les deux gobelets doivent-ils rester dans le même endroit ?', expectedAnswer: 'Pour garder la température et l’éclairage comparables.', successCriterion: 'L’élève cite des conditions constantes.' },
    ],
  ),
  '3-3': makeGuide(
    '34–35',
    'Les graines sont des êtres vivants et elles ont besoin d’air pour germer. Pour tester ce besoin, on compare deux groupes qui reçoivent de l’eau : le premier reste sur du coton humide et au contact de l’air ; le second est complètement immergé. On garde les deux groupes dans un endroit de même température et avec un éclairage comparable. On observe ensuite les graines. Le but est de vérifier l’effet de l’accès à l’air, sans changer en même temps les autres conditions.',
    'Place des graines sur du coton humide dans le bécher A. Place des graines semblables dans le bécher B et ajoute assez d’eau pour les immerger. Garde les deux récipients dans le même endroit chaud et observe-les pendant plusieurs jours.',
    [
      { prompt: 'Pourquoi les graines du bécher B sont-elles immergées ?', expectedAnswer: 'Pour réduire leur accès à l’air et tester si l’air est nécessaire.' },
      { prompt: 'Quelle condition doit rester comparable entre A et B ?', expectedAnswer: 'La quantité d’eau disponible et la température ; l’éclairage doit aussi être comparable.' },
    ],
    [
      { prompt: 'Que montre la comparaison entre les graines exposées à l’air et les graines immergées ?', expectedAnswer: 'L’accès à l’air est nécessaire à la germination.' },
      { prompt: 'Pourquoi cette expérience ne doit-elle pas changer aussi la température ?', expectedAnswer: 'Pour savoir si la différence de résultat vient de l’accès à l’air.' },
    ],
    ['Les graines exposées à l’air peuvent germer ; l’air est nécessaire.', 'Pour isoler l’effet de l’air et rendre la comparaison équitable.'],
    [
      { observedResponse: 'Les graines ont besoin seulement d’eau.', diagnosis: 'L’élève oublie que la graine est un être vivant qui a aussi besoin d’air.', correctivePrompt: 'Que se passe-t-il si une graine reste complètement sous l’eau ?' },
      { observedResponse: 'L’expérience teste la température.', diagnosis: 'L’élève confond l’expérience sur l’air avec celle sur la température.', correctivePrompt: 'Quel élément est différent entre le coton humide exposé à l’air et l’immersion ?' },
    ],
    [
      'Fais comparer les deux montages et demande à l’élève de nommer la seule différence visée.',
      'Utilise un tableau de résultats pour distinguer observation et conclusion.',
    ],
    [
      { prompt: 'Quelle condition de germination est testée dans cette expérience ?', expectedAnswer: 'L’accès à l’air.', successCriterion: 'L’élève nomme l’air, pas l’eau ou la température.' },
      { prompt: 'Quelle conclusion tire-t-on de l’expérience ?', expectedAnswer: 'Les graines ont besoin d’air pour germer.', successCriterion: 'La conclusion répond directement à la question testée.' },
    ],
  ),
  '3-4': makeGuide(
    '36–39',
    'Les graines ont besoin d’une température convenable pour germer. Pour étudier son effet, on place des graines semblables sur du coton humide dans deux gobelets. L’un reste dans un endroit chaud ; l’autre est placé au réfrigérateur. L’eau, l’air et l’éclairage doivent rester comparables. Le manuel propose de couvrir le gobelet chaud avec une boîte sombre pour rapprocher son éclairage de celui du réfrigérateur, tout en laissant entrer l’air. On compare ensuite les résultats. Une température trop basse peut empêcher la germination.',
    'Prépare deux gobelets identiques avec du coton humide et le même nombre de graines. Place A dans un endroit chaud et B au réfrigérateur. Protège A de la lumière avec une boîte qui laisse passer l’air, comme le décrit le manuel. Observe les graines après quelques jours.',
    [
      { prompt: 'Quelle condition change entre les deux gobelets ?', expectedAnswer: 'La température : un gobelet est au chaud et l’autre au froid.' },
      { prompt: 'Pourquoi couvre-t-on le gobelet placé au chaud ?', expectedAnswer: 'Pour rendre l’éclairage comparable à celui du réfrigérateur.' },
    ],
    [
      { prompt: 'Pourquoi les graines du réfrigérateur ne germent-elles pas dans cette expérience ?', expectedAnswer: 'Parce que la température est trop basse pour la germination.' },
      { prompt: 'Cite deux conditions à garder identiques.', expectedAnswer: 'L’eau et l’air ; l’éclairage doit également être comparable.' },
    ],
    ['La température est trop basse.', 'L’eau et l’air doivent rester identiques ; l’éclairage doit aussi être comparable.'],
    [
      { observedResponse: 'On change l’eau et la température ensemble.', diagnosis: 'L’élève ne sait pas isoler une variable.', correctivePrompt: 'Quelle condition veux-tu tester ? Garde toutes les autres identiques.' },
      { observedResponse: 'Les graines ont besoin de lumière pour germer.', diagnosis: 'L’élève confond germination et croissance après la germination.', correctivePrompt: 'Le manuel distingue-t-il les besoins de la graine qui germe et ceux de la jeune plante qui grandit ?' },
    ],
    [
      'Reconstitue le montage avec des cartes « eau », « air », « lumière » et « température », puis identifie la carte qui change.',
      'Fais expliquer le rôle de la boîte sombre et des espaces qui laissent entrer l’air.',
    ],
    [
      { prompt: 'Quel facteur est étudié dans l’expérience chaud/froid ?', expectedAnswer: 'La température.', successCriterion: 'L’élève identifie la température comme variable modifiée.' },
      { prompt: 'Pourquoi faut-il garder l’eau et l’air comparables ?', expectedAnswer: 'Pour attribuer la différence observée à la température.', successCriterion: 'L’élève explique le contrôle des variables.' },
    ],
  ),
  '3-5': makeGuide(
    '40–43',
    'Les expériences du chapitre montrent trois conditions nécessaires à la germination : l’eau, l’air et une température appropriée. Si l’une de ces conditions manque, la graine ne germe pas normalement. La lumière du Soleil et l’engrais ne sont pas nécessaires pour déclencher la germination elle-même ; ils deviennent importants pour la croissance de la jeune plante après la germination. Une graine peut donc commencer à germer dans un endroit sombre si elle dispose d’eau, d’air et d’une température convenable.',
    'Présente trois cartes : eau, air, température appropriée. Retire une carte à la fois et demande ce qui manque à la graine. Ajoute ensuite deux cartes, lumière et engrais, et classe-les dans les besoins de la croissance après la germination.',
    [
      { prompt: 'Quelles sont les trois conditions indispensables à la germination ?', expectedAnswer: 'L’eau, l’air et une température appropriée.' },
      { prompt: 'La lumière est-elle nécessaire pour que la graine commence à germer ?', expectedAnswer: 'Non, elle est surtout nécessaire à la croissance après la germination.' },
    ],
    [
      { prompt: 'Une graine reçoit de l’eau et de l’air, mais reste dans un endroit trop froid. Que prévois-tu ?', expectedAnswer: 'Elle ne germera pas normalement, car la température n’est pas appropriée.' },
      { prompt: 'Classe la lumière et l’engrais : germination ou croissance après la germination ?', expectedAnswer: 'Ils sont nécessaires à la croissance après la germination, pas au déclenchement de la germination.' },
    ],
    ['La graine ne germera pas normalement si la température est trop basse.', 'La lumière et l’engrais soutiennent la croissance après la germination.'],
    [
      { observedResponse: 'Les graines ont besoin de lumière pour germer.', diagnosis: 'L’élève mélange les conditions de germination avec celles de la croissance ultérieure.', correctivePrompt: 'Une graine peut-elle commencer à germer dans un coton humide placé dans une boîte sombre mais chaude et aérée ?' },
      { observedResponse: 'L’eau suffit à elle seule.', diagnosis: 'L’élève oublie l’air et la température appropriée.', correctivePrompt: 'Que montrent les deux autres expériences du chapitre ?' },
    ],
    [
      'Reprends les trois expériences précédentes et fais compléter un tableau comparatif avec la variable modifiée et le résultat.',
      'Fais classer chaque facteur dans deux colonnes : « germination » et « croissance après la germination ».',
    ],
    [
      { prompt: 'Cite les trois conditions de germination.', expectedAnswer: 'L’eau, l’air et une température appropriée.', successCriterion: 'Les trois conditions sont citées sans en ajouter une quatrième.' },
      { prompt: 'Pourquoi la lumière et l’engrais sont-ils classés dans la croissance ultérieure ?', expectedAnswer: 'Ils aident la jeune plante à grandir après que la germination a commencé.', successCriterion: 'L’élève distingue clairement germination et croissance.' },
    ],
  ),
  '4-1': makeGuide(
    '44–45',
    'Après la germination, la plante a besoin de lumière du Soleil pour grandir sainement et fabriquer sa nourriture. Pour étudier ce rôle, on compare deux jeunes plants de taille semblable : l’un reçoit une lumière convenable et l’autre est placé dans l’obscurité. On garde l’eau, la température, le type de plante et les autres conditions comparables. Après plusieurs jours, on observe la couleur des feuilles et l’épaisseur de la tige. Une plante qui reçoit une lumière convenable présente généralement des feuilles plus vertes et une tige plus forte.',
    'Place deux jeunes plants semblables dans des conditions identiques. Mets A à la lumière et couvre B avec une boîte sombre. Arrose-les de façon comparable pendant environ une semaine, puis compare la couleur des feuilles et l’épaisseur des tiges.',
    [
      { prompt: 'Quelle condition change dans cette expérience ?', expectedAnswer: 'La présence ou l’absence de lumière du Soleil.' },
      { prompt: 'Quels éléments observe-t-on pour comparer les deux plants ?', expectedAnswer: 'La couleur des feuilles et l’épaisseur des tiges.' },
    ],
    [
      { prompt: 'Comment peut apparaître une plante qui grandit sans lumière ?', expectedAnswer: 'Ses feuilles peuvent jaunir et ses tiges devenir longues, fines et faibles.' },
      { prompt: 'Pourquoi faut-il donner la même quantité d’eau aux deux plants ?', expectedAnswer: 'Pour isoler l’effet de la lumière.' },
    ],
    ['Les feuilles peuvent jaunir et les tiges devenir longues, fines et faibles.', 'Pour que la lumière soit la seule variable modifiée.'],
    [
      { observedResponse: 'L’eau remplace la lumière.', diagnosis: 'L’élève confond deux besoins différents de la plante.', correctivePrompt: 'Pourquoi le manuel compare-t-il deux plants qui reçoivent la même eau mais pas la même lumière ?' },
      { observedResponse: 'Une plante sans lumière ne change jamais.', diagnosis: 'L’élève ne relie pas la lumière à la couleur et à la solidité de la plante.', correctivePrompt: 'Compare les feuilles et les tiges des deux plants.' },
    ],
    [
      'Fais prédire la couleur et la forme des tiges avant de montrer les résultats de l’expérience.',
      'Utilise des photos datées ou un tableau d’observations pour suivre les deux plants sur plusieurs jours.',
    ],
    [
      { prompt: 'Quel est le rôle de la lumière dans la croissance de la plante ?', expectedAnswer: 'Elle permet à la plante de fabriquer sa nourriture et soutient une croissance saine.', successCriterion: 'La réponse relie lumière et fabrication de nourriture.' },
      { prompt: 'Quelle différence observes-tu entre les deux plants ?', expectedAnswer: 'Le plant éclairé a des feuilles plus vertes et une tige plus forte ; le plant privé de lumière devient plus pâle et fragile.', successCriterion: 'La comparaison mentionne les feuilles et les tiges.' },
    ],
  ),
  '4-2': makeGuide(
    '46–49',
    'Les plantes absorbent dans le sol des nutriments qui contribuent à leur croissance. Un engrais peut apporter ces nutriments et aider les feuilles et les tiges à se développer. Pour vérifier son effet, on compare deux plants semblables : l’un reçoit de l’eau mélangée à une quantité déterminée d’engrais et l’autre reçoit seulement de l’eau. Les deux plants doivent recevoir une lumière et une température comparables, et être cultivés dans le même type de sol. On mesure leur hauteur à intervalles réguliers. L’engrais ne remplace ni l’eau ni la lumière.',
    'Prépare deux plants de haricot semblables. Donne à A de l’eau avec une quantité fixe d’engrais et à B seulement de l’eau. Place-les au même endroit et mesure leur hauteur tous les quelques jours.',
    [
      { prompt: 'Quelle condition change entre les deux plants ?', expectedAnswer: 'La présence ou l’absence d’engrais.' },
      { prompt: 'Que faut-il mesurer pour suivre leur croissance ?', expectedAnswer: 'La hauteur des plants ; on peut aussi observer les feuilles et les tiges.' },
    ],
    [
      { prompt: 'Pourquoi les deux plants doivent-ils recevoir la même lumière ?', expectedAnswer: 'Pour que la différence observée soit liée à l’engrais et non à la lumière.' },
      { prompt: 'L’engrais peut-il remplacer l’eau ?', expectedAnswer: 'Non. L’engrais apporte des nutriments, mais la plante a toujours besoin d’eau.' },
    ],
    ['Pour isoler l’effet de l’engrais.', 'Non. L’engrais ne remplace pas l’eau.'],
    [
      { observedResponse: 'Le plant qui reçoit le plus d’engrais grandit toujours mieux.', diagnosis: 'L’élève suppose qu’une quantité plus grande est toujours préférable.', correctivePrompt: 'Pourquoi le protocole utilise-t-il une quantité fixe et mesurée d’engrais ?' },
      { observedResponse: 'L’engrais remplace la lumière.', diagnosis: 'L’élève confond nutriments du sol et énergie lumineuse.', correctivePrompt: 'Quelles conditions le manuel demande-t-il de garder identiques ?' },
    ],
    [
      'Fais identifier la variable modifiée et toutes les conditions constantes avant de comparer les résultats.',
      'Fais tracer deux lignes de croissance à partir de mesures prises à plusieurs dates.',
    ],
    [
      { prompt: 'Quel est le rôle de l’engrais ?', expectedAnswer: 'Il apporte des nutriments qui soutiennent la croissance des feuilles et des tiges.', successCriterion: 'La réponse mentionne l’apport de nutriments.' },
      { prompt: 'Comment organiser une comparaison juste avec et sans engrais ?', expectedAnswer: 'Utiliser des plants semblables et garder l’eau, la lumière, le sol et la température comparables.', successCriterion: 'L’élève nomme une seule variable modifiée et plusieurs constantes.' },
    ],
  ),
  '5-1': makeGuide(
    '52–54',
    'Le luffa et la courge portent des fleurs mâles et des fleurs femelles séparées sur une même plante. La fleur mâle possède une étamine qui produit des grains de pollen jaunes. La fleur femelle possède un carpelle au centre et un renflement à sa base ; ce renflement pourra se développer en fruit. Pour reconnaître les deux fleurs, observe la base et la partie centrale : le renflement est un indice de la fleur femelle, tandis que l’étamine porte le pollen dans la fleur mâle.',
    'Observe deux images de fleurs de luffa. Cherche d’abord un renflement sous les pétales, puis observe le centre de la fleur. Étiquette la fleur avec renflement « femelle » et celle qui porte l’étamine « mâle ».',
    [
      { prompt: 'Quelle structure produit les grains de pollen ?', expectedAnswer: 'L’étamine de la fleur mâle.' },
      { prompt: 'Quel indice visible aide à reconnaître la fleur femelle ?', expectedAnswer: 'Le renflement à la base de la fleur.' },
    ],
    [
      { prompt: 'Associe : étamine, pollen, carpelle, renflement à la base.', expectedAnswer: 'L’étamine produit le pollen ; le carpelle est la partie femelle ; le renflement de la fleur femelle se développera en fruit.' },
      { prompt: 'Pourquoi peut-on reconnaître une fleur femelle avant que le fruit se développe ?', expectedAnswer: 'Elle possède déjà un renflement à sa base.' },
    ],
    ['L’étamine produit le pollen ; le carpelle est la partie femelle ; le renflement devient le fruit.', 'Parce qu’un renflement est visible à la base de la fleur femelle.'],
    [
      { observedResponse: 'La fleur mâle possède le renflement qui devient fruit.', diagnosis: 'L’élève inverse les caractéristiques des deux fleurs.', correctivePrompt: 'Quelle fleur possède le petit renflement sous les pétales ?' },
      { observedResponse: 'Le pollen est produit par le carpelle.', diagnosis: 'L’élève confond les organes mâle et femelle.', correctivePrompt: 'Associe l’étamine au pollen et le carpelle à la partie femelle.' },
    ],
    [
      'Fais colorier séparément les deux types de fleurs et place des étiquettes sur l’étamine, le pollen, le carpelle et le renflement.',
      'Utilise un tableau « fleur mâle / fleur femelle » avec deux critères : partie centrale et base de la fleur.',
    ],
    [
      { prompt: 'Quelle partie de la fleur mâle produit le pollen ?', expectedAnswer: 'L’étamine.', successCriterion: 'Le nom « étamine » est donné.' },
      { prompt: 'Quelle partie de la fleur femelle se développe en fruit ?', expectedAnswer: 'Le carpelle, avec le renflement à sa base qui se développe en fruit.', successCriterion: 'L’élève identifie la fleur femelle et le renflement.' },
    ],
  ),
  '5-2': makeGuide(
    '55–59',
    'Le microscope permet d’observer des objets trop petits pour être vus clairement à l’œil nu. La préparation à observer est placée sur une lame de verre, parfois avec une ou deux gouttes d’eau, puis recouverte délicatement d’une lamelle. Le microscope possède notamment un oculaire, un objectif, une platine, une vis de réglage, un miroir et des valets. Commence toujours avec le plus faible grossissement. Mets la lame sur la platine, règle l’éclairage, rapproche l’objectif en regardant de côté, puis regarde dans l’oculaire et éloigne doucement l’objectif pour faire la mise au point. L’image apparaît inversée. Le grossissement total est égal au grossissement de l’oculaire multiplié par celui de l’objectif.',
    'Si l’oculaire grossit 10 fois et l’objectif 40 fois, le grossissement total est 10 × 40 = 400 fois. Pour observer le pollen, commence avec l’objectif le plus faible, repère l’échantillon, puis augmente le grossissement si nécessaire. Ne dirige jamais le microscope vers le Soleil.',
    [
      { prompt: 'Par quel grossissement commence-t-on ?', expectedAnswer: 'Par le plus faible grossissement.' },
      { prompt: 'Pourquoi éloigne-t-on l’objectif de la lame pendant la mise au point ?', expectedAnswer: 'Pour éviter que l’objectif heurte et casse la lame.' },
    ],
    [
      { prompt: 'Calcule le grossissement total avec un oculaire ×10 et un objectif ×40.', expectedAnswer: '×400.' },
      { prompt: 'Comment apparaît l’image observée au microscope ?', expectedAnswer: 'Elle apparaît inversée de haut en bas et de droite à gauche.' },
    ],
    ['10 × 40 = 400.', 'L’image est inversée verticalement et horizontalement.'],
    [
      { observedResponse: 'Il faut commencer par le plus fort grossissement.', diagnosis: 'L’élève ne tient pas compte du champ de vision plus large au faible grossissement.', correctivePrompt: 'Avec quel grossissement est-il plus facile de trouver d’abord l’objet ?' },
      { observedResponse: 'On rapproche l’objectif de la lame en regardant dans l’oculaire.', diagnosis: 'L’élève risque de heurter la lame avec l’objectif.', correctivePrompt: 'Pourquoi faut-il regarder de côté avant de rapprocher l’objectif ?' },
    ],
    [
      'Fais placer des étiquettes sur un schéma du microscope avant toute manipulation.',
      'Fais répéter l’ordre des gestes à vide, sans toucher aux vis, puis supervise une observation au faible grossissement.',
    ],
    [
      { prompt: 'Comment calcule-t-on le grossissement total ?', expectedAnswer: 'On multiplie le grossissement de l’oculaire par celui de l’objectif.', successCriterion: 'La multiplication et les deux facteurs sont corrects.' },
      { prompt: 'Quelle règle de sécurité protège la lame ?', expectedAnswer: 'On rapproche l’objectif en regardant de côté, puis on fait la mise au point en éloignant l’objectif.', successCriterion: 'L’élève décrit l’ordre sûr de mise au point.' },
    ],
  ),
  '5-3': makeGuide(
    '60–63',
    'La pollinisation se produit lorsque des grains de pollen provenant d’une fleur mâle se déposent sur le sommet du carpelle d’une fleur femelle. Chez le luffa, les fleurs mâles et femelles sont séparées. Des insectes, comme les abeilles, peuvent transporter le pollen d’une fleur à l’autre. Après la pollinisation, le carpelle se développe en fruit et des graines se forment à l’intérieur. Sans pollinisation, la fleur femelle ne produit pas un fruit qui se développe normalement.',
    'Utilise deux fleurs femelles de luffa protégées par des sacs. Sur la fleur A, dépose du pollen provenant d’une fleur mâle puis replace le sac. Laisse la fleur B protégée sans ajouter de pollen. Après quelques jours, compare le développement des deux bases florales.',
    [
      { prompt: 'Comment appelle-t-on le dépôt du pollen sur le sommet du carpelle ?', expectedAnswer: 'La pollinisation.' },
      { prompt: 'Quel animal peut transporter le pollen entre les fleurs de luffa ?', expectedAnswer: 'Un insecte, par exemple une abeille.' },
    ],
    [
      { prompt: 'Mets dans l’ordre : formation des graines, pollinisation, développement du fruit.', expectedAnswer: 'Pollinisation → développement du fruit → formation des graines à l’intérieur.' },
      { prompt: 'Que peut-il arriver à une fleur femelle qui n’a pas été pollinisée ?', expectedAnswer: 'Elle se fane et le fruit ne se développe pas normalement.' },
    ],
    ['Pollinisation → développement du fruit → formation des graines.', 'La fleur se fane et le fruit ne se développe pas normalement.'],
    [
      { observedResponse: 'La pollinisation est la transformation de la fleur en fruit.', diagnosis: 'L’élève confond le transfert du pollen avec les changements qui suivent.', correctivePrompt: 'Quel événement doit arriver avant que le fruit se développe ?' },
      { observedResponse: 'Le pollen est transporté par le vent uniquement.', diagnosis: 'L’élève oublie les insectes cités dans l’exemple du luffa.', correctivePrompt: 'Quel insecte visite les fleurs et peut transporter le pollen ?' },
    ],
    [
      'Utilise des flèches pour représenter le trajet du pollen de l’étamine vers le sommet du carpelle.',
      'Fais reconstruire la séquence avec trois cartes : pollinisation, fruit, graines.',
    ],
    [
      { prompt: 'Définis la pollinisation.', expectedAnswer: 'Le dépôt des grains de pollen sur le sommet du carpelle d’une fleur femelle.', successCriterion: 'La réponse mentionne le pollen et le carpelle.' },
      { prompt: 'Quel est le lien entre pollinisation et formation du fruit ?', expectedAnswer: 'Après la pollinisation, le carpelle se développe en fruit et des graines se forment.', successCriterion: 'Les étapes sont dans le bon ordre.' },
    ],
  ),
  '6-1': makeGuide(
    '64–65',
    'La croissance est un changement qui se produit au fil du temps : le corps devient plus grand, plus fort et plus complexe. Le manuel présente plusieurs étapes de la vie humaine : petite enfance, enfance, adolescence, jeunesse et vieillesse. La petite enfance commence à la naissance ; le nourrisson dépend des adultes pour la nourriture, les soins et la protection. Pendant l’enfance, l’enfant apprend notamment à marcher, à parler et à aller à l’école, tandis que ses os et ses muscles deviennent plus forts. Les étapes se succèdent au cours de la vie.',
    'Place cinq cartes dans l’ordre : nourrisson, enfant, adolescent, jeune adulte, personne âgée. Pour chaque carte, demande un changement général observable, sans demander à l’élève de raconter des informations personnelles.',
    [
      { prompt: 'Quelle étape commence à la naissance ?', expectedAnswer: 'La petite enfance.' },
      { prompt: 'Cite deux capacités que l’enfant développe pendant l’enfance.', expectedAnswer: 'Il apprend notamment à marcher et à parler.' },
    ],
    [
      { prompt: 'Ordonne les étapes de la vie présentées dans le manuel.', expectedAnswer: 'Petite enfance → enfance → adolescence → jeunesse → vieillesse.' },
      { prompt: 'Que signifie grandir ?', expectedAnswer: 'Le corps change au fil du temps et devient plus grand, plus fort et plus complexe.' },
    ],
    ['Petite enfance → enfance → adolescence → jeunesse → vieillesse.', 'Le corps change au fil du temps et devient plus grand, plus fort et plus complexe.'],
    [
      { observedResponse: 'La jeunesse vient avant l’enfance.', diagnosis: 'L’élève ne maîtrise pas l’ordre chronologique des étapes.', correctivePrompt: 'Quelle étape vient juste après la naissance ? Et après l’enfance ?' },
      { observedResponse: 'La croissance signifie seulement devenir plus grand.', diagnosis: 'L’élève réduit la croissance à la taille.', correctivePrompt: 'Le manuel parle aussi de force et de complexité : que signifient ces changements ?' },
    ],
    [
      'Reprends la frise des âges et fais raconter une étape à la fois avec une phrase courte.',
      'Compare deux illustrations fictives du même personnage à deux âges différents et relève plusieurs changements.',
    ],
    [
      { prompt: 'Quelle étape vient après la petite enfance ?', expectedAnswer: 'L’enfance.', successCriterion: 'L’ordre chronologique est correct.' },
      { prompt: 'Donne deux aspects de la croissance.', expectedAnswer: 'Le corps devient plus grand, plus fort et plus complexe.', successCriterion: 'Au moins deux aspects sont cités.' },
    ],
  ),
  '6-2': makeGuide(
    '66–67',
    'Les enfants ressemblent souvent à leurs parents parce qu’ils héritent de caractères de leur père et de leur mère. Des membres d’une même famille peuvent partager certains traits et présenter aussi des différences. La ressemblance ne signifie pas que deux personnes sont identiques. Pour étudier cette idée en classe, on peut utiliser des personnages fictifs ou des dessins, sans demander à l’enfant de révéler des informations personnelles sur sa famille.',
    'Montre un dessin de deux parents fictifs et de deux enfants fictifs. Demande aux élèves de repérer un trait partagé, puis un trait différent. Explique que les enfants héritent de caractères des deux parents.',
    [
      { prompt: 'Pourquoi des enfants peuvent-ils ressembler à leurs parents ?', expectedAnswer: 'Parce qu’ils héritent de caractères de leur père et de leur mère.' },
      { prompt: 'Deux enfants d’une même famille sont-ils toujours identiques ?', expectedAnswer: 'Non. Ils peuvent partager certains traits et avoir aussi des différences.' },
    ],
    [
      { prompt: 'Complète : les enfants héritent de caractères de leur ______ et de leur ______.', expectedAnswer: 'père ; mère.' },
      { prompt: 'Donne un exemple de ressemblance et un exemple de différence dans une famille fictive.', expectedAnswer: 'Réponse variable, avec au moins un trait partagé et un trait différent clairement décrits.' },
    ],
    ['père ; mère.', 'Réponse variable : un trait partagé et un trait différent doivent être décrits sans affirmer que les personnes sont identiques.'],
    [
      { observedResponse: 'Les enfants ressemblent à leurs parents uniquement parce qu’ils vivent ensemble.', diagnosis: 'L’élève confond l’héritage des caractères avec les habitudes partagées.', correctivePrompt: 'Le manuel parle-t-il de caractères hérités ou seulement d’habitudes apprises ?' },
      { observedResponse: 'Tous les enfants d’une famille sont identiques.', diagnosis: 'L’élève confond ressemblance et identité parfaite.', correctivePrompt: 'Peux-tu trouver à la fois une ressemblance et une différence dans le dessin ?' },
    ],
    [
      'Travaille avec des personnages inventés et un tableau « ressemblances / différences ».',
      'Reformule les réponses qui jugent les apparences pour ne garder que des descriptions neutres et respectueuses.',
    ],
    [
      { prompt: 'Que signifie hériter d’un caractère ?', expectedAnswer: 'Recevoir un trait transmis par ses parents.', successCriterion: 'La réponse relie héritage et parents.' },
      { prompt: 'Pourquoi les membres d’une famille peuvent-ils se ressembler sans être identiques ?', expectedAnswer: 'Ils héritent de caractères de leurs deux parents, mais chacun présente une combinaison de traits.', successCriterion: 'La réponse mentionne à la fois ressemblances et différences.' },
    ],
  ),
  '6-3': makeGuide(
    '68–71',
    'Pour grandir en bonne santé, le manuel présente trois conditions importantes. Une alimentation saine apporte au corps les éléments nutritifs dont il a besoin. Un sommeil suffisant permet au cerveau de se reposer et accompagne la construction et le développement du corps. Une activité physique adaptée fait bouger le corps et contribue à renforcer le cœur et les muscles. Ces trois habitudes se complètent : aucune ne remplace les deux autres.',
    'Présente trois cartes : repas varié, sommeil suffisant, activité physique. Pour chaque carte, demande à l’élève d’expliquer en une phrase comment cette habitude soutient la croissance.',
    [
      { prompt: 'Quel est le rôle du sommeil suffisant ?', expectedAnswer: 'Il permet au cerveau de se reposer et aide le corps à se construire et à se développer.' },
      { prompt: 'Que renforce l’activité physique adaptée ?', expectedAnswer: 'Le cœur et les muscles.' },
    ],
    [
      { prompt: 'Associe chaque action à une condition : manger des fruits et légumes, dormir suffisamment, bouger régulièrement.', expectedAnswer: 'Fruits et légumes : alimentation saine ; dormir : sommeil suffisant ; bouger : activité physique adaptée.' },
      { prompt: 'Pourquoi ces trois conditions doivent-elles être équilibrées ?', expectedAnswer: 'Parce qu’elles ont des rôles différents et complémentaires dans une croissance saine.' },
    ],
    ['Fruits et légumes : alimentation saine ; dormir : sommeil suffisant ; bouger : activité physique adaptée.', 'Elles ont des rôles différents et complémentaires.'],
    [
      { observedResponse: 'Faire du sport remplace le sommeil.', diagnosis: 'L’élève pense qu’une seule habitude suffit.', correctivePrompt: 'Quel rôle le manuel attribue-t-il séparément au sommeil et à l’activité physique ?' },
      { observedResponse: 'Manger seulement des collations suffit pour grandir.', diagnosis: 'L’élève ne relie pas la diversité alimentaire aux besoins du corps.', correctivePrompt: 'Quels exemples d’aliments sains le manuel propose-t-il ?' },
    ],
    [
      'Fais classer des exemples d’habitudes dans les trois catégories avant de demander une explication.',
      'Construis avec l’élève une journée fictive équilibrée comportant repas, repos et mouvement.',
    ],
    [
      { prompt: 'Cite les trois conditions d’une croissance saine présentées dans le manuel.', expectedAnswer: 'Alimentation saine, sommeil suffisant et activité physique adaptée.', successCriterion: 'Les trois conditions sont nommées.' },
      { prompt: 'Explique le rôle de l’une de ces conditions.', expectedAnswer: 'Réponse cohérente : nutriments pour l’alimentation, repos du cerveau et développement pour le sommeil, renforcement du cœur et des muscles pour l’activité.', successCriterion: 'L’explication correspond au bon facteur.' },
    ],
  ),
  '7-1': makeGuide(
    '72–73',
    'La manière dont les animaux commencent une nouvelle vie varie selon les espèces. La chatte porte ses petits dans son corps pendant leur développement, puis elle leur donne naissance. Après la naissance, elle nettoie les chatons et les nourrit avec son lait. Les chatons sont petits au début, puis grandissent avec le temps. Les petits ressemblent souvent à leurs parents. La reproduction permet de produire de nouveaux individus de la même espèce et contribue à la continuité de la vie.',
    'Présente trois images séquentielles : chatons avant la naissance dans le corps de la mère, naissance, puis chatons nourris par leur mère. Demande à l’élève de raconter les étapes sans ajouter de détails non étudiés.',
    [
      { prompt: 'Où les chatons se développent-ils avant leur naissance ?', expectedAnswer: 'À l’intérieur du corps de leur mère.' },
      { prompt: 'Que boivent les chatons nouveau-nés ?', expectedAnswer: 'Le lait maternel.' },
    ],
    [
      { prompt: 'Décris deux soins apportés par la chatte à ses petits.', expectedAnswer: 'Elle les nettoie et les nourrit avec son lait.' },
      { prompt: 'Pourquoi la reproduction est-elle importante pour l’espèce ?', expectedAnswer: 'Elle permet de produire de nouveaux individus et d’assurer la continuité de l’espèce.' },
    ],
    ['La chatte nettoie ses petits et les nourrit avec son lait.', 'La reproduction produit de nouveaux individus et assure la continuité de l’espèce.'],
    [
      { observedResponse: 'La chatte pond des œufs.', diagnosis: 'L’élève confond les deux modes de reproduction étudiés.', correctivePrompt: 'Le manuel décrit-il des chatons qui sortent d’un œuf ou qui naissent du corps de la mère ?' },
      { observedResponse: 'Les chatons boivent de l’eau uniquement.', diagnosis: 'L’élève oublie l’allaitement décrit dans le manuel.', correctivePrompt: 'Que donne la chatte à ses petits après leur naissance ?' },
    ],
    [
      'Compare une séquence illustrée de la chatte avec celle du poisson qui pond des œufs.',
      'Fais reformuler les étapes avec les mots « porter », « donner naissance », « nourrir » et « grandir ».',
    ],
    [
      { prompt: 'Comment la chatte met-elle ses petits au monde ?', expectedAnswer: 'Elle donne naissance à des chatons.', successCriterion: 'L’élève ne parle pas de ponte.' },
      { prompt: 'Quel soin aide les chatons à grandir ?', expectedAnswer: 'La chatte les nourrit avec son lait et prend soin d’eux.', successCriterion: 'L’élève mentionne le lait maternel ou les soins.' },
    ],
  ),
  '7-2': makeGuide(
    '74–75',
    'Contrairement aux chats, les poissons étudiés dans le manuel pondent des œufs dans l’eau. Après une certaine période, les petits poissons sortent des œufs : cette sortie s’appelle l’éclosion. Les jeunes poissons commencent ensuite à nager. La femelle pond un grand nombre d’œufs ; cela augmente les chances qu’un grand nombre de petits survivent. La reproduction produit de nouveaux individus de la même espèce.',
    'Utilise un schéma en trois étapes : œufs dans l’eau, éclosion, jeunes poissons qui nagent. Fais comparer cette séquence à celle du chat sans dire que tous les animaux se reproduisent de la même manière.',
    [
      { prompt: 'Comment appelle-t-on la sortie du petit poisson hors de l’œuf ?', expectedAnswer: 'L’éclosion.' },
      { prompt: 'Où la femelle poisson pond-elle ses œufs ?', expectedAnswer: 'Dans l’eau.' },
    ],
    [
      { prompt: 'Pourquoi certains poissons pondent-ils beaucoup d’œufs ?', expectedAnswer: 'Pour augmenter les chances qu’un grand nombre de petits survivent.' },
      { prompt: 'Quelle différence essentielle existe entre la naissance des chatons et celle des petits poissons ?', expectedAnswer: 'La chatte donne naissance à des petits ; les poissons pondent des œufs dont les petits éclosent.' },
    ],
    ['Pour augmenter les chances de survie d’un grand nombre de petits poissons.', 'La chatte donne naissance ; les poissons pondent des œufs et les petits en sortent par éclosion.'],
    [
      { observedResponse: 'Les poissons donnent naissance à des chatons.', diagnosis: 'L’élève mélange les exemples des deux chapitres.', correctivePrompt: 'Quel animal pond des œufs dans l’eau dans le manuel ?' },
      { observedResponse: 'L’éclosion est la formation de l’œuf.', diagnosis: 'L’élève confond la ponte et la sortie du petit.', correctivePrompt: 'À quel moment le petit poisson sort-il de l’œuf ?' },
    ],
    [
      'Fais ordonner les cartes « ponte », « œuf », « éclosion », « jeune poisson ».',
      'Fais comparer les nombres de petits et les soins parentaux décrits dans les exemples du chat et du poisson.',
    ],
    [
      { prompt: 'Définis l’éclosion.', expectedAnswer: 'C’est la sortie du petit animal de l’œuf.', successCriterion: 'La réponse décrit la sortie de l’œuf.' },
      { prompt: 'Pourquoi une femelle poisson pond-elle beaucoup d’œufs ?', expectedAnswer: 'Pour augmenter les chances qu’un grand nombre de petits survivent.', successCriterion: 'La réponse mentionne la survie des petits.' },
    ],
  ),
  '7-3': makeGuide(
    '76–79',
    'Les animaux peuvent donner naissance à des petits ou pondre des œufs. La chatte et le dromadaire donnent naissance à leurs petits ; la poule et la cane pondent des œufs ; les poissons pondent leurs œufs dans l’eau. Les jeunes sortent des œufs par éclosion. La reproduction permet de préserver une espèce. Les réserves naturelles protègent les animaux et leur offrent un environnement où ils peuvent vivre et se reproduire en sécurité. Le manuel cite notamment les réserves de Ras Mohammed et du Désert blanc en Égypte.',
    'Construis un tableau avec trois colonnes : animal, naissance ou ponte, lieu indiqué dans l’exemple. Classe le chat, le dromadaire, la poule, la cane et le poisson. Ajoute ensuite un exemple connu de l’élève.',
    [
      { prompt: 'Classe la poule : donne-t-elle naissance ou pond-elle des œufs ?', expectedAnswer: 'Elle pond des œufs.' },
      { prompt: 'À quoi sert une réserve naturelle ?', expectedAnswer: 'À protéger les animaux et leur permettre de vivre et de se reproduire en sécurité.' },
    ],
    [
      { prompt: 'Classe le chat, la poule et le poisson selon leur mode de reproduction.', expectedAnswer: 'Le chat donne naissance ; la poule pond des œufs sur la terre ; le poisson pond des œufs dans l’eau.' },
      { prompt: 'Pourquoi la protection des habitats aide-t-elle à préserver les espèces ?', expectedAnswer: 'Elle offre aux animaux un milieu sûr pour vivre et se reproduire.' },
    ],
    ['Le chat donne naissance ; la poule pond sur la terre ; le poisson pond dans l’eau.', 'Un habitat protégé permet aux animaux de vivre et de se reproduire en sécurité.'],
    [
      { observedResponse: 'Tous les animaux pondent des œufs.', diagnosis: 'L’élève généralise le mode de reproduction du poisson et de la poule.', correctivePrompt: 'Compare le chat avec la poule : que font-ils différemment ?' },
      { observedResponse: 'Une réserve naturelle est un parc d’attractions.', diagnosis: 'L’élève ne relie pas la réserve à la conservation des espèces.', correctivePrompt: 'Quel est l’objectif de protéger un habitat naturel ?' },
    ],
    [
      'Utilise des cartes d’animaux et un tableau de classement avant de demander une justification.',
      'Fais expliquer le lien entre habitat sûr, reproduction et continuité de l’espèce.',
    ],
    [
      { prompt: 'Quelle différence y a-t-il entre donner naissance et pondre des œufs ?', expectedAnswer: 'Dans un cas, le petit naît du corps de la mère ; dans l’autre, il sort d’un œuf par éclosion.', successCriterion: 'Les deux modes sont clairement distingués.' },
      { prompt: 'Cite une raison de créer des réserves naturelles.', expectedAnswer: 'Protéger les animaux et leurs habitats afin qu’ils puissent vivre et se reproduire.', successCriterion: 'La réponse mentionne la protection des espèces ou de leur habitat.' },
    ],
  ),
  '8-1': makeGuide(
    '80–81',
    'Pour décrire la couverture nuageuse, le manuel propose d’imaginer que le ciel entier est partagé en huit parties égales. On compte les parties couvertes par les nuages : ce nombre indique la couverture nuageuse, de 0 à 8. Dans la règle simplifiée du manuel, une couverture de 0 à 6 est classée « ensoleillée » et une couverture de 7 à 8 est classée « nuageuse ». Si la pluie ou la neige tombe, on décrit le temps comme pluvieux ou neigeux, quelle que soit la couverture nuageuse.',
    'Dessine un grand cercle partagé en huit secteurs. Colorie cinq secteurs pour représenter une couverture de 5/8. Selon la règle du manuel, le temps est classé ensoleillé. Colorie ensuite sept secteurs : il est classé nuageux.',
    [
      { prompt: 'Comment mesure-t-on la couverture nuageuse dans le modèle du manuel ?', expectedAnswer: 'On compte combien des huit parties du ciel sont couvertes.' },
      { prompt: 'Quelle catégorie correspond à une couverture de 7/8 ?', expectedAnswer: 'Nuageux.' },
    ],
    [
      { prompt: 'Classe une couverture de 4/8 selon la règle du manuel.', expectedAnswer: 'Ensoleillé.' },
      { prompt: 'Que dit-on s’il pleut, même si la couverture nuageuse est faible ?', expectedAnswer: 'Le temps est pluvieux.' },
    ],
    ['Ensoleillé.', 'Le temps est pluvieux, quelle que soit la couverture nuageuse.'],
    [
      { observedResponse: 'Une couverture de 6/8 est nuageuse.', diagnosis: 'L’élève place mal la limite de la règle du manuel.', correctivePrompt: 'Relis la séparation : 0 à 6, puis 7 à 8.' },
      { observedResponse: 'La pluie est classée ensoleillée si le ciel a moins de 7 parts nuageuses.', diagnosis: 'L’élève oublie la règle prioritaire pour la pluie ou la neige.', correctivePrompt: 'Que faut-il écrire si des précipitations tombent ?' },
    ],
    [
      'Fais manipuler huit jetons identiques pour représenter les huit parts du ciel.',
      'Présente plusieurs valeurs et demande à l’élève de justifier la catégorie avec la règle exacte.',
    ],
    [
      { prompt: 'Quelle catégorie correspond à 6/8 ?', expectedAnswer: 'Ensoleillé.', successCriterion: 'L’élève applique correctement la limite 0–6.' },
      { prompt: 'Quelle catégorie correspond à 8/8 ?', expectedAnswer: 'Nuageux.', successCriterion: 'L’élève applique correctement la limite 7–8.' },
    ],
  ),
  '8-2': makeGuide(
    '82–85',
    'Les nuages se déplacent avec le vent. Pour observer leur mouvement, il faut rester au même endroit et choisir un repère fixe, comme un bâtiment ou un arbre. On peut utiliser une boussole pour repérer l’Ouest et l’Est, puis observer le ciel toutes les quinze minutes. Le manuel indique qu’en Égypte et au Japon, les nuages se déplacent souvent de l’Ouest vers l’Est. C’est un motif fréquent à observer, pas une règle valable pour tous les lieux et tous les moments.',
    'Choisis un bâtiment comme repère. Avec une boussole, repère l’Ouest et l’Est. Observe les nuages, note leur position, puis recommence quinze minutes plus tard. Compare les notes sans te déplacer.',
    [
      { prompt: 'Pourquoi faut-il choisir un repère fixe ?', expectedAnswer: 'Pour distinguer le mouvement des nuages de celui de l’observateur.' },
      { prompt: 'À quel intervalle le manuel propose-t-il de refaire l’observation ?', expectedAnswer: 'Toutes les quinze minutes.' },
    ],
    [
      { prompt: 'Quelle direction de déplacement est souvent observée en Égypte selon le manuel ?', expectedAnswer: 'De l’Ouest vers l’Est.' },
      { prompt: 'Pourquoi observer les nuages depuis une voiture en mouvement est-il une mauvaise méthode ?', expectedAnswer: 'Parce que le mouvement de la voiture empêche de comparer correctement la position des nuages par rapport au sol.' },
    ],
    ['De l’Ouest vers l’Est.', 'Parce que l’observateur bouge aussi et le repère n’est plus fixe.'],
    [
      { observedResponse: 'Les nuages vont toujours de l’Est vers l’Ouest.', diagnosis: 'L’élève inverse les directions données dans le manuel.', correctivePrompt: 'Repère l’Ouest avec la boussole, puis rappelle le sens indiqué dans l’exemple.' },
      { observedResponse: 'On peut observer depuis une voiture en mouvement.', diagnosis: 'L’élève oublie que l’observateur doit rester fixe.', correctivePrompt: 'Que devient ton point de référence si tu te déplaces ?' },
    ],
    [
      'Fais placer les directions cardinales autour d’un dessin et trace une flèche Ouest → Est.',
      'Fais remplir un petit tableau d’observations avec heure, position des nuages et repère fixe.',
    ],
    [
      { prompt: 'Quelle est la règle d’observation la plus importante ?', expectedAnswer: 'Rester au même endroit et utiliser un repère fixe.', successCriterion: 'La réponse mentionne l’immobilité et le repère.' },
      { prompt: 'Quel motif de déplacement le manuel décrit-il souvent pour l’Égypte ?', expectedAnswer: 'Les nuages se déplacent souvent de l’Ouest vers l’Est.', successCriterion: 'Les deux directions sont dans le bon ordre.' },
    ],
  ),
  '8-3': makeGuide(
    '86–89',
    'Les satellites météorologiques prennent des images d’une grande région depuis l’espace. Sur les images présentées dans le manuel, les zones blanches représentent les nuages. Pour prévoir le temps, on observe où se trouvent les nuages et dans quelle direction ils se déplacent, puis on combine ces informations avec celles sur les vents. Si une grande masse nuageuse située à l’Ouest s’approche, le temps peut devenir plus nuageux ou pluvieux. Une prévision est une estimation fondée sur des observations ; elle n’est pas une certitude.',
    'Sur une carte simplifiée, place une masse blanche à l’Ouest de l’Égypte. Fais tracer sa direction habituelle vers l’Est. Demande à l’élève de prévoir ce qui pourrait arriver et de citer l’indice utilisé.',
    [
      { prompt: 'Que représentent les zones blanches sur une image satellite météorologique ?', expectedAnswer: 'Les nuages.' },
      { prompt: 'Quelle information complète l’observation des nuages pour faire une prévision ?', expectedAnswer: 'Les informations sur le vent.' },
    ],
    [
      { prompt: 'Une grande masse nuageuse arrive de l’Ouest. Quel changement peut-on prévoir ?', expectedAnswer: 'Le temps peut devenir plus nuageux ou pluvieux.' },
      { prompt: 'Pourquoi une prévision météorologique n’est-elle pas une certitude ?', expectedAnswer: 'Parce qu’elle est fondée sur des observations et des informations qui peuvent évoluer.' },
    ],
    ['Le temps peut devenir plus nuageux ou pluvieux.', 'Parce que les conditions météorologiques peuvent évoluer après l’observation.'],
    [
      { observedResponse: 'Les zones blanches représentent la mer.', diagnosis: 'L’élève ne connaît pas la convention de lecture de l’image utilisée dans le manuel.', correctivePrompt: 'Quelle couleur le manuel associe-t-il aux nuages sur l’image satellite ?' },
      { observedResponse: 'La prévision annonce exactement ce qui va arriver.', diagnosis: 'L’élève confond une prévision avec une certitude.', correctivePrompt: 'Pourquoi faut-il observer les nuages et le vent à nouveau ?' },
    ],
    [
      'Fais lire une image satellite simplifiée en commençant par identifier les zones blanches.',
      'Demande à l’élève de formuler une prévision avec la structure « Je prévois… parce que j’observe… ».',
    ],
    [
      { prompt: 'Quelles données sont combinées pour prévoir le temps ?', expectedAnswer: 'La position et le mouvement des nuages ainsi que les informations sur le vent.', successCriterion: 'La réponse mentionne nuages et vent.' },
      { prompt: 'Comment justifier une prévision ?', expectedAnswer: 'En citant les nuages observés, leur direction et les informations sur le vent.', successCriterion: 'La justification s’appuie sur des indices observables.' },
    ],
  ),
  '9-1': makeGuide(
    '92–93',
    'L’évaporation est le passage de l’eau liquide à la vapeur d’eau invisible qui se mélange à l’air. L’eau d’une flaque ou d’un vêtement mouillé ne disparaît pas : elle change d’état et passe dans l’air. L’évaporation est plus rapide lorsque la température est élevée, lorsque le temps est ensoleillé et lorsqu’il y a du vent. Pour l’étudier, on peut comparer deux récipients contenant la même quantité d’eau, dont un seul est couvert, puis observer la quantité d’eau après deux ou trois jours.',
    'Verse la même quantité d’eau dans deux verres. Couvre l’un avec un film plastique fixé par un élastique et laisse l’autre ouvert. Place-les dans le même endroit. Après deux ou trois jours, compare les quantités d’eau restantes.',
    [
      { prompt: 'Comment appelle-t-on le passage de l’eau liquide à la vapeur invisible ?', expectedAnswer: 'L’évaporation.' },
      { prompt: 'Quelles conditions accélèrent l’évaporation selon le manuel ?', expectedAnswer: 'Une température élevée, le soleil et le vent.' },
    ],
    [
      { prompt: 'Pourquoi une flaque sèche-t-elle après une période ensoleillée ?', expectedAnswer: 'Une partie de l’eau s’évapore et passe dans l’air sous forme de vapeur invisible.' },
      { prompt: 'Pourquoi faut-il mettre la même quantité d’eau dans les deux verres ?', expectedAnswer: 'Pour comparer les récipients dans des conditions de départ identiques.' },
    ],
    ['L’eau s’évapore et passe dans l’air sous forme de vapeur invisible.', 'Pour rendre la comparaison équitable.'],
    [
      { observedResponse: 'L’eau disparaît complètement.', diagnosis: 'L’élève ne comprend pas le changement d’état.', correctivePrompt: 'Où va l’eau lorsqu’un vêtement sèche ?' },
      { observedResponse: 'Le vent transforme l’eau en glace.', diagnosis: 'L’élève confond évaporation et solidification.', correctivePrompt: 'L’eau devient-elle invisible dans l’air ou devient-elle solide ?' },
    ],
    [
      'Fais observer un linge humide dans deux conditions et demande de prédire lequel sèchera le plus vite.',
      'Utilise un dessin « eau liquide → vapeur invisible dans l’air » pour représenter le changement.',
    ],
    [
      { prompt: 'Définis l’évaporation.', expectedAnswer: 'Le passage de l’eau liquide à la vapeur d’eau invisible qui se mélange à l’air.', successCriterion: 'La réponse mentionne eau liquide et vapeur invisible.' },
      { prompt: 'Cite deux facteurs qui accélèrent l’évaporation.', expectedAnswer: 'Une température élevée, le soleil ou le vent.', successCriterion: 'Au moins deux facteurs sont corrects.' },
    ],
  ),
  '9-2': makeGuide(
    '94–97',
    'L’air contient de la vapeur d’eau invisible. Lorsque cette vapeur se refroidit, elle peut se transformer en petites gouttelettes d’eau liquide : c’est la condensation. Les gouttelettes qui apparaissent à l’extérieur d’un verre rempli d’eau glacée viennent de la vapeur d’eau présente dans l’air autour du verre. Elles ne traversent pas le verre depuis l’intérieur. Le refroidissement de l’air au contact de la surface froide permet à la vapeur de se condenser.',
    'Remplis un verre de glace et d’eau, couvre-le avec un film plastique et marque le niveau de l’eau. Laisse-le un moment. Observe les gouttelettes sur la surface extérieure et vérifie que le niveau de l’eau à l’intérieur n’explique pas ces gouttes.',
    [
      { prompt: 'Que contient l’air même si nous ne le voyons pas ?', expectedAnswer: 'De la vapeur d’eau invisible.' },
      { prompt: 'Comment appelle-t-on le passage de la vapeur refroidie à l’eau liquide ?', expectedAnswer: 'La condensation.' },
    ],
    [
      { prompt: 'D’où viennent les gouttelettes à l’extérieur du verre froid ?', expectedAnswer: 'De la vapeur d’eau de l’air qui se refroidit et se condense.' },
      { prompt: 'Qu’est-ce qui se refroidit au contact du verre ?', expectedAnswer: 'La vapeur d’eau présente dans l’air environnant.' },
    ],
    ['De la vapeur d’eau de l’air qui se refroidit et se condense.', 'La vapeur d’eau présente dans l’air environnant.'],
    [
      { observedResponse: 'L’eau traverse le verre.', diagnosis: 'L’élève attribue les gouttes à une fuite plutôt qu’à la condensation.', correctivePrompt: 'Le niveau de l’eau à l’intérieur a-t-il changé ? Quelle autre source d’eau existe dans l’air ?' },
      { observedResponse: 'La condensation transforme l’eau en vapeur.', diagnosis: 'L’élève inverse les deux changements d’état.', correctivePrompt: 'La vapeur refroidie devient-elle liquide ou devient-elle plus chaude ?' },
    ],
    [
      'Compare un verre froid et un verre à température ambiante pour observer où apparaissent les gouttelettes.',
      'Fais dessiner l’air autour du verre avec des petites particules de vapeur qui deviennent des gouttes sur la surface froide.',
    ],
    [
      { prompt: 'Définis la condensation.', expectedAnswer: 'Le refroidissement de la vapeur d’eau et sa transformation en eau liquide.', successCriterion: 'La réponse mentionne refroidissement et eau liquide.' },
      { prompt: 'Pourquoi le verre froid devient-il humide à l’extérieur ?', expectedAnswer: 'La vapeur d’eau de l’air se refroidit au contact du verre et se condense.', successCriterion: 'La réponse identifie l’air comme source des gouttelettes.' },
    ],
  ),
  '9-3': makeGuide(
    '98–101',
    'L’eau de la Terre effectue un voyage circulaire continu : c’est le cycle de l’eau. Le Soleil chauffe l’eau des mers et des rivières ; une partie s’évapore et monte dans l’air sous forme de vapeur invisible. En altitude, la vapeur se refroidit et se condense en petites gouttelettes qui forment les nuages. L’eau retombe ensuite sur la terre sous forme de pluie. Elle rejoint les rivières, qui la transportent vers les mers. Le cycle recommence. L’eau change donc d’état et se déplace d’un endroit à un autre.',
    'Dessine quatre étapes reliées par des flèches : mer chauffée par le Soleil, vapeur qui monte, nuages et pluie, rivière qui retourne vers la mer. Fais raconter le trajet dans l’ordre sans ajouter d’étapes qui ne sont pas étudiées dans ce chapitre.',
    [
      { prompt: 'Quelle source d’énergie chauffe l’eau des mers et des rivières ?', expectedAnswer: 'La chaleur du Soleil.' },
      { prompt: 'Que devient la vapeur d’eau lorsqu’elle se refroidit ?', expectedAnswer: 'Elle se condense en gouttelettes qui forment les nuages.' },
    ],
    [
      { prompt: 'Ordonne : pluie, évaporation, retour par les rivières, condensation et nuages.', expectedAnswer: 'Évaporation → condensation et formation des nuages → pluie → retour par les rivières vers la mer.' },
      { prompt: 'Pourquoi appelle-t-on ce trajet un cycle ?', expectedAnswer: 'Parce que l’eau circule continuellement et que le trajet recommence.' },
    ],
    ['Évaporation → condensation et formation des nuages → pluie → retour par les rivières vers la mer.', 'Parce que le trajet de l’eau se répète continuellement.'],
    [
      { observedResponse: 'La vapeur d’eau est visible comme un nuage de fumée.', diagnosis: 'L’élève confond la vapeur invisible et les gouttelettes visibles des nuages.', correctivePrompt: 'À quelle étape la vapeur refroidie devient-elle des gouttelettes ?' },
      { observedResponse: 'La pluie est la première étape du cycle.', diagnosis: 'L’élève ne suit pas l’ordre du trajet présenté dans le manuel.', correctivePrompt: 'Que fait le Soleil à l’eau avant la formation des nuages ?' },
    ],
    [
      'Fais remettre les quatre images dans l’ordre et demander une phrase de liaison entre chaque étape.',
      'Utilise des flèches de couleur pour distinguer l’eau liquide, la vapeur invisible et les gouttelettes des nuages.',
    ],
    [
      { prompt: 'Quelle étape vient après l’évaporation ?', expectedAnswer: 'La vapeur se refroidit, se condense et forme des nuages.', successCriterion: 'L’élève place la condensation après l’évaporation.' },
      { prompt: 'Comment l’eau retourne-t-elle vers la mer dans le schéma du manuel ?', expectedAnswer: 'La pluie rejoint la terre et les rivières, qui retournent vers la mer.', successCriterion: 'La réponse mentionne la pluie, les rivières et la mer.' },
    ],
  ),
};

export const SCIENCE_FR_TERM1_ENRICHMENT_2026 = [
  {
    chapters: [1],
    sourcePages: '18–19',
    titleFr: 'Biomécanique : le dromadaire',
    appAuthoredSummaryFr: 'Le manuel relie la forme des pieds du dromadaire à la marche sur le sable : les os des orteils s’écartent et répartissent le poids. Les callosités des genoux amortissent les contacts avec le sol. La bosse stocke de la graisse, et non de l’eau ; cette graisse constitue une réserve d’énergie.',
  },
  {
    chapters: [2],
    sourcePages: '26–27',
    titleFr: 'Le renard fennec et les vêtements traditionnels',
    appAuthoredSummaryFr: 'Le manuel présente les grandes oreilles du fennec comme une aide à la perte de chaleur et les poils sous ses pattes comme une protection contre le sable chaud. Il compare aussi la galabeya ample et la couleur des vêtements à la circulation de l’air et à la gestion de la chaleur. Utiliser cette page comme étude d’adaptations, sans généraliser chaque détail à tous les vêtements.',
  },
  {
    chapters: [3],
    sourcePages: '43',
    titleFr: 'Comparer les graines familières',
    appAuthoredSummaryFr: 'Les élèves observent et comparent la forme et la couleur de graines de pois, de palmier dattier, de blé, de tournesol, de coton et de maïs. L’objectif est de décrire des observations sans supposer que toutes les graines se ressemblent.',
  },
  {
    chapters: [3, 4],
    sourcePages: '50–51',
    titleFr: 'Dormance des graines et sol du Nil',
    appAuthoredSummaryFr: 'Le manuel présente la dormance comme un état pendant lequel une graine reste inactive jusqu’à ce que les conditions de germination soient réunies. Il relie aussi les nutriments transportés par le Nil à la fertilité des sols agricoles. Distinguer ces exemples d’une condition supplémentaire de germination.',
  },
  {
    chapters: [8],
    sourcePages: '90–91',
    titleFr: 'Satellites, radar et khamsin',
    appAuthoredSummaryFr: 'Le manuel explique que les satellites observent les nuages sur de vastes régions et que le radar météorologique suit les précipitations. Il présente le khamsin comme un vent chaud et sec accompagné de poussière, entre l’hiver et l’été en Égypte.',
  },
  {
    chapters: [9],
    sourcePages: '102–103',
    titleFr: 'Le cycle de l’eau du Nil',
    appAuthoredSummaryFr: 'Le manuel relie l’évaporation, la condensation et les pluies au trajet de l’eau en Afrique et au Nil. Il évoque le stockage de l’eau derrière le Haut Barrage d’Assouan. Utiliser ce passage comme enrichissement du cycle de l’eau et de la préservation de la ressource.',
  },
] as const;

export const SCIENCE_FR_TERM1_METHOD_SKILLS_2026 = [
  {
    sourcePages: '104',
    titleFr: 'Réaliser une expérience équitable',
    objectiveFr: 'Modifier un seul facteur à la fois et maintenir les autres conditions constantes.',
    teachingSequenceFr: 'Poser la question, identifier le facteur à tester, nommer les conditions constantes, puis comparer les résultats.',
  },
  {
    sourcePages: '105',
    titleFr: 'Utiliser le microscope',
    objectiveFr: 'Identifier les parties du microscope et suivre une procédure sûre de mise au point.',
    teachingSequenceFr: 'Installer le microscope sur une surface plane, commencer au faible grossissement, éclairer correctement, placer la lame, rapprocher l’objectif en regardant de côté, puis faire la mise au point en éloignant l’objectif.',
  },
  {
    sourcePages: '106',
    titleFr: 'Enregistrer les observations',
    objectiveFr: 'Suivre un changement au cours du temps avec des notes, des dessins, des tableaux et des graphiques.',
    teachingSequenceFr: 'Observer à intervalles réguliers, noter les mêmes indicateurs, comparer les mesures et présenter les résultats clairement.',
  },
  {
    sourcePages: '107',
    titleFr: 'Les six étapes de la recherche scientifique',
    objectiveFr: 'Poser une question, prédire, planifier, expérimenter et noter, organiser les données, puis conclure.',
    teachingSequenceFr: 'Faire formuler une question, écrire une prédiction, planifier une comparaison équitable, réaliser l’expérience, organiser les résultats et comparer la conclusion à la prédiction.',
  },
] as const;
