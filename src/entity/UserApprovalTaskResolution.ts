import {
  ManyToOne,
  Entity,
  Column,
  BaseEntity,
  PrimaryGeneratedColumn,
} from "typeorm";

import { TaskResolution } from "./TaskResolution";
import { User } from "./User";
import { Task } from "./Task";

@Entity()
export class UserApprovalTaskResolution extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column(_ => TaskResolution)
  resolution: TaskResolution;

  @ManyToOne(_ => User, user => user.approvedResolutions)
  approvedBy: User;

  @ManyToOne(_ => User, user => user.createdUserApprovalResolutions)
  creator: User;

  @ManyToOne(_ => Task, task => task.userApprovalResolutions)
  task: Task;
}
