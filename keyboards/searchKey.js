const { Telegraf, Markup, Scenes, session } = require('telegraf');
const bot = require('../config/config');
const { genderCommand } = require('../keyboards/gender')

const searchCommand = async (ctx) => {
    try {
        await ctx.reply(
            'Сначала определимся с вашим полом ⚧:',
            Markup.inlineKeyboard([
                [Markup.button.callback('Я парень 👨', 'mann')],
                [Markup.button.callback('Я девушка 👱‍♀️', 'womann')]
            ])
        );
    } catch (error) {
        console.error('Произошла ошибка:', error);
        ctx.reply('Произошла ошибка при отправке сообщения.');
    }
};



module.exports = {

    searchCommand
};
