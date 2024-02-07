const { Telegraf, Markup, Scenes, session } = require('telegraf');
const bot = require('./config/config');
const { startCommand } = require ("./keyboards/greatKey");
const { createScenes } = require ("./create")
const userDelete = require('./delete')
const { sendProfile } = require ("./sendProfile")
const { dateUsers } = require ("./dateUsers")




bot.use((ctx, next) => {
    if (!ctx.session) {
        ctx.session = {};
    }
    if (!ctx.session.profiles) {
        ctx.session.profiles = []; // Инициализируйте массив анкет здесь
    }
    next();
});

bot.use(session());
createScenes(bot)

bot.action(['mann', 'womann', 'anyy'], (ctx) => {

    if (!ctx.session) {
        ctx.session = {};
    }

    if (ctx.session.gender_to_searchChoice) {
        return ctx.reply('Вы уже сделали свой выбор пола. Хотите заполнить анкету заново?', {
            reply_markup: {
                inline_keyboard: [
                    [{ text: 'Да', callback_data: 'reset' }],
                    [{ text: 'Нет', callback_data: 'continue' }]
                ]
            }
        });
    }
});
bot.command('start', startCommand);
bot.action('fill_form', async (ctx) => {
    await ctx.answerCbQuery();
    await ctx.scene.enter('firstQuestion');
});

bot.action('create', async (ctx) => {
    try {
        ctx.scene.enter('startScene');

    } catch (err) {
        console.error(err);
        ctx.reply('У вас нету заполненной анкеты.');
    }
});
    bot.action('updater', (ctx) => {
    startCommand(ctx);
    });
    bot.action('update', (ctx) => {
    startCommand(ctx);

    bot.action('delete', async (ctx) => {
            try {
                await userDelete.deleteFunction(ctx);
            } catch (err) {
                console.error(err);
                ctx.reply('У вас нету заполненной анкеты.');
            }
    });
    bot.action('search', async (ctx) => {
            try {
                await dateUsers(ctx);
            } catch (err) {
                console.error(err);
                ctx.reply('Вы просмотрели все доступные анкеты');
            }
    });
        bot.action('like', async (ctx) => {
            const { profiles, currentProfileIndex } = ctx.session;

            if (profiles && Array.isArray(profiles) && currentProfileIndex < profiles.length) {
                const profile = profiles[currentProfileIndex];

                // Проверяем, есть ли у профиля имя пользователя (username)
                if (profile.username) {
                    const telegramUrl = `https://t.me/${profile.username}`;
                    ctx.reply(`Приятного общения 😼 ${telegramUrl}`);

                } else if (profile.telegram_id) {
                    const firstName = `${profile.name} ${profile.surname}`;

                    const formattedName = `[${firstName}](tg://user?id=${profile.telegram_id})`;
                    const textPredict = "Приятного общения 😼"; // Замените эту строку на ваш текст
                    const messageText = `${formattedName}, ${textPredict}`;

                    ctx.replyWithMarkdownV2(messageText);

                } else {
                    // Если нет ни имени пользователя, ни telegram_id
                    ctx.reply('Информация о контакте пользователя отсутствует.');
                }

                let text = `👻`;

                ctx.reply(text, {
                    reply_markup: {
                        keyboard: [
                            [{text: 'Вернуться в главное меню'}],
                        ],
                        resize_keyboard: true,
                        one_time_keyboard: true,
                    },
                });
            }
        });
        bot.action('next', async (ctx) => {
            ctx.session.currentProfileIndex++;

            // Зацикливание
            if (ctx.session.currentProfileIndex >= ctx.session.profiles.length) {
                ctx.session.currentProfileIndex %= ctx.session.profiles.length;

            }
            await sendProfile(ctx);
        });
});



    bot.action('continue', (ctx) => {
        // Пользователь выбрал продолжение, убираем клавиатуру и вызываем функцию createScenes

        ctx.deleteMessage(); // Опционально: удаляем сообщение с клавиатурой
    });

    // // createScenes(bot)
    // console.log(ctx.match); // Добавлено для отладки
    // let gender_to_searchText = '';

    // Присваиваем строку из первого элемента массива ctx.match
    // const action = ctx.match[0];

    // switch (action) {
    //     case 'mann':
    //         gender_to_searchText = 'Парня';
    //         break;
    //     case 'womann':
    //         gender_to_searchText = 'Девушку';
    //         break;
    //     case 'anyy':
    //         gender_to_searchText = 'Любой пол';
    //         break;
    //     default:
    //         // Если ни одно из значений не совпадает, выбирается это
    //         gender_to_searchText = 'Любой пол';
    //         break;
    // }

    // ctx.session.gender_to_searchChoice = action;// Здесь также нужно использовать исправленную переменную action
    //
    // // Исправленная строка для ответа пользователю
    // ctx.reply(`Вы выбрали "${gender_to_searchText}"`);
    //
    // bot.action('mann', gender_to_searchCommand);
    //
    // bot.action('womann', gender_to_searchCommand);
    //
    // bot.action('anyy', gender_to_searchCommand);





// Обработчик команды /start
// bot.start((ctx) => {
//     console.log('Обработчик startCommand вызван'); // Добавьте эту строку
//     startCommand(ctx); // Вызываем функцию startCommand для отправки клавиатуры
// });

bot.hears('Вернуться в главное меню', startCommand);
bot.command('start', startCommand);

bot.launch()

