import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Simple service to fetch fingerprint transactions via Prisma
const FingerprintService = {
    async getTransactions(opts: { since?: string | null; limit?: number | null; emp_code?: string | null }) {
        const where: any = {};
        if (opts && opts.emp_code) where.emp_code = opts.emp_code;
        if (opts && opts.since) where.punch_time = { gt: new Date(opts.since) };
        const take = opts && opts.limit ? Number(opts.limit) : 100;
        return prisma.fingerTransaction.findMany({ where, orderBy: { punch_time: 'desc' }, take });
    },
    async persist(records: Array<{ emp_code: string; punch_time: Date }>) {
        const inserted: any[] = [];
        for (const r of records) {
            const exists = await prisma.fingerTransaction.findFirst({ where: { emp_code: r.emp_code, punch_time: r.punch_time } });
            if (exists) continue;
            const created = await prisma.fingerTransaction.create({ data: { emp_code: r.emp_code, punch_time: r.punch_time } });
            inserted.push(created);
        }
        return inserted;
    }
};

export const resolvers = {
    Query: {
        departments: async () => prisma.department.findMany(),
        department: async (_: any, { id }: { id: number }) => prisma.department.findUnique({ where: { id: Number(id) } }),
        positions: async () => prisma.position.findMany(),
        position: async (_: any, { id }: { id: number }) => prisma.position.findUnique({ where: { id: Number(id) } }),
        employees: async () => prisma.employee.findMany({ include: { position: true, department: true } }),
        employee: async (_: any, { id }: { id: number }) => prisma.employee.findUnique({ where: { id: Number(id) }, include: { position: true, department: true } }),
        leaves: async (_: any, { employeeId, since, until }: { employeeId?: string | null; since?: string | null; until?: string | null }) => {
            // build filters. leaves that overlap the given range should be returned
            const where: any = {};
            if (employeeId) where.employee_id = Number(employeeId);
            if (since && until) {
                const s = new Date(since);
                const u = new Date(until);
                // overlap condition: start_time <= until AND end_time >= since
                where.AND = [{ start_time: { lte: u } }, { end_time: { gte: s } }];
            } else if (since) {
                where.end_time = { gte: new Date(since) };
            } else if (until) {
                where.start_time = { lte: new Date(until) };
            }
            const items = await prisma.leave.findMany({ where, orderBy: { start_time: 'desc' } });
            return items;
        },
        leavesPage: async (_: any, { employeeId, since, until, skip, take }: { employeeId?: string | null; since?: string | null; until?: string | null; skip?: number | null; take?: number | null }) => {
            const where: any = {};
            if (employeeId) where.employee_id = Number(employeeId);
            if (since && until) {
                const s = new Date(since);
                const u = new Date(until);
                where.AND = [{ start_time: { lte: u } }, { end_time: { gte: s } }];
            } else if (since) {
                where.end_time = { gte: new Date(since) };
            } else if (until) {
                where.start_time = { lte: new Date(until) };
            }
            const _skip = skip ? Number(skip) : 0;
            const _take = take ? Number(take) : 20;
            const [items, total] = await Promise.all([
                prisma.leave.findMany({ where, orderBy: { start_time: 'desc' }, skip: _skip, take: _take }),
                prisma.leave.count({ where }),
            ]);
            return { items, total };
        },
        fingerprintTransactions: async (_: any, { since, limit, emp_code }: { since?: string | null; limit?: number | null; emp_code?: string | null }) => {
            return FingerprintService.getTransactions({ since, limit, emp_code });
        },
        fingerprintTransactionsPage: async (_: any, { since, skip, take, emp_code }: { since?: string | null; skip?: number | null; take?: number | null; emp_code?: string | null }) => {
            const where: any = {};
            if (emp_code) where.emp_code = emp_code;
            if (since) where.punch_time = { gt: new Date(since) };
            const _take = take ? Number(take) : 100;
            const _skip = skip ? Number(skip) : 0;
            const [items, total] = await Promise.all([
                prisma.fingerTransaction.findMany({ where, orderBy: { punch_time: 'desc' }, skip: _skip, take: _take }),
                prisma.fingerTransaction.count({ where }),
            ]);
            return { items, total };
        },
        attendanceForDay: async (_: any, { date, skip, take }: { date: string; skip?: number | null; take?: number | null }) => {
            // date expected in ISO YYYY-MM-DD or full ISO; normalize to start/end of day UTC
            const dayStart = new Date(date + 'T00:00:00.000Z');
            const dayEnd = new Date(date + 'T23:59:59.999Z');
            const _skip = skip ? Number(skip) : 0;
            const _take = take ? Number(take) : undefined;

            // fetch employees (paged)
            const employees = await prisma.employee.findMany({ skip: _skip, take: _take });

            // fetch all fingerprint transactions for that day
            const tx = await prisma.fingerTransaction.findMany({ where: { punch_time: { gte: dayStart, lte: dayEnd } } });

            // fetch approved leaves that overlap the day
            const leaves = await prisma.leave.findMany({ where: { status: 'APPROVED', OR: [{ start_time: { lte: dayEnd }, end_time: { gte: dayStart } }] } });

            // fetch staff day offs that apply (simple match by day_of_week)
            const dow = dayStart.toLocaleString('en-GB', { weekday: 'long' }).toUpperCase(); // e.g., 'SUNDAY'
            const staffDayOffs = await prisma.staffDayOff.findMany({ where: { day_of_week: dow } });

            // build a map of emp_code -> times
            const txMap = new Map<string, Date[]>();
            for (const t of tx) {
                const arr = txMap.get(t.emp_code) ?? [];
                arr.push(t.punch_time);
                txMap.set(t.emp_code, arr);
            }

            // helper to check if employee has approved leave covering the day
            const empLeaveMap = new Map<number, boolean>();
            for (const l of leaves) {
                empLeaveMap.set(l.employee_id, true);
            }

            // helper to check if employee has regular day off matching this day
            const empDayOffMap = new Map<number, boolean>();
            for (const s of staffDayOffs) {
                empDayOffMap.set(s.employee_id, true);
            }

            const rows = employees.map((e: any) => {
                const times = (txMap.get(e.emp_code) ?? []).slice().sort((a: Date, b: Date) => a.getTime() - b.getTime());
                const clock_in = times.length > 0 ? times[0].toISOString() : null;
                const clock_out = times.length > 0 ? times[times.length - 1].toISOString() : null;

                let status = 'Absent';
                if (empLeaveMap.get(e.id)) status = 'Leave';
                else if (empDayOffMap.get(e.id)) status = 'Day Off';
                else if (clock_in) status = 'Present';

                return {
                    id: e.id,
                    emp_code: e.emp_code,
                    name: e.name ?? '',
                    clock_in,
                    clock_out,
                    status,
                };
            });

            return rows;
        },
        leaveBalance: async (_: any, { employeeId, year }: { employeeId: string; year?: number }) => {
            const empId = Number(employeeId);
            const targetYear = year ?? new Date().getUTCFullYear();

            // try persisted balance first
            try {
                const persisted = await (prisma as any).leaveBalance.findUnique({ where: { employee_id_year: { employee_id: empId, year: targetYear } } as any });
                if (persisted) {
                    return {
                        employee_id: String(empId),
                        year: persisted.year,
                        entitlement: persisted.entitlement,
                        used: persisted.used,
                        remaining: persisted.entitlement - persisted.used,
                    };
                }
            } catch (e) {
                // ignore, fallback to compute
            }

            // compute used days from approved leaves overlapping the year
            const start = new Date(Date.UTC(targetYear, 0, 1));
            const end = new Date(Date.UTC(targetYear + 1, 0, 1));
            const agg = await prisma.leave.aggregate({
                _sum: { leave_day: true },
                where: {
                    employee_id: empId,
                    status: 'APPROVED',
                    AND: [{ start_time: { lt: end } }, { end_time: { gte: start } }],
                },
            });
            const used = agg._sum.leave_day ?? 0;
            const defaultEntitlement = 12.0;
            return { employee_id: String(empId), year: targetYear, entitlement: defaultEntitlement, used, remaining: defaultEntitlement - used };
        },
        // Shifts
        shifts: async () => {
            const orderBy: any = { alias: 'asc' };
            return prisma.shift.findMany({ orderBy });
        },
        shiftSchedules: async (_: any, { employeeId, departmentId, date }: { employeeId?: string | null; departmentId?: string | null; date?: string | null }) => {
            const where: any = {};
            if (employeeId) where.employee_id = Number(employeeId);
            if (departmentId) where.department_id = Number(departmentId);
            if (date) {
                const d = new Date(date);
                where.AND = [{ start_date: { lte: d } }, { OR: [{ end_date: null }, { end_date: { gte: d } }] }];
            }
            return prisma.shiftSchedule.findMany({ where, include: { shift: true } });
        },
    // (TimeTable models removed from schema)
    },
    Mutation: {
        createDepartment: async (_: any, { name, description }: { name: string; description?: string }) => {
            return prisma.department.create({ data: { name, description } });
        },
        updateDepartment: async (_: any, { id, name, description }: { id: number; name?: string; description?: string }) => {
            return prisma.department.update({ where: { id: Number(id) }, data: { name, description } });
        },
        deleteDepartment: async (_: any, { id }: { id: number }) => {
            await prisma.department.delete({ where: { id: Number(id) } });
            return true;
        },
        createPosition: async (_: any, { name, description }: { name: string; description?: string }) => {
            return prisma.position.create({ data: { name, description } });
        },
        updatePosition: async (_: any, { id, name, description }: { id: number; name?: string; description?: string }) => {
            return prisma.position.update({ where: { id: Number(id) }, data: { name, description } });
        },
        deletePosition: async (_: any, { id }: { id: number }) => {
            await prisma.position.delete({ where: { id: Number(id) } });
            return true;
        },
        createEmployee: async (_: any, args: any) => {
            const { emp_code, name, phone, national_id, hire_date, position_id, department_id } = args;
            const data: any = {
                emp_code,
                name,
                is_resigned: false,
            };
            if (phone !== undefined) data.phone = phone;
            if (national_id !== undefined) data.national_id = national_id;
            if (hire_date) data.hire_date = new Date(hire_date);
            if (position_id) data.position = { connect: { id: Number(position_id) } };
            if (department_id) data.department = { connect: { id: Number(department_id) } };
            return prisma.employee.create({ data, include: { position: true, department: true } });
        },
        updateEmployee: async (_: any, args: any) => {
            const { id, name, phone, national_id, hire_date, position_id, department_id, is_resigned } = args;
            const data: any = {};
            if (name !== undefined) data.name = name;
            if (phone !== undefined) data.phone = phone;
            if (national_id !== undefined) data.national_id = national_id;
            if (hire_date !== undefined && hire_date !== null) data.hire_date = new Date(hire_date);
            if (is_resigned !== undefined) data.is_resigned = Boolean(is_resigned);
            // handle relations
            if (position_id !== undefined) {
                if (position_id === null) data.position = { disconnect: true };
                else data.position = { connect: { id: Number(position_id) } };
            }
            if (department_id !== undefined) {
                if (department_id === null) data.department = { disconnect: true };
                else data.department = { connect: { id: Number(department_id) } };
            }
            return prisma.employee.update({ where: { id: Number(id) }, data, include: { position: true, department: true } });
        },
        deleteEmployee: async (_: any, { id }: { id: number }) => {
            await prisma.employee.delete({ where: { id: Number(id) } });
            return true;
        },
        // Leave mutations
        createLeave: async (_: any, { employee_id, leave_type, start_time, end_time, leave_day, reason }: any) => {
            const ld = leave_day !== undefined ? Number(leave_day) : 1.0;
            return prisma.leave.create({ data: { employee_id: Number(employee_id), leave_type, start_time: new Date(start_time), end_time: new Date(end_time), leave_day: ld, reason, status: 'PENDING' } });
        },
        updateLeave: async (_: any, { id, leave_type, start_time, end_time, reason }: any) => {
            const data: any = {};
            if (leave_type !== undefined) data.leave_type = leave_type;
            if (start_time !== undefined) data.start_time = new Date(start_time);
            if (end_time !== undefined) data.end_time = new Date(end_time);
            if (reason !== undefined) data.reason = reason;
            return prisma.leave.update({ where: { id: Number(id) }, data });
        },
        changeLeaveStatus: async (_: any, { id, status }: any) => {
            // fetch existing leave to determine previous status and details
            const leave = await prisma.leave.findUnique({ where: { id: Number(id) } });
            if (!leave) throw new Error('Leave not found');
            const prevStatus = leave.status;
            const updated = await prisma.leave.update({ where: { id: Number(id) }, data: { status } });

            // if status changed to APPROVED, increment LeaveBalance.used for that year
            try {
                const year = updated.start_time.getUTCFullYear();
                if (prevStatus !== 'APPROVED' && status === 'APPROVED') {
                    // upsert leave balance and increment used
                    await (prisma as any).leaveBalance.upsert({
                        where: { employee_id_year: { employee_id: updated.employee_id, year } },
                        update: { used: { increment: updated.leave_day } },
                        create: { employee_id: updated.employee_id, year, entitlement: 12.0, used: updated.leave_day },
                    });
                } else if (prevStatus === 'APPROVED' && status !== 'APPROVED') {
                    // decrement used if previously approved
                    await (prisma as any).leaveBalance.updateMany({ where: { employee_id: updated.employee_id, year }, data: { used: { decrement: updated.leave_day } } });
                }
            } catch (e) {
                console.error('Failed to update LeaveBalance:', e);
            }

            return updated;
        },
        // Shift mutations
        createShift: async (_: any, { alias, in_time, out_time, day_index }: any) => {
            const data: any = { alias, in_time, out_time, day_index: Number(day_index) };
            return prisma.shift.create({ data });
        },
    // createTimeTable and assignTimeTable removed from schema
        createShiftSchedule: async (_: any, { employee_id, department_id, shift_id, start_date, end_date }: any) => {
            const data: any = { shift: { connect: { id: Number(shift_id) } }, start_date: new Date(start_date) };
            const sDate = new Date(start_date);
            const eDate = end_date ? new Date(end_date) : null;
            if (employee_id) data.employee = { connect: { id: Number(employee_id) } };
            if (department_id) data.department_id = Number(department_id);
            if (end_date) data.end_date = eDate;

            // Prevent overlapping schedules for same employee or department
            const overlapConds: any[] = [];
            if (employee_id) {
                const empCond: any = { employee_id: Number(employee_id) };
                // Overlap if existing.start_date <= new_end (if new_end) AND (existing.end_date IS NULL OR existing.end_date >= new_start)
                const ands: any[] = [];
                if (eDate) ands.push({ start_date: { lte: eDate } });
                ands.push({ OR: [{ end_date: null }, { end_date: { gte: sDate } }] });
                empCond.AND = ands;
                overlapConds.push(empCond);
            }
            if (department_id) {
                const depCond: any = { department_id: Number(department_id) };
                const ands: any[] = [];
                if (eDate) ands.push({ start_date: { lte: eDate } });
                ands.push({ OR: [{ end_date: null }, { end_date: { gte: sDate } }] });
                depCond.AND = ands;
                overlapConds.push(depCond);
            }

            if (overlapConds.length) {
                const existing = await prisma.shiftSchedule.findFirst({ where: { OR: overlapConds } });
                if (existing) {
                    throw new Error('Overlapping shift schedule exists for the given employee or department during the requested date range');
                }
            }

            return prisma.shiftSchedule.create({ data, include: { shift: true } });
        },
        deleteShiftSchedule: async (_: any, { id }: any) => {
            await prisma.shiftSchedule.delete({ where: { id: Number(id) } });
            return true;
        },
    },
};
