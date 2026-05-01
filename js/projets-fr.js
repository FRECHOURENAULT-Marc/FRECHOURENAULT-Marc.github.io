import { Project } from './utils.js';

document.addEventListener('DOMContentLoaded', () =>
    {
        //USR
        let project_usr = new Project("USR : Bananium Rush", "(3semaines)", "../img/USR_illu.png", "fr");
        project_usr.SetID("usr");
        project_usr.AddDesc("USR Bananium Rush est un jeu en temps réel mélangeant gestion et deck building.");
        project_usr.AddDesc("");
        project_usr.AddDesc("Vous incarnez le commandant d'une mission spatiale dans un futur alternatif.");
        project_usr.AddDesc("Dans cet avenir, les singes ont remplacé les humains suite à des expériences menées sur ces animaux pour les améliorer génétiquement.");
        project_usr.AddDesc("Cet nouvel ordre mondial part à l'exploration de l'espace et y découvre une ressource qui va devenir indispensable : le bananium.");
        project_usr.AddDesc("Votre objectif principal est de réduire au silence des groupes de singes n'obéissent plus au commandement de l'Union des République des Singes (Union of Samiens Republic).");
        project_usr.AddDesc("");
        project_usr.AddDesc("Pour ce faire, vous disposez de cartes (préalablement choisis en fonction de votre stratégie) qui vous permettent de déployer bâtiment, unités et capacités stratégiques.");
        project_usr.AddDesc("Mais attention, vos ressources sont limitées et votre adversaire ne vous laissera pas de répit pour préparer vos attaques.");
        project_usr.AddDesc("");
        project_usr.AddDesc("Ce jeu a été produit à l'aide du moteur créé par nos soins le ", false);
        project_usr.AddDescLink("#dx12", "FS-Engine", false);

        project_usr.AddSkill("Game design");
        project_usr.AddSkill("Game Feel");
        project_usr.AddSkill("Équilibrage gameplay");
        project_usr.AddSkill("C++ et .json");
        project_usr.Addlink("https://github.com/FRECHOURENAULT-Marc/Y2-009-USR", "GitHub du projet");
        //project_usr.Addlink("https://", "Démo du jeu");

        //DX12
        let project_dx12 = new Project("FS-Engine", "(4semaines)", "../img/dx12_illu.png", "fr");
        project_dx12.SetID("dx12");
        project_dx12.AddDesc("FS-Engine est un moteur de jeu custom développé en C++ durant 4 semaines.");
        project_dx12.AddDesc("");
        project_dx12.AddDesc("Il utilise le pipeline de rendu dx12 pour rendre des géométries 3D et sprites 2D.");
        project_dx12.AddDesc("Nous avons initialisé, encapsulé et architecturé dx12 pour concevoir ce moteur.");
        project_dx12.AddDesc("Notre partie rendu supporte les couleurs, les textures, la transparence, la lumière ainsi que les rotations et translations 3D.");
        project_dx12.AddDesc("");
        project_dx12.AddDesc("Nous avons utilisé cette librairie de rendu dans notre moteur personnalisé de type ECS.");
        project_dx12.AddDesc("Ce moteur possède des components, des systems, un héritage parent/enfant pour les TransformComponents ainsi que des scenes chargées et déchargées dynamiquement.");
        project_dx12.AddDesc("");
        project_dx12.AddDesc("Ce moteur et sa partie rendu nous a permis de produire le jeu du projet suivant, que nous avons intitulé ", false);
        project_dx12.AddDescLink("#usr", "USR : Bananium rush", false);

        project_dx12.AddSkill("Rendu 3D C++ bas niveau");
        project_dx12.AddSkill("DX12");
        project_dx12.AddSkill("Communication carte graphique/processeur");
        project_dx12.Addlink("https://github.com/FRECHOURENAULT-Marc/FS_ENGINE", "GitHub du projet");
        project_dx12.Addlink("https://drive.google.com/file/d/16DoD1IyVg7dhQ0GIz4Z5KTHd863TI9BO/view?usp=sharing", "Démo du moteur");
      
        //PWE
        let project_pwe = new Project("Pwe FPS", "(2semaines)", "../img/PweFPS_illu.png", "fr");
        project_pwe.SetID("pwe");
        project_pwe.AddDesc("Pwe FPS est un jeu de tir à la première personne multijoueur développé durant 2 semaines.");
        project_pwe.AddDesc("");
        project_pwe.AddDesc("Pour l'emporter dans ce jeu en joueur contre joueur il vous faudra :");
        project_pwe.AddDesc("Bien viser !");
        project_pwe.AddDesc("Esquiver les balles adverses");
        project_pwe.AddDesc("Tendre des embuscades");
        project_pwe.AddDesc("Choisissez de jouer sur courte, moyenne ou longue distance avec des armes spécialisées afin de définir votre stratégie.");
        project_pwe.AddDesc("");
        project_pwe.AddDesc("Ce jeu a été réalisé en C++ sur un moteur custom interne avec la librairie réseau winsock2.");
        project_pwe.AddDesc("Il utilise le protocole UDP pour gérer l'envoi et la réception de packets optimisés : header, id et data.");

        project_pwe.AddSkill("Protocoles réseau UDP");
        project_pwe.AddSkill("Winsock2");
        project_pwe.AddSkill("Optimisation de packets");
        project_pwe.Addlink("https://github.com/FRECHOURENAULT-Marc/Y2-006-MULTIPLAYER", "GitHub du projet");
        project_pwe.Addlink("https://drive.google.com/file/d/1ceY4jZCbbMuOx4x-gLcrLAzneDn1oVrk/view?usp=sharing", "Démo du jeu");

        //Dust and Bullets
        let project_dust = new Project("Dust and Bullets", "(3semaines)", "../img/DustAndBullets_illu.png", "fr");
        project_dust.SetID("dust");
        project_dust.AddDesc("Dust and Bullets est un jeu de tir à la première personne développé en C++ durant 3 semaines.");
        project_dust.AddDesc("");
        project_dust.AddDesc("Vous incarnez un shérif dans une ville ravagée par des gangsters sans foi ni loi.");
        project_dust.AddDesc("Votre objectif est de les éliminer pour rétablir l'ordre dans la ville.");
        project_dust.AddDesc("");
        project_dust.AddDesc("Nous avons utilisé un moteur de jeu interne à l'école (GC-Engine).");
        project_dust.AddDesc("Nous avons créé ce jeu en coopération avec d'autres étudiants artistes et étudiants développeurs.");

        project_dust.AddSkill("Level design");
        project_dust.AddSkill("Game feel");
        project_dust.AddSkill("Intégration d'assets 3D/2D");
        project_dust.Addlink("https://github.com/FRECHOURENAULT-Marc/Y2-005-ARENA-SHOOTER", "GitHub du projet");
        project_dust.Addlink("https://drive.google.com/file/d/1b1klal868Z_mQIYfsc8v6hZfQOYbVPCW/view?usp=sharing", "Démo du jeu");
    }
);