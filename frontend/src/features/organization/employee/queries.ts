import { gql, useQuery, useMutation } from '@apollo/client';

export const GET_EMPLOYEES = gql`
  query GetEmployees {
    employees {
      id
      emp_code
  name
      phone
      national_id
      hire_date
      is_resigned
      position {
        id
        name
      }
      department {
        id
        name
      }
      created_at
      updated_at
    }
  }
`;

export const CREATE_EMPLOYEE = gql`
  mutation CreateEmployee($emp_code: String!, $name: String!, $phone: String, $national_id: String, $hire_date: String, $position_id: ID, $department_id: ID) {
    createEmployee(emp_code: $emp_code, name: $name, phone: $phone, national_id: $national_id, hire_date: $hire_date, position_id: $position_id, department_id: $department_id) {
      id
      emp_code
    }
  }
`;

export const UPDATE_EMPLOYEE = gql`
  mutation UpdateEmployee($id: ID!, $name: String, $phone: String, $national_id: String, $hire_date: String, $position_id: ID, $department_id: ID, $is_resigned: Boolean) {
    updateEmployee(id: $id, name: $name, phone: $phone, national_id: $national_id, hire_date: $hire_date, position_id: $position_id, department_id: $department_id, is_resigned: $is_resigned) {
      id
    }
  }
`;

export const DELETE_EMPLOYEE = gql`
  mutation DeleteEmployee($id: ID!) {
    deleteEmployee(id: $id)
  }
`;

export function useEmployeesQuery() {
    return useQuery(GET_EMPLOYEES);
}

export function useCreateEmployeeMutation() {
    const [mutate] = useMutation(CREATE_EMPLOYEE);
    return async (values: Record<string, unknown>) => {
        return mutate({ variables: values });
    };
}

export function useUpdateEmployeeMutation() {
    const [mutate] = useMutation(UPDATE_EMPLOYEE);
    return async (id: string, values: Record<string, unknown>) => {
        return mutate({ variables: { id, ...values } });
    };
}

export function useDeleteEmployeeMutation() {
    const [mutate] = useMutation(DELETE_EMPLOYEE);
    return async (id: string) => {
        return mutate({ variables: { id } });
    };
}
