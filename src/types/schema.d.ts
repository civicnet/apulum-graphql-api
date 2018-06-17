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
dummy3: string | null;

/**
 * List all incident reports in the system
 */
incidentReports: Array<IIncidentReport>;

/**
 * Query for a single incident report
 */
incidentReport: IIncidentReport | null;

/**
 * List all of the comments for a specific incident report
 */
commentsForIncidentReport: Array<IIncidentReportComment>;

/**
 * Query for a single incident report comment
 */
incidentReportComment: IIncidentReportComment | null;
bye2: string | null;
dummy: string | null;
me: IUser | null;
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

interface IIncidentReportOnQueryArguments {
id: string;
}

interface ICommentsForIncidentReportOnQueryArguments {
incidentReportID: string;
}

interface IIncidentReportCommentOnQueryArguments {
id: string;
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

/**
 * An incident report is usually made by citizens, reporting an issue in the city. They can describe it,
* add a short title and place a marker on the map in order to localize it. Each report can have multiple
* comments from city representatives, other citizens or themselves and each report has a status that
* describes the report's current state.
 */
  interface IIncidentReport {
__typename: "IncidentReport";
id: string;
creator: IUser | null;
description: string;
title: string;

/**
 * The latitude is stored in the DB with a 1m precision, which should suffice for any city report
 */
latitude: number;

/**
 * The longitude is stored in the DB with a 1m precision, which should suffice for any city report
 */
longitude: number;
type: IncidentReportType | null;
status: IncidentReportStatus | null;
comments: Array<IIncidentReportComment> | null;
}

interface IUser {
__typename: "User";
id: string;
email: string;
firstName: string | null;
lastName: string | null;
}

/**
 * A broad list of incident report types in the city
 */
  enum IncidentReportType {
OTHER = 'OTHER',
PARKING = 'PARKING',
TRASH = 'TRASH'
};

/**
 * The status of the report, as marked by the city representatives
 */
  enum IncidentReportStatus {
NEW = 'NEW',
TRIAGED = 'TRIAGED',
SOLVED = 'SOLVED',
DENIED = 'DENIED'
};

/**
 * A comment can be made by either citizens, or city representatives. It doesn't
* have to have an actual text comment if it updates the status, and it doesn't
* have to have a status update if it has a text comment.
 */
  interface IIncidentReportComment {
__typename: "IncidentReportComment";
id: string;
creator: IUser;
incidentReport: IIncidentReport;
comment: string | null;

/**
 * The old status (before the comment was made) and the new status (after the comment was made).
* Can be null if a change to the status wasn't made.
 */
oldStatus: IncidentReportStatus | null;
newStatus: IncidentReportStatus | null;
}

interface ITask {
__typename: "Task";
id: string;
title: string;
description: string;
creator: IUser;
asignee: IUser | null;
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
sendForgotPasswordEmail: boolean | null;
forgotPasswordChange: Array<IError>;

/**
 * Create a brand new incident report. Can be done by either citizens or city representatives
 */
createIncidentReport: Array<MaybeIncidentReport>;

/**
 * Update any fields on an existing report
 */
updateIncidentReport: Array<MaybeIncidentReport>;

/**
 * Update a report status and create a new comment with the change
 */
changeIncidentReportStatus: Array<MaybeIncidentReport>;

/**
 * Add a comment, or a status update, to a report
 */
createIncidentReportComment: Array<MaybeIncidentReportComment>;

/**
 * Update a report comment, or status update
 */
updateIncidentReportComment: Array<MaybeIncidentReportComment>;
login: Array<IError>;
logout: boolean | null;
register: Array<IError>;
createTask: Array<MaybeTask>;
deleteTask: Array<IError>;
assignTask: Array<IError>;
createOnDemandTaskResolution: Array<IError>;
createUserApprovalTaskResolution: Array<IError>;
createDueDateTaskResolution: Array<IError>;
updateUser: Array<MaybeUser>;
}

interface ISendForgotPasswordEmailOnMutationArguments {
email: string;
}

interface IForgotPasswordChangeOnMutationArguments {
newPassword: string;
key: string;
}

interface ICreateIncidentReportOnMutationArguments {
input: IIncidentReportInput;
}

interface IUpdateIncidentReportOnMutationArguments {
id: string;
input: IIncidentReportInput;
}

interface IChangeIncidentReportStatusOnMutationArguments {
id: string;
input: IIncidentReportStatusChangeInput;
}

interface ICreateIncidentReportCommentOnMutationArguments {
input: IIncidentReportCommentInput;
}

interface IUpdateIncidentReportCommentOnMutationArguments {
id: string;
input: IIncidentReportCommentInput;
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

interface IUpdateUserOnMutationArguments {
id: string;
firstName?: string | null;
lastName?: string | null;
}

interface IError {
__typename: "Error";
path: string;
message: string;
}

/**
 * We use the same input for both updates and creations of incident reports so the only mandatory field
* is userId. For the rest, it depends on the mutation being performed.
* 
* TODO: Group latitude and longitude into a separate mandatory input. There is no use case for updating
* just the longitude or the latitude.
 */
  interface IIncidentReportInput {
description?: string | null;
title?: string | null;
latitude?: number | null;
longitude?: number | null;
type?: IncidentReportType | null;
userId: string;
}

type MaybeIncidentReport = IError | IIncidentReport;



/**
 * If the status for an incident report is being updated, we only care for the new status and who
* made the update, we can fetch the old status from the report.
 */
  interface IIncidentReportStatusChangeInput {
newStatus?: IncidentReportStatus | null;
userID: string;
}

/**
 * Creating a new comment should contain other a text comment, or a status change, or both.
 */
  interface IIncidentReportCommentInput {
userID: string;
incidentReportID: string;
comment?: string | null;
statusChange?: IIncidentReportStatusChangeInput | null;
}

type MaybeIncidentReportComment = IIncidentReportComment | IError;



type MaybeTask = IError | ITask;



type MaybeUser = IError | IUser;



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
