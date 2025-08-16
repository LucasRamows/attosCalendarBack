// import getReminder from './functions/getReminder';
// import setRemainder from './functions/setReminder';

import deleteReminder from "./functions/deleteReminder";

// // Objeto de teste
// const reminderData = {
//     date: "16/08/2025",        // Data final do evento
//     remaining: "7/3",           // taxaAviso / quantidade
//     description: "Comprar leite",
//     phone: "+5511999999999",
//     id: 2                      // ID do usuário
// };

// // Chamar a função para gerar reminders e salvar no txt
// (async () => {
//     try {
//         await setRemainder(reminderData);
//         console.log("Reminders gerados e salvos com sucesso!");
//     } catch (err) {
//         console.error("Erro ao gerar reminders:", err);
//     }
// })();


deleteReminder(1).then(() => {
    console.log("Lembrete deletado com sucesso!");
})