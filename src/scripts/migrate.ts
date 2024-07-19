import fs from 'fs';
import path from 'path';
import { AppDataSource } from '../data-source';

interface Migration {
    depends_upon?: string;
    script: string;
    type: 'INSTALL' | 'UPDATE';
    id: string;
}

const migrationsPath = path.join(__dirname, '../migration');

const loadMigrations = (type: 'INSTALL' | 'UPDATE'): Migration[] => {
    const migrations: Migration[] = [];
    fs.readdirSync(migrationsPath).forEach((migrationDir) => {
        const migrationFiles = fs.readdirSync(path.join(migrationsPath, migrationDir));
        migrationFiles.forEach((file) => {
            const filePath = path.join(migrationsPath, migrationDir, file);
            const migration = JSON.parse(fs.readFileSync(filePath, 'utf8')) as Omit<Migration, 'id'>;
            if (migration.type === type) {
                migrations.push({ ...migration, id: migrationDir });
            }
        });
    });

    // Sort migrations based on their dependencies
    migrations.sort((a, b) => {
        if (!a.depends_upon) return -1;
        if (!b.depends_upon) return 1;
        return a.depends_upon.localeCompare(b.depends_upon);
    });

    return migrations;
};

const runMigrations = async (type: 'INSTALL' | 'UPDATE') => {
    await AppDataSource.initialize()
        .then(() => {
            console.log("Database connection successful");
        })
        .catch((error) => console.log(error));

    const queryRunner = AppDataSource.createQueryRunner();
    const executedMigrations = new Set<string>(); // Track executed migrations to handle dependencies

    const migrations = loadMigrations(type);

    const executeMigration = async (migration: Migration) => {
        if (migration.depends_upon && !executedMigrations.has(migration.depends_upon)) {
            const dependency = migrations.find(m => m.id === migration.depends_upon);
            if (dependency) {
                await executeMigration(dependency);
            }
        }

        if (!executedMigrations.has(migration.id)) {
            console.log(`Executing ${migration.id}`);
            await queryRunner.query(migration.script);
            executedMigrations.add(migration.id);
        }
    };

    for (const migration of migrations) {
        await executeMigration(migration);
    }

    await queryRunner.release();
};

const main = async () => {
    const type = process.argv[2] as 'INSTALL' | 'UPDATE';
    if (!type || (type !== 'INSTALL' && type !== 'UPDATE')) {
        console.error('Usage: ts-node scripts/migrate.ts <INSTALL|UPDATE>');
        process.exit(1);
    }
    await runMigrations(type);
    console.log(`${type} migrations executed successfully.`);
};

main().catch(console.error);
