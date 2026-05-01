import { Box, Project } from './utils.js';

document.addEventListener('DOMContentLoaded', () =>
{
  //Projets
  let box_projets = new Box("Découvrir mes projets", null, "../pages-fr/projets.html");
  box_projets.AddDesc(
    "J'ai réalisé des créations digitales de toutes sortes. Passons en revue mes réalisations personnelles et d'études."
  );
  //Expériences
  let box_exp = new Box("Découvrir mes expériences", null, "../pages-fr/experiences.html");
  box_exp.AddDesc(
    "Le domaine de l'informatique m'a toujours passionné. Mes stages et périodes en entreprise le démontre bien."
  );
  //Parcours
  let box_parcours = new Box("Découvrir mon parcours", null, "../pages-fr/parcours.html");
  box_parcours.AddDesc(
    "Depuis que j'ai accès à un internet, je n'ai cessé de créer. Des mes idées d'enfants à aujourd'hui, retraçons mon chemin."
  );
  //Contact
  let box_contact = new Box("Entrer en contact", null, "../pages-fr/contact.html");
  box_contact.AddDesc(
    "Vous souhaitez me contacter ? N'hésitez pas à me joindre via mon adresse email ou mon profil LinkedIn."
  );
});