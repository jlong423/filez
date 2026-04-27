import db from "#db/client";
import { faker } from "@faker-js/faker";
import { createFolder } from "#db/queries/folders";
import { createFile } from "#db/queries/files";

await db.connect();
await seed();
await db.end();
console.log("🌱 Database seeded.");

async function seed() {
  for (let i = 0; i < 3; i++) {
    const folder = {
      name: faker.word.adjective(),
    };

    const createdFolder = await createFolder(folder);

    for (let j = 0; j < 5; j++) {
      const file = {
        name: faker.system.commonFileName(),
        size: faker.number.int({ max: 100000 }),
        folder_id: createdFolder.id,
      };

      await createFile(file);
    }
  }
}
