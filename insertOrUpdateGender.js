const { Telegraf, Markup, Scenes, session } = require('telegraf');
const db = require('./database/db-pool');
const bot = require('./config/config');




    const insertOrUpdateGender = async (userId, gender) => {
        const conn = await db.getConnection();
        console.log(`Проверяем существование пользователя с ID: ${userId} и полом: ${gender}`);
        const userExists = await conn.query('SELECT 1 FROM users WHERE telegram_id = ?', [userId]);
        if (userExists.length > 0) {
            console.log(`Обновляем пол пользователя с ID: ${userId}`);
            await conn.query('UPDATE users SET gender = ? WHERE telegram_id = ?', [gender, userId]);
        } else {
            console.log(`Вставляем нового пользователя с ID: ${userId} и полом: ${gender}`);
            await conn.query('INSERT INTO users (telegram_id, gender) VALUES (?, ?)', [userId, gender]);
        }
        await conn.end(); // Не забудьте закрыть соединение после запроса
    }

    const insertOrUpdateGenderSearch = async (userId, gender_to_search) => {
        const conn = await db.getConnection();
        console.log(`Проверяем существование пользователя с ID: ${userId} и полом: ${gender_to_search}`);
        const userExists = await conn.query('SELECT 1 FROM users WHERE telegram_id = ?', [userId]);
        if (userExists.length > 0) {
            console.log(`Обновляем пол пользователя с ID: ${userId}`);
            await conn.query('UPDATE users SET gender_to_search = ? WHERE telegram_id = ?', [gender_to_search, userId]);
        } else {
            console.log(`Вставляем нового пользователя с ID: ${userId} и полом: ${gender_to_search}`);
            await conn.query('INSERT INTO users (telegram_id, gender_to_search) VALUES (?, ?)', [userId, gender_to_search]);
        }
        await conn.end(); // Не забудьте закрыть соединение после запроса
    }


module.exports = {
    insertOrUpdateGender,
    insertOrUpdateGenderSearch
};

