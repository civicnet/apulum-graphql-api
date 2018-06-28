import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinTable,
} from "typeorm";

import { IncidentReport } from "./IncidentReport";
import { User } from "./User";

@Entity("incidentReportComment")
export class IncidentReportComment extends BaseEntity {

  @PrimaryGeneratedColumn("uuid")
  id: string;

  @CreateDateColumn({type: "timestamp"})
  createdAt: Date;

  @UpdateDateColumn({type: "timestamp"})
  updatedAt: Date;

  @Column("text")
  comment: string;

  @Column("varchar", { length: 64, nullable: true })
  oldStatus: string;

  @Column("varchar", { length: 64, nullable: true })
  newStatus: string;

  @ManyToOne(_ => IncidentReport, incident => incident.comments)
  incident: IncidentReport

  @ManyToOne(_ => User, user => user.incidentComments, {
    eager: true
  })
  @JoinTable()
  creator: User

}
