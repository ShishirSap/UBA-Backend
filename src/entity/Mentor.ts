import { Entity,Column, OneToMany } from "typeorm";
import { BaseEntity } from "./baseentity";
import { Internship } from "./internshipProgram";
import { Evaluation } from "./evaluations";

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
  
    @Column({ nullable: true })
    department: string;

    @OneToMany(()=>Internship,internship=>internship.mentor)
    internships:Internship[]

    @OneToMany(() => Evaluation, evaluation => evaluation.mentor)
    evaluations: Evaluation[];
  
}