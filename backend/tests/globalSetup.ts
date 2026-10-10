import { execSync } from "node:child_process";

export default function globalSetup(): void {
  const env = { ...process.env, DATABASE_URL: "file:./test.db" };
  execSync("npx prisma db push --skip-generate --force-reset", {
    stdio: "inherit",
    env,
  });
  execSync("npx tsx src/db/seed.ts", { stdio: "inherit", env });
}
