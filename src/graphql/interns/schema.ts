export const interntypeDefs = `
type Intern {
  id: String!
  firstName: String!
  lastName: String!
  email: String!
  phoneNumber: String
  address: String
  university: String
  degree: String
  major: String
  yearOfStudy: Int
  resume: String
  profilePicture: String
  dateOfBirth: String
  gender: String
}

type PageInfo {
  endCursor: [String]
  hasNextPage: Boolean!
}

type InternConnection {
  interns: [Intern!]!
  pageInfo: PageInfo!
}

type Query {
  listInterns(
    firstName: String
    lastName: String
    email: String
    cursor:[String]
    limit: Int
  ): InternConnection!
}
`;

// export const interntypeDefs = `
// type Intern {
//   id: String!
//   firstName: String!
//   lastName: String!
//   email: String!
//   phoneNumber: String
//   address: String
//   university: String
//   degree: String
//   major: String
//   yearOfStudy: Int
//   resume: String
//   profilePicture: String
//   dateOfBirth: String
//   gender: String
// }

// type PageInfo {
//   endCursor: Int
//   hasNextPage: Boolean!
// }

// type InternConnection {
//   interns: [Intern!]!
//   pageInfo: PageInfo!
// }

// type Query {
//   listInterns(cursor:Int, limit: Int): InternConnection!
//   searchInterns(firstName:String, lastName: String, email: String, cursor:Int, limit: Int): InternConnection!
// }
// `;
