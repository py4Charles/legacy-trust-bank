import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    globals: false,
    fileParallelism: false,
    globalSetup: ["./tests/globalSetup.ts"],
    env: {
      NODE_ENV: "test",
      DATABASE_URL: "file:./test.db",
      JWT_ACCESS_SECRET: "test-access-secret",
      JWT_REFRESH_SECRET: "test-refresh-secret",
      ACCESS_TOKEN_TTL: "15m",
      REFRESH_TOKEN_TTL: "30d",
      TWO_FACTOR_ENABLED: "true",
    },
  },
});
