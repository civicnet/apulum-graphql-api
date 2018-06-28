import {
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  VersionColumn,
} from "typeorm";

export interface ITaskResolution {
  resolution: {
    createdAt: number;
    updatedAt: number;
    description: string;
    achieved: boolean;
    entityVersion: number;
  }
}

export class TaskResolution {
  @CreateDateColumn({type: "timestamp"})
  createdAt: Date;

  @UpdateDateColumn({type: "timestamp"})
  updatedAt: Date;

  @Column("text")
  description: string;

  @Column("boolean", { default: false })
  achieved: boolean

  @VersionColumn()
  entityVersion: number;
}
