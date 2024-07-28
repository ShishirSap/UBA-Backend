import { Entity, PrimaryColumn, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Intern } from './intern'; // Assuming you have an Intern entity
import { Role } from './role';

@Entity({name:'user_roles'})
export class UserRole {
    @PrimaryColumn()
    intern_id: number;

    @PrimaryColumn()
    role_id: bigint;

    @CreateDateColumn({ type: 'timestamp' })
    assigned_at: Date;

    @ManyToOne(() => Intern, intern => intern.userRoles, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'intern_id' })
    intern: Intern;

    @ManyToOne(() => Role, role => role.userRoles, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'role_id' })
    roles: Role;
}