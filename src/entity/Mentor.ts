import { Entity, Column, OneToMany, ManyToOne } from "typeorm";
import { BaseEntity } from "./baseentity";
import { internship } from "./internshipProgram";
import { Evaluation } from "./evaluations";
import { department } from "./Department";

@Entity({ name: 'mentor' })
export class Mentor extends BaseEntity {

    @Column({ type: 'varchar', length: 255 })
    firstName: string;

    @Column({ type: 'varchar', length: 255 })
    lastName: string;

    @Column({ type: 'varchar', length: 255, unique: true })
    email: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    phoneNumber: string;

    @ManyToOne(() => department, department => department.mentors)
    department:department;

    @OneToMany(() => internship, internship => internship.mentor)
    internships: internship[];

    @OneToMany(() => Evaluation, evaluation => evaluation.mentor)
    evaluations: Evaluation[];
}
