async function findUsersByAgeRange(ageMin, ageMax) {
    let connection;
    try {
        connection = await db.getConnection();
        const query = "SELECT name, age FROM users WHERE age BETWEEN ? AND ?";
        const rows = await connection.query(query, [ageMin, ageMax]);
        return rows;
    } catch (err) {
        console.error('Ошибка при выполнении запроса к базе данных:', err);
        throw err; // Перебрасываем ошибку для дальнейшей обработки
    } finally {
        if (connection) await connection.end();
    }
}
module.exports = {
    findUsersByAgeRange
};