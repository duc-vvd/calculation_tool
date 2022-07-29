import * as db from './database/db/index.js'

db.exec({
    action: 'SELECT',
    table: 'symbol',
    fields: ['symbol', 'company_name'],
    condition: {
        descriptors: [
            {
                field: 'class',
                val: 'equity',
                opt: '='
            }
        ]
    }
}, (data, err) => {
    if (err) {
        console.error(`error: ====`, err)
    }
    console.log(data);
})