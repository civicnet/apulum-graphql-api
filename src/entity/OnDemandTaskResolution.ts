import { TaskResolution } from "./TaskResolution";
import { ChildEntity } from "typeorm";

@ChildEntity()
export class OnDemandTaskResolution extends TaskResolution {
}
