import { gql, useQuery, useMutation } from '@apollo/client';

export const GET_POSITIONS = gql`
  query GetPositions {
    positions {
      id
      name
      description
      created_at
      updated_at
    }
  }
`;

export const CREATE_POSITION = gql`
  mutation CreatePosition($name: String!, $description: String) {
    createPosition(name: $name, description: $description) {
      id
      name
      description
      created_at
      updated_at
    }
  }
`;

export const UPDATE_POSITION = gql`
  mutation UpdatePosition($id: ID!, $name: String, $description: String) {
    updatePosition(id: $id, name: $name, description: $description) {
      id
      name
      description
      created_at
      updated_at
    }
  }
`;

export const DELETE_POSITION = gql`
  mutation DeletePosition($id: ID!) {
    deletePosition(id: $id)
  }
`;

export function usePositionsQuery() {
    return useQuery(GET_POSITIONS);
}

export function useCreatePositionMutation() {
    const [mutate] = useMutation(CREATE_POSITION);
    return async (values: { name: string; description?: string }) => {
        await mutate({ variables: values });
    };
}

export function useUpdatePositionMutation() {
    const [mutate] = useMutation(UPDATE_POSITION);
    return async (id: string, values: { name: string; description?: string }) => {
        await mutate({ variables: { id, ...values } });
    };
}

export function useDeletePositionMutation() {
    const [mutate] = useMutation(DELETE_POSITION);
    return async (id: string) => {
        await mutate({ variables: { id } });
    };
}
