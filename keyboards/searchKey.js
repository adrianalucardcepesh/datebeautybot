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





module.exports = { searchCommand };