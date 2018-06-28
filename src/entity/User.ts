import {
  Entity,
  Column,
  BaseEntity,
  PrimaryGeneratedColumn,
  OneToMany,
  BeforeInsert,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

import { Task } from "./Task";
import { UserApprovalTaskResolution } from "./UserApprovalTaskResolution";
import { IncidentReport } from "./IncidentReport";
import { IncidentReportComment } from "./IncidentReportComment";

import { DueDateTaskResolution } from "./DueDateTaskResolution";
import { OnDemandTaskResolution } from "./OnDemandTaskResolution";

import * as bcrypt from 'bcryptjs';

@Entity("users")
export class User extends BaseEntity {

  @PrimaryGeneratedColumn("uuid")
  id: string;

  @CreateDateColumn({type: "timestamp"})
  createdAt: Date;

  @UpdateDateColumn({type: "timestamp"})
  updatedAt: Date;

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

  @OneToMany(_ => UserApprovalTaskResolution, resolution => resolution.creator)
  createdUserApprovalResolutions: UserApprovalTaskResolution[];

  @OneToMany(_ => OnDemandTaskResolution, resolution => resolution.creator)
  createdOnDemandResolutions: OnDemandTaskResolution[];

  @OneToMany(_ => DueDateTaskResolution, resolution => resolution.creator)
  createdDueDateResolutions: OnDemandTaskResolution[];

  @OneToMany(_ => Task, task => task.creator)
  tasks: Task[];

  @OneToMany(_ => IncidentReport, incident => incident.creator)
  incidents: IncidentReport[];

  @OneToMany(_ => Task, task => task.asignee)
  asignedTasks: Task[];

  @OneToMany(_ => IncidentReportComment, comment => comment.creator)
  incidentComments: IncidentReportComment[];

  @OneToMany(_ => UserApprovalTaskResolution, resolution => resolution.approvedBy)
  approvedResolutions: UserApprovalTaskResolution[];

  @BeforeInsert()
  async hashPasswordBeforeInsert() {
    this.password = await bcrypt.hash(this.password, 10);
  }
}
