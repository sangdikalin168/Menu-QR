import { gql, useQuery } from '@apollo/client';

export const GET_FINGERPRINT_TRANSACTIONS = gql`
  query GetFingerprintTransactions($since: String, $limit: Int, $emp_code: String) {
    fingerprintTransactions(since: $since, limit: $limit, emp_code: $emp_code) {
      id
      emp_code
      punch_time
    }
  }
`;

export function useFingerprintTransactionsQuery(variables?: { since?: string; limit?: number; emp_code?: string }) {
  return useQuery(GET_FINGERPRINT_TRANSACTIONS, { variables });
}

export const GET_FINGERPRINT_TRANSACTIONS_PAGE = gql`
  query GetFingerprintTransactionsPage($since: String, $skip: Int, $take: Int, $emp_code: String) {
    fingerprintTransactionsPage(since: $since, skip: $skip, take: $take, emp_code: $emp_code) {
      items {
        id
        emp_code
        punch_time
      }
      total
    }
  }
`;

export function useFingerprintTransactionsPageQuery(variables?: { since?: string; skip?: number; take?: number; emp_code?: string }) {
  return useQuery(GET_FINGERPRINT_TRANSACTIONS_PAGE, { variables });
}

export const GET_ATTENDANCE_FOR_DAY = gql`
  query GetAttendanceForDay($date: String!, $skip: Int, $take: Int) {
    attendanceForDay(date: $date, skip: $skip, take: $take) {
      id
      emp_code
      name
      clock_in
      clock_out
      status
    }
  }
`;

export function useAttendanceForDayQuery(variables?: { date: string; skip?: number; take?: number }) {
  return useQuery(GET_ATTENDANCE_FOR_DAY, { variables });
}
