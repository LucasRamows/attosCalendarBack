import { updateTask } from "../../functions/prismaFunctions";
import deleteReminder from "../../functions/deleteReminder";
import { sendMessage } from "../app";

interface WhatsAppMessage {
  body: string;
  from: string;
  _data?: {
    quotedMsg?: {
      body: string;
    };
  };
}

export const checkTask = async (msg: WhatsAppMessage): Promise<void> => {
  if (msg.body.toLowerCase() === "#ok" && msg._data?.quotedMsg) {
    const id = parseInt(msg._data.quotedMsg.body.split(" -")[0]);
    const status = true;
    const isPriority = false;

    await updateTask(id, status, isPriority);
    deleteReminder(id);

    await sendMessage(msg.from, "✅ Tarefa finalizada com sucesso!");
  } else {
    await sendMessage(
      msg.from,
      "ℹ️ Se deseja finalizar uma tarefa, responda com *#ok* citando a mensagem da tarefa."
    );
  }
};
