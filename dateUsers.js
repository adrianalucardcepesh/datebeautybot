const db = require('./database/db-pool.js');
const { Telegraf, Markup, Scenes, session } = require('telegraf');
const { sendProfile } = require ("./sendProfile")

const dateUsers = async (ctx) => {
    ctx.session.currentProfileIndex = 0;

    let conn;

    try {
        conn = await db.getConnection();
        const profiles = await conn.query('SELECT * FROM users');

        if (!profiles || profiles.length === 0) {
            ctx.reply('Нет доступных анкет участников.');
            return;
        }

        ctx.session.profiles = profiles;
        ctx.session.currentProfileIndex = 0; // Установите индекс текущей анкеты на 0

        // После получения данных из базы, вызовите функцию sendProfile
        await sendProfile(ctx);

    } catch (err) {
        console.error('Ошибка при получении данных из базы данных:', err);
        ctx.reply('Произошла ошибка при получении данных из базы данных.');
    } finally {
        if (conn) conn.end();
    }
};

module.exports = {
    dateUsers,
};

