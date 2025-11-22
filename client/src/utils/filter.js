const BAD_WORDS = ['bad', 'word', 'ugly', 'hate', 'stupid'];

export const filterMessage = (text) => {
    let filtered = text;
    BAD_WORDS.forEach(word => {
        const regex = new RegExp(`\\b${word}\\b`, 'gi');
        filtered = filtered.replace(regex, '***');
    });
    return filtered;
};
