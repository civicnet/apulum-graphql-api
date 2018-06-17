import {
  Entity,
  Column,
  BaseEntity,
  PrimaryGeneratedColumn,
  OneToMany,
  BeforeInsert,
} from "typeorm";

import * as bcrypt from 'bcryptjs';

import { Task } from "./Task";
import { UserApprovalTaskResolution } from "./UserApprovalTaskResolution";
import { IncidentReport } from "./IncidentReport";
import { IncidentReportComment } from "./IncidentReportComment";

@Entity("users")
export class User extends BaseEntity {

  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("varchar", { length: 255 })
  email: string;

  @Column("varchar", { length: 255, nullable: true })
  firstName?: string;

  @Column("varchar", { length: 255, nullable: true })
  lastName?: string;

  @Column("text")
  password: string;

  @Column("boolean", { default: false })
  confirmed: boolean;

  @Column("boolean", { default: false })
  forgotPasswordLocked: boolean

  // @ts-ignore `type` is not being used
  @OneToMany(type => Task, task => task.creator)
  tasks: Task[];

  // @ts-ignore `type` is not being used
  @OneToMany(type => IncidentReport, incident => incident.creator)
  incidents: IncidentReport[];

  // @ts-ignore `type` is not being used
  @OneToMany(type => Task, task => task.asignee)
  asignedTasks: Task[];

  // @ts-ignore `type` is not being used
  @OneToMany(type => IncidentReportComment, comment => comment.creator)
  incidentAttachments: IncidentReportComment[];

  // @ts-ignore `type` is not being used
  @OneToMany(type => UserApprovalTaskResolution, resolution => resolution.approver)
  approvedResolutions: UserApprovalTaskResolution[];

  @BeforeInsert()
  async hashPasswordBeforeInsert() {
    this.password = await bcrypt.hash(this.password, 10);
  }
}
