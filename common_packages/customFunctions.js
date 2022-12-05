const fs = require('fs');

const createDirectory = (dir) => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
};

const getOutputDir = () => {
    const date = new Date();

    return `./output/${date.toISOString().split("T")[0]}/${Math.round(date.getTime() / 1000)}`;
};

const clearString = (str) => {
    if (!str) return '';
    // Replace forbidden symbols in string

    return str
        .replace(/ /g, '_')
        .replace(/"/g, "'")
        .replace(/\//g, '_')
        .replace(/</g, '(')
        .replace(/>/g, ')')
        .replace(/:/g, '_')
        .replace(/\\/g, '_')
        .replace(/\|/g, '_')
        .replace(/\?/g, '.')
        .replace(/\*/g, '^')
        .replace(/'/g, '');
};

module.exports = {
    createDirectory,
    getOutputDir,
    clearString
}
