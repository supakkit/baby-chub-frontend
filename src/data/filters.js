export const filters = {
    'age': [
        { min: 3, max: 4 },
        { min: 4, max: 6 },
        { min: 6, max: 9 },
        { min: 9, max: 12 },
        { min: 12, max: Infinity },    
    ],
    'price': [
        { min: 0, max: 100 },
        { min: 101, max: 500 },
        { min: 501, max: 1000 },
        { min: 1001, max: 2000 },
        { min: 2001, max: Infinity },
    ],
    'type': ['application', 'audiobook', 'course', 'ebook', 'worksheet'],
    'subject': ['coding', 'math', 'language', 'science', 'english', 'others', 'skill', 'art'],
    
};
