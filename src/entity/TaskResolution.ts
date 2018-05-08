import { PrimaryGeneratedColumn, Column, BaseEntity, OneToOne, Entity, TableInheritance } from "typeorm";
import { Task } from "./Task";

@Entity()
@TableInheritance({
  pattern: "STI",
  column: {
      name: "type",
      type: "varchar",
  },
})
export class TaskResolution extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("text")
  description: string;

  @Column("boolean", { default: false })
  achieved: boolean

  // @ts-ignore `type` is not being used
  @OneToOne(type => Task, task => task.resolution)
  task: Task
}
