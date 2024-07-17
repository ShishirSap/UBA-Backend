import { Column, Entity, ManyToOne } from "typeorm";
import { BaseEntity } from "./baseentity";
import { Intern } from "./intern";
import { Position } from "./position";
import { Mentor } from "./Mentor";

@Entity({name:'internship'})
export class Internship extends BaseEntity {
    
@ManyToOne(()=>Intern,intern=>intern.internships)
intern:Intern

@ManyToOne(() => Position, position => position.internships)
position: Position;

@ManyToOne(() => Mentor, mentor => mentor.internships)
mentor: Mentor;

@Column({ type: 'date', nullable: true })
start_date: string;

@Column({ type: 'date', nullable: true })
end_date: string;


}