const { Telegraf, Markup, Scenes, session } = require('telegraf');
const bot = require('../config/config');


const genderCommand = async (ctx) => {
    try {
        await ctx.reply(
            'Теперь выберите кого вы ищите 🚀',
            Markup.inlineKeyboard([
                [Markup.button.callback('Парня 👨', 'mann')],
                [Markup.button.callback('Девушку 👱‍♀️', 'womann')],
                [Markup.button.callback('Любой пол 👤', 'any')]
            ])
        );
    } catch (error) {
        console.error('Произошла ошибка:', error);
        ctx.reply('Произошла ошибка при отправке сообщения.');
    }
};

// Добавляем обработчики для кнопок
bot.action('mann', genderCommand);
bot.action('womann', genderCommand);
bot.action('any', genderCommand);

// Запускаем бота


// bot.action('mann', (ctx) => {
//     ctx.session.genderChoice = 'mann';
//
// });
// bot.action('womann', (ctx) => {
//     ctx.session.genderChoice = 'womann';
//
// });
// bot.action('womann', (ctx) => {
//     ctx.session.genderChoice = 'any';
//
// });


module.exports = {
    genderCommand
};
