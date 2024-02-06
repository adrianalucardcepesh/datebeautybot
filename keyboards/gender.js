//
// const { Telegraf, Markup, Scenes, session } = require('telegraf');
// const bot = require('../config/config');
// const gender_to_searchCommand = async (ctx) => {
//     try {
//         await ctx.telegram.sendMessage(ctx.chat.id, 'Теперь выберите кого вы ищите: ', {
//             reply_markup: {
//                 inline_keyboard: [
//                     [Markup.button.callback('Парня 👨', 'search_mann')],
//                     [Markup.button.callback('Девушку 👱‍♀️', 'search_womann')],
//                     [Markup.button.callback('Любой пол 👤', 'any')],
//                 ],
//             },
//         });
//     } catch (error) {
//         console.error('Произошла ошибка:', error);
//         await ctx.reply('Произошла ошибка при отправке сообщения.');
//     }
// };
//
// module.exports = {
//     gender_to_searchCommand
// };
