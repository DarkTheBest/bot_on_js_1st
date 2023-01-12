const TelegramAPI = require('node-telegram-bot-api');
const {gameOptions,gameRetry} = require('./options.js');


const TOKEN = '5702228046:AAGc79FFHvdUgjdxI-ajhwxgsV1PGAlfM-Y';

const bot = new TelegramAPI(TOKEN, {polling: true});

const help_cmd = "<b>/start</b> - <em>начало работы бота</em> \r\n /<b>help</b> - <em>список команд</em>";

const chats = {};


const start = () => {
    // подсказка с командами 
bot.setMyCommands([
    {command: '/start', description: "Начальное приветствие"},
    {command: '/help', description: "Навигация по командам"},
    {command: '/game', description: 'Игра "угадай число"'}
]);
    bot.on('message', async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;
    
        if (text === "/start") {
            return bot.sendMessage(chatId, 'Привет, хозяин, теперь на js пробуешь?)');
        }
        else if (text === "/help") {
            return bot.sendMessage(chatId, help_cmd,{parse_mode: 'HTML'});
        }
        if (text === "/game") {
            await bot.sendMessage(chatId, 'Сейчас я загадаю цифру от 0 до 5, а ты его отгадай.');
            const randomDigit = Math.floor(Math.random() * 5);
            chats[chatId] = randomDigit;
            return bot.sendMessage(chatId, 'Отгадывай',gameOptions);
        }

        return bot.sendMessage(chatId, 'Далбоеб, на понятном языке пиши.');
    
    });

    bot.on("callback_query",msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id;
        
        if (data == 'Сыграть снова') {
            bot.sendMessage(chatId, 'Сейчас я загадаю цифру от 0 до 5, а ты его отгадай.');
            const randomDigit = Math.floor(Math.random() * 5);
            chats[chatId] = randomDigit;
            return bot.sendMessage(chatId, 'Отгадывай',gameOptions);
        }

        if (data == chats[chatId]) {
            bot.sendMessage(chatId, `Поздравляю, ты отгадал цифру ${chats[chatId]}`,gameRetry);
        }
        else {
            bot.sendMessage(chatId, `Ты не отгадал, правильный ответ ${chats[chatId]}`,gameRetry);
        }
    });
};

start();











