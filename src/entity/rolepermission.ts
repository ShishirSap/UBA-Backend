import { Entity, PrimaryColumn, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Role } from './role';
import { Permission } from './permission';

@Entity()
export class RolePermission {
    @PrimaryColumn()
    role_id: bigint;

    @PrimaryColumn()
    permission_id: bigint;

    @CreateDateColumn({ type: 'timestamp' })
    granted_at: Date;

    @ManyToOne(() => Role, role => role.rolePermissions, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'role_id' })
    role: Role;

    @ManyToOne(() => Permission, permission => permission.rolePermissions, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'permission_id' })
    permission: Permission;
}