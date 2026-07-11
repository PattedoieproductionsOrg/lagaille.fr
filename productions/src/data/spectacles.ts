import affiche from "../assets/affiche.jpg";

export interface Spectacle {
  titre: string;
  duree: string;
  publicCible: string;
  pitch: string;
  affiche: ImageMetadata;
  /** Site dédié du spectacle (dates, réservation). */
  siteUrl?: string;
}

export const spectacles: Spectacle[] = [
  {
    titre: "Entre Rire et Réalité",
    duree: "60 minutes",
    publicCible: "Tout public",
    pitch:
      "Le one-man-show de La Gaille. Un spectacle qui mêle autodérision, observation du quotidien et réflexion sur les choix de vie — soixante minutes pour rire de ce qui nous ressemble.",
    affiche,
    siteUrl: "https://lagaille.fr",
  },
];
