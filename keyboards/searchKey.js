// const { Telegraf, Markup, Scenes, session } = require('telegraf');
// const bot = require('../config/config');
//
//
// const searchCommand = async (ctx) => {
//     try {
//         await ctx.reply(
//             'Сначала определимся с вашим полом ⚧:',
//             Markup.inlineKeyboard([
//                 [Markup.button.callback('Я парень 👨', 'mann')],
//                 [Markup.button.callback('Я девушка 👱‍♀️', 'womann')],
//             ])
//         );
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
//         ctx.reply('Произошла ошибка при отправке сообщения.');
//     }
// };
//
//
//
//
// module.exports = {
//
//     searchCommand
// };
