import { Entity,Column,ManyToOne,PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { BaseEntity } from "./baseentity";
import { Position } from "./position";
import { Mentor } from "./Mentor";

@Entity({name:'department'})
export class Department extends BaseEntity{
    @Column({length:100})
    deptname:string;

    @OneToMany(()=>Position,position=>position.department)
    positions:Position[]

    @OneToMany(()=>Mentor,mentor=>mentor.department)
    mentors:Mentor[]

    
}