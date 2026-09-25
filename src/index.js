import { createInterface } from "node:readline";
import { styleText } from "node:util";
import { generateSqlObject, generateTextAnswer } from "./ai.js";
import { createDb } from "./db.js";
import { DB_NAME } from "./constants.js";

const db = createDb(DB_NAME);
const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: true,
});

function prompt(text) {
  return new Promise((resolve) => rl.question(text, resolve));
}

rl.on("close", () => {
  db.close();
  console.log(styleText("gray", "Encerrando o agent, até a próxima!"));
  process.exit(0);
});

console.log(
  styleText(
    ["bold", "cyan"],
    "\nBem-vindo ao SQL Terminal Agent! (Ctrl + C - Para sair)",
  ),
);
while (true) {
  const question = await prompt(styleText(["bold", "magenta"], "Pergunta: "));

  if (!question.trim()) {
    continue;
  }
  try {
    const sqlObject = await generateSqlObject(question);
    const { sql, explanation } = sqlObject;

    console.log(styleText("cyan", "\nSQL Sugerido:"));
    console.log(styleText("yellow", sql));
    console.log(styleText("cyan", "\nExplicação:"));
    console.log(explanation);

    const confirm = await prompt(
      styleText(["bold", "green"], "\nDeseja excutar SQL (S/N)?"),
    );
    if (confirm.toUpperCase() == "S") {
      const result = db
        .prepare(sql)
        .all()
        .map((row) => ({ ...row }));
      const answer = await generateTextAnswer({ question, sql, rows: result });

      console.log(styleText("magenta", "\nResultado:"));
      console.log(answer);
    } else {
      console.log("red", "SQL não executado.");
    }
  } catch (error) {
    console.error(styleText("red", "Erro ao processar a solicitação: "), error);
  }
}
