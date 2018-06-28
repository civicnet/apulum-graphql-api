import { TaskResolution } from "./TaskResolution";
import { Column, Entity, BaseEntity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";
import { Task } from "./Task";

@Entity()
export class DueDateTaskResolution extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column(_ => TaskResolution)
  resolution: TaskResolution;

  @Column("varchar", { length: 64 })
  dueDate: string

  @ManyToOne(_ => User, user => user.createdDueDateResolutions)
  creator: User;

  @ManyToOne(_ => Task, task => task.dueDateResolutions)
  task: Task;
}
