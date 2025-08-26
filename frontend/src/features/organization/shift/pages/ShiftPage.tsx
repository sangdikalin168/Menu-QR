import React, { useState } from 'react';
import DataTable from '@/components/common/DataTable';
// import { PlusCircleIcon } from '@heroicons/react/20/solid';
import { type ColumnDef } from '@tanstack/react-table';
import { useShifts, useCreateShift } from '../queries';
import { showSuccess, showError } from '@/utils/toastHelpers';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
// timetables removed

type Shift = {
    id: string;
    alias: string;
    in_time: string;
    out_time: string;
    day_index: number;
}

const ShiftPage: React.FC = () => {
    const { data, loading, error, refetch } = useShifts();
    // timetables removed - assign UI disabled

    // CreateShiftDialog component defined below

    const columns: ColumnDef<Shift>[] = [
        { accessorKey: 'alias', header: 'Alias' },
        { accessorKey: 'in_time', header: 'In' },
        { accessorKey: 'out_time', header: 'Out' },
        { accessorKey: 'day_index', header: 'Day' },
    ];

    // header buttons are not used directly here; actions are provided inline

    const records = data?.shifts ?? [];

    return (
        <div className="p-4">
            <h2 className="text-xl font-semibold mb-4">Shifts</h2>
            <div className="flex items-center justify-between mb-4">
                <div />
                <div className="flex items-center gap-2">
                    <CreateShiftDialog onCreated={() => refetch?.()} />

                    {/* Assign Shift feature removed (timetables deleted) */}
                </div>
            </div>

            <DataTable
                columns={columns}
                data={records}
                loading={loading}
                error={error ? error.message : null}
                headerButtons={[]}
                tableId="shifts-table"
            />
        </div>
    );
};

export default ShiftPage;

// CreateShiftDialog component: controlled dialog to create a shift
const CreateShiftDialog: React.FC<{ onCreated?: () => void }> = ({ onCreated }) => {
    const [open, setOpen] = useState(false);
    const [alias, setAlias] = useState('');
    const [inTime, setInTime] = useState('08:30');
    const [outTime, setOutTime] = useState('17:30');
    const [dayIndex, setDayIndex] = useState<string>('1');
    const [createShift] = useCreateShift();

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-green-500 text-white hover:bg-green-600">Add Shift</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create Shift</DialogTitle>
                </DialogHeader>
                <div className="grid gap-2">
                    <div>
                        <Label className="mb-1">Alias</Label>
                        <Input value={alias} onChange={(e) => setAlias(e.target.value)} />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <Label className="mb-1">In Time (HH:MM)</Label>
                            <Input value={inTime} onChange={(e) => setInTime(e.target.value)} />
                        </div>
                        <div>
                            <Label className="mb-1">Out Time (HH:MM)</Label>
                            <Input value={outTime} onChange={(e) => setOutTime(e.target.value)} />
                        </div>
                    </div>
                    <div>
                        <Label className="mb-1">Day Index</Label>
                        <Select value={dayIndex} onValueChange={(v) => setDayIndex(v)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Day" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="0">Sun</SelectItem>
                                <SelectItem value="1">Mon</SelectItem>
                                <SelectItem value="2">Tue</SelectItem>
                                <SelectItem value="3">Wed</SelectItem>
                                <SelectItem value="4">Thu</SelectItem>
                                <SelectItem value="5">Fri</SelectItem>
                                <SelectItem value="6">Sat</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                    <Button onClick={async () => {
                        try {
                            await createShift({ variables: { alias, in_time: inTime, out_time: outTime, day_index: Number(dayIndex) } });
                            showSuccess('Shift created');
                            setOpen(false);
                            onCreated?.();
                        } catch (e) {
                            console.error(e);
                            showError('Failed to create shift');
                        }
                    }}>Create</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
