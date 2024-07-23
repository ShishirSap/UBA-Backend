import {DataSource,Repository,ObjectLiteral} from 'typeorm'

export class TestHelper{
    private static _instance:TestHelper
    private constructor(){}
    public static get instance():TestHelper{
        if(!this._instance) this._instance=new TestHelper()
            return this._instance
    }
    private dbConnect!:DataSource

    
    getRepo<T extends ObjectLiteral>(entity:{new ():T}):Repository<T>{
        return this.dbConnect.getRepository(entity)
    }

    async setupTestDB(){
        this.dbConnect=new DataSource({
            name:'unit-tests',
            type:'better-sqlite3',
            database:':memory:',
            entities:['src/entity/**/*.ts'],
            synchronize:true

        })
        await this.dbConnect.initialize();
    }
    tearDownTestDB(){
        if(this.dbConnect.isInitialized) this.dbConnect.destroy()
    }



}