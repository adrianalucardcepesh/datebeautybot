const db = require('./database/db-pool.js');


const deleteUser = async (userId) => {
    let conn;

    try {
        conn = await db.getConnection();
        const result = await conn.query('DELETE FROM users WHERE telegram_id = ?', [userId]);

        if (result.affectedRows > 0) {
            return true; // Успешно удалено
        } else {
            return false; // Пользователь не найден
        }
    } catch (err) {
        console.error(err);
        return false; // Ошибка при удалении пользователя
    } finally {
        if (conn) conn.end();
    }
};





const deleteFunction = async (ctx) => {
    const userId = ctx.from.id; // Получение userId из объекта ctx
    let userDeleted = false;
    try {
        userDeleted = await deleteUser(userId);
    } catch (err) {
        console.error(err);
    }
    if (userDeleted) {
        ctx.reply('Ваша анкета успешно удалена');
    } else {
        ctx.reply('У вас нету заполненной анкеты');
    }
};



module.exports = {
    deleteFunction
};