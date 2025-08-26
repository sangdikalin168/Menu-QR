import { gql, useMutation, useQuery } from '@apollo/client';

export const GET_LEAVES = gql`
  query GetLeaves($employeeId: ID, $since: String, $until: String) {
    leaves(employeeId: $employeeId, since: $since, until: $until) {
      id
      employee_id
      leave_type
      start_time
      end_time
      leave_day
      reason
      status
      created_at
      updated_at
    }
  }
`;

export function useLeavesQuery(variables?: { employeeId?: string; since?: string; until?: string }) {
    return useQuery(GET_LEAVES, { variables });
}

export const GET_LEAVES_PAGE = gql`
  query GetLeavesPage($employeeId: ID, $since: String, $until: String, $skip: Int, $take: Int) {
    leavesPage(employeeId: $employeeId, since: $since, until: $until, skip: $skip, take: $take) {
      items {
        id
        employee_id
        leave_type
        start_time
        end_time
        leave_day
        reason
        status
        created_at
        updated_at
      }
      total
    }
  }
`;

export function useLeavesPageQuery(variables?: { employeeId?: string; since?: string; until?: string; skip?: number; take?: number }) {
    return useQuery(GET_LEAVES_PAGE, { variables });
}

export const CREATE_LEAVE = gql`
  mutation CreateLeave($employee_id: ID!, $leave_type: String!, $start_time: String!, $end_time: String!, $leave_day: Float, $reason: String) {
    createLeave(employee_id: $employee_id, leave_type: $leave_type, start_time: $start_time, end_time: $end_time, leave_day: $leave_day, reason: $reason) {
      id
      employee_id
      leave_type
      start_time
      end_time
      leave_day
      reason
      status
    }
  }
`;

export function useCreateLeaveMutation() {
    const [mutate] = useMutation(CREATE_LEAVE);
    return async (values: Record<string, any>) => {
        return mutate({ variables: values });
    };
}

export const CHANGE_LEAVE_STATUS = gql`
  mutation ChangeLeaveStatus($id: ID!, $status: String!) {
    changeLeaveStatus(id: $id, status: $status) {
      id
      status
    }
  }
`;

export function useChangeLeaveStatusMutation() {
    const [mutate] = useMutation(CHANGE_LEAVE_STATUS);
    return async (id: string, status: string) => {
        return mutate({ variables: { id, status } });
    };
}

export const GET_LEAVE_BALANCE = gql`
  query GetLeaveBalance($employeeId: ID!, $year: Int) {
    leaveBalance(employeeId: $employeeId, year: $year) {
      employee_id
      year
      entitlement
      used
    }
  }
`;

export const useLeaveBalance = (employeeId?: string, year?: number) => {
    const skip = !employeeId;
    const { data, loading, error, refetch } = useQuery(GET_LEAVE_BALANCE, {
        variables: { employeeId, year },
        skip,
        fetchPolicy: 'network-only',
    });

    return {
        balance: data?.leaveBalance,
        loading,
        error,
        refetch,
    };
};