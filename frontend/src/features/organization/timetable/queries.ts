import { gql, useMutation, useQuery } from '@apollo/client';

export const GET_TIMETABLES = gql`
  query GetTimeTables {
    timeTables { id name description created_at updated_at entries { id weekday start_time end_time entry_type position created_at updated_at } }
  }
`;

export const CREATE_TIMETABLE = gql`
  mutation CreateTimeTable($name: String!, $description: String, $entries: [TimeTableEntryInput!]!) {
    createTimeTable(name: $name, description: $description, entries: $entries) { id name description }
  }
`;

export const useTimeTables = () => useQuery(GET_TIMETABLES, { fetchPolicy: 'network-only' });

export const useCreateTimeTable = () => useMutation(CREATE_TIMETABLE);

export const ASSIGN_TIMETABLE = gql`
  mutation AssignTimeTable($employee_id: ID, $department_id: ID, $timetable_id: ID!, $start_date: String!, $end_date: String, $weekday_from: Int, $weekday_to: Int) {
    assignTimeTable(employee_id: $employee_id, department_id: $department_id, timetable_id: $timetable_id, start_date: $start_date, end_date: $end_date, weekday_from: $weekday_from, weekday_to: $weekday_to) {
      id
    }
  }
`;

export const useAssignTimeTable = () => useMutation(ASSIGN_TIMETABLE);
