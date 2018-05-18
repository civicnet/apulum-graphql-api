import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  ManyToOne,
} from "typeorm";
import { IncidentReport } from "./IncidentReport";
import { User } from "./User";

@Entity("incidentReportComment")
export class IncidentReportComment extends BaseEntity {

  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("text")
  comment: string;

  @Column("varchar", { length: 64 })
  oldStatus: string;

  @Column("varchar", { length: 64 })
  newStatus: string;

  // @ts-ignore `type` is not being used
  @ManyToOne(type => IncidentReport, incident => incident.comments)
  incident: IncidentReport

  // @ts-ignore `type` is not being used
  @ManyToOne(type => User, user => user.incidentComments)
  creator: User

}
