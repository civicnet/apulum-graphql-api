// tslint:disable
// graphql typescript definitions

declare namespace GQL {
interface IGraphQLResponseRoot {
data?: IQuery | IMutation;
errors?: Array<IGraphQLResponseError>;
}

interface IGraphQLResponseError {
/** Required for all errors */
message: string;
locations?: Array<IGraphQLResponseErrorLocation>;
/** 7.2.2 says 'GraphQL servers may provide additional entries to error' */
[propName: string]: any;
}

interface IGraphQLResponseErrorLocation {
line: number;
column: number;
}

interface IQuery {
__typename: "Query";
bye2: string | null;
bye: string | null;
tasks: Array<ITask>;
task: ITask | null;
tasksByUser: Array<ITask>;
tasksForUser: Array<ITask>;
upForGrabsTasks: Array<ITask>;
taskResolution: ITaskResolution | null;
taskResolutionForTask: ITaskResolution;
onDemandTaskResolutions: Array<ITaskResolution>;
userApprovalTaskResolutions: Array<ITaskResolution>;
dueDateTaskResolutions: Array<ITaskResolution>;
hello: string;
users: Array<IUser>;
user: IUser | null;
}

interface ITaskOnQueryArguments {
id: string;
}

interface ITasksByUserOnQueryArguments {
id: string;
}

interface ITasksForUserOnQueryArguments {
id: string;
}

interface ITaskResolutionOnQueryArguments {
id: string;
}

interface ITaskResolutionForTaskOnQueryArguments {
id: string;
}

interface IHelloOnQueryArguments {
name?: string | null;
}

interface IUserOnQueryArguments {
id: string;
}

interface ITask {
__typename: "Task";
id: string;
title: string;
description: string;
creator: IUser;
asignee: IUser | null;
}

interface IUser {
__typename: "User";
id: string;
email: string;
}

type ITaskResolution = IOnDemandTaskResolution | IUserApprovalTaskResolution | IDueDateTaskResolution;

interface IITaskResolution {
__typename: "ITaskResolution";
id: string;
description: string;
achieved: boolean;
task: ITask;
}

interface IMutation {
__typename: "Mutation";
login: Array<IError>;
register: Array<IError>;
createTask: Array<IError>;
deleteTask: Array<IError>;
assignTask: Array<IError>;
createOnDemandTaskResolution: Array<IError>;
createUserApprovalTaskResolution: Array<IError>;
createDueDateTaskResolution: Array<IError>;
}

interface ILoginOnMutationArguments {
email: string;
password: string;
}

interface IRegisterOnMutationArguments {
email: string;
password: string;
}

interface ICreateTaskOnMutationArguments {
userId: string;
title: string;
description: string;
}

interface IDeleteTaskOnMutationArguments {
id: string;
}

interface IAssignTaskOnMutationArguments {
taskId: string;
userId: string;
}

interface ICreateOnDemandTaskResolutionOnMutationArguments {
taskId: string;
description: string;
}

interface ICreateUserApprovalTaskResolutionOnMutationArguments {
taskId: string;
description: string;
}

interface ICreateDueDateTaskResolutionOnMutationArguments {
taskId: string;
description: string;
}

interface IError {
__typename: "Error";
path: string;
message: string;
}

interface IOnDemandTaskResolution {
__typename: "OnDemandTaskResolution";
id: string;
description: string;
achieved: boolean;
task: ITask;
}

interface IUserApprovalTaskResolution {
__typename: "UserApprovalTaskResolution";
id: string;
description: string;
achieved: boolean;
task: ITask;
approver: IUser | null;
}

interface IDueDateTaskResolution {
__typename: "DueDateTaskResolution";
id: string;
description: string;
achieved: boolean;
task: ITask;
dueDate: number | null;
}
}

// tslint:enable
