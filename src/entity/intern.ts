import { Entity,PrimaryGeneratedColumn,Column, ManyToOne, OneToMany } from "typeorm";
import { BaseEntity } from "./baseentity";
import { Internship } from "./internshipProgram";
import { Evaluation } from "./evaluations";

@Entity({name:'intern'})
export class Intern extends BaseEntity{

    @Column()
    firstName:string;

    @Column()
    lastName:string;

    @Column({unique:true})
    email:string

    @Column()
    password:string

    @Column({ nullable: true })
    phoneNumber: string;
  
    @Column({ nullable: true })
    address: string;
  
    @Column({ nullable: true })
    university: string;
  
    @Column({ nullable: true })
    degree: string;
  
    @Column({ nullable: true })
    major: string;
  
    @Column({ nullable: true })
    dateOfBirth: Date;
  
    @Column({ nullable: true, type: 'enum', enum: ['M', 'F', 'Other'] })
    gender: 'M' | 'F' | 'Other';


    @OneToMany(()=>Internship,internship=>internship.intern)
    internships:Internship[]

    @OneToMany(()=>Evaluation,evaluation=>evaluation.intern)
    evaluations:Evaluation[]




}