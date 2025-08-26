import { gql, useQuery, useMutation } from '@apollo/client';

export const GET_DEPARTMENTS = gql`
  query GetDepartments {
    departments {
      id
      name
      description
      created_at
      updated_at
    }
  }
`;

export const CREATE_DEPARTMENT = gql`
  mutation CreateDepartment($name: String!, $description: String) {
    createDepartment(name: $name, description: $description) {
      id
      name
      description
      created_at
      updated_at
    }
  }
`;

export const UPDATE_DEPARTMENT = gql`
  mutation UpdateDepartment($id: ID!, $name: String, $description: String) {
    updateDepartment(id: $id, name: $name, description: $description) {
      id
      name
      description
      created_at
      updated_at
    }
  }
`;

export const DELETE_DEPARTMENT = gql`
  mutation DeleteDepartment($id: ID!) {
    deleteDepartment(id: $id)
  }
`;

export function useDepartmentsQuery() {
    return useQuery(GET_DEPARTMENTS);
}

export function useCreateDepartmentMutation() {
    const [mutate] = useMutation(CREATE_DEPARTMENT);
    return async (values: { name: string; description?: string }) => {
        await mutate({ variables: values });
    };
}

export function useUpdateDepartmentMutation() {
    const [mutate] = useMutation(UPDATE_DEPARTMENT);
    return async (id: string, values: { name?: string; description?: string }) => {
        await mutate({ variables: { id, ...values } });
    };
}

export function useDeleteDepartmentMutation() {
    const [mutate] = useMutation(DELETE_DEPARTMENT);
    return async (id: string) => {
        await mutate({ variables: { id } });
    };
}
