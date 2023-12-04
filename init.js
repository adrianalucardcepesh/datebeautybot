const { Telegraf, Markup, Scenes, session } = require('telegraf');
const bot = require('./config/config');
const { startCommand } = require ("./keyboards/greatKey");









// Обработчик команды /start
bot.start((ctx) => {
    console.log('Обработчик startCommand вызван'); // Добавьте эту строку
    startCommand(ctx); // Вызываем функцию startCommand для отправки клавиатуры
});

bot.hears('Вернуться в главное меню', startCommand);
bot.command('start', startCommand);

bot.launch()

