// const { Markup, Stage, BaseScene } = require('telegraf');
//
// // Создайте сцену для первого вопроса
// const firstQuestionScene = new BaseScene('firstQuestion');
// firstQuestionScene.enter(async (ctx) => {
//     await ctx.reply(
//         'Сначала определимся с вашим полом ⚧:',
//         Markup.inlineKeyboard([
//             [Markup.button.callback('Я парень 👨', 'mann')],
//             [Markup.button.callback('Я девушка 👱‍♀️', 'womann')],
//         ])
//     );
// });
// firstQuestionScene.action(['mann', 'womann'], async (ctx) => {
//     // Обработайте ответ и перейдите ко второму вопросу
//     await ctx.answerCbQuery();
//     ctx.scene.enter('secondQuestion');
// });
//
// // Создайте сцену для второго вопроса
// const secondQuestionScene = new BaseScene('secondQuestion');
// secondQuestionScene.enter(async (ctx) => {
//     await ctx.reply(
//         'Теперь выберите кого вы ищите:',
//         Markup.inlineKeyboard([
//             [Markup.button.callback('Парня 👨', 'search_mann')],
//             [Markup.button.callback('Девушку 👱‍♀️', 'search_womann')],
//             [Markup.button.callback('Любой пол 👤', 'any')],
//         ])
//     );
// });
// secondQuestionScene.action(['search_mann', 'search_womann', 'any'], async (ctx) => {
//     // Обработайте ответ и завершите сцену
//     await ctx.answerCbQuery();
//     ctx.scene.leave();
// });
//
// // Создайте менеджер сцен и зарегистрируйте сцены
// const stage = new Stage([firstQuestionScene, secondQuestionScene]);
//
// // Добавьте менеджер сцен в миддлвар бота
// const bot = new Telegraf(process.env.BOT_TOKEN);
// bot.use(stage.middleware());
//
// // Установите команду для начала первой сцены
// bot.command('start', (ctx) => {
//     ctx.scene.enter('firstQuestion');
// });
//
// bot.launch();
