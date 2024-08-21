import { DataSource, Repository, ObjectLiteral, QueryRunner } from "typeorm";
import { AppDataSource } from "../data-source";
export class TestHelper {
  private static _instance: TestHelper;
  private constructor() {}
  public static get instance(): TestHelper {
    if (!this._instance) this._instance = new TestHelper();
    return this._instance;
  }
  private dbConnect!: DataSource;
  private queryRunner!: QueryRunner;

  getRepo<T extends ObjectLiteral>(entity: { new (): T }): Repository<T> {
    return AppDataSource.getRepository(entity);
  }

  async setupTestDB() {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }
  }
  async tearDownTestDB() {
    if (AppDataSource.isInitialized) {
      const queryRunner = AppDataSource.createQueryRunner();
      await queryRunner.clearDatabase();
      AppDataSource.destroy();
      // await queryRunner.startTransaction();
      // try {
      //     const tables = await queryRunner.getTables();
      //     for (const table of tables) {
      //         await queryRunner.query(`DELETE FROM \`${table.name}\`;`);
      //     }
      //     await queryRunner.commitTransaction();
      // } catch (err) {
      //     await queryRunner.rollbackTransaction();
      //     throw err;
      // } finally {
      //     await queryRunner.release();
      //     await AppDataSource.destroy();
      // }
    }
  }
}
