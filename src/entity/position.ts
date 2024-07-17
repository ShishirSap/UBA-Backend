import { Entity,Column, ManyToOne, OneToMany } from "typeorm";
import { BaseEntity } from "./baseentity";
import { Department } from "./Department";
import { Internship } from "./internshipProgram";


@Entity({name:'position'})
export class Position extends BaseEntity{
    @Column()
    title: string;
  
    @Column({ type: 'text', nullable: true })
    description: string;
  
    @Column({ type: 'text', nullable: true })
    requirements: string;

   @ManyToOne(()=>Department,department=>department.positions)
   department:Department;

   @OneToMany(()=>Internship,internship=>internship.position)
   internships:Internship[]
  
}