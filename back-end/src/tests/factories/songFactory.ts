import { prisma } from "../../database.js";
import { CreateRecommendationData } from "../../services/recommendationsService.js";

export type SongName = Omit<CreateRecommendationData, "youtubeLink">;

export async function insertSong(data: CreateRecommendationData) {
  return await prisma.recommendation.create({
    data: {
      name: data.name,
      youtubeLink: data.youtubeLink,
    },
  });
}

export async function deleteSong(song: SongName) {
  await prisma.recommendation.delete({
    where: {
      name: song.name,
    },
  });
}
