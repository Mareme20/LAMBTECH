import { AppDataSource } from "./src/database/data-source.js";
import { User } from "./src/modules/auth/entity/user.entity.js";
import { Role } from "./src/shared/enums/role.enum.js";
import bcrypt from "bcrypt";

async function createAdmin() {
  await AppDataSource.initialize();
  const repo = AppDataSource.getRepository(User);
  
  const email = "admin@meds.sn";
  const password = "adminpassword";
  const hashedPassword = await bcrypt.hash(password, 10);
  
  const existing = await repo.findOne({ where: { email } });
  if (existing) {
    existing.motDePasse = hashedPassword;
    await repo.save(existing);
    console.log("Admin password updated");
  } else {
    const admin = repo.create({
      email,
      motDePasse: hashedPassword,
      nomComplet: "Administrateur Système",
      telephone: "770" + Math.floor(Math.random() * 1000000),
      role: Role.ADMIN
    });
    await repo.save(admin);
    console.log("Admin created: admin@meds.sn / adminpassword");
  }
  process.exit(0);
}

createAdmin().catch(err => {
  console.error(err);
  process.exit(1);
});
