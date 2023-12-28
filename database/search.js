const { Telegraf, Markup, Scenes, session } = require('telegraf');
const axios = require('axios');
const db = require('../database/db-pool');



const ITEMS_PER_PAGE = 10; // Define how many items you want per page
async function renderCityPage(ctx, currentPage) {
    try {
        // Get cities list from API
        const response = await axios.get('https://raw.githubusercontent.com/adrianalucardcepesh/russian-cities-json/main/cities.json');

        // Sort cities alphabetically
        const cities = response.data.map(city => city.name).sort((a, b) => a.localeCompare(b));

        // Calculate cities for the current page
        const pageCities = cities.slice(currentPage * ITEMS_PER_PAGE, (currentPage + 1) * ITEMS_PER_PAGE);

        // Create city buttons for the current page
        const cityButtons = pageCities.map(city =>
            Markup.button.callback(city, `city_select_${city}`)
        );

        // Create navigation buttons
        const navigationButtons = [];
        if (currentPage > 0) {
            navigationButtons.push(Markup.button.callback('⬅️ Назад', `page_${currentPage - 1}`));
        }
        if ((currentPage + 1) * ITEMS_PER_PAGE < cities.length) {
            navigationButtons.push(Markup.button.callback('Вперед ➡️', `page_${currentPage + 1}`));
        }

        // Combine city buttons with navigation buttons
        const keyboard = Markup.inlineKeyboard([...cityButtons, ...navigationButtons], { columns: 2 }).resize();

        await ctx.reply('Выберите свой город: 🏙', keyboard);

        let text = 'Чтобы быстрее найти ваш город, напишите его название снизу 👇';
        await ctx.reply(text, {
            reply_markup: {
                keyboard: [
                    [{ text: 'Вернуться в главное меню' }],
                ],
                resize_keyboard: true,
                one_time_keyboard: true,
            },
        });
    } catch (error) {
        console.error('Error fetching city data:', error);
        await ctx.reply('An error occurred while fetching the list of cities.');
    }
    ctx.scene.enter('age');
}

module.exports = {
    insertCityForUser
};


// Initialize a base scene for 'city'
// В вашем коде для cityScene или в другом месте, где создаются кнопки городов
cityScene.action(/^city_select_(.+)$/, async (ctx) => {
    const selectedCity = ctx.match[1];
    const userId = ctx.from.id; // Telegram ID пользователя, если он совпадает с вашим идентификатором в бд; если нет, вам может потребоваться дополнительная логика для получения идентификатора пользователя
    try {
        await insertCityForUser(userId, selectedCity);
        await ctx.reply(`Вы выбрали город: ${selectedCity}`);
    } catch (error) {
        // Логируем ошибку и сообщаем пользователю
        console.error('Ошибка при вставке города в базу данных:', error);
        await ctx.reply('Произошла ошибка при сохранении вашего выбора города.');
    }

    // Закрытие inline-клавиатуры
    await ctx.answerCbQuery();
})

async function insertCityForUser(userId, selectedCity) {
    let conn;
    try {
        conn = await db.getConnection();
        // Here we're assuming the table is named 'users' and has columns 'id' for userID and 'city' for the city
        // Also assuming 'id' is a primary key or unique field so "upsert" can be done using ON DUPLICATE KEY UPDATE
        const query = `
            INSERT INTO users (id, city)
            VALUES (?, ?) ON DUPLICATE KEY UPDATE city = VALUES(city)
        `;
        const result = await conn.query(query, [userId, selectedCity]);
        return result;
    } catch (error) {
        console.error('An error occurred while inserting/updating the city for the user:', error);
        throw error;
    } finally {
        // Always close connection whether query was successful or not
        if (conn) conn.release();
    }
}


cityScene.enter(async (ctx) => {
    await renderCityPage(ctx, 0); // Start page at 0
});




// Function for rendering search results of cities
async function searchForCity(searchQuery, ctx) {
    try {

        // Fetch cities list from API
        const response = await axios.get('https://raw.githubusercontent.com/adrianalucardcepesh/russian-cities-json/main/cities.json');

        // Filter cities that include the search query
        const searchResults = response.data
            .map(city => city.name)
            .filter(cityName => cityName.toLowerCase().includes(searchQuery.toLowerCase()));

        // Limit the number of search results
        const limitedResults = searchResults.slice(0, ITEMS_PER_PAGE);

        // Create city buttons from search results
        const cityButtons = limitedResults.map(city =>
            Markup.button.callback(city, `city_select_${city}`)
        );

        // Prepare the keyboard with search results
        const keyboard = Markup.inlineKeyboard(cityButtons, { columns: 1 }).resize();

        if (cityButtons.length === 0) {
            await ctx.reply('К сожалению, не найдено городов, соответствующих вашему запросу. \nПопробуйте другое название.');
        } else {
            await ctx.reply('Результаты поиска:', keyboard);
        }

    } catch (error) {
        console.error('Error while searching for cities:', error);
        await ctx.reply('Произошла ошибка при поиске города. Пожалуйста, попробуйте снова.');
    }
}

// ...cityScene and renderCityPage code...

cityScene.on('text', async (ctx) => {
    // Use the message text as a query for searching cities
    await searchForCity(ctx.message.text, ctx);
});