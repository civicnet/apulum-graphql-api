import {
  Entity,
  Column,
  BaseEntity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  JoinTable
} from "typeorm";

import { User } from "./User";
import { UserApprovalTaskResolution } from "./UserApprovalTaskResolution";
import { OnDemandTaskResolution } from "./OnDemandTaskResolution";
import { DueDateTaskResolution } from "./DueDateTaskResolution";

@Entity("tasks")
export class Task extends BaseEntity {

  @PrimaryGeneratedColumn("uuid")
  id: string;

  @CreateDateColumn({type: "timestamp"})
  createdAt: Date;

  @UpdateDateColumn({type: "timestamp"})
  updatedAt: Date;

  @Column("varchar", { length: 255 })
  title: string;

  @Column("text")
  description: string;

  @ManyToOne(_ => User, user => user.tasks, {
    eager: true
  })
  @JoinTable()
  creator: User

  @ManyToOne(_ => User, user => user.asignedTasks, {
    eager: true
  })
  @JoinTable()
  asignee: User

  @OneToMany(_ => UserApprovalTaskResolution, resolution => resolution.task)
  userApprovalResolutions: UserApprovalTaskResolution[]

  @OneToMany(_ => OnDemandTaskResolution, resolution => resolution.task)
  onDemandResolutions: OnDemandTaskResolution[]

  @OneToMany(_ => DueDateTaskResolution, resolution => resolution.task)
  dueDateResolutions: DueDateTaskResolution[]
}
