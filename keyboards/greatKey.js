const { Markup, session } = require('telegraf');


const startCommand = async (ctx) => {
    console.log('Пользователь запустил бота');

    const imageUrl = 'https://raw.githubusercontent.com/ospreystudio/photo-gallery/main/logo.jpg';

    try {
        // Отправляем изображение с клавиатурой и текстом приветствия
        await ctx.replyWithPhoto({ url: imageUrl });

        // Затем отправляем текст приветствия и клавиатуру
        await ctx.reply("Привет! ‍💫  \n \nВас приветствует бот знакомств DateBeautyBot 💟 \n \nЕсли Вам уже 18 лет или больше, то начинайте заполнять анкету и заводить новых друзей! 🔞 \n \nВнимание! ⚠ \n \nЕсли во время просмотра анкет у вас случился баг или бот завис, то воспользуйтесь командой /start 🚀" +
            "\n \nДавайте начнем знакомиться 💑" +
            "\n \nСначала определите ваш пол  👤" ,
            {
            reply_markup: {
                inline_keyboard: [
                    [
                        Markup.button.callback('Парень  👨', 'man'),
                        Markup.button.callback('Девушка  👱', 'woman'),
                    ],
                ],
            },
        });

    } catch (error) {
        console.error('Произошла ошибка:', error);
        ctx.reply('Произошла ошибка при загрузке картинки или отправке сообщения.');
    }
};


module.exports = { startCommand };
