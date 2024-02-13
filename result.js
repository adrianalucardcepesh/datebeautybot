const bot = require('./config/config');
const db = require('./database/db-pool.js');
const result = require('./result');


const showProfile = async (ctx) => {
    function telegramId(ctx) {
        return ctx.from.id;
    }

    let conn;
    let user; // Определите переменную user на уровне функции


    try {
        const userId = telegramId(ctx);

        conn = await db.getConnection();

        [user] = await conn.query('SELECT * FROM users WHERE telegram_id = ?', [userId]);

        if (!user) {
            ctx.reply('Ваша анкета не найдена');
            return;
        }

        const {name, surname, city, age, info, search, goal} = user;

        let text = `ВАША АНКЕТА:\n\n`;
        text += `Имя: ${name}\n`;
        text += `Фамилия: ${surname}\n`;
        text += `Город, Страна: ${city}\n`;
        text += `Возраст: ${age}\n`;
        text += `О себе: ${info}\n`;
        text += `Ищу: ${search}\n`;
        text += `Цель знакомства: ${goal}\n`;

        ctx.reply(text, {
            reply_markup: {
                keyboard: [
                    [{text: 'Вернуться в главное меню'}],
                ],
                resize_keyboard: true,
                one_time_keyboard: true,
            },
        });
    } catch (err) {
        console.error(err);
        ctx.reply('Произошла ошибка при получении анкеты');
    } finally {
        if (conn) conn.end();
    }



    try {
        // Асинхронный блок, который выводит фото или видео после основных данных
        if (user && user.fileId && user.fileType) {
            if (user.fileType === 'photo') {
                await ctx.telegram.sendPhoto(ctx.chat.id, user.fileId);
            } else if (user.fileType === 'video') {
                await ctx.telegram.sendVideo(ctx.chat.id, user.fileId);
            }
        }
        // Создайте клавиатуру
        const keyboard = [
            [{text: 'Изменить анкету 📝,', callback_data: 'updater'}],
            // [{text: 'Пожаловаться на анкету 👮🏼‍', callback_data: 'complain'}],
        ];
        await ctx.telegram.sendMessage(ctx.chat.id, 'Как вам анкета? ', {
            reply_markup: {
                inline_keyboard: keyboard,
            },
        });

    } catch (err) {
        console.error(err);
        ctx.reply('Ошибка при выводе файла');
    }
};

module.exports = {
    showProfile
};