import { checkTask } from "./modules/checkTask";
import { createTask, getIdByPhone } from "../functions/prismaFunctions";
import { sessionManager } from "./controler";
import { sendMessage } from "./app";

async function getExercisesFromDB(userId: string) {
  return ["Pull-up", "Push-up", "Squat"];
}

export const reminderMiddleware = async (msg: any) => {
  const session = sessionManager.getSession(msg.from);

  if (msg.hasQuotedMsg && msg.body.toLowerCase() === "#ok") {
    await checkTask(msg);
    return;
  }

  if (msg.body.toLowerCase() === "#gym") {
    const exercises = await getExercisesFromDB(msg.from);

    if (!exercises.length) {
      await sendMessage(msg.from, "Nenhum treino encontrado 💪");
      return;
    }

    sessionManager.setSession(msg.from, {
      isSession: true,
      flow: "gym",
      step: 0,
      data: { exercises, results: [] }
    });

    await sendMessage(
      msg.from,
      `🏋️ Primeiro exercício: *${exercises[0]}* \n.`
    );
    return;
  }

  if (session.isSession && session.flow === "gym") {
    if (msg.hasQuotedMsg) {
      const { exercises, results } = session.data;
      const currentStep = session.step;

      results.push({
        exercise: exercises[currentStep],
        result: msg.body
      });

      if (currentStep + 1 < exercises.length) {
        sessionManager.setSession(msg.from, {
          step: currentStep + 1,
          data: { exercises, results }
        });

        await sendMessage(
          msg.from,
          `👉 Próximo exercício: *${exercises[currentStep + 1]}* \nResponda citando esta mensagem com o resultado.`
        );
      } else {
        sessionManager.resetSession(msg.from);

        await sendMessage(msg.from, "✅ Treino finalizado! Aqui está o resumo:");
        for (const r of results) {
          await sendMessage(msg.from, `• ${r.exercise}: ${r.result}`);
        }

        // aqui salvar no banco (com prisma)
      }
    } else {
      await sendMessage(msg.from, "❗ Responda citando a mensagem do exercício.");
    }
    return;
  }

  // 🔹 4. Criar tarefa (#n)
  if (msg.body.startsWith("#n-")) {
    const formattedPhone = msg.from.split("@")[0].replace(/^(\d{2})/, "");
    const parts = msg.body.split("-");

    if (parts.length < 4) {
      await sendMessage(
        msg.from,
        "⚠️ Formato inválido. Use: #n-Nome da Tarefa - 15/02/2000 - {dias}/{3}"
      );
      return;
    }

    const taskName = parts[1].trim();
    const taskDate = parts[2].trim();
    const reminder = parts[3].trim();

    try {
      const id = await getIdByPhone(formattedPhone);
      await createTask(
        taskName,
        taskDate,
        reminder,
        "desc",
        false,
        id ?? "",
        formattedPhone
      );

      await sendMessage(
        msg.from,
        `✅ Tarefa criada: *${taskName}* para ${taskDate}`
      );
    } catch (error) {
      console.error("Erro ao criar tarefa:", error);
      await sendMessage(msg.from, "❌ Ocorreu um erro ao criar a tarefa.");
    }
    return;
  }

  // 🔹 5. Fallback
  await sendMessage(
    msg.from,
    "ℹ️ Comandos disponíveis:\n\n" +
      "• *#gym* → iniciar treino\n" +
      "• *#n-Nome - Data - Dias* → criar tarefa\n" +
      "• Responder com *#ok* uma tarefa → finalizar"
  );
};
