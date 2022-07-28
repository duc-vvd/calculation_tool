import file from './file/index.js';

export default function (app, domain) {
    file(app, `/${domain}/file`);
}
