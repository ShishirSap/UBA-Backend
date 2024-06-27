import { users } from "../controllers/users";

export const resolvers = {
    Query: {
      listusers: () => users,
      searchUsers: (_: any, args: { name?: string; email?: string; age?: number }) => {
        return users.filter(user => {
          return (
            (!args.name || user.name.includes(args.name)) &&
            (!args.email || user.email.includes(args.email))
          );
        });
      },
    },
  };
  
