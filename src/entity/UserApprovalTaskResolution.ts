import { TaskResolution } from "./TaskResolution";
import { ManyToOne, ChildEntity } from "typeorm";
import { User } from "./User";

@ChildEntity()
export class UserApprovalTaskResolution extends TaskResolution {
  // @ts-ignore `type` is not being used
  @ManyToOne(type => User, user => user.approvedResolutions)
  approver: User
}
