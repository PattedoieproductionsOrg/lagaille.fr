import photoLaGaille from "../assets/photo_la_gaille_1.jpg";

export interface Artiste {
  nom: string;
  role: string;
  bio: string;
  photo: ImageMetadata;
  siteUrl?: string;
  instagram?: string;
}

export const artistes: Artiste[] = [
  {
    nom: "La Gaille",
    role: "Humoriste stand-up",
    bio: "Humoriste lyonnais, auteur et interprète du one-man-show « Entre Rire et Réalité ». Sur scène, il transforme le quotidien en matière à rire, entre autodérision et regard tendre sur nos contradictions.",
    photo: photoLaGaille,
    siteUrl: "https://lagaille.fr",
    instagram: "https://www.instagram.com/la_gaille_/",
  },
];
