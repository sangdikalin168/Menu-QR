import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import AttendanceReport from '../AttendanceReport';
import { GET_ATTENDANCE_FOR_DAY } from '../../features/organization/queries/fingerprintQueries';

const mocks = [
    {
        request: {
            query: GET_ATTENDANCE_FOR_DAY,
            variables: { date: '2025-08-23', skip: 0, take: 20 },
        },
        result: {
            data: {
                attendanceForDay: [
                    { id: '1', emp_code: 'E001', name: 'Alice', clock_in: '2025-08-23T08:00:00.000Z', clock_out: '2025-08-23T17:00:00.000Z', status: 'Present' },
                    { id: '2', emp_code: 'E002', name: 'Bob', clock_in: '2025-08-23T09:30:00.000Z', clock_out: '2025-08-23T18:00:00.000Z', status: 'Present' },
                ],
            },
        },
    },
];

describe('AttendanceReport integration', () => {
    it('renders table rows and formatted dates', async () => {
        render(
            <MockedProvider mocks={mocks} addTypename={false}>
                <AttendanceReport />
            </MockedProvider>
        );

        // wait for rows to appear
        await waitFor(() => {
            expect(screen.getByText('E001')).toBeInTheDocument();
            expect(screen.getByText('E002')).toBeInTheDocument();
        });

        // check formatted dates (day-first) present in multiple rows
        const dateCells = screen.getAllByText(/23\/08\/2025/);
        expect(dateCells.length).toBeGreaterThanOrEqual(1);
    });
});
