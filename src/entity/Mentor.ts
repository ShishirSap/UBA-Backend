import { Entity,Column, OneToMany, ManyToOne } from "typeorm";
import { BaseEntity } from "./baseentity";
import { Internship } from "./internshipProgram";
import { Evaluation } from "./evaluations";
import { Department } from "./Department";

@Entity({name:'mentor'})
export class Mentor extends BaseEntity{
    @Column()
    firstName: string;
  
    @Column()
    lastName: string;
  
    @Column({ unique: true })
    email: string;
  
    @Column({ nullable: true })
    phoneNumber: string;
  
    @ManyToOne(()=>Department,department=>department.mentors)
    department:Department

    @OneToMany(()=>Internship,internship=>internship.mentor)
    internships:Internship[]

    @OneToMany(() => Evaluation, evaluation => evaluation.mentor)
    evaluations: Evaluation[];
  
}