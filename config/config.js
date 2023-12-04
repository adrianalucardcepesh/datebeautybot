// config.js
const { Telegraf } = require('telegraf');

// const botToken = '6923424734:AAGDu6QRV3o0SI485MKh7G8o9G5oDm5aP8I'; // Замените на свой токен

const botToken = '6538687089:AAFc5JkevqmFzQNAFt9nSS7iJN68kig_iYQ'; // Замените свой токен





const bot = new Telegraf(botToken);

module.exports = bot;