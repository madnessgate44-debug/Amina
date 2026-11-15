/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * 2026/2027 Egypt Ministry Grade 5 Sciences en français, Term 1.
 * Lesson inventory and page spans are grounded in the inspected Ministry
 * student book. Explanations and checks are Miss Noor teaching adaptations,
 * not an official Ministry teacher guide.
 */
import { CurriculumSupplementarySection, OfficialCurriculumLesson } from '../../types/teachingSession';
import {
  SCIENCE_FR_TEACHER_GUIDE_2026,
  SCIENCE_FR_TERM1_ENRICHMENT_2026,
  SCIENCE_FR_TERM1_CHAPTER_REVIEWS_2026,
  SCIENCE_FR_TERM1_METHOD_SKILLS_2026,
} from './scienceFrTeachingGuide2026';

type Spec = {
  u:number; n:number; page:number; pages:string; fr:string; en:string; ar:string;
  focus:string; objectives:string[]; vocab:[string,string][];
  q:string; options:string[]; answer:string; why:string;
  exampleFr:string; exampleEn:string; exampleAr:string;
};
const S:Spec[] = [
{u:1,n:1,page:6,pages:'6–7',fr:'Les os et les muscles',en:'Bones and muscles',ar:'العظام والعضلات',focus:'Quand tu plies le coude, le muscle fléchisseur à l’avant du bras se contracte tandis que le muscle extenseur à l’arrière se relâche. Quand tu tends le bras, leurs rôles s’inversent. Les muscles tirent les os ; ils ne les poussent pas. Le coude est une articulation.',objectives:['Décrire la flexion et l’extension du bras.','Expliquer le travail des muscles en paire.','Comprendre que les muscles tirent les os.'],vocab:[['os','Partie dure du squelette.'],['muscle','Organe qui se contracte et se relâche.'],['articulation','Endroit où des os se rencontrent.']],q:'Quand tu plies le coude, que fait le biceps ?',options:['Il se contracte.','Il disparaît.','Il pousse les os.','Il devient un os.'],answer:'Il se contracte.',why:'Le biceps se raccourcit et tire l’avant-bras vers le haut.',exampleFr:'Plie doucement ton coude et touche le muscle à l’avant du bras.',exampleEn:'Bend your elbow gently and feel the muscle at the front of your arm.',exampleAr:'اثنِ مرفقك برفق والمس العضلة أمام الذراع.'},
{u:1,n:2,page:8,pages:'8–11',fr:'La structure des os',en:'The structure of bones',ar:'تركيب العظام',focus:'Les os soutiennent le corps, lui donnent sa forme et protègent les organes. Les articulations relient les os. Le cartilage recouvre certaines extrémités osseuses et réduit les frottements. Les articulations n’ont pas toutes la même mobilité.',objectives:['Expliquer le soutien et la protection assurés par les os.','Identifier le rôle des articulations.','Expliquer comment le cartilage facilite le mouvement.'],vocab:[['cartilage','Tissu souple qui protège les extrémités des os.'],['articulation','Jonction entre des os.'],['frottement','Résistance entre deux surfaces en contact.']],q:'Quel est le rôle du cartilage ?',options:['Réduire les frottements.','Faire pousser les muscles.','Remplacer les os.','Fabriquer les articulations.'],answer:'Réduire les frottements.',why:'Le cartilage forme une surface lisse qui aide les os à bouger.',exampleFr:'Le cartilage du genou aide les os à glisser pendant la marche.',exampleEn:'Knee cartilage helps bones move smoothly while walking.',exampleAr:'يساعد غضروف الركبة العظام على الحركة بسلاسة أثناء المشي.'},
{u:1,n:3,page:12,pages:'12–13',fr:'Le squelette complet du corps',en:'The human skeleton',ar:'الهيكل العظمي الكامل',focus:'Le squelette soutient le corps et protège les organes. Le crâne protège le cerveau. Les côtes protègent le cœur et les poumons. La colonne vertébrale soutient le tronc et permet de se pencher et de tourner.',objectives:['Nommer le crâne, les côtes et la colonne vertébrale.','Associer chaque partie à sa fonction.','Expliquer le rôle du squelette dans le mouvement.'],vocab:[['squelette','Ensemble des os du corps.'],['crâne','Os qui protègent le cerveau.'],['colonne vertébrale','Suite de vertèbres qui soutient le dos.']],q:'Quel organe est protégé par le crâne ?',options:['Le cerveau.','L’estomac.','Les reins.','Les muscles des jambes.'],answer:'Le cerveau.',why:'Le crâne forme une protection osseuse autour du cerveau.',exampleFr:'Ta colonne vertébrale aide à soutenir ton tronc quand tu portes ton sac.',exampleEn:'Your spine supports your trunk when you carry a schoolbag.',exampleAr:'يساعد العمود الفقري على دعم الجذع عند حمل الحقيبة.'},
{u:1,n:4,page:14,pages:'14–17',fr:'Le corps des animaux',en:'Animal bodies and movement',ar:'أجسام الحيوانات وحركتها',focus:'Les os, les articulations et les muscles travaillent ensemble pour permettre le mouvement. Leur forme varie selon le mode de déplacement. Un animal qui court, nage, vole ou grimpe présente des adaptations différentes.',objectives:['Comparer le squelette humain à celui de quelques animaux.','Relier la forme du corps au mode de déplacement.','Expliquer le rôle des muscles dans le mouvement.'],vocab:[['locomotion','Manière dont un être vivant se déplace.'],['adaptation','Caractéristique utile dans un milieu.'],['articulation','Jonction qui permet le mouvement.']],q:'Pourquoi les squelettes des animaux ont-ils des formes différentes ?',options:['Ils sont adaptés à différents mouvements.','Les animaux n’ont pas de muscles.','Tous les animaux vivent dans l’eau.','Les os sont en métal.'],answer:'Ils sont adaptés à différents mouvements.',why:'La forme des membres et des articulations dépend du déplacement.',exampleFr:'Les pattes d’un chat aident à courir et sauter ; les nageoires d’un poisson aident à nager.',exampleEn:'A cat’s legs help it run and jump; a fish’s fins help it swim.',exampleAr:'تساعد أرجل القط على الجري والقفز، وتساعد زعانف السمكة على السباحة.'},
{u:2,n:1,page:20,pages:'20–21',fr:'Les changements au cours de l’année',en:'Changes during the year',ar:'التغيرات خلال العام',focus:'La température et la durée du jour changent avec les saisons. Une plante peut germer, grandir, fleurir, produire des fruits et des graines, puis se faner. Des graines peuvent recommencer le cycle lorsque les conditions deviennent favorables.',objectives:['Décrire les changements saisonniers chez une plante.','Ordonner germination, croissance, floraison et fructification.','Relier les changements aux saisons.'],vocab:[['saison','Période de l’année avec des conditions météo caractéristiques.'],['germer','Commencer à pousser à partir d’une graine.'],['se faner','Perdre sa fraîcheur et dépérir.']],q:'Quelle étape vient après la floraison ?',options:['La formation des fruits et des graines.','La migration.','La formation des os.','La disparition des racines.'],answer:'La formation des fruits et des graines.',why:'Après la floraison, la fleur peut donner un fruit contenant des graines.',exampleFr:'Observe une plante au printemps puis en été : ses fleurs peuvent devenir des fruits.',exampleEn:'A plant’s spring flowers may become fruits in summer.',exampleAr:'قد تتحول أزهار النبات في الربيع إلى ثمار في الصيف.'},
{u:2,n:2,page:22,pages:'22–25',fr:'Les animaux et la température',en:'Animals and temperature',ar:'الحيوانات ودرجة الحرارة',focus:'La température influence l’activité des animaux. Certains reptiles et amphibiens deviennent moins actifs quand il fait froid. Certains animaux hibernent ; plusieurs oiseaux migrent vers des régions plus favorables. Hibernation et migration sont différentes.',objectives:['Expliquer l’effet de la température sur l’activité animale.','Distinguer hibernation et migration.','Donner des exemples de comportements saisonniers.'],vocab:[['hibernation','Période de repos prolongé pendant une saison défavorable.'],['migration','Déplacement saisonnier vers une autre région.'],['température','Mesure du chaud et du froid.']],q:'Quelle phrase décrit la migration ?',options:['Un déplacement saisonnier vers une autre région.','Un long sommeil hivernal.','La germination.','La formation des nuages.'],answer:'Un déplacement saisonnier vers une autre région.',why:'La migration est un déplacement ; l’hibernation est un repos prolongé.',exampleFr:'Certains oiseaux viennent en Égypte en hiver puis repartent.',exampleEn:'Some birds come to Egypt in winter and leave later.',exampleAr:'تأتي بعض الطيور إلى مصر في الشتاء ثم تغادر لاحقاً.'},
{u:3,n:1,page:28,pages:'28–29',fr:'À l’intérieur de la graine',en:'Inside a seed',ar:'ما بداخل البذرة',focus:'Une graine contient un embryon et des cotylédons qui stockent des réserves nutritives, notamment de l’amidon. Une solution d’iode peut devenir bleu foncé en présence d’amidon. La germination marque le début du développement de la plantule.',objectives:['Identifier l’embryon et les cotylédons.','Expliquer le rôle des réserves nutritives.','Relier le test à l’iode à la présence d’amidon.'],vocab:[['embryon','Partie de la graine qui donnera une nouvelle plante.'],['cotylédon','Partie qui stocke des réserves.'],['amidon','Substance nutritive de réserve.']],q:'Quelle partie de la graine stocke des réserves ?',options:['Les cotylédons.','La fleur.','La racine adulte.','Le fruit mûr.'],answer:'Les cotylédons.',why:'Les cotylédons nourrissent l’embryon au début de son développement.',exampleFr:'Dans un haricot, les deux grandes parties charnues sont les cotylédons.',exampleEn:'In a bean, the two large fleshy halves are the cotyledons.',exampleAr:'في الفاصوليا، الجزآن الكبيران اللحميان هما الفلقتان.'},
{u:3,n:2,page:30,pages:'30–33',fr:'L’eau et la germination',en:'Water and germination',ar:'الماء والإنبات',focus:'Pour tester le rôle de l’eau, compare des graines sur du coton humide et des graines sur du coton sec. Garde la température, l’air et la lumière comparables. On modifie une seule variable : la présence d’eau. Les graines ont besoin d’eau pour germer.',objectives:['Expliquer pourquoi l’eau est nécessaire.','Décrire une expérience avec coton humide et sec.','Identifier la variable modifiée et les conditions constantes.'],vocab:[['variable','Facteur modifié ou mesuré dans une expérience.'],['coton humide','Coton contenant de l’eau.'],['condition constante','Facteur gardé identique.']],q:'Dans une expérience juste sur l’eau, que faut-il garder identique ?',options:['La température et l’air.','La présence d’eau.','Le résultat attendu.','Le nombre de jours.'],answer:'La température et l’air.',why:'Pour isoler l’effet de l’eau, les autres conditions restent comparables.',exampleFr:'Deux lots de graines identiques sont placés sur du coton ; un seul reçoit de l’eau.',exampleEn:'Two identical seed groups are placed on cotton; only one receives water.',exampleAr:'نضع مجموعتين متماثلتين من البذور على القطن، ونسقي مجموعة واحدة فقط.'},
{u:3,n:3,page:34,pages:'34–35',fr:'L’air et la germination',en:'Air and germination',ar:'الهواء والإنبات',focus:'Les graines ont besoin d’air pour germer. Compare des graines sur du coton humide exposées à l’air avec des graines entièrement immergées. Garde l’eau et la température comparables. L’eau seule ne suffit pas : l’air est également nécessaire.',objectives:['Expliquer le rôle de l’air.','Comparer graines exposées à l’air et graines immergées.','Respecter la règle d’une seule variable modifiée.'],vocab:[['air','Mélange de gaz qui entoure les êtres vivants.'],['immerger','Plonger complètement dans un liquide.'],['expérience','Test organisé pour répondre à une question.']],q:'Pourquoi comparer des graines sur coton humide et des graines immergées ?',options:['Pour tester l’accès à l’air.','Pour tester la couleur.','Pour mesurer la lumière.','Pour observer les fleurs.'],answer:'Pour tester l’accès à l’air.',why:'Les graines immergées ont moins accès à l’air.',exampleFr:'Une graine sur coton humide reçoit de l’eau tout en restant au contact de l’air.',exampleEn:'A seed on moist cotton gets water while remaining in contact with air.',exampleAr:'تحصل البذرة على الماء من القطن الرطب مع بقائها ملامسة للهواء.'},
{u:3,n:4,page:36,pages:'36–39',fr:'La température et la germination',en:'Temperature and germination',ar:'درجة الحرارة والإنبات',focus:'La germination nécessite une température appropriée. Compare des graines identiques dans des conditions chaudes et froides, en gardant l’eau, l’air et la lumière semblables. Une température trop basse peut ralentir ou empêcher la germination.',objectives:['Expliquer le besoin d’une température convenable.','Décrire une comparaison chaud/froid.','Identifier les facteurs à maintenir constants.'],vocab:[['température appropriée','Température convenable au processus.'],['germination','Début du développement à partir d’une graine.'],['comparer','Examiner des résultats pour repérer des différences.']],q:'Dans un test sur la température, quel facteur doit varier ?',options:['La température.','L’eau et l’air ensemble.','Le type de graine.','Tous les facteurs.'],answer:'La température.',why:'On modifie la température seule pour mesurer son influence.',exampleFr:'Des graines identiques restent humides mais sont placées à deux températures différentes.',exampleEn:'Identical seeds stay moist but are placed at two different temperatures.',exampleAr:'نحافظ على رطوبة بذور متماثلة ونضعها في درجتي حرارة مختلفتين.'},
{u:3,n:5,page:40,pages:'40–42',fr:'Résumé des conditions de germination',en:'Summary of germination conditions',ar:'ملخص شروط الإنبات',focus:'Trois conditions essentielles permettent la germination : l’eau, l’air et une température appropriée. Si l’une manque, la graine ne germe pas normalement. La lumière et l’engrais jouent surtout un rôle dans la croissance après la germination.',objectives:['Citer les trois conditions essentielles.','Distinguer germination et croissance.','Expliquer pourquoi une condition manquante empêche la germination.'],vocab:[['condition essentielle','Facteur indispensable à un processus.'],['croissance','Développement et augmentation de taille.'],['plantule','Jeune plante issue de la germination.']],q:'Quelles sont les trois conditions essentielles ?',options:['Eau, air et température appropriée.','Soleil, engrais et fleurs.','Terre, fruit et vent.','Lumière et pollinisation.'],answer:'Eau, air et température appropriée.',why:'La graine doit absorber de l’eau, respirer et être à une température adaptée.',exampleFr:'Une graine peut germer dans du coton humide sans être plantée dans la terre.',exampleEn:'A seed can germinate on moist cotton without soil.',exampleAr:'يمكن للبذرة أن تنبت على قطن رطب دون أن تُزرع في التربة.'},
{u:4,n:1,page:44,pages:'44–45',fr:'La lumière du Soleil et la croissance',en:'Sunlight and plant growth',ar:'ضوء الشمس ونمو النبات',focus:'Après la germination, une plante a besoin de lumière pour fabriquer sa nourriture et grandir. Compare des plantules semblables avec et sans lumière, en gardant l’eau et la température comparables. Une lumière convenable favorise des feuilles vertes et des tiges robustes.',objectives:['Expliquer le rôle de la lumière dans la croissance.','Décrire une comparaison avec et sans lumière.','Distinguer les besoins de germination et de croissance.'],vocab:[['croissance','Développement et augmentation de taille.'],['plantule','Jeune plante après la germination.'],['lumière','Énergie utilisée par la plante pour fabriquer sa nourriture.']],q:'Quel effet la lumière convenable a-t-elle ?',options:['Elle favorise des feuilles vertes et des tiges robustes.','Elle remplace l’eau.','Elle empêche la croissance.','Elle transforme les feuilles en racines.'],answer:'Elle favorise des feuilles vertes et des tiges robustes.',why:'La lumière permet à la plante de fabriquer la matière nutritive nécessaire.',exampleFr:'Une plante près d’une fenêtre reçoit plus de lumière qu’une plante dans un placard.',exampleEn:'A plant near a window receives more light than one in a cupboard.',exampleAr:'يحصل النبات قرب النافذة على ضوء أكثر من نبات داخل خزانة.'},
{u:4,n:2,page:46,pages:'46–49',fr:'L’engrais et la croissance',en:'Fertilizer and plant growth',ar:'السماد ونمو النبات',focus:'Les plantes utilisent des éléments nutritifs présents dans le sol. Un engrais peut apporter des nutriments et soutenir la croissance. Compare des plantes semblables avec et sans engrais en gardant constants l’eau, la lumière, le sol et la température. L’engrais ne remplace ni l’eau ni la lumière.',objectives:['Expliquer comment les nutriments soutiennent la croissance.','Décrire une expérience avec et sans engrais.','Identifier les conditions constantes.'],vocab:[['engrais','Substance qui apporte des nutriments aux plantes.'],['nutriment','Substance nécessaire au développement.'],['test équitable','Comparaison où un seul facteur varie.']],q:'Pour tester l’effet de l’engrais, que faut-il garder identique ?',options:['L’eau, la lumière et le type de plante.','La quantité d’engrais.','Le résultat final.','Le nom des pots.'],answer:'L’eau, la lumière et le type de plante.',why:'Ces facteurs doivent rester identiques pour isoler l’effet de l’engrais.',exampleFr:'Deux plants identiques reçoivent la même lumière et la même eau ; un seul reçoit de l’engrais.',exampleEn:'Two identical plants get the same light and water; only one gets fertilizer.',exampleAr:'يحصل نباتان متماثلان على الضوء والماء نفسيهما، ويضاف السماد إلى أحدهما فقط.'},
{u:5,n:1,page:52,pages:'52–54',fr:'La structure de la fleur de luffa',en:'The structure of a luffa flower',ar:'تركيب زهرة اللوف',focus:'Le luffa porte des fleurs mâles et femelles. La fleur mâle possède des étamines qui produisent le pollen. La fleur femelle possède un carpelle et une base renflée qui peut devenir un fruit après la pollinisation. Les pétales attirent les pollinisateurs et les sépales protègent le bouton.',objectives:['Distinguer les fleurs mâles et femelles.','Identifier étamine, pollen, carpelle, pétales et sépales.','Relier la base renflée au futur fruit.'],vocab:[['étamine','Organe mâle de la fleur qui produit le pollen.'],['pollen','Poudre transportée pendant la pollinisation.'],['carpelle','Partie femelle de la fleur.']],q:'Quelle partie de la fleur mâle produit le pollen ?',options:['L’étamine.','Le sépale.','La racine.','Le pétiole.'],answer:'L’étamine.',why:'Les étamines sont les organes mâles qui produisent le pollen.',exampleFr:'Observe une fleur de courge ou de luffa et repère sa base renflée.',exampleEn:'Look at a squash or luffa flower and identify its swollen base.',exampleAr:'لاحظ زهرة القرع أو اللوف وحدد قاعدتها المنتفخة.'},
{u:5,n:2,page:55,pages:'55–59',fr:'Comment utiliser le microscope ?',en:'How to use a microscope',ar:'كيف نستخدم المجهر؟',focus:'Un microscope permet d’observer de très petits objets. Place la préparation sur la platine et commence avec le faible grossissement. Règle la mise au point doucement. Le grossissement total est égal au grossissement de l’oculaire multiplié par celui de l’objectif. L’image observée est inversée. Ne dirige jamais le microscope vers le Soleil.',objectives:['Nommer les principales parties du microscope.','Commencer avec le faible grossissement.','Calculer le grossissement total et appliquer les règles de sécurité.'],vocab:[['oculaire','Lentille par laquelle on regarde.'],['objectif','Lentille proche de l’objet.'],['grossissement','Nombre qui indique combien de fois l’image est agrandie.']],q:'Comment calcule-t-on le grossissement total ?',options:['Oculaire × objectif.','Oculaire + objectif.','Objectif − oculaire.','On ne le calcule pas.'],answer:'Oculaire × objectif.',why:'On multiplie le grossissement de l’oculaire par celui de l’objectif.',exampleFr:'Un oculaire ×10 et un objectif ×4 donnent un grossissement total de ×40.',exampleEn:'A ×10 eyepiece and a ×4 objective give ×40 total magnification.',exampleAr:'عدسة عينية ×10 وعدسة شيئية ×4 تعطي تكبيراً كلياً ×40.'},
{u:5,n:3,page:60,pages:'60–62',fr:'La pollinisation et le développement des fruits',en:'Pollination and fruit development',ar:'التلقيح وتكوّن الثمار',focus:'La pollinisation est le transfert du pollen vers le sommet du carpelle. Chez le luffa, les insectes comme les abeilles transportent le pollen d’une fleur à l’autre. Après la pollinisation, la partie femelle peut se développer en fruit et des graines se forment.',objectives:['Définir la pollinisation.','Expliquer le rôle des insectes pollinisateurs.','Ordonner pollinisation, fruit et graines.'],vocab:[['pollinisation','Transfert du pollen vers la partie femelle.'],['pollinisateur','Animal qui transporte le pollen.'],['fruit','Structure qui se développe à partir de la fleur.']],q:'Quel est le rôle d’une abeille ?',options:['Transporter le pollen entre les fleurs.','Fabriquer les racines.','Absorber l’eau du sol.','Transformer les feuilles.'],answer:'Transporter le pollen entre les fleurs.',why:'Une abeille peut transporter du pollen en visitant plusieurs fleurs.',exampleFr:'Une abeille qui visite deux fleurs de luffa peut transporter du pollen de l’une à l’autre.',exampleEn:'A bee visiting two luffa flowers can carry pollen between them.',exampleAr:'قد تنقل النحلة حبوب اللقاح من زهرة لوْف إلى أخرى.'},
{u:6,n:1,page:64,pages:'64–65',fr:'Les étapes de croissance de l’être humain',en:'Stages of human growth',ar:'مراحل نمو الإنسان',focus:'La croissance humaine se déroule au fil de la vie. Le manuel présente la petite enfance, l’enfance, l’adolescence, la jeunesse et la vieillesse. La petite enfance commence à la naissance, après environ neuf mois de développement dans le corps de la mère. La reproduction permet la continuité de la vie et la préservation de l’espèce.',objectives:['Nommer et ordonner les grandes étapes de la vie humaine.','Décrire le début de la petite enfance et la dépendance du nourrisson.','Expliquer le rôle de la reproduction dans la continuité de la vie.'],vocab:[['croissance','Développement du corps au cours du temps.'],['petite enfance','Étape qui commence à la naissance.'],['reproduction','Processus qui permet la continuité de la vie et de l’espèce.']],q:'Quelle étape vient généralement après l’enfance ?',options:['L’adolescence.','La petite enfance.','La vieillesse.','La naissance.'],answer:'L’adolescence.',why:'Dans la séquence du manuel, l’adolescence vient après l’enfance.',exampleFr:'Une frise chronologique peut représenter les étapes de la vie.',exampleEn:'A timeline can show the stages of human life.',exampleAr:'يمكن للخط الزمني أن يوضح مراحل حياة الإنسان.'},
{u:6,n:2,page:66,pages:'66–67',fr:'Les points communs entre parents et enfants',en:'Similarities between parents and children',ar:'أوجه الشبه بين الآباء والأبناء',focus:'Le manuel explique que la vie humaine commence avec un père et une mère et que les parents prennent soin de leurs enfants et les protègent. Les enfants héritent de caractéristiques de leurs deux parents. Certains traits se ressemblent dans une famille, tandis que d’autres diffèrent.',objectives:['Expliquer que les enfants héritent de caractères de leur père et de leur mère.','Reconnaître des ressemblances et des différences.','Décrire le rôle des parents dans les soins et la protection des enfants.'],vocab:[['hériter','Recevoir des caractéristiques biologiques de ses parents.'],['caractéristique','Trait ou particularité d’un être vivant.'],['ressemblance','Point commun entre deux êtres vivants.'],['protection','Action de mettre quelqu’un à l’abri du danger.']],q:'Pourquoi un enfant peut-il ressembler à ses deux parents ?',options:['Il hérite de caractéristiques des deux parents.','Il copie exactement un seul parent.','Il choisit tout après la naissance.','Les caractéristiques ne se transmettent jamais.'],answer:'Il hérite de caractéristiques des deux parents.',why:'Les enfants reçoivent des informations héréditaires de chacun de leurs parents.',exampleFr:'Deux frères et sœurs peuvent partager certains traits tout en ayant des différences.',exampleEn:'Siblings can share some traits while also being different.',exampleAr:'قد يشترك الإخوة في بعض الصفات مع وجود اختلافات بينهم.'},
{u:6,n:3,page:68,pages:'68–71',fr:'Les conditions d’une croissance saine',en:'Conditions for healthy growth',ar:'شروط النمو الصحي',focus:'Une croissance saine est soutenue par une alimentation variée, un sommeil suffisant et une activité physique adaptée. Le manuel cite le lait, les légumes et les fruits bien lavés comme exemples d’aliments. Le sommeil aide le corps à récupérer et l’activité physique soutient la santé et le développement.',objectives:['Citer trois habitudes qui soutiennent une croissance saine.','Expliquer le rôle de l’alimentation, du sommeil et de l’activité.','Reconnaître les exemples alimentaires du manuel et l’importance de laver les fruits et légumes.'],vocab:[['alimentation équilibrée','Alimentation variée qui apporte différents nutriments.'],['hygiène alimentaire','Précautions simples pour garder les aliments propres avant de les manger.'],['sommeil','Repos nécessaire au corps et au cerveau.'],['activité physique','Mouvement du corps qui demande de l’énergie.']],q:'Quelle combinaison soutient une croissance saine ?',options:['Alimentation équilibrée, sommeil et activité physique.','Seulement des sucreries.','Rester assis toute la journée.','Dormir très peu.'],answer:'Alimentation équilibrée, sommeil et activité physique.',why:'Ces trois habitudes contribuent ensemble à la santé et au développement.',exampleFr:'Une journée équilibrée comprend des repas variés, des fruits et légumes bien lavés, du repos et du jeu actif.',exampleEn:'A balanced day includes varied meals, rest and active play.',exampleAr:'يتضمن اليوم المتوازن طعاماً متنوعاً وراحة ولعباً حركياً.'},
{u:7,n:1,page:72,pages:'72–73',fr:'Les animaux qui donnent naissance',en:'Animals that give birth',ar:'الحيوانات التي تلد',focus:'Certains animaux, comme les chats et les chameaux, donnent naissance à des petits vivants. Chez les mammifères, les petits boivent le lait de leur mère. Les parents peuvent protéger et nourrir leurs petits. La reproduction permet à une espèce de continuer d’exister.',objectives:['Reconnaître des animaux qui donnent naissance.','Décrire le rôle du lait chez les mammifères.','Expliquer les soins parentaux.'],vocab:[['mammifère','Animal dont la femelle nourrit ses petits avec du lait.'],['donner naissance','Mettre au monde un petit vivant.'],['soins parentaux','Actions pour protéger et nourrir les petits.']],q:'Comment un chaton reçoit-il sa nourriture au début ?',options:['Il boit le lait de sa mère.','Il mange des graines.','Il fabrique sa nourriture avec la lumière.','Il reçoit du pollen.'],answer:'Il boit le lait de sa mère.',why:'Le chat est un mammifère et la mère nourrit ses petits avec du lait.',exampleFr:'Une chatte nourrit et protège ses chatons lorsqu’ils sont jeunes.',exampleEn:'A mother cat feeds and protects her kittens.',exampleAr:'تطعم القطة صغارها وتحميهم عندما يكونون صغاراً.'},
{u:7,n:2,page:74,pages:'74–75',fr:'Les animaux qui pondent des œufs',en:'Animals that lay eggs',ar:'الحيوانات التي تبيض',focus:'De nombreux animaux pondent des œufs. Les poissons pondent leurs œufs dans l’eau ; les oiseaux pondent des œufs dont les petits sortent lors de l’éclosion. Chez certaines espèces, le nombre d’œufs est élevé, ce qui augmente la probabilité que quelques jeunes survivent.',objectives:['Identifier des animaux qui pondent des œufs.','Définir l’éclosion.','Comparer les modes de développement.'],vocab:[['pondre','Déposer des œufs.'],['éclosion','Moment où le jeune sort de l’œuf.'],['œuf','Structure qui protège le développement du jeune.']],q:'Que signifie le mot éclosion ?',options:['Le jeune sort de l’œuf.','La fleur produit du pollen.','La graine absorbe l’eau.','Un animal hiberne.'],answer:'Le jeune sort de l’œuf.',why:'L’éclosion est la sortie du jeune animal hors de l’œuf.',exampleFr:'Un poussin sort de sa coquille après son développement dans l’œuf.',exampleEn:'A chick comes out of its shell after developing inside the egg.',exampleAr:'يخرج الكتكوت من القشرة بعد نموه داخل البيضة.'},
{u:7,n:3,page:76,pages:'76–79',fr:'Comparer les animaux et préserver les espèces',en:'Comparing animals and conserving species',ar:'مقارنة الحيوانات وحماية الأنواع',focus:'Certains animaux donnent naissance à des petits vivants, d’autres pondent des œufs. Les jeunes ont besoin de conditions favorables pour survivre. Les réserves naturelles protègent les habitats et aident à préserver les espèces.',objectives:['Classer des animaux selon leur mode de reproduction.','Comparer les besoins des jeunes animaux.','Expliquer le rôle des réserves naturelles.'],vocab:[['espèce','Groupe d’êtres vivants capables de se reproduire entre eux.'],['réserve naturelle','Zone protégée pour conserver les milieux et les espèces.'],['conservation','Protection durable des êtres vivants et de leurs habitats.']],q:'Pourquoi crée-t-on des réserves naturelles ?',options:['Pour protéger les espèces et leurs habitats.','Pour supprimer les habitats.','Pour empêcher la reproduction.','Pour remplacer les animaux.'],answer:'Pour protéger les espèces et leurs habitats.',why:'Les réserves préservent les milieux où les animaux vivent et se reproduisent.',exampleFr:'Les aires protégées d’Égypte contribuent à préserver des animaux et leurs milieux.',exampleEn:'Protected areas in Egypt help conserve animals and habitats.',exampleAr:'تساعد المحميات الطبيعية في مصر على حماية الحيوانات وبيئاتها.'},
{u:8,n:1,page:80,pages:'80–81',fr:'Les nuages et la météo',en:'Clouds and weather',ar:'السحب والطقس',focus:'La couverture nuageuse décrit la part du ciel occupée par les nuages. Le manuel propose de diviser mentalement le ciel en huit parties pour estimer cette couverture. Une observation doit être faite depuis un endroit sûr et fixe. La pluie ou la neige doit aussi être prise en compte.',objectives:['Décrire la couverture nuageuse.','Utiliser un modèle de huit parties.','Distinguer ciel ensoleillé et ciel nuageux.'],vocab:[['couverture nuageuse','Part du ciel occupée par les nuages.'],['nuageux','État du ciel avec beaucoup de nuages.'],['observation','Action de regarder attentivement.']],q:'À quoi sert de diviser le ciel en huit parties ?',options:['À estimer la couverture nuageuse.','À mesurer la température du sol.','À calculer la vitesse animale.','À mesurer la profondeur de la mer.'],answer:'À estimer la couverture nuageuse.',why:'Le modèle aide à estimer quelle portion du ciel est couverte.',exampleFr:'Depuis une fenêtre, estime combien de huitièmes du ciel sont couverts.',exampleEn:'From a window, estimate how many eighths of the sky are cloudy.',exampleAr:'من النافذة، قدّر عدد الأجزاء من ثمانية التي تغطيها السحب.'},
{u:8,n:2,page:82,pages:'82–85',fr:'Le mouvement des nuages',en:'Cloud movement',ar:'حركة السحب',focus:'Les nuages se déplacent avec le vent. Choisis un repère fixe, note leur position puis observe de nouveau après un intervalle de temps. Le manuel décrit un déplacement fréquent d’ouest en est dans les exemples étudiés, mais la direction peut varier selon les conditions météorologiques.',objectives:['Expliquer que le vent déplace les nuages.','Observer depuis un repère fixe.','Lire une direction avec les points cardinaux.'],vocab:[['direction','Sens dans lequel un objet se déplace.'],['repère','Point fixe utilisé pour comparer une position.'],['boussole','Instrument qui indique les directions.']],q:'Pourquoi choisir un repère fixe ?',options:['Pour comparer la position des nuages au fil du temps.','Pour empêcher le vent.','Pour changer leur direction.','Pour mesurer directement la pluie.'],answer:'Pour comparer la position des nuages au fil du temps.',why:'Un repère fixe permet de voir dans quelle direction les nuages se déplacent.',exampleFr:'Observe un nuage par rapport à un bâtiment depuis le même endroit.',exampleEn:'Watch a cloud against a building from the same spot.',exampleAr:'راقب سحابة بالنسبة إلى مبنى من المكان نفسه.'},
{u:8,n:3,page:86,pages:'86–89',fr:'Les prévisions météorologiques',en:'Weather forecasts',ar:'التنبؤات الجوية',focus:'Les images satellites montrent les nuages et leur position à grande échelle. Le radar météorologique utilise des ondes radio pour repérer en temps réel où et avec quelle intensité il pleut ou neige. En combinant ces informations avec le mouvement des nuages et les données sur le vent, on peut prévoir l’évolution probable du temps à court terme. Une prévision reste une estimation fondée sur des indices, pas une certitude.',objectives:['Expliquer ce qu’une image satellite permet d’observer.','Décrire ce que le radar météorologique détecte et comment il fonctionne.','Combiner nuages, radar et vent pour interpréter une prévision.'],vocab:[['satellite','Objet qui observe la Terre depuis l’espace.'],['radar météorologique','Appareil utilisant des ondes radio pour repérer les précipitations.'],['prévision','Estimation de ce qui pourrait se produire.'],['indice','Information qui aide à tirer une conclusion.']],q:'À quoi sert le radar météorologique ?',options:['À repérer où et avec quelle intensité il pleut ou neige.','À fabriquer les nuages.','À mesurer la température du Soleil.','À arrêter le vent.'],answer:'À repérer où et avec quelle intensité il pleut ou neige.',why:'Le radar utilise des ondes radio pour observer les précipitations en temps réel.',exampleFr:'Une image satellite montre une masse nuageuse à l’Ouest ; le radar indique où la pluie tombe déjà et avec quelle intensité.',exampleEn:'A satellite image shows clouds to the west; radar shows where rain is already falling and how intensely.',exampleAr:'تُظهر صورة القمر الصناعي سحبًا غربًا، ويُبيّن الرادار أين يهطل المطر بالفعل ومدى شدته.'},
{u:9,n:1,page:92,pages:'92–93',fr:'L’évaporation de l’eau',en:'Evaporation of water',ar:'تبخر الماء',focus:'L’évaporation est le passage de l’eau liquide à la vapeur d’eau invisible. La chaleur, le soleil et le vent peuvent accélérer l’évaporation. L’eau ne disparaît pas : elle passe dans l’air sous forme de vapeur.',objectives:['Définir l’évaporation.','Expliquer l’effet de la chaleur et du vent.','Comprendre que l’eau liquide devient vapeur invisible.'],vocab:[['évaporation','Passage de l’état liquide à l’état gazeux.'],['vapeur d’eau','Eau sous forme de gaz invisible.'],['chaleur','Énergie thermique.']],q:'Que devient l’eau liquide pendant l’évaporation ?',options:['Elle devient de la vapeur d’eau.','Elle devient du sable.','Elle disparaît de l’univers.','Elle devient immédiatement de la glace.'],answer:'Elle devient de la vapeur d’eau.',why:'L’eau change d’état et se mélange à l’air sous forme de vapeur.',exampleFr:'Une flaque diminue après une journée chaude et venteuse.',exampleEn:'A puddle gets smaller after a warm, windy day.',exampleAr:'تقل مياه البركة بعد يوم دافئ وعاصف.'},
{u:9,n:2,page:94,pages:'94–97',fr:'La vapeur d’eau dans l’air',en:'Water vapour in the air',ar:'بخار الماء في الهواء',focus:'L’air contient de la vapeur d’eau invisible. Quand l’air humide se refroidit, la vapeur peut se condenser en petites gouttelettes liquides. Les gouttes à l’extérieur d’un verre froid proviennent de la vapeur d’eau de l’air ambiant, pas de l’eau qui traverse le verre.',objectives:['Expliquer que l’air contient de la vapeur d’eau.','Définir la condensation.','Interpréter les gouttelettes sur un verre froid.'],vocab:[['condensation','Passage de la vapeur d’eau à l’état liquide.'],['gouttelette','Très petite goutte de liquide.'],['refroidissement','Diminution de la température.']],q:'D’où viennent les gouttelettes à l’extérieur d’un verre froid ?',options:['De la vapeur d’eau présente dans l’air.','De l’eau qui traverse le verre.','Du sucre dans la boisson.','Du verre qui fond.'],answer:'De la vapeur d’eau présente dans l’air.',why:'La vapeur de l’air se refroidit au contact du verre et se condense.',exampleFr:'Un verre rempli d’eau glacée devient humide à l’extérieur dans une pièce chaude.',exampleEn:'A glass of iced water becomes wet outside in a warm room.',exampleAr:'يصبح السطح الخارجي لكوب الماء المثلج مبتلاً في غرفة دافئة.'},
{u:9,n:3,page:98,pages:'98–101',fr:'Où va l’eau ? Le cycle de l’eau',en:'Where does water go? The water cycle',ar:'إلى أين يذهب الماء؟ دورة الماء',focus:'Le Soleil chauffe l’eau des mers, des lacs et des rivières. Une partie s’évapore et monte dans l’air. En se refroidissant, la vapeur se condense et forme des gouttelettes dans les nuages. L’eau retombe sous forme de précipitations et rejoint les rivières, les lacs et les mers. Le cycle recommence.',objectives:['Ordonner évaporation, condensation et précipitation.','Expliquer le rôle du Soleil.','Décrire le retour de l’eau vers les rivières et les mers.'],vocab:[['précipitation','Eau qui tombe des nuages.'],['cycle','Suite d’étapes qui se répète.'],['condensation','Formation de gouttelettes à partir de vapeur refroidie.']],q:'Quelle étape suit la condensation ?',options:['Les précipitations.','La germination.','La pollinisation.','La migration.'],answer:'Les précipitations.',why:'Après la formation des nuages par condensation, l’eau peut retomber.',exampleFr:'La pluie rejoint les cours d’eau puis retourne vers les mers.',exampleEn:'Rain flows into waterways and eventually returns to seas.',exampleAr:'يصل المطر إلى المجاري المائية ثم يعود في النهاية إلى البحار.'}
];

const SCIENCE_FR_CHAPTER_TITLES_2026: Record<number,string> = {
  1:'Les os et les muscles',
  2:'Les changements des saisons',
  3:'Les conditions de germination',
  4:'Les conditions de croissance',
  5:'De la fleur au fruit',
  6:'La croissance et la reproduction humaines',
  7:'La croissance et la reproduction des animaux',
  8:'Les changements météorologiques',
  9:'Le cycle de l’eau'
};

const LAST_LESSON_BY_CHAPTER: Record<number, number> = {
  1: 4, 2: 2, 3: 5, 4: 2, 5: 3, 6: 3, 7: 3, 8: 3, 9: 3,
};

function getSupplementarySections(s: Spec): CurriculumSupplementarySection[] {
  const sections: CurriculumSupplementarySection[] = [];

  if (s.n === LAST_LESSON_BY_CHAPTER[s.u]) {
    for (const item of SCIENCE_FR_TERM1_ENRICHMENT_2026.filter((entry) => (entry.chapters as readonly number[]).includes(s.u))) {
      sections.push({
        id: `science-fr-enrichment-${item.sourcePages.replace(/[^0-9]/g, '-')}`,
        kind: 'enrichment',
        sourcePages: item.sourcePages,
        titleFr: item.titleFr,
        summaryFr: item.appAuthoredSummaryFr,
      });
    }
  }

  if (s.u === 5 && s.n === 3) {
    for (const item of SCIENCE_FR_TERM1_CHAPTER_REVIEWS_2026) {
      sections.push({
        id: `science-fr-review-${item.sourcePages}`,
        kind: 'review',
        sourcePages: item.sourcePages,
        titleFr: item.titleFr,
        summaryFr: item.appAuthoredSummaryFr,
        practiceItemsFr: item.practiceItemsFr.map((practice) => ({
          prompt: practice.prompt,
          expectedAnswer: practice.expectedAnswer,
        })),
      });
    }
  }

  if (s.u === 6 && s.n === 3) {
    sections.push({
      id: 'science-fr-review-69-71',
      kind: 'review',
      sourcePages: '69–71',
      titleFr: 'Conseils, révision et entraînement',
      summaryFr: 'Les pages 69–71 proposent de formuler des conseils sur l’alimentation, le sommeil et l’activité physique, puis de vérifier les acquis du chapitre : étapes de croissance, début de la vie humaine, héritage des caractères, rôle des parents et conditions d’une croissance saine.',
      practiceItemsFr: [
        { prompt: 'Donne un conseil concernant l’alimentation saine.', expectedAnswer: 'Boire du lait et manger des légumes et des fruits bien lavés.' },
        { prompt: 'Donne un conseil concernant le sommeil.', expectedAnswer: 'Dormir suffisamment et éviter de veiller tard.' },
        { prompt: 'Donne un conseil concernant l’activité physique.', expectedAnswer: 'Bouger et pratiquer des jeux ou des exercices physiques adaptés.' },
        { prompt: 'Ordonne les cinq étapes de la croissance humaine.', expectedAnswer: 'Petite enfance → enfance → adolescence → jeunesse → vieillesse.' },
        { prompt: 'Comment appelle-t-on l’étape qui commence juste après la naissance ?', expectedAnswer: 'La petite enfance.' },
        { prompt: 'Selon le manuel, de qui commence la vie d’un être humain ?', expectedAnswer: 'D’un père et d’une mère.' },
        { prompt: 'Pourquoi les enfants peuvent-ils ressembler à leurs parents ?', expectedAnswer: 'Parce qu’ils héritent de caractères de leurs parents.' },
        { prompt: 'Quelles sont les trois conditions d’une croissance saine ?', expectedAnswer: 'Une alimentation saine, un sommeil suffisant et une activité physique adaptée.' },
        { prompt: 'Quel est le rôle du sommeil suffisant ?', expectedAnswer: 'Le cerveau se repose et le corps se construit et se développe.' },
        { prompt: 'Quelle caractéristique correspond à l’étape de l’enfance ?', expectedAnswer: 'L’enfant commence à marcher, à parler et à aller à l’école.' },
        { prompt: 'Quels changements le corps connaît-il pendant la croissance ?', expectedAnswer: 'Au fil du temps, il devient plus grand, plus fort et plus complexe.' },
        { prompt: 'Quel rôle les parents jouent-ils envers leurs enfants ?', expectedAnswer: 'Ils prennent soin de leurs enfants et les protègent jusqu’à ce qu’ils grandissent.' },
        { prompt: 'Associe chaque action à la bonne condition : boire du lait et manger des fruits et légumes ; bouger ; se reposer la nuit.', expectedAnswer: 'Boire du lait et manger des fruits et légumes : alimentation saine ; bouger : activité physique adaptée ; se reposer la nuit : sommeil suffisant.' },
        { prompt: 'Que peut-il arriver à la croissance si un enfant ne mange que des collations, veille tard et ne fait pas d’exercice ?', expectedAnswer: 'Sa croissance peut être moins saine, car son corps ne reçoit pas une alimentation adaptée, ne se repose pas assez et manque d’activité physique.' },
      ],
    });
  }

  if (s.u === 7 && s.n === 3) {
    sections.push({
      id: 'science-fr-review-78-79',
      kind: 'review',
      sourcePages: '78–79',
      titleFr: 'Révision et entraînement du chapitre 7',
      summaryFr: 'Les pages 78–79 vérifient la distinction entre naissance et ponte, les soins aux chatons, la ponte et l’éclosion des poissons, la définition de la reproduction, le classement des animaux et le rôle des réserves naturelles.',
      practiceItemsFr: [
        { prompt: 'Comment la chatte met-elle ses petits au monde ?', expectedAnswer: 'Elle donne naissance à des petits.' },
        { prompt: 'Que boivent les chatons nouveau-nés pour grandir ?', expectedAnswer: 'Le lait maternel.' },
        { prompt: 'Comment les poissons comme le tilapia se reproduisent-ils ?', expectedAnswer: 'Ils pondent des œufs dans l’eau.' },
        { prompt: 'Comment appelle-t-on la sortie du petit poisson hors de l’œuf ?', expectedAnswer: 'L’éclosion.' },
        { prompt: 'Classe le dromadaire, la poule, le chat et la grenouille : qui donne naissance et qui pond des œufs ?', expectedAnswer: 'Le dromadaire et le chat donnent naissance à des petits ; la poule et la grenouille pondent des œufs.' },
        { prompt: 'Comment appelle-t-on le processus qui permet à un mâle et une femelle de produire un nouvel individu ?', expectedAnswer: 'La reproduction.' },
        { prompt: 'Où la chatte porte-t-elle ses petits avant leur naissance ?', expectedAnswer: 'À l’intérieur de son corps.' },
        { prompt: 'Pourquoi les poissons pondent-ils un très grand nombre d’œufs dans l’eau ?', expectedAnswer: 'Pour augmenter les chances de survie du plus grand nombre possible de petits poissons.' },
        { prompt: 'Que signifie la reproduction chez les êtres vivants ?', expectedAnswer: 'C’est la capacité de produire de nouveaux individus de la même espèce ; elle contribue à leur survie et à la continuité de l’espèce.' },
        { prompt: 'Comment appelle-t-on les lieux protégés où les animaux peuvent vivre et se reproduire en sécurité ?', expectedAnswer: 'Les réserves naturelles.' },
        { prompt: 'Cite un animal qui pond des œufs et indique où il les pond.', expectedAnswer: 'Exemples : la poule pond sur la terre ; le poisson pond dans l’eau ; la grenouille pond dans l’eau.' },
      ],
    });
  }

  if (s.u === 1 && s.n === 4) {
    sections.push({
      id: 'science-fr-practice-16-17',
      kind: 'practice',
      sourcePages: '16–17',
      titleFr: 'Exercices sur le squelette et le mouvement',
      summaryFr: 'Ces exercices vérifient les rôles du squelette, du crâne et de la cage thoracique, ainsi que le mouvement produit par les muscles et les os et l’adaptation des membres des animaux.',
      practiceItemsFr: [
        { prompt: 'Comment appelle-t-on la structure osseuse qui donne sa forme au corps ?', expectedAnswer: 'Le squelette.' },
        { prompt: 'Quels deux organes la cage thoracique protège-t-elle ?', expectedAnswer: 'Le cœur et les poumons.' },
        { prompt: 'Comment les chiens et les chevaux déplacent-ils leurs membres ?', expectedAnswer: 'Les muscles se contractent et tirent sur les os.' },
        { prompt: 'Pourquoi la longueur et la forme des os diffèrent-elles selon les animaux ?', expectedAnswer: 'Elles sont adaptées à leur mode de vie et à leurs mouvements, comme courir ou voler.' },
        { prompt: 'Quel organe le crâne protège-t-il ?', expectedAnswer: 'Le cerveau.' },
        { prompt: 'De quoi la colonne vertébrale est-elle composée et pourquoi permet-elle de plier le corps ?', expectedAnswer: 'Elle est composée de nombreux petits os reliés entre eux, ce qui permet au corps de se plier.' },
        { prompt: 'Qu’est-ce qui permet aux pattes antérieures du chien de se plier ?', expectedAnswer: 'Elles possèdent des articulations.' },
        { prompt: 'Pourquoi les os des animaux ont-ils des formes différentes ?', expectedAnswer: 'Parce que leur forme est adaptée aux types de mouvements de chaque animal.' },
      ],
    });
  }

  if (s.u === 2 && s.n === 2) {
    sections.push({
      id: 'science-fr-practice-24-25',
      kind: 'practice',
      sourcePages: '24–25',
      titleFr: 'Exercices sur les changements saisonniers',
      summaryFr: 'Ces exercices relient la température aux changements de la plante de luffa et à l’activité des lézards, puis vérifient l’ordre du cycle annuel de la plante et la dormance hivernale.',
      practiceItemsFr: [
        { prompt: 'Quand les graines de luffa germent-elles et se développent-elles rapidement ?', expectedAnswer: 'Lorsque la température augmente.' },
        { prompt: 'Que reste-t-il après le flétrissement du luffa en hiver pour produire la génération suivante ?', expectedAnswer: 'Les graines.' },
        { prompt: 'Quand les lézards sont-ils les plus actifs ?', expectedAnswer: 'Lorsque la température est élevée.' },
        { prompt: 'Comment les lézards passent-ils généralement l’hiver froid ?', expectedAnswer: 'Ils restent immobiles dans le sol ou dans les fissures des roches.' },
        { prompt: 'Que font de nombreuses plantes lorsque la température devient plus élevée en été ?', expectedAnswer: 'Elles développent largement leurs feuilles et produisent des fleurs.' },
        { prompt: 'Ordonne le cycle annuel de la plante : germination, floraison, développement des fruits.', expectedAnswer: 'Les graines germent → les fleurs s’épanouissent → les fruits se développent.' },
        { prompt: 'Comment la température influence-t-elle le mouvement des lézards ?', expectedAnswer: 'Ils deviennent lents lorsque la température est basse et peuvent bouger rapidement lorsqu’elle est élevée.' },
        { prompt: 'Comment appelle-t-on l’état d’inactivité de certains animaux pendant l’hiver pour conserver leur énergie ?', expectedAnswer: 'L’hibernation.' },
      ],
    });
  }

  if (s.u === 3 && s.n === 5) {
    sections.push({
      id: 'science-fr-practice-42',
      kind: 'practice',
      sourcePages: '42',
      titleFr: 'Exercices de synthèse sur la germination',
      summaryFr: 'Les exercices vérifient les trois conditions de germination et distinguent la germination de la croissance ultérieure, qui nécessite notamment la lumière du Soleil et des nutriments.',
      practiceItemsFr: [
        { prompt: 'Que se passe-t-il si l’une des trois conditions nécessaires à la germination manque ?', expectedAnswer: 'Les graines ne germent pas.' },
        { prompt: 'Quel autre facteur, en plus de la lumière du Soleil, est nécessaire à la croissance après la germination mais pas à la germination elle-même ?', expectedAnswer: 'L’engrais.' },
        { prompt: 'Des graines placées sur du coton humide, dans une boîte obscure et dans une pièce chaude peuvent-elles germer ?', expectedAnswer: 'Oui, si elles disposent d’eau, d’air et d’une température appropriée ; la lumière n’est pas nécessaire à la germination.' },
        { prompt: 'Quelles sont les trois conditions nécessaires à la germination ?', expectedAnswer: 'L’eau, l’air et une température appropriée.' },
        { prompt: 'Dans l’expérience qui compare un endroit chaud et un réfrigérateur, quelle condition est modifiée ?', expectedAnswer: 'La température.' },
        { prompt: 'Des graines placées sur du coton humide dans un réfrigérateur germent-elles dans les conditions de l’expérience ?', expectedAnswer: 'Non, car la température froide n’est pas appropriée à la germination.' },
      ],
    });
  }

  if (s.u === 4 && s.n === 2) {
    sections.push({
      id: 'science-fr-practice-48-49',
      kind: 'practice',
      sourcePages: '48–49',
      titleFr: 'Exercices sur la lumière et l’engrais',
      summaryFr: 'Ces exercices vérifient les effets de la lumière du Soleil et de l’engrais sur la croissance des plantes, ainsi que les variables à maintenir constantes pendant les expériences.',
      practiceItemsFr: [
        { prompt: 'À quoi ressemblent les feuilles et les tiges d’une plante qui reçoit une quantité appropriée de lumière ?', expectedAnswer: 'Les feuilles sont vert foncé et les tiges sont épaisses et fortes.' },
        { prompt: 'Quelle condition est modifiée dans l’expérience qui étudie l’effet de la lumière du Soleil ?', expectedAnswer: 'La présence ou la quantité de lumière du Soleil.' },
        { prompt: 'Comment les plants avec engrais grandissent-ils par rapport aux plants sans engrais ?', expectedAnswer: 'Ils grandissent davantage.' },
        { prompt: 'Quelles deux conditions doivent rester identiques dans l’expérience sur l’engrais ?', expectedAnswer: 'La quantité d’eau et la façon dont la lumière du Soleil arrive.' },
        { prompt: 'Que devient une plante qui pousse sans lumière du Soleil ?', expectedAnswer: 'Ses feuilles tendent à jaunir et ses tiges deviennent fines et longues.' },
        { prompt: 'Pourquoi les plantes ont-elles besoin de la lumière du Soleil ?', expectedAnswer: 'La lumière du Soleil les aide à grandir fortes et en bonne santé.' },
        { prompt: 'Quel élément n’est pas un effet attendu de l’engrais dans les choix du manuel ?', expectedAnswer: 'La diminution du nombre de feuilles.' },
        { prompt: 'De quoi les plantes ont-elles besoin pour fabriquer leurs nutriments et poursuivre leur croissance ?', expectedAnswer: 'Elles utilisent la lumière du Soleil et absorbent de l’eau.' },
      ],
    });
  }

  if (s.u === 5 && s.n === 3) {
    sections.push({
      id: 'science-fr-practice-62',
      kind: 'practice',
      sourcePages: '62',
      titleFr: 'Exercices sur la pollinisation et le fruit',
      summaryFr: 'Ces exercices vérifient la définition de la pollinisation, l’ordre des changements après la pollinisation, le rôle des insectes et le devenir d’une fleur femelle non pollinisée.',
      practiceItemsFr: [
        { prompt: 'Comment appelle-t-on le processus au cours duquel les grains de pollen adhèrent au sommet du carpelle ?', expectedAnswer: 'La pollinisation.' },
        { prompt: 'Quel est l’ordre correct des changements après la pollinisation ?', expectedAnswer: 'La pollinisation → le renflement à la base de la fleur femelle se développe → les graines se forment à l’intérieur du fruit.' },
        { prompt: 'Quels êtres vivants transportent souvent le pollen des fleurs mâles vers les fleurs femelles du luffa ?', expectedAnswer: 'Des insectes comme les abeilles.' },
        { prompt: 'Que devient une fleur femelle de luffa qui n’a pas été pollinisée ?', expectedAnswer: 'Elle jaunit et tombe sans que le fruit se développe.' },
      ],
    });
  }

  if (s.u === 8 && s.n === 3) {
    sections.push({
      id: 'science-fr-practice-88',
      kind: 'practice',
      sourcePages: '88',
      titleFr: 'Exercices sur les images satellites',
      summaryFr: 'Ces exercices vérifient la lecture des images satellites, la représentation des nuages, leur déplacement général d’Ouest en Est et l’utilisation de ces observations pour prévoir le temps à court terme.',
      practiceItemsFr: [
        { prompt: 'Dans quelle direction les nuages se déplacent-ils généralement selon le manuel ?', expectedAnswer: 'D’Ouest en Est.' },
        { prompt: 'Quel temps est probable lorsqu’il n’y a aucun nuage au-dessus de l’Égypte sur l’image satellite ?', expectedAnswer: 'Un temps ensoleillé.' },
        { prompt: 'Que représentent les zones blanches sur les images des satellites météorologiques ?', expectedAnswer: 'Les nuages.' },
        { prompt: 'Quel temps peut-on prévoir si une grande masse de nuages arrive de l’Ouest ?', expectedAnswer: 'Le temps risque de se dégrader et de devenir nuageux ou pluvieux.' },
      ],
    });
  }

  if (s.u === 9 && s.n === 3) {
    sections.push({
      id: 'science-fr-practice-100-101',
      kind: 'practice',
      sourcePages: '100–101',
      titleFr: 'Exercices sur le cycle de l’eau',
      summaryFr: 'Ces exercices vérifient le trajet circulaire de l’eau entre la mer, le ciel et la terre, la forme invisible de la vapeur d’eau et le rôle de la chaleur du Soleil dans l’évaporation.',
      practiceItemsFr: [
        { prompt: 'Comment appelle-t-on le trajet circulaire de l’eau entre la mer, les nuages, la pluie et les rivières ?', expectedAnswer: 'Le cycle de l’eau.' },
        { prompt: 'Sous quelle forme l’eau des mers et des rivières monte-t-elle vers le ciel ?', expectedAnswer: 'Sous forme de vapeur d’eau invisible.' },
        { prompt: 'Quel est l’ordre correct du cycle de l’eau à partir de la mer ?', expectedAnswer: 'L’eau s’évapore de la mer → elle forme des nuages → la pluie tombe → l’eau retourne à la mer.' },
        { prompt: 'Quelle source d’énergie est nécessaire pour que l’eau s’évapore ?', expectedAnswer: 'La chaleur du Soleil.' },
      ],
    });
  }

  // The general scientific-method appendix is linked from the lessons where
  // its procedures are directly practised: fair tests and observation records
  // from seed germination; microscope operation from lesson 5-2.
  if (s.u === 3 && s.n === 2) {
    for (const item of SCIENCE_FR_TERM1_METHOD_SKILLS_2026.filter((entry) =>
      ['104', '106', '107'].includes(entry.sourcePages),
    )) {
      sections.push({
        id: `science-fr-method-${item.sourcePages}`,
        kind: 'method',
        sourcePages: item.sourcePages,
        titleFr: item.titleFr,
        summaryFr: `${item.objectiveFr} ${item.teachingSequenceFr}`,
      });
    }
  }

  if (s.u === 5 && s.n === 2) {
    for (const item of SCIENCE_FR_TERM1_METHOD_SKILLS_2026.filter((entry) => entry.sourcePages === '105')) {
      sections.push({
        id: `science-fr-method-${item.sourcePages}`,
        kind: 'method',
        sourcePages: item.sourcePages,
        titleFr: item.titleFr,
        summaryFr: `${item.objectiveFr} ${item.teachingSequenceFr}`,
      });
    }
  }

  return sections;
}

function makeLesson(s:Spec):OfficialCurriculumLesson {
 const teacherGuide = SCIENCE_FR_TEACHER_GUIDE_2026[`${s.u}-${s.n}`];
 if (!teacherGuide) throw new Error(`Missing app-authored teacher guide for Science lesson ${s.u}-${s.n}`);
 const id='off_scifr_2026_u'+s.u+'_l'+s.n;
 const conceptId='conc_scifr_2026_u'+s.u+'_l'+s.n;
 const chapterTitleFr=SCIENCE_FR_CHAPTER_TITLES_2026[s.u];
 if (!chapterTitleFr) throw new Error(`Missing French chapter title for Science chapter ${s.u}`);
 const unit='Chapitre '+s.u;
 const lesson='Leçon '+s.u+'-'+s.n;
 const sourceRef={book:'Manuel de Sciences 5e Primaire — Ministère de l’Éducation, 2026–2027, Term 1',bookAr:'كتاب الوزارة للعلوم بالفرنسية — الصف الخامس — الفصل الدراسي الأول',bookEn:'Egypt Ministry Grade 5 Science in French — Term 1 (2026–2027)',grade:'Primary 5 / Grade 5',term:'Term 1 — 2026–2027',unit,lesson,page:s.page,notes:'[VERIFIED] Normalized extracted text on all 109 book pages matches the Ministry-hosted endpoint page by page. [UNPROVEN] PDF byte-level identity and visual/layout identity remain unverified; this Library copy is third-party assembled and bears the Ministry 2026–2027 imprint.',isAvailable:true};
 const concept={
  id:conceptId,conceptNumber:1,titleAr:s.ar,titleEn:s.en,titleFr:s.fr,
  sourceText:s.focus,sourceTextFr:teacherGuide.explanationFr,keyPoints:s.objectives,keyPointsFr:s.objectives,
  misconceptions:teacherGuide.misconceptionDiagnosisFr.map((item,index)=>({
   id:`mis_${conceptId}_${index+1}`,trigger:item.observedResponse,
   explanation:item.diagnosis,remediation:item.correctivePrompt,
   explanationFr:item.diagnosis,remediationFr:item.correctivePrompt
  })),
  dailyLifeExampleAr:s.exampleAr,dailyLifeExampleEn:s.exampleEn,dailyLifeExampleFr:s.exampleFr,
  storyAnalogyAr:'تخيّل مثالاً من الحياة اليومية يساعدك على فهم '+s.ar,
  storyAnalogyEn:'Use a familiar everyday situation to understand '+s.en+'.',
  storyAnalogyFr:'Relie cette idée à une situation familière de la vie quotidienne.',
  prerequisiteAr:'راجع الملاحظة والمقارنة والمفردات العلمية الأساسية.',
  prerequisiteEn:'Review observation, comparison and basic science vocabulary.',
  prerequisiteFr:'Révise l’observation, la comparaison et le vocabulaire scientifique de base.',
  visualType:'diagram' as const,
  visualPrompt:'Schéma pédagogique en français sur '+s.fr+'. Montrer les éléments cités dans la leçon, sans ajouter de faits non vérifiés.'
 };
 const mc={type:'multiple_choice' as const,question:s.q,options:s.options,expectedAnswer:s.answer,page:s.page};
 const qa={type:'qa' as const,question:'Explique avec tes propres mots : '+s.objectives[0],expectedAnswer:s.why,page:s.page};
 return {
  id,subjectId:'subj_science_fr',subjectNameAr:'العلوم (بالفرنسية)',subjectNameEn:'Science (French section)',subjectNameFr:'Sciences',
  unitNumber:s.u,unitNameAr:'الفصل '+s.u,unitNameEn:'Chapter '+s.u,unitNameFr:unit+' : '+chapterTitleFr,lessonNumber:s.n,
  titleAr:s.ar,titleEn:s.en,titleFr:s.fr,originTag:'official',language:'fr',
  instructionLanguage:'fr',contentLanguage:'fr',assessmentLanguage:'fr',curriculumSource:'egyptian_national',track:'french_bilingual',
  isAvailable:true,contentStatus:'available',sourceRef,
  objectives:s.objectives,
  readingText:teacherGuide.explanationFr+'\n\nDémonstration : '+teacherGuide.workedExampleFr+'\n\nExplique ensuite cette idée avec tes propres mots.',
  teacherGuide,
  supplementarySections: getSupplementarySections(s),
  vocabulary:s.vocab.map(([word,definition])=>({word,definition})),
  exercises:[mc,qa],exercisesByLanguage:{fr:[mc,qa]},concepts:[concept]
 };
}
export const SCIENCE_FR_CURRICULUM_2026_LESSONS:OfficialCurriculumLesson[]=S.map(makeLesson);
