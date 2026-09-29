import { describe, it } from "node:test";
import { equal } from "node:assert";

describe("Testes para a integração com o modeo de linguagem", () => {
  it("Deve gerar uma query SQL válida para uma pergunta simples", async (ctx) => {
    ctx.mock.module("ai", {
      exports: {
        generateText: async ({ system, prompt }) => {
          return {
            experimental_output: {
              sql: "SELECT date, COUNT(*) as access_count FROM access_log GROUP BY date",
              explanation:
                "Esta query encontra o numero de acessos por dia....",
            },
          };
        },
        Output: { object: ({ schema }) => ({ schema }) },
      },
    });

    const { generateSqlObject } = await import("./ai.js");

    const question = "Quantos acessos tivemos por dia?";
    const { sql, explanation } = await generateSqlObject(question);

    equal(typeof sql, "string");
    equal(sql.trim().length > 0, true);

    equal(sql.trim().toUpperCase().startsWith("SELECT"), true);
  });
});
