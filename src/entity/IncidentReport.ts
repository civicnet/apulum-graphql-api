import {
  Entity,
  Column,
  BaseEntity,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne
} from "typeorm";
import { User } from "./User";
import { IncidentReportComment } from "./IncidentReportComment";

@Entity("incidentReport")
export class IncidentReport extends BaseEntity {

  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("varchar", { length: 255 })
  title: string;

  @Column("text")
  description: string;

  @Column("varchar", { length: 64 })
  type: string;

  @Column("varchar", { length: 64 })
  status: string;

  @Column("decimal", { precision: 7, scale: 5 })
  latitude: number;

  @Column("decimal", { precision: 8, scale: 5 })
  longitude: number;

  // @ts-ignore `type` is not being used
  @ManyToOne(type => User, user => user.incidents)
  creator: User

  // @ts-ignore `type` is not being used
  @OneToMany(type => IncidentReportComment, comment => comment.incident)
  comments: IncidentReportComment[];
}
