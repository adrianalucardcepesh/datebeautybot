const { Telegraf, Markup, Scenes, session } = require('telegraf');
const bot = require('./config/config');
const { startCommand } = require ("./keyboards/greatKey");
const { createScenes } = require ("./create/create")



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

    if (ctx.session.genderChoice) {
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
    await ctx.scene.enter('name');
});




    bot.action('reset', (ctx) => {
        // Предполагаем, что функция startCommand(ctx) начинает процедуру заново
        startCommand(ctx);
        ctx.deleteMessage(); // Опционально: удаляем сообщение с клавиатурой
    });



    bot.action('continue', (ctx) => {
        // Пользователь выбрал продолжение, убираем клавиатуру и вызываем функцию createScenes

        ctx.deleteMessage(); // Опционально: удаляем сообщение с клавиатурой
    });

    // // createScenes(bot)
    // console.log(ctx.match); // Добавлено для отладки
    // let genderText = '';

    // Присваиваем строку из первого элемента массива ctx.match
    // const action = ctx.match[0];

    // switch (action) {
    //     case 'mann':
    //         genderText = 'Парня';
    //         break;
    //     case 'womann':
    //         genderText = 'Девушку';
    //         break;
    //     case 'anyy':
    //         genderText = 'Любой пол';
    //         break;
    //     default:
    //         // Если ни одно из значений не совпадает, выбирается это
    //         genderText = 'Любой пол';
    //         break;
    // }

    // ctx.session.genderChoice = action;// Здесь также нужно использовать исправленную переменную action
    //
    // // Исправленная строка для ответа пользователю
    // ctx.reply(`Вы выбрали "${genderText}"`);
    //
    // bot.action('mann', genderCommand);
    //
    // bot.action('womann', genderCommand);
    //
    // bot.action('anyy', genderCommand);





// Обработчик команды /start
// bot.start((ctx) => {
//     console.log('Обработчик startCommand вызван'); // Добавьте эту строку
//     startCommand(ctx); // Вызываем функцию startCommand для отправки клавиатуры
// });

bot.hears('Вернуться в главное меню', startCommand);
bot.command('start', startCommand);

bot.launch()

