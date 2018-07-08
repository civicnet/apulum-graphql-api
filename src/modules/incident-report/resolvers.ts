import * as yup from "yup";

import { ResolverMap } from "../../types/graphql-utils";
import { User } from "../../entity/User";
import { invalidUserID, allMandatory } from "./errorMessages";
import { IncidentReport } from "../../entity/IncidentReport";
import { uuidRegex } from "../../utils/uuidRegex";
import { formatYupError } from "../../utils/formatYupError";
import { getRepository } from "typeorm";
import { IncidentReportComment } from "../../entity/IncidentReportComment";

const inputSchema = yup.object().shape({
  description: yup
    .string()
    .min(5)
    .required(),
  title: yup
    .string()
    .min(3)
    .max(256)
    .required(),
  latitude: yup
    .number()
    .required(),
  longitude: yup
    .number()
    .required(),
  type: yup
    .string()
    .max(64)
    .required(),
  userId: yup
    .string()
    .min(36, invalidUserID)
    .max(36, invalidUserID)
    .matches(uuidRegex, invalidUserID)
    .required()
});

export const resolvers: ResolverMap = {
  MaybeIncidentReportComment: {
    __resolveType: (obj) => {
      if (obj.path) {
        return 'Error';
      }

      return 'IncidentReportComment';
    },
  },
  MaybeIncidentReport: {
    __resolveType: (obj) => {

      if (obj.path) {
        return 'Error';
      }

      return 'IncidentReport';
    },
  },

  Query: {
    incidentReports: async () => {
      return getRepository(IncidentReport).find();
    },
    incidentReport: async (_, { id }) => {
      return IncidentReport.findOne({
        where: { id },
      });
    },
    commentsForIncidentReport: async (
      _,
      { incidentReportID }: GQL.ICommentsForIncidentReportOnQueryArguments
    ) => {
      return IncidentReportComment.find({
        where: { incident: incidentReportID },
      });
    },
    incidentReportComment: async (
      _,
      { id }: GQL.IIncidentReportCommentOnQueryArguments
    ) => {
      return IncidentReportComment.findOne({
        where: { id },
      });
    },
  },

  Mutation: {
    createIncidentReport: async (
      _,
      { input }: GQL.ICreateIncidentReportOnMutationArguments
    ) => {
      const { description, title, latitude, longitude, type, userId } = input;

      if (!(description && title && latitude && longitude && type && userId)) {
        return [{
          path: 'incident',
          message: allMandatory
        }];
      }

      try {
        await inputSchema.validate({
          description,
          title,
          latitude,
          longitude,
          type,
          userId
        }, { abortEarly: false });
      } catch(err) {
        return formatYupError(err);
      }

      const creator = await User.findOne(userId);
      if (!creator) {
        return [{
          path: 'incident',
          message: invalidUserID
        }]
      }

      const incident = await IncidentReport.create({
        creator,
        title,
        description,
        latitude,
        longitude,
        type,
        status: "NEW"
      }).save();

      return [incident];
    },
    updateIncidentReport: async (
      _,
      { id, input }: GQL.IUpdateIncidentReportOnMutationArguments
    ) => {
      const {type, description, title, latitude, longitude } = input;

      const report = await IncidentReport.findOne({
        where: { id },
      });

      if (!report) {
        return [{
          path: 'incident',
          message: 'Bad report ID',
        }];
      }

      if (type) {
        report.type = type;
      }

      if (description) {
        report.description = description;
      }

      if (title) {
        report.title = title;
      }

      if (latitude && longitude) {
        report.latitude = latitude;
        report.longitude = longitude;
      } else if (latitude !== longitude) {
        return [{
          path: 'incident',
          message: 'Must have both lat and long, or neither',
        }];
      }

      await report.save();
      return [report];
    },
    changeIncidentReportStatus: async (
      _,
      { id, input }: GQL.IChangeIncidentReportStatusOnMutationArguments
    ) => {
      const { newStatus, userID} = input;

      if (!newStatus) {
        return [{
          path: 'incident',
          message: 'You need to set the new status'
        }];
      }

      const report = await IncidentReport.findOne({
        where: { id },
      });

      if (!report) {
        return [{
          path: 'incident',
          message: 'Bad report ID',
        }];
      }

      const user = await User.findOne({
        where: { id: userID },
      });

      if (!user) {
        return [{
          path: 'incident',
          message: 'Bad user ID',
        }];
      }

      await IncidentReportComment.create({
        newStatus,
        oldStatus: report.status,
        creator: user,
        incident: report,
      }).save();

      report.status = newStatus;
      await report.save();

      return [report];
    },
    createIncidentReportComment: async (
      _,
      { input }: GQL.ICreateIncidentReportCommentOnMutationArguments
    ) => {
      const { userID, comment, incidentReportID, statusChange } = input;

      const user = await User.findOne({
        where: { id: userID },
      });

      if (!user) {
        return [{
          path: 'incident',
          message: 'Bad user ID',
        }];
      }

      const report = await IncidentReport.findOne({
        where: { id: incidentReportID },
      });

      if (!report) {
        return [{
          path: 'incident',
          message: 'Bad report ID',
        }];
      }

      let newStatus = null;
      if (statusChange) {
        newStatus = statusChange.newStatus;
      }

      const commentEntity = await IncidentReportComment.create({
        creator: user,
        incident: report,
        comment: comment || '',
        oldStatus: report.status,
        newStatus: newStatus || undefined,
      }).save();

      if (newStatus) {
        report.status = newStatus;
        await report.save();
      }

      return [commentEntity];
    },
    updateIncidentReportComment: async (
      _,
      { input }
    ) => {
      console.log(input);
      return [];
    },
  }
}

