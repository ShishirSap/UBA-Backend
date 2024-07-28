import { Entity,Column, ManyToOne, OneToMany } from "typeorm";
import { BaseEntity } from "./baseentity";
import { department, } from "./Department";
import { internship } from "./internshipProgram";
@Entity({name:'designation'})
export class designation extends BaseEntity{
    @Column({type:'text'})
    title: string;
  
    @Column({ type: 'text', nullable: true })
    description: string;
  
    @Column({ type: 'text', nullable: true })
    requirements: string;

   @ManyToOne(()=>department,department=>department.designations)
   department:department;

   @OneToMany(()=>internship,internship=>internship.designation)
   internships:internship[]
  
}