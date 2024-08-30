import { AppDataSource } from "../../data-source";
import { Intern } from "../../entity/intern";
import { paginate } from "../cursorpaginationhelper";
import { Client } from "@elastic/elasticsearch";
const client = new Client({
  node: "https://127.0.0.1:9200",
  auth: {
    username: "elastic",
    password: "N+za+u9y_h-nGWkvC2fp",
  },
  tls: {
    rejectUnauthorized: false, // if using self-signed certificate
  },
});

export const internResolvers = {
  Query: {
    listInterns: async (
      _: any,
      args: {
        firstName?: string;
        lastName?: string;
        email?: string;
        cursor?: [string]; // Updated to string for search_after
        limit?: number;
      },
    ) => {
      const limit = args.limit || 5;
      const cursor = args.cursor ? args.cursor : undefined;
      const searchQuery: any = {
        index: "interns",
        body: {
          query: {
            bool: {
              must: [],
            },
          },
          size: limit + 1,
          sort: [
            { createdAt: "desc" }, // Primary sort by creation date
            { "email.keyword": "asc" }, // Secondary sort by email
          ],
        },
      };

      if (args.firstName) {
        searchQuery.body.query.bool.must.push({
          match: { firstName: args.firstName },
        });
      }

      if (args.lastName) {
        searchQuery.body.query.bool.must.push({
          match: { lastName: args.lastName },
        });
      }

      if (args.email) {
        searchQuery.body.query.bool.must.push({
          match: { email: args.email },
        });
      }

      if (cursor) {
        searchQuery.body.search_after = cursor;
      }

      try {
        console.log("graphql hit");
        const esResponse = await client.search(searchQuery);
        const hits = esResponse.hits.hits;
        const interns = hits.slice(0, limit).map((hit: any) => hit._source);

        const hasNextPage = hits.length > limit;
        const endCursor = hasNextPage ? hits[limit - 1].sort : null;
        console.log(interns, endCursor);
        console.log("haha");
        return {
          interns,
          pageInfo: {
            endCursor: endCursor ? endCursor : null,
            hasNextPage,
          },
        };
      } catch (error) {
        console.error("Elasticsearch error:", error);
        throw new Error("Error fetching interns from Elasticsearch");
      }
    },
  },
};

// export const internResolvers = {
//   Query: {
//     listInterns: async (
//       _: any,
//       args: {
//         firstName?: string;
//         lastName?: string;
//         email?: string;
//         cursor?: number;
//         limit?: number;
//       },
//     ) => {
//       const limit = args.limit || 10;
//       const cursor = args.cursor || 0;
//       const searchQuery: any = {
//         index: "interns",
//         body: {
//           query: {
//             bool: {
//               must: [],
//             },
//           },
//           from: cursor,
//           size: limit + 1, // Fetch one more document to check for next page
//         },
//       };

//       if (args.firstName) {
//         searchQuery.body.query.bool.must.push({
//           match: { firstName: args.firstName },
//         });
//       }

//       if (args.lastName) {
//         searchQuery.body.query.bool.must.push({
//           match: { lastName: args.lastName },
//         });
//       }

//       if (args.email) {
//         searchQuery.body.query.bool.must.push({
//           match: { email: args.email },
//         });
//       }

//       try {
//         console.log("graphql hit");
//         const esResponse = await client.search(searchQuery);
//         const hits = esResponse.hits.hits;
//         const interns = hits.slice(0, limit).map((hit: any) => hit._source);

//         const hasNextPage = hits.length > limit; // Check if there's an extra document
//         const endCursor = hasNextPage ? hits[limit]._id : null;

//         return {
//           interns,
//           pageInfo: {
//             endCursor,
//             hasNextPage,
//           },
//         };
//       } catch (error) {
//         console.error("Elasticsearch error:", error);
//         throw new Error("Error fetching interns from Elasticsearch");
//       }
//     },
//   },
// };

// export const internResolvers = {
//   Query: {
//     listInterns: async (
//       _: any,
//       args: {
//         firstName?: string;
//         lastName?: string;
//         email?: string;
//         cursor?: number;
//         limit?: number;
//       },
//     ) => {
//       const limit = args.limit || 10;
//       const cursor = args.cursor || 0;
//       const searchQuery: any = {
//         index: "interns",
//         body: {
//           query: {
//             bool: {
//               must: [],
//             },
//           },
//           from: cursor,
//           size: limit,
//         },
//       };

//       if (args.firstName) {
//         searchQuery.body.query.bool.must.push({
//           match: { firstName: args.firstName },
//         });
//       }

//       if (args.lastName) {
//         searchQuery.body.query.bool.must.push({
//           match: { lastName: args.lastName },
//         });
//       }

//       if (args.email) {
//         searchQuery.body.query.bool.must.push({
//           match: { email: args.email },
//         });
//       }

//       try {
//         console.log("graphql hit");
//         const esResponse = await client.search(searchQuery);
//         const interns = esResponse.hits.hits.map((hit: any) => hit._source);
//        console.log('interns length is',interns.length)
//         const hasNextPage = interns.length === limit;
//         const endCursor = hasNextPage
//           ? esResponse.hits.hits[interns.length - 1]._id
//           : null;

//         return {
//           interns,
//           pageInfo: {
//             endCursor,
//             hasNextPage,
//           },
//         };
//       } catch (error) {
//         console.error("Elasticsearch error:", error);
//         throw new Error("Error fetching interns from Elasticsearch");
//       }
//     },
//   },
// };

// export const internResolvers = {
//   Query: {
//     listInterns: async (_: any, args: { cursor?: number; limit?: number }) => {
//       const cursor = args.cursor || null;
//       const limit = args.limit || 5;

//       const interns = await AppDataSource.getRepository(Intern).find();
//       const { items, pageInfo } = paginate(interns, cursor, limit);

//       return {
//         interns: items,
//         pageInfo
//       };
//     },

//     searchInterns: async (_: any, args: { firstName?: string; lastName?: string; email?: string; cursor?: number; limit?: number }) => {
//       const interns = await AppDataSource.getRepository(Intern).find();

//       const filteredInterns = interns.filter(intern => {
//         return (
//           (!args.firstName || intern.firstName.includes(args.firstName)) &&
//           (!args.lastName || intern.lastName.includes(args.lastName)) &&
//           (!args.email || intern.email.includes(args.email))
//         );
//       });

//       const cursor = args.cursor || null;
//       const limit = args.limit || 5;
//       const { items, pageInfo } = paginate(filteredInterns, cursor, limit);

//       return {
//         interns: items,
//         pageInfo,
//       };
//     },
//   },
// };
