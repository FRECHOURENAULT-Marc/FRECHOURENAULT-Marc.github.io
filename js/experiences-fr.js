import { Box, Project } from './utils.js';

document.addEventListener('DOMContentLoaded', () =>
{
  //GAIA
  let project_gaia = new Project("DÉVELOPPEUR FULL STACK", "2025 (2mois)", "../img/gaia_74_illu.png", "fr");
  project_gaia.SetID("gaia");
  project_gaia.AddDesc("J'ai eu pour mission de développer une webapp de restauration pour l'association ", false);
  project_gaia.AddDescLink("https://gaia74.fr/", "GAIA 74", true, false);
  project_gaia.AddDesc(" pendant ce stage.");
  project_gaia.AddDesc("");
  project_gaia.AddDesc("J'ai été sur le terrain pour rencontrer les utilisateurs et acteurs du furtur logiciel.");
  project_gaia.AddDesc("Sur cette base, j'ai conçu l'application de réservation et de gestion des repas pour la cuisine du CHRS LaCordée.");
  project_gaia.AddDesc("J'ai aussi participé à la vie de l'association (AG, journée associative).");
  project_gaia.AddSkill("Front end (HTML/CSS/JS)");
  project_gaia.AddSkill("Back end (Express.js/Batch scripting/BDD en .json)");
  project_gaia.AddSkill("UX/UI design");
  project_gaia.AddSkill("Écoute active");
  project_gaia.AddLink("https://marcgaia74.github.io/site/", "Lien de la webapp(inactive)");
  project_gaia.AddLink("https://github.com/FRECHOURENAULT-Marc/GAIA74-BOOKING-APP-Public", "GitHub du projet");
  project_gaia.AddLink("https://gaia74.com/", "Site de l'association");

  //ISART
  let project_isart = new Project("MONTE-OU-TOMBE", "2023 (2semaines)", "../img/isart_illu.png", "fr");
  project_isart.SetID("isart");
  project_isart.AddDesc('"MonteOuTombe" est un plateformer 2D où vous incarnez un petit slime bleu qui cherche à sortir des entrailles de la Terre.');
  project_isart.AddDesc("");
  project_isart.AddDesc("J'ai réalisé un stage d'initiation au visual scripting avec Unity à Paris durant l'été.");
  project_isart.AddDesc("Pendant 2 semaines un étudiant d'ISART m'a enseigné les bases d'un plateformer 2D.");
  project_isart.AddDesc("");
  project_isart.AddDesc("Au cours de ce stage, des corruptions de fichiers m'ont appris à améliorer mon processus de sauvegarde.");
  project_isart.AddDesc("J'ai pu y parvenir en travaillant sur mon temps libre.");
  project_isart.AddDesc("");
  project_isart.AddDesc("En résulte ce petit jeu dont je reste encore fier aujourd'hui.");
  project_isart.AddSkill("Unity 2D");
  project_isart.AddSkill("Visual Scripting");
  project_isart.AddSkill("Résilience");
  project_isart.AddLink("https://github.com/FRECHOURENAULT-Marc/MonteOuTombe", "GitHub du jeu");

  //SIMONES
  let project_simones = new Project("GRAPHISME WEB", "2022 (2semaines)", "../img/les_simones_illu.png", "fr");
  project_simones.SetID("simones");
  project_simones.AddDesc("Pour ma première expérience professionnelle, je me suis dirigé vers le monde des sites web.");
  project_simones.AddDesc("");
  project_simones.AddDesc("Lors de ce stage, j'ai découvert comment travaille une chargée de communication, mais aussi le principe du coworking.");
  project_simones.AddDesc("De la rencontre du client au produit final, j'ai eu la chance de suivre tout le processus et d'y participer.");
  project_simones.AddSkill("Adaptabilité");
  project_simones.AddSkill("Curiosité");
  project_simones.AddSkill("Initiation InDesign");
  project_simones.AddLink("https://lessimones.fr/", "Site de l'entreprise");

  //TO BE CONTINUED
  let continued_div = document.createElement("div");
  continued_div.innerHTML = `
    <div class="container-center-col-independant">
      <p><strong>Et bientôt d'autres !</strong></p>
    </div>
  `;
  document.getElementsByClassName("page-content")[0].appendChild(continued_div);

});