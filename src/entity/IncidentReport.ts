import {
  Entity,
  Column,
  BaseEntity,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinTable
} from "typeorm";
import { User } from "./User";
import { IncidentReportComment } from "./IncidentReportComment";

@Entity("incidentReport")
export class IncidentReport extends BaseEntity {

  @PrimaryGeneratedColumn("uuid")
  id: string;

  @CreateDateColumn({type: "timestamp"})
  createdAt: Date;

  @UpdateDateColumn({type: "timestamp"})
  updatedAt: Date;

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

  @ManyToOne(_ => User, user => user.incidents, {
    eager: true
  })
  @JoinTable()
  creator: User

  @OneToMany(_ => IncidentReportComment, comment => comment.incident, {
    eager: true
  })
  @JoinTable()
  comments: IncidentReportComment[];
}
