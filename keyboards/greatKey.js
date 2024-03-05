const { Telegraf, Markup, Scenes, session } = require('telegraf');
const bot = require('../config/config');





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
        await ctx.reply("Привет, друзья! 💫\n\nВас приветствует бот знакомств Hummingbird 💟\n\nЕсли Вам уже 18 лет или больше, то начинайте заполнять анкету и заводить новых друзей! 🔞\n\nВнимание! ⚠️\n\nЕсли во время просмотра анкет у вас случиться баг или бот зависнет, то воспользуйтесь командой /start 🚀",
            Markup.inlineKeyboard([
                [
                    Markup.button.callback('ЗАПОЛНИТЕ АНКЕТУ 🚀', 'fill_form'),
                    Markup.button.callback('Смотреть анкеты 💎', 'search'),

                ],
                [
                    Markup.button.callback('Изменить свою анкету 📂', 'fill_form'),
                    Markup.button.callback('Удалить свою анкету 🗑', 'delete'),
                ],
            ])
        );
       // await ctx.scene.enter('firstQuestion');


    } catch (error) {
        console.error('Произошла ошибка:', error);
        ctx.reply('Произошла ошибка при загрузке картинки или отправке сообщения.');
    }
};


module.exports = { startCommand };