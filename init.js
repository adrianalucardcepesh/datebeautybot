const { Telegraf, Markup, Scenes, session } = require('telegraf');
const bot = require('./config/config');
const { startCommand } = require ("./keyboards/greatKey");


bot.use((ctx, next) => {
    if (!ctx.session) {
        ctx.session = {};
    }
    if (!ctx.session.profiles) {
        ctx.session.profiles = []; // Инициализируйте массив анкет здесь
    }
    next();
});



bot.action(['mann', 'womann', 'anyy'], (ctx) => {

    if (ctx.session.genderChoice) {
        ctx.reply('Вы уже сделали свой выбор пола. Давайте продолжим.');
        return;
    }


    console.log(ctx.match); // Добавлено для отладки
    let genderText = '';

    // Присваиваем строку из первого элемента массива ctx.match
    const action = ctx.match[0];

    switch (action) {
        case 'mann':
            genderText = 'Парня';
            break;
        case 'womann':
            genderText = 'Девушку';
            break;
        case 'anyy':
            genderText = 'Любой пол';
            break;
        default:
            // Если ни одно из значений не совпадает, выбирается это
            genderText = 'Любой пол';
            break;
    }

    ctx.session.genderChoice = action;// Здесь также нужно использовать исправленную переменную action

    // Исправленная строка для ответа пользователю
    ctx.reply(`Вы выбрали "${genderText}" ️\n\nТеперь напишите свой город 🏙:`);
});



// Обработчик команды /start
bot.start((ctx) => {
    console.log('Обработчик startCommand вызван'); // Добавьте эту строку
    startCommand(ctx); // Вызываем функцию startCommand для отправки клавиатуры
});

bot.hears('Вернуться в главное меню', startCommand);
bot.command('start', startCommand);

bot.launch()

