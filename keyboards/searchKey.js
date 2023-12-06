const { Markup } = require('telegraf');
const bot = require('../config/config');

const searchCommand = async (ctx, gender) => {
    try {
        // Затем отправляем текст от выборе пола и клавиатуру
        await ctx.reply(
            ` Теперь выберите кого вы ищите: `,
            {
                reply_markup: {
                    inline_keyboard: [
                        [
                            Markup.button.callback('Парня  ' + ' 👨', 'mann'),
                            Markup.button.callback('Девушку  ' + ' 👱', 'womann'),
                        ],
                        [
                            Markup.button.callback('Любой пол' + ' 👤', 'anyy'),
                        ],
                    ],
                },
            }
        );
    } catch (error) {
        console.error('Произошла ошибка:', error);
        ctx.reply('Произошла ошибка при отправке сообщения.');
    }
};

bot.action('mann', (ctx) => {
    ctx.reply('Вы выбрали "Парня"' +  '  👨  \n \n' +
        'Теперь напишите свой город  🏙️ :');
    // Дальнейшие действия для выбора "Парень"
});

bot.action('womann', (ctx) => {
    ctx.reply('Вы выбрали "Девушку"' + '  👱  \n \n' +
        'Теперь напишите свой город  🏙️ : ');
    // Дальнейшие действия для выбора "Девушка"
});
bot.action('anyy', (ctx) => {
    ctx.reply('Вы выбрали "Любой пол"' + '  👤 \n \n' +
        'Теперь напишите свой город  🏙️ : ');
    // Дальнейшие действия для выбора "Девушка"
});



module.exports = { searchCommand };