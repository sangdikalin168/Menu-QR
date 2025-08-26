import { gql } from '@apollo/client';
import { useQuery, useMutation } from '@apollo/client';

export const GET_SHIFTS = gql`
  query GetShifts {
  shifts { id alias in_time out_time day_index created_at updated_at }
  }
`;

export const CREATE_SHIFT = gql`
  mutation CreateShift($alias: String!, $in_time: String!, $out_time: String!, $day_index: Int!) {
    createShift(alias: $alias, in_time: $in_time, out_time: $out_time, day_index: $day_index) {
      id
      alias
    }
  }
`;

export const CREATE_SHIFT_SCHEDULE = gql`
  mutation CreateShiftSchedule($employee_id: ID, $department_id: ID, $shift_id: ID!, $start_date: String!, $end_date: String) {
    createShiftSchedule(employee_id: $employee_id, department_id: $department_id, shift_id: $shift_id, start_date: $start_date, end_date: $end_date) {
      id
    }
  }
`;

export const useShifts = () => useQuery(GET_SHIFTS, { fetchPolicy: 'network-only' });
export const useCreateShift = () => useMutation(CREATE_SHIFT);
export const useCreateShiftSchedule = () => useMutation(CREATE_SHIFT_SCHEDULE);
