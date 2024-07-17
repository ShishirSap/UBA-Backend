import { AppDataSource } from '../../data-source';
import { Intern } from '../../entity/intern';
import { paginate } from '../cursorpaginationhelper';

export const internResolvers = {
  Query: {
    listInterns: async (_: any, args: { cursor?: number; limit?: number }) => {
      const cursor = args.cursor || null;
      const limit = args.limit || 5;
      
      const interns = await AppDataSource.getRepository(Intern).find();
      const { items, pageInfo } = paginate(interns, cursor, limit);

      return {
        interns: items,
        pageInfo
      };
    },

    searchInterns: async (_: any, args: { firstName?: string; lastName?: string; email?: string; cursor?: number; limit?: number }) => {
      const interns = await AppDataSource.getRepository(Intern).find();

      const filteredInterns = interns.filter(intern => {
        return (
          (!args.firstName || intern.firstName.includes(args.firstName)) &&
          (!args.lastName || intern.lastName.includes(args.lastName)) &&
          (!args.email || intern.email.includes(args.email))
        );
      });

      const cursor = args.cursor || null;
      const limit = args.limit || 5;
      const { items, pageInfo } = paginate(filteredInterns, cursor, limit);

      return {
        interns: items,
        pageInfo,
      };
    },
  },
};
