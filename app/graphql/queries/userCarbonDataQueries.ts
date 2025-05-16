import { gql } from "@apollo/client";

export const GET_USER_CARBON_DATA = gql`
  query GetUserCarbonData($id: String!) {
    UserCarbonDetails(userId: $id) {
      userId
      carbonFootprints {
        month
        food
        home
        shopping
        transport
        total_emissions
      }
    }
  }
`;
