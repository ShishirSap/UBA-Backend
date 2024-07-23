import { Column, Entity, ManyToOne } from "typeorm";
import { BaseEntity } from "./baseentity";
import { Intern } from "./intern";
import { designation} from "./position";
import { Mentor } from "./Mentor";

@Entity({name:'internship'})
export class internship extends BaseEntity {
    
@ManyToOne(()=>Intern,intern=>intern.internships)
intern:Intern

@ManyToOne(() => designation, designation => designation.internships)
designation: designation;

@ManyToOne(() => Mentor, mentor => mentor.internships)
mentor: Mentor;

@Column({ type: 'date', nullable: true })
start_date: string;

@Column({ type: 'date', nullable: true })
end_date: string;


}