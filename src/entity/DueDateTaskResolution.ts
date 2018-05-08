import { TaskResolution } from "./TaskResolution";
import { Column, ChildEntity } from "typeorm";

@ChildEntity()
export class DueDateTaskResolution extends TaskResolution {
  @Column("varchar", { length: 64 })
  dueDate: String
}
