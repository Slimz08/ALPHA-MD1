const fs = require('fs-extra');
const { Sequelize } = require('sequelize');
if (fs.existsSync('set.env'))
    require('dotenv').config({ path: __dirname + '/set.env' });
const path = require("path");
const databasePath = path.join(__dirname, './database.db');
const DATABASE_URL = process.env.DATABASE_URL === undefined
    ? databasePath
    : process.env.DATABASE_URL;
module.exports = { session: process.env.SESSION_ID || 'eyJub2lzZUtleSI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiT0IyTUcxVi9HVTl6RVBtQlVBR0JmWWR2ZWI3KzgzbUtseC9QVW82bk9tYz0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiTWovVTVSaVlzREYvKzNCa3N2K3hTd1c2WmpXTUVDQmUrZkRJc3ppRlNFND0ifX0sInBhaXJpbmdFcGhlbWVyYWxLZXlQYWlyIjp7InByaXZhdGUiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJzS2k5ZlVid3ZqY3dXaU9iZlhycTZsMENVTWpoODhsSFdLcHU5dm8xbFdZPSJ9LCJwdWJsaWMiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJQYm1qZG03THZYN1hBcDEvMEdYSE1YZk1mTW9LNVViT3NZbDdTczliMldNPSJ9fSwic2lnbmVkSWRlbnRpdHlLZXkiOnsicHJpdmF0ZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IjhPU01kUTNXaEtHREtqZUc1R0UvM3ZJYVdVam0zOEpHeWRHaGR5ZzhoSE09In0sInB1YmxpYyI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IjAybVhoM29kb3MyVWN5NmVTMTd0eGJyc2tYYmwxcUZpNTJ1WEhVUEdtbEE9In19LCJzaWduZWRQcmVLZXkiOnsia2V5UGFpciI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiU09HYi9BT2ZVYk5TU0c0enVpODdkODNLSWVGWTJWVklMRGNvOVVjRFBYOD0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiTys0NnFLSzRsOHpsZzllM0lRK1RwajMrUGhxN3U5bWhqbXgyVXFubm9uOD0ifX0sInNpZ25hdHVyZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IkZoV1RhYXA1V0t4M2E5WXFUek1PU0VpemtZemRQWm5Vc2RWSHd5S0tXUjExNGJJa0Z4TElKSHVqMUpDUU9jNzVqaFR4b1ZOUm85RXp1K05paGR4ZUNRPT0ifSwia2V5SWQiOjF9LCJyZWdpc3RyYXRpb25JZCI6NjUsImFkdlNlY3JldEtleSI6IkdPMjN2dVpZVWxITHMyVW9FM2N2MlNwYjZ5M2JmakZEMDhnZk9VVGRYZFk9IiwicHJvY2Vzc2VkSGlzdG9yeU1lc3NhZ2VzIjpbXSwibmV4dFByZUtleUlkIjozMSwiZmlyc3RVbnVwbG9hZGVkUHJlS2V5SWQiOjMxLCJhY2NvdW50U3luY0NvdW50ZXIiOjAsImFjY291bnRTZXR0aW5ncyI6eyJ1bmFyY2hpdmVDaGF0cyI6ZmFsc2V9LCJkZXZpY2VJZCI6IkR0cExhR0txU1J5dXloQk41ZE9sdVEiLCJwaG9uZUlkIjoiMWZjZDZmZDUtMTkxOC00NTYzLThlNjUtNWNkN2QxMjJjZjFiIiwiaWRlbnRpdHlJZCI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6InpPbGErQU1pMzBteDBZMnBPbFB6dkIxU25nRT0ifSwicmVnaXN0ZXJlZCI6dHJ1ZSwiYmFja3VwVG9rZW4iOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJwWi9zOS9mRTZldEVSNGJGSTB3OVp3eHVCUzg9In0sInJlZ2lzdHJhdGlvbiI6e30sInBhaXJpbmdDb2RlIjoiTVA1MjJRQVoiLCJtZSI6eyJpZCI6IjI2MDk3Mzc2Mjk1MzoyNUBzLndoYXRzYXBwLm5ldCJ9LCJhY2NvdW50Ijp7ImRldGFpbHMiOiJDSWJxcjZ3RkVPMnl5N2dHR0FVZ0FDZ0EiLCJhY2NvdW50U2lnbmF0dXJlS2V5IjoiUWdHMXJTK3JVTGQ3b0liSnZxQWpKejMvdkN1Uk01REFOdGdrR2NvTXNnND0iLCJhY2NvdW50U2lnbmF0dXJlIjoiVTY1eGRqUDB2R2djUVZLNGNzcVpHSldBYkpLZGpkeHZDaW4zMXMzOUJuWGozd2svWFBVSHpGVzA1QkJtM1UyTW1OWVRod0F2UE5wL0RsTS9jSUI3QXc9PSIsImRldmljZVNpZ25hdHVyZSI6IkQydHNROFV6N2dNM1ZTUTNTWWRtaWZXbGgxWXgwZ0FSWnRxVkMrSEl2dng2U3B6alVuS29mODJCSW5SZzI0R0NrdC8xZDgxMS8zU2d3MXl3YTJaN0JBPT0ifSwic2lnbmFsSWRlbnRpdGllcyI6W3siaWRlbnRpZmllciI6eyJuYW1lIjoiMjYwOTczNzYyOTUzOjI1QHMud2hhdHNhcHAubmV0IiwiZGV2aWNlSWQiOjB9LCJpZGVudGlmaWVyS2V5Ijp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiQlVJQnRhMHZxMUMzZTZDR3liNmdJeWM5Lzd3cmtUT1F3RGJZSkJuS0RMSU8ifX1dLCJwbGF0Zm9ybSI6ImFuZHJvaWQiLCJsYXN0QWNjb3VudFN5bmNUaW1lc3RhbXAiOjE3MjkyODg1NzEsIm15QXBwU3RhdGVLZXlJZCI6IkFBQUFBSFpxIn0=',
    PREFIXE: process.env.PREFIX || ".",
    OWNER_NAME: process.env.OWNER_NAME || "𝛭𝛯𝐿𝐿𝛩",
    NUMERO_OWNER : process.env.NUMERO_OWNER || "260973762953",              
    AUTO_READ_STATUS: process.env.AUTO_READ_STATUS || "yes",
    AUTO_DOWNLOAD_STATUS: process.env.AUTO_DOWNLOAD_STATUS || 'no',
    BOT : process.env.BOT_NAME || '𝐀𝐋𝐏𝐇𝐀-𝐌𝐃',
    URL : process.env.BOT_MENU_LINKS || 'https://telegra.ph/file/0c351a67f1dffd1f34cf5.jpg',
    MODE: process.env.PUBLIC_MODE || "yes",
    PM_PERMIT: process.env.PM_PERMIT || 'no',
    HEROKU_APP_NAME : process.env.HEROKU_APP_NAME,
    HEROKU_APY_KEY : process.env.HEROKU_APY_KEY ,
    WARN_COUNT : process.env.WARN_COUNT || '3' ,
    ETAT : process.env.PRESENCE || 'yes',
    CHATBOT : process.env.PM_CHATBOT || 'no',
    DP : process.env.STARTING_BOT_MESSAGE || "yes",
    ADM : process.env.ANTI_DELETE_MESSAGE || 'yes',
    DATABASE_URL,
    DATABASE: DATABASE_URL === databasePath
        ? "postgresql://postgres:bKlIqoOUWFIHOAhKxRWQtGfKfhGKgmRX@viaduct.proxy.rlwy.net:47738/railway" : "postgresql://postgres:bKlIqoOUWFIHOAhKxRWQtGfKfhGKgmRX@viaduct.proxy.rlwy.net:47738/railway",
   
};
let fichier = require.resolve(__filename);
fs.watchFile(fichier, () => {
    fs.unwatchFile(fichier);
    console.log(`mise à jour ${__filename}`);
    delete require.cache[fichier];
    require(fichier);
});
