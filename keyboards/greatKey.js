const { Telegraf, Markup, Scenes, session } = require('telegraf');
const bot = require('../config/config');
const { searchCommand } = require('./searchKey');

const startCommand = async (ctx) => {
    console.log('Пользователь запустил бота');

    try {

        ctx.session = {}; // Обнуляем всю сессию
        // Если вы хотите обнулить только определенные данные сессии:
        ctx.session.genderChoice = null;
        // Отправляем изображение с клавиатурой и текстом приветствия
        const imageUrl = 'https://raw.githubusercontent.com/ospreystudio/photo-gallery/main/logo.jpg';
        await ctx.replyWithPhoto({ url: imageUrl });

        // Затем отправляем текст приветствия и клавиатуру
        await ctx.reply("Привет! ‍💫  \n \nВас приветствует бот знакомств DateBeautyBot 💟 \n \nЕсли Вам уже 18 лет или больше, то начинайте заполнять анкету и заводить новых друзей! 🔞 \n \nВнимание! ⚠️ \n \nЕсли во время просмотра анкет у вас случился баг или бот завис, то воспользуйтесь командой /start 🚀" +
            "\n \nДавайте начнем знакомиться 💑" +
            "\n \nСначала определите свой пол  👤",
            Markup.inlineKeyboard([ // Обработчики кнопок
                Markup.button.callback('Парень  👨', 'man'),
                Markup.button.callback('Девушка  👱', 'woman'),
            ])
        );
    } catch (error) {
        console.error('Произошла ошибка:', error);
        ctx.reply('Произошла ошибка при загрузке картинки или отправке сообщения.');
    }
};
bot.action('man', (ctx) => {
        searchCommand(ctx)
});

bot.action('woman', (ctx) => {
        searchCommand(ctx)
});

module.exports = { startCommand };