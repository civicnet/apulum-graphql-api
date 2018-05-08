import {
  Entity,
  Column,
  BaseEntity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToOne
} from "typeorm";
import { User } from "./User";
import { TaskResolution } from "./TaskResolution";

@Entity("tasks")
export class Task extends BaseEntity {

  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("varchar", { length: 255 })
  title: string;

  @Column("text")
  description: string;

  // @ts-ignore `type` is not being used
  @ManyToOne(type => User, user => user.tasks)
  creator: User

  // @ts-ignore `type` is not being used
  @ManyToOne(type => User, user => user.asignedTasks)
  asignee: User

  // @ts-ignore `type` is not being used
  @OneToOne(type => TaskResolution, resolution => resolution.task)
  @JoinColumn()
  resolution: TaskResolution
}
