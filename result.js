const db = require('./database/db-pool.js');
const showProfile = async (ctx) => {
    function telegramId(ctx) {
        return ctx.from.id;
    }

    let conn;
    let user; // Define the user variable at the function level

    try {
        const userId = telegramId(ctx);

        conn = await db.getConnection();

        [user] = await conn.query('SELECT * FROM users WHERE telegram_id = ?', [userId]);

        if (!user ) {
            let text_1 = `'Поздравляем! Ваша анкета создана! 💥'`;
            ctx.reply(text_1, {
                reply_markup: {
                    keyboard: [
                        [{ text: 'Вернуться в главное меню' }],
                    ],
                    resize_keyboard: true,
                    one_time_keyboard: true,
                },
            });
        } else {
            const { name, surname, gender, city, age, info, search, goal, fileId, fileType } = user;

            let text = `ВАША АНКЕТА:\n\n`;
            text += `Имя: ${name}\n`;
            text += `Фамилия: ${surname}\n`;
            text += `Пол : ${gender}\n`;
            text += `Город, Страна: ${city}\n`;
            text += `Возраст: ${age}\n`;
            text += `О себе: ${info}\n`;
            text += `Ищу: ${search}\n`;
            text += `Цель знакомства: ${goal}\n`;

            ctx.reply(text, {
                reply_markup: {
                    keyboard: [
                        [{ text: 'Вернуться в главное меню ' }],
                    ],
                    resize_keyboard: true,
                    one_time_keyboard: true,
                },
            });

            // Asynchronous block to send photo or video after basic data
            if (fileId && fileType) {
                if (fileType === 'photo') {
                    await ctx.telegram.sendPhoto(ctx.chat.id, fileId);
                } else if (fileType === 'video') {
                    await ctx.telegram.sendVideo(ctx.chat.id, fileId);
                }
            }

            // Create a keyboard for updating the profile
            const keyboard = [
                [{ text: 'Изменить анкету 📝', callback_data: 'updater' }],
                // [{ text: 'Пожаловаться на анкету 👮🏼‍', callback_data: 'complain' }],
            ];
            await ctx.telegram.sendMessage(ctx.chat.id, 'Как вам анкета? ', {
                reply_markup: {
                    inline_keyboard: keyboard,
                },
            });
        }
    } catch (err) {
        console.error(err);
        ctx.reply('Произошла ошибка при получении анкеты');
    } finally {
        if (conn) conn.release();
    }
};

module.exports = {
    showProfile
};