import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const sqlitePath = path.resolve(__dirname, '../database.sqlite');

const dialect = process.env.DB_DIALECT || 'sqlite';

let sequelize;

if (dialect === 'mysql') {
  sequelize = new Sequelize(
    process.env.DB_NAME || 'moneymanager',
    process.env.DB_USER || 'root',
    process.env.DB_PASSWORD || '',
    {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      dialect: 'mysql',
      logging: false,
      define: {
        timestamps: true,
        freezeTableName: true
      }
    }
  );
} else {
  // Default: SQLite (file-based database, zero installation required)
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: sqlitePath,
    logging: false,
    define: {
      timestamps: true,
      freezeTableName: true
    }
  });
}

export default sequelize;
