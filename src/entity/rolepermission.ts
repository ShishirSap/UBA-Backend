import 'reflect-metadata'
import { Entity, PrimaryColumn, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Role } from './role';
import { Permission } from './permission';

@Entity('role_permissions')
export class RolePermission {
    @PrimaryColumn({type:'bigint'})
    role_id: bigint;

    @PrimaryColumn({type:'bigint'})
    permission_id: bigint;

    @CreateDateColumn()
    granted_at: Date;

    @ManyToOne(() => Role, role => role.rolePermissions, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'role_id' })
    role: Role;

    @ManyToOne(() => Permission, permission => permission.rolePermissions, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'permission_id' })
    permission: Permission;
}