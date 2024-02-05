const createProfileData = require('../create/createProfileData.js');
const { showProfile } =  require('../result.js')
const createAndShowProfile = async (ctx, fileId, fileType, savedPath, data) => {
    const telegramId = String(ctx.from.id);

    try {
        // Вызываем функцию insertProfileData для вставки данных в базу данных
        await createProfileData.createProfileData(ctx, {
            ...ctx.session,
            fileId,
            fileType,
            filePath: savedPath,
            username: ctx.from.username,
            telegramId: telegramId,
            ...data
        });

        await showProfile(ctx);
    } catch (error) {
        console.error('Error updating and showing profile:', error);
        ctx.reply('Произошла ошибка при обновлении данных и отображении профиля.');
    }
};

module.exports = {
    createAndShowProfile,
};