import { Entity,Column,ManyToOne,PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { BaseEntity } from "./baseentity";
import { designation } from "./position";
import { Mentor } from "./Mentor";

@Entity({name:'department'})
export class department extends BaseEntity{
    @Column({type:'varchar',length:100})
    deptname:string;

    @OneToMany(()=>designation,designation=>designation.department)
    designations:designation[]

    @OneToMany(()=>Mentor,mentor=>mentor.department)
    mentors:Mentor[]

    
}