const { Telegraf, Markup, Scenes, session } = require('telegraf');


async function sendProfileToAdminChannel(ctx, profile) {
    try {
        const chatId = 6247308978; // Проверьте правильность этого ID
        const mediaType = profile.fileType === 'photo' ? 'photo' : 'video';
        const messageText = `Новая анкета!\nИмя: ${profile.name}\nФамилия: ${profile.surname}\nГород: ${profile.city}\nВозраст: ${profile.age}\nО себе: ${profile.info}\nИщу: ${profile.search}\nЦель знакомства: ${profile.goal}`;

        await ctx.telegram.sendMessage(chatId, messageText);

        if (profile.fileId) {
            await ctx.telegram.sendMediaGroup(chatId, [{
                type: mediaType,
                media: profile.fileId,
            }]);
        }
    } catch (error) {
        console.error(`Произошла ошибка: ${error}`);
    }
}
module.exports = {
    sendProfileToAdminChannel
}