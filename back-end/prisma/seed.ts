import { prisma } from "../src/database.js";

async function main() {
  await prisma.recommendation.deleteMany({});

  await prisma.recommendation.upsert({
    where: {
      name: "Courtesy Call",
    },
    update: {},
    create: {
      name: "Courtesy Call",
      youtubeLink: "https://www.youtube.com/watch?v=ocpDEOXABWg",
    },
  });

  await prisma.recommendation.upsert({
    where: {
      name: "Breath",
    },
    update: {},
    create: {
      name: "Breath",
      youtubeLink: "https://www.youtube.com/watch?v=Ib9swdvt3mA",
    },
  });

  await prisma.recommendation.upsert({
    where: {
      name: "The Rumbling",
    },
    update: {},
    create: {
      name: "The Rumbling",
      youtubeLink: "https://www.youtube.com/watch?v=DSMuhzSgOGE",
      score: 10,
    },
  });

  await prisma.recommendation.upsert({
    where: {
      name: "Baby",
    },
    update: {},
    create: {
      name: "Baby",
      youtubeLink: "https://www.youtube.com/watch?v=kffacxfA7G4",
      score: -100,
    },
  });
}

main()
  .catch((e) => {
    console.log(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
