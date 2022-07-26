const arr = [
    'Item',
    'Quarter n-19',
    'Quarter n-18',
    'Quarter n-17',
    'Quarter n-16',
    'Quarter n-15',
    'Quarter n-14',
    'Quarter n-13',
    'Quarter n-12',
    'Quarter n-11',
    'Quarter n-10',
    'Quarter n-9',
    'Quarter n-8',
    'Quarter n-7',
    'Quarter n-6',
    'Quarter n-5',
    'Quarter n-4',
    'Quarter n-3',
    'Quarter n-2',
    'Quarter n-1',
    'Quarter n',
];

const obj = arr.reduce((prev, cur, i) => {
    prev[cur] = i;
    return prev;
}, {});

console.log(JSON.stringify(obj));
