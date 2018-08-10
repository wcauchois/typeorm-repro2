import 'reflect-metadata';
import { Entity, BaseEntity, PrimaryGeneratedColumn, OneToOne, JoinColumn, Column, ManyToOne } from 'typeorm';
import Gizmo from './Gizmo';

@Entity()
export default class Gadget extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(type => Gizmo)
  gizmo: Promise<Gizmo>;

  @Column({ type: Number, nullable: true })
  gizmoId: number | null;
}
