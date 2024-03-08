# OlympicGames

Ce projet est une application front permattant de visualiser les données des jeux olympiques sous forme de graphiques et diagrammes.

Une page d'accueil avec un diagramme en camembert représente les pays et leur nombre de médailles remportées au total.
Quand on clique sur un secteur du diagramme, on accède aux détails des participations aux JOs du pays concerné (nombre de participations aux JOs, de médailles total, de participants total) 
et à un diagramme linéaire représentant le nombre de médailles remportées par année.


## Technologies utilisées

- Angular 14.1.3
- Tailwind 3.4.1 et scss pour le style et la responsivité
- ng2-charts 4.1.1 pour le diagrammes

## Architecture

Dans le dossier src/app :
- core
  - component : pour les composants réutilisables (header, footer, titre1 et titre2)
  - models : 2 entités (Olympic et Participation)
  - services : un service olympic pour charger les données à partir d'un fichier json et les transformer en objets
  
- pages :
  -  home : page d'accueil où s'affiche un diagramme en camembert
  -  detail : page affichant les details d'un pays
  -  not-found : page qui s'affiche si l'adresse entrée est incorrecte

- assets
  - img : contient les images utilisées dans le projet
  - mock: contient le fichier json où sont stockées les informations concernant les JOs


## Outils utilisés

- IDE: Vscode
- Navigateurs: Firefox, Edge


## Démarrage du projet

- Cloner le projet
- Ouvrir le projet avec un éditeur de code
- Installer les node_modules avec la commande (`npm install`)
- Lancer le projet avec ('ng serve')
- Aller à l'adresse `http://localhost:4200/




