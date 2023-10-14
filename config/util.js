const bcrypt = require('bcrypt');


async function hashGenerate(text) {
    return await bcrypt.hash(text, 10);
}
module.exports = {
    hashGenerate
}