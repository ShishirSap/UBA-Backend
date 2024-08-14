import { Entity, PrimaryColumn, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Intern } from './intern'; // Assuming you have an Intern entity
import { Role } from './role';

@Entity({name:'user_roles'})
export class UserRole {
    @PrimaryColumn('int')
    intern_id: number;

    @PrimaryColumn('bigint')
    role_id: bigint;

    @CreateDateColumn()
    assigned_at: Date;

    @ManyToOne(() => Intern, intern => intern.userRoles, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'intern_id' })
    intern: Intern;

    @ManyToOne(() => Role, role => role.userRoles, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'role_id' })
    roles: Role;
}