import { execSync } from "node:child_process";

export default function globalSetup(): void {
  const env = {
    ...process.env,
    DATABASE_URL:
      process.env.TEST_DATABASE_URL ??
      "postgresql://ltb:ltb@localhost:5432/ltb_test?schema=public",
  };
  execSync("npx prisma db push --skip-generate --force-reset", {
    stdio: "inherit",
    env,
  });
  execSync("npx tsx src/db/seed.ts", { stdio: "inherit", env });
}
