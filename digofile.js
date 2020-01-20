const digo = require('digo');
const path = require("path")
/**
 * 清理仓库
 */
exports.clean = () => {
    let dir = digo.parseArgs()[1] || 'lib';
    digo.cleanDir(path.resolve(process.cwd(), dir));
    digo.info(`清理${dir}完成`);
}