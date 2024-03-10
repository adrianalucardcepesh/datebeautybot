require('dotenv').config();
const { Telegraf, Markup, Scenes, session } = require('telegraf');
const bot = new Telegraf(process.env.BOT_TOKEN);

const { startCommand } = require ("./keyboards/greatKey");
// Используйте токен из переменных окружения для создания экземпляра Telegraf
const { deleteFunction } = require ("./delete")
const { createScenes } = require ('./scenes')
const util = require('util');
const { dateUsers } = require('./DateUsers')

// Теперь вы можете использовать метод .use на экземпляре bot

bot.hears('Вернуться в главное меню', startCommand);
bot.command('start', startCommand);
bot.use((ctx, next) => {
    if (!ctx.session) {
        ctx.session = {};
    }
    if (!ctx.session.profiles) {
        ctx.session.profiles = []; // Инициализируйте массив анкет здесь
    }
    if (ctx.session.currentUserIndex === undefined) {
        ctx.session.currentUserIndex = 0; // Инициализируйте индекс текущего пользователя
    }
    next();
});




createScenes(bot)

bot.use(session());


bot.action('fill_form', async (ctx) => {
    try {
        await ctx.answerCbQuery();
        await ctx.scene.enter('name');
    } catch (err) {
        console.error("Error responding to callback query:", err);
        // Optionally, inform the user (consider the usability implications)
        await ctx.reply('Oops! There was an issue processing your request.');
    }
});

bot.action('update', (ctx) => {
    startCommand(ctx);
});

bot.action('updater', (ctx) => {
    startCommand(ctx);
});

bot.action('delete', async (ctx) => {
    try {
        await deleteFunction(ctx);
    } catch (err) {
        console.error(err);
        ctx.reply('У вас нету заполненной анкеты.');
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

bot.launch();


