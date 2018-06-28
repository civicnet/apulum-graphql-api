import { TaskResolution } from "./TaskResolution";
import {
  PrimaryGeneratedColumn,
  Entity,
  Column,
  BaseEntity,
  ManyToOne,
} from "typeorm";

import { User } from "./User";
import { Task } from "./Task";

export interface IOnDemandTaskResolution {
  creator: User;
  task: Task;
}

@Entity()
export class OnDemandTaskResolution extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column(_ => TaskResolution)
  resolution: TaskResolution;

  @ManyToOne(_ => User, user => user.createdOnDemandResolutions)
  creator: User

  @ManyToOne(_ => Task, task => task.onDemandResolutions)
  task: Task;
}
