// const { Telegraf, Markup, Scenes, session } = require('telegraf');
// const db = require('./database/db-pool'); // Убедитесь в правильности пути к вашему модулю пула БД
//
//
//
// async function loadUsersToSession(ctx) {
//     let conn;
//     try {
//         // Получаем соединение с базой данных
//         conn = await db.getConnection();
//         // Текущий пользователь
//         const currentUserTelegramId = String(ctx.from.id);
//
//         // Выполняем запрос к базе данных для получения пола пользователя и его предпочтений
//         const userInfoQuery = 'SELECT gender, gendersearch FROM users WHERE telegram_id = ?';
//         const [[currentUser]] = await conn.query(userInfoQuery, [currentUserTelegramId]);
//
//         // Проверяем, была ли найдена информация о пользователе
//         if (!currentUser) {
//             console.log('Текущий пользователь не найден');
//             return;
//         }
//
//         // Если текущий пользователь ищет не любой пол, добавляем соответствующее условие в запрос
//         let usersQuery = 'SELECT * FROM users WHERE telegram_id != ? ';
//         const queryParams = [currentUserTelegramId];
//
//
//         // Составляем запрос в зависимости от предпочтений пользователя
//         if (currentUser.gendersearch !== 'любой') {
//             usersQuery += 'AND gender = ? ';
//             queryParams.push(currentUser.gendersearch);
//         }
//
//         // Выполняем запрос и получаем список пользователей, соответствующих критериям
//         const [users] = await conn.query(usersQuery, queryParams);
//
//         // Проверяем, найдены ли пользователи
//         if (users.length > 0) {
//             // Предполагается, что users - это массив пользователей подходящих по критериям
//             ctx.session.users = users; // Сохраняем пользователей в сессию
//             ctx.session.currentUserIndex = 0; // Инициализируем индекс начального пользователя для
//         } else {
//             console.log('Подходящие пользователи в базе отсутствуют');
//         }
//     } catch (e) {
//         console.error('Ошибка при загрузке пользователей:', e);
//     } finally {
//         if (conn) await conn.end();
//     }
// }
//
//
// module.exports = {
//     loadUsersToSession
// };