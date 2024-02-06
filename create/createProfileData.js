const db = require('../database/db-pool.js');


async function checkIfUserExists(telegramId) {
    let conn;
    try {
        conn = await db.getConnection();
        const sql = 'SELECT * FROM users WHERE telegram_id = ?';
        const result = await conn.query(sql, [telegramId]);
        console.log(result); // Add this line to inspect the raw result
        const [results] = result;
        return Array.isArray(results) && results.length > 0; // Check if 'results' is an array before accessing 'length'
    } catch (error) {
        console.error('Error fetching data from the database:', error);
        throw error;
    } finally {
        if (conn) {
            conn.release();
        }
    }
}

const createProfileData = async (ctx, { telegramId, fileId, filePath, ...data }) => {
    try {
        const userExists = await checkIfUserExists(ctx.from.id);

        if (userExists) {
            ctx.reply('Анкету можно заполнить только один раз!\n' +
                'Если вы хотите изменить анкету, нажмите на кнопку "Изменить анкету"');
            return;
        }

        const conn = await db.getConnection();
        let fileType;

        if (ctx.message.photo) {
            fileType = 'photo';
        } else if (ctx.message.video) {
            fileType = 'video';
        }

        // Вставляем данные анкеты в таблицу users
        const insertSql = `
            INSERT INTO users
            (telegram_id, username, name, surname, age, info, search, fileId, filePath, fileType)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE
                                     username = VALUES(username),
                                     name = VALUES(name),
                                     surname = VALUES(surname),
                                     age = VALUES(age),
                                     info = VALUES(info),
                                     search = VALUES(search),
                                     fileId = VALUES(fileId),
                                     filePath = VALUES(filePath),
                                     fileType = VALUES(fileType)
        `;
        await conn.query(insertSql, [
            ctx.from.id,
            ctx.from.username,
            data.name,
            data.surname,
            data.age,
            data.info,
            data.search,
            data.fileId, // Предполагается, что эти поля уже содержат правильные значения
            data.filePath,
            fileType // Предполагается, что fileType переменная уже определена и содержит правильное значение
        ]);
        conn.release();
    } catch (error) {
        // Обработка ошибок, включая дублирование записей
        console.error('Ошибка вставки данных: ', error);
        ctx.reply('Произошла ошибка при сохранении данных.');
    }
};

module.exports = {
    createProfileData
}