// «Чаты» — Figma 344:16231 / mobil 461:28717.

const AVATAR = '/img/models/model.jpg'

export const CHATS = [
    {
        id: 'ch-1',
        name: 'Катерина Журавлёва',
        role: 'Модель',
        avatar: AVATAR,
        time: '12:45',
        preview: 'Добрый день! После завершени...',
        unread: true,
        online: 'Была в сети 15:54',
    },
    {
        id: 'ch-2',
        name: 'Катерина Журавлёва',
        role: 'Модель',
        avatar: AVATAR,
        time: '12:45',
        preview: 'Здравствуйте! Не получается открыт...',
        unread: false,
        online: 'Была в сети 15:54',
    },
    {
        id: 'ch-3',
        name: 'Катерина Журавлёва',
        role: 'Модель',
        avatar: AVATAR,
        time: '12:45',
        preview: 'Здравствуйте! Не получается открыт...',
        unread: false,
        online: 'Была в сети 15:54',
    },
]

export const CHAT_MESSAGES = [
    {
        id: 1,
        own: true,
        text: 'Свяжитесь с нами, если вам нужна помощь в работе с платформой.',
        time: '12:45',
    },
    {
        id: 2,
        own: false,
        text: 'Здравствуйте! Не получается открыть переписку с исполнителем. При переходе в чат появляется пустой экран. Прошу помочь разобраться.',
        time: '12:45',
    },
]
