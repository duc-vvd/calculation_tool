import { executeTransaction } from './database/mysql/db_sql.js';
import moment from 'moment';

const query = `INSERT INTO rwa_calculate.report
(report_name, file_name, path, created)
VALUES('AK_Test_CR_00013_DETAIL_K_CCR.xlsx', 'AK_Test_CR_00013', '/output/AK_Test_CR_00013_DETAIL_K_CCR.xlsx', ${new moment().format(
    'YYYY-MM-DD  hh:mm:ss',
)});
`;

console.log(query);
// const query = `INSERT INTO rwa_calculate.file
// (file_name, path, created, username, relative_path)
// VALUES('423', '', '2022-07-27 06:36:06', 'anh.khong', NULL);
// `;

try {
    executeTransaction(query, (data, error) => {
        // console.log(error, data);
        // console.log(error);

        if (data?.length) {
            data.forEach((element) => {
                console.log(`=========>`, element);
            });
        }

        process.exit;
    });
} catch (error) {
    console.log('========================>', error.message);
}
