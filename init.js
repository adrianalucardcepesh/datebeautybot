const { Telegraf, Markup, Scenes, session } = require('telegraf');
const bot = require('./config/config');
const { startCommand } = require ("./keyboards/greatKey");
const { createScenes } = require ("./create")
const userDelete = require('./delete')
const { dateUsers } = require ("./dateUsers")
const geolib = require('geolib');
const util = require('util');
const { sendProfile } = require('./sendProfile')



bot.use((ctx, next) => {
    if (!ctx.session) {
        ctx.session = {};
    }
    if (!ctx.session.profiles) {
        ctx.session.profiles = []; // Инициализируйте массив анкет здесь
    }
    if (ctx.session.currentUserIndex === undefined) {
        ctx.session.currentUserIndex = 0;
    }
    next();
});



bot.use(session());
createScenes(bot)



bot.action(['mann', 'womann', 'anyy'], (ctx) => {

    if (!ctx.session) {
        ctx.session = {};
    }

    if (ctx.session.gendersearchChoice) {
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
        bot.action('delete', async (ctx) => {
            try {
                await userDelete.deleteFunction(ctx);
            } catch (err) {
                console.error(err);
                ctx.reply('У вас нету заполненной анкеты.');
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

        bot.action('complain', (ctx) => {
            // Пользователь выбрал "Пожаловаться на анкету", запросим у него текст жалобы
            ctx.session.complainStep = 'waiting_for_complaint';
            ctx.reply('Пожалуйста, напишите текст вашей жалобы:');
        });

// Middleware для сохранения состояния сессии
        bot.use((ctx, next) => {
            ctx.session = ctx.session || {};
            return next();
        });

        // Обработчик для текстовых сообщений
        bot.on('text', (ctx) => {
            if (ctx.session.complainStep === 'waiting_for_complaint') {
                // Пользователь написал жалобу, отправим её в админский чат
                const complaintText = ctx.message.text;
                bot.telegram.sendMessage(6638651166, `Жалоба от пользователя ${ctx.from.username || ctx.from.id}: ${complaintText}`);
                ctx.reply('Ваша жалоба была отправлена администратору.');
                // Сбросим состояние сессии
                ctx.session.complainStep = null;
            }
        });
        bot.action('search', async (ctx) => {
            try {
                await dateUsers(ctx);

            } catch (err) {
                console.error(util.inspect(err, { depth: null })); // Show complete error without limitation
                ctx.reply('Вы просмотрели все доступные анкеты');
            }
        });
        // bot.command('search', async (ctx) => {
        //     try {
        //         const userCity = await getCityForUser(ctx.from.id); // Получаем город пользователя из БД
        //         if (!userCity) {
        //             ctx.reply('Ваш город не установлен. Пожалуйста, установите ваш город.');
        //             return;
        //         }
        //
        //         const userCityCoordinates = citiesCoordinates[userCity]; // Получаем координаты города пользователя
        //         if (!userCityCoordinates) {
        //             ctx.reply(`Координаты для города ${userCity} не найдены.`);
        //             return;
        //         }
        //
        //         // Здесь должен быть код, который получает список пользователей из базы данных (вместо usersDatabase)
        //         // Предполагаем, что есть функция getUsersFromDb, которую нужно реализовать
        //         const usersFromDb = await dateUsers();
        //
        //         // Отфильтровываем пользователей, которые находятся в maxDistance от текущего пользователя
        //         const maxDistance = 50000; // максимальное расстояние в метрах
        //         const nearbyUsers = usersFromDb.filter(user => {
        //             const userCityCoordinates = citiesCoordinates[user.city];
        //             console.log('User city coordinates:', userCityCoordinates);
        //             if (!userCityCoordinates) return false;
        //
        //             const distance = geolib.getDistance(userCityCoordinates, userCityCoordinates);
        //             return distance <= maxDistance;
        //         });
        //
        //         // Формирование и отправка сообщения
        //         let message = nearbyUsers.length ? 'Ближайшие пользователи:\n' : 'Поблизости нет пользователей.\n';
        //         nearbyUsers.forEach(user => {
        //             message += `Username: ${user.username}, Age: ${user.age}, City: ${user.city}\n`;
        //         });
        //
        //         ctx.reply(message);
        //     } catch (error) {
        //         console.error(error);
        //         ctx.reply('Произошла ошибка при поиске пользователей.');
        //     }
        // });



    });



    bot.action('continue', (ctx) => {
        // Пользователь выбрал продолжение, убираем клавиатуру и вызываем функцию createScenes

        ctx.deleteMessage(); // Опционально: удаляем сообщение с клавиатурой
    });

    // // createScenes(bot)
    // console.log(ctx.match); // Добавлено для отладки
    // let gendersearchText = '';

    // Присваиваем строку из первого элемента массива ctx.match
    // const action = ctx.match[0];

    // switch (action) {
    //     case 'mann':
    //         gendersearchText = 'Парня';
    //         break;
    //     case 'womann':
    //         gendersearchText = 'Девушку';
    //         break;
    //     case 'anyy':
    //         gendersearchText = 'Любой пол';
    //         break;
    //     default:
    //         // Если ни одно из значений не совпадает, выбирается это
    //         gendersearchText = 'Любой пол';
    //         break;
    // }

    // ctx.session.gendersearchChoice = action;// Здесь также нужно использовать исправленную переменную action
    //
    // // Исправленная строка для ответа пользователю
    // ctx.reply(`Вы выбрали "${gendersearchText}"`);
    //
    // bot.action('mann', gendersearchCommand);
    //
    // bot.action('womann', gendersearchCommand);
    //
    // bot.action('anyy', gendersearchCommand);





// Обработчик команды /start
// bot.start((ctx) => {
//     console.log('Обработчик startCommand вызван'); // Добавьте эту строку
//     startCommand(ctx); // Вызываем функцию startCommand для отправки клавиатуры
// });

bot.hears('Вернуться в главное меню', startCommand);
bot.command('start', startCommand);

bot.launch()

