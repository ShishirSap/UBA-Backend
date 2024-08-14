import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { RolePermission } from './rolepermission';

@Entity('permissions')
export class Permission {
    @PrimaryGeneratedColumn('increment')
    id: bigint;

    @Column({ type: 'varchar', length: 50, unique: true })
    name: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    description: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @OneToMany(() => RolePermission, rolePermission => rolePermission.permission)
    rolePermissions: RolePermission[];
}