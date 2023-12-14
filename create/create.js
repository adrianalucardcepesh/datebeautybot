const { Telegraf, Markup, Scenes, session } = require('telegraf');
// Сцена 'city'
const axios = require('axios');

const { startCommand } = require ("../keyboards/greatKey");

const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');

function createScenes(bot) {

    const cityScene = new Scenes.BaseScene('city');

    cityScene.enter(async (ctx) => {
        renderCityPage(ctx, 0); // Страница начинается с 0
    });
    async function renderCityPage(ctx, currentPage) {
        const ITEMS_PER_PAGE = 10; // Define how many items you want per page
        try {
            // Get cities list from API
            const response = await axios.get('https://raw.githubusercontent.com/adrianalucardcepesh/russian-cities-json/main/cities.json');

            // Sort cities alphabetically
            const cities = response.data.map(city => city.name).sort((a, b) => a.localeCompare(b));

            // Calculate cities for the current page
            const pageCities = cities.slice(currentPage * ITEMS_PER_PAGE, (currentPage + 1) * ITEMS_PER_PAGE);

            // Create city buttons for the current page
            const cityButtons = pageCities.map((city, index) =>
                Markup.button.callback(city, `city_select_${index + currentPage * ITEMS_PER_PAGE}`));

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

            await ctx.reply('Выберите свой город: 🏙 ', keyboard);

            let text = `Что бы быстрее найти свой город, напишите его название: 👇  `;
            ctx.reply(text, {
                reply_markup: {
                    keyboard: [
                        [{text: 'Вернуться в главное меню'}],
                    ],
                    resize_keyboard: true,
                    one_time_keyboard: true,
                },
            });


        } catch (error) {
            console.error('Error fetching city data:', error);
            await ctx.reply('An error occurred while fetching the list of cities.');
        }
    }

    const ITEMS_PER_PAGE = 5;


    cityScene.on('text', async (ctx) => {
        // Ваша функция поиска города здесь
        await searchForCity(ctx.message.text, ctx);
    });

    async function searchForCity(query, ctx) {
        try {
            const response = await axios.get('https://raw.githubusercontent.com/adrianalucardcepesh/russian-cities-json/main/cities.json');
            const cities = response.data.map(city => city.name).sort((a, b) => a.localeCompare(b));

            // Фильтруем массив городов основываясь на запросе пользователя
            const searchResults = cities.filter(city => city.toLowerCase().includes(query.toLowerCase()));

            if (searchResults.length === 0) {
                // Ничего не найдено. Можете сообщить об этом пользователю.
                await ctx.reply('Город не найден. Попробуйте написать что-то еще.');
                return;
            }

            // Подразумевается, что currentPage уже определена (например, в контексте пользователя)
            let currentPage = 0; // Это значение могло быть получено из ctx.session или другой переменной, отвечающей за состояние сессии

            // Создаем кнопки для результатов поиска, используя новую логику
            const cityButtons = searchResults.map((city, index) =>
                Markup.button.callback(city, `select_${index + currentPage * ITEMS_PER_PAGE}`)
            );

            // Клавиатура с результатами поиска
            const keyboard = Markup.inlineKeyboard(cityButtons, { columns: 2 });

            await ctx.reply('Результаты поиска 👀 : \n\n ' + 'Теперь выбирите его 🤙🏼 ', keyboard);
        } catch (error) {
            console.error('Error searching cities:', error);
            await ctx.reply('Произошла ошибка во время поиска города.');
        }
    }
// Обрабатываем callback от нажатия кнопок городов
    cityScene.action(/select_(\d+)/, async (ctx) => {
        // Добавьте здесь логику обработки выбранного города...
        await ctx.answerCbQuery();
    });

// Обрабатываем callback от кнопок навигации
    cityScene.action(/page_(\d+)/, async (ctx) => {
        const newPage = parseInt(ctx.match[1]); // Получаем номер страницы из callback_data
        await renderCityPage(ctx, newPage); // Перерендериваем страницу с новым номером страницы
        await ctx.answerCbQuery();
    });


// Позже в коде можете добавить обработчики для кнопок, например:
    cityScene.action(/.*/, (ctx) => {
        const selectedCity = ctx.callbackQuery.data;
        ctx.reply(`Вы выбрали город: ${selectedCity}`);
    });
// Обработчик для callback_query в сцене
    cityScene.on('callback_query', (ctx) => {
        // Сохраняем выбранный город в сессию
        ctx.session.city = ctx.callbackQuery.data;
        ctx.answerCbQuery(`Вы выбрали город: ${ctx.session.city}`);
        // Переходим в следующую сцену
        ctx.scene.enter('ageScene');
    });


// Сцена 'age'
    const ageScene = new Scenes.BaseScene('age');
    ageScene.enter((ctx) => ctx.reply('Ваш возраст :'));
    ageScene.on('text', (ctx) => {
        const age = Number(ctx.message.text);

        if (isNaN(age)) {
            ctx.reply('Введите возраст в виде числа');
            return;
        }

        if (age < 18) {
            ctx.reply('Вам должно быть больше 18 лет');
            return;
        } else if (age > 60) {
            ctx.reply('Вам должно быть меньше 60 лет');
            return;
        }

        ctx.session.age = age;

        ctx.scene.enter('info');
    });


// Сцена 'info'
    const infoScene = new Scenes.BaseScene('info');

    infoScene.enter((ctx) => {
        ctx.reply('Напишите немного о себе:');
    });

    infoScene.on('text', (ctx) => {
        if (!ctx.message.text) {
            ctx.reply('Эта информация обязательна для заполнения!');
            return;
        }

        ctx.session.info = ctx.message.text;

        ctx.scene.enter('search');
    });

// Сцена 'search'
    const searchScene = new Scenes.BaseScene('search');
    searchScene.enter((ctx) => ctx.reply('Опишите кратко кого или что вы ищите: друга, партнера на вечер, отношения, делового партнера, товарища по переписке, работу, финансовую или моральную помощь и т.д'));
    searchScene.on('text', (ctx) => {
        ctx.session.search = ctx.message.text;
        ctx.scene.enter('goal');

    });

    const goalScene = new Scenes.BaseScene('goal');
    goalScene.enter((ctx) => ctx.reply('Напишите цель знакомства:'));
    goalScene.on('text', (ctx) => {
        ctx.session.goal = ctx.message.text;
        ctx.scene.enter('media');
    });


    const mediaScene = new Scenes.BaseScene('media');


    mediaScene.enter((ctx) => {


        ctx.reply('Загрузите своё фото 🖼 или видео 🎥 (mp4) \n \n Макс. размер фото должен составлять не больше - 5 МБ ' +
            '\n Макс. размер видео должен составлять не больше - 50 МБ' +
            '\n \n Внимание! ⚠️ \n \n  Если вы загружаете фото или видео на котором изображение другого человека (т.е. не ваше фото), вы моментально попадаете в черный бан 🚫 нашего бота. \n \n Загрузить можно только одну фотографию или видео! ‍✈️' +
            '\n \n Можете использовать:\n' +
            '\n' +
            '⚧ Свою фотографию \n' +
            '\n' +
            '⚧ Аниме картинку\n' +
            '\n' +
            '⚧ Фотографии на которых нету лиц людей\n' +
            '\n' +
            '⚧ Мемасики\n' +
            '\n' +
            '⚧ Отрывки из фильмов\n' +
            '\n' +
            '⚧ Мем-видео\n' +
            '\n' +
            '⚧ Ваше Tik-Tok видео (mp4)\n' +
            '\n' +
            '⚧ Анимированные стикеры');
    });

    mediaScene.on(['photo', 'video'], async (ctx) => {

        const MAX_VIDEO_SIZE = 50 * 1024 * 1024; // Максимальный размер видео (50 MB)
        const MAX_PHOTO_SIZE = 5 * 1024 * 1024; // Максимальный размер фото (5 МБ)

        const fileId = ctx.message.video ? ctx.message.video.file_id : ctx.message.photo[ctx.message.photo.length - 1].file_id;
        const fileSize = ctx.message.video ? ctx.message.video.file_size : ctx.message.photo[ctx.message.photo.length - 1].file_size;


        const validVideoExtensions = ['mp4'];
        const validPhotoExtensions = ['jpg', 'jpeg', 'png', 'gif'];

        const isVideo = !!ctx.message.video; // Проверяем, является ли файл видео
        const isPhoto = !!ctx.message.photo; // Проверяем, является ли файл фото

        const fileType = isVideo ? 'video' : 'photo';


        if (isVideo) {
            const extension = fileExtension(fileId);
            if (extension && !validVideoExtensions.includes(extension.toLowerCase())) {
                ctx.reply('Формат видео должен быть MP4.');
                return;
            }
        } else if (isPhoto) {
            const extension = fileExtension(fileId);
            if (extension && !validPhotoExtensions.includes(extension.toLowerCase())) {
                ctx.reply('Формат фото должен быть JPG, JPEG, PNG или GIF.');
                return;
            }
        }


        console.log('MAX_VIDEO_SIZE в байтах:', MAX_VIDEO_SIZE);
        console.log('MAX_PHOTO_SIZE в байтах:', MAX_PHOTO_SIZE);
        console.log('Размер загруженного файла в байтах:', fileSize);
        console.log('Размер загруженного файла:', fileSize);

        let errorMessage = null;

        // Проверяем размер файла и формат
        if (fileSize > MAX_PHOTO_SIZE && fileType === 'photo') {
            errorMessage = '\n Внимание! ⚠ \n \n  Макс. размер фото должен составлять не больше - 5 МБ \n \n Загрузить можно только одну фотографию или видео! ‍✈️';
        }
        if (fileSize > MAX_PHOTO_SIZE && fileType === 'video') {
            errorMessage = '\n Внимание! ⚠ \n \n  Макс. размер видео не больше 50 МБ \n \n  Загрузить можно только одну фотографию или видео! ‍✈️';
        }
        if (ctx.session.uploadedFile) {
            ctx.reply('Вы уже загрузили файл. Вы можете загрузить только один файл.');
            return;
        }


        if (errorMessage) {
            ctx.reply(errorMessage);
            await ctx.scene.reenter(); // Повторно вызываем текущую сцену
            // В этом месте вы можете добавить дополнительные инструкции для пользователя
        } else {
            // Если размер и формат файла прошли валидацию, продолжаем его обработку и загрузку в базу данных
            const file = await ctx.telegram.getFile(fileId);
            const url = `https://api.telegram.org/file/bot6429157048:AAHgx-wS_eqF73lMshCAcHJHI3k_xf516Hk/${file.file_path}`;
            const response = await fetch(url);
            const buffer = await response.buffer();
            const savedPath = path.join(__dirname, 'downloads', fileId);
            fs.writeFileSync(savedPath, buffer);

            await createAndShowProfile(ctx, fileId, fileType, savedPath, ctx.session);

        }
    });

    const Stage = new Scenes.Stage([
        cityScene,
        ageScene,
        infoScene,
        searchScene,
        goalScene,
        mediaScene,
    ]);

    bot.use(Stage.middleware());

    return Stage;
}
function checkUploadedFiles(ctx) {
    if (!ctx.session.uploadedFiles) {
        ctx.session.uploadedFiles = [];
    }

    if (ctx.session.uploadedFiles.length > 0) {
        ctx.reply('Вы уже загрузили файл. Вы можете загрузить только один файл.');
        return true;
    }
    return false;
}

const fileExtension = (fileId) => {
    const parts = fileId.split('.');
    if (parts.length > 1) {
        return parts[parts.length - 1].toLowerCase();
    }
    return null;
};

module.exports = {
    createScenes
};
