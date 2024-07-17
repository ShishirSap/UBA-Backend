import { Column, Entity, ManyToOne } from "typeorm";
import { BaseEntity } from "./baseentity";
import { Intern } from "./intern";
import { Mentor } from "./Mentor";

@Entity({name:'evaluation'})
export class Evaluation extends BaseEntity{
    @Column({type:'decimal',precision:3,scale:2,nullable:true })
    performanceScore:number

    @Column({type:'text',nullable:true})
    feedback:string

    @ManyToOne(() => Intern, intern => intern.evaluations)
    intern: Intern;

    @ManyToOne(() => Mentor, mentor => mentor.evaluations)
    mentor: Mentor;

    
}