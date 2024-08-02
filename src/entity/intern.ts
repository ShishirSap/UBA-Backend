import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from "typeorm";
import { BaseEntity } from "./baseentity";
import { internship } from "./internshipProgram";
import { Evaluation } from "./evaluations";
import { UserRole } from "./userrole";

@Entity({ name: 'intern' })
export class Intern extends BaseEntity {

    @Column({ type: 'varchar', length: 255 })
    firstName: string;

    @Column({ type: 'varchar', length: 255 })
    lastName: string;

    @Column({ type: 'varchar', length: 255, unique: true })
    email: string;

    @Column({ type: 'varchar', length: 255 })
    password: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    phoneNumber: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    address: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    university: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    degree: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    major: string;

    @Column({ type: 'date', nullable: true })
    dateOfBirth: Date;

    @Column({default:'intern'})
    userType:'mentor'|'admin'|'intern'

    // @Column({ type: 'enum', enum: ['M', 'F', 'Other'], nullable: true })
    // gender: 'M' | 'F' | 'Other';

    @Column('text')
    gender:'M'|'F'|'Other'

    @OneToMany(() => internship, internship => internship.intern)
    internships: internship[];

    @OneToMany(() => Evaluation, evaluation => evaluation.intern)
    evaluations: Evaluation[];

    @OneToMany(() => UserRole, userRole => userRole.intern)
    userRoles: UserRole[];
}
