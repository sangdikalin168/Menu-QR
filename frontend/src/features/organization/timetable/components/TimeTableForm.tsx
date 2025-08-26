import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useCreateTimeTable } from '../queries';
import { showSuccess, showError } from '@/utils/toastHelpers';

const TimeTableForm: React.FC<{ onCreated?: () => void }> = ({ onCreated }) => {
    const [open, setOpen] = React.useState(false);
    const [name, setName] = React.useState('');
    const [clockIn, setClockIn] = React.useState('09:00');
    const [clockOut, setClockOut] = React.useState('17:00');
    const [createTimeTable] = useCreateTimeTable();

    const handleCreate = async () => {
        if (!name.trim()) return showError('Please enter a name');
        try {
            await createTimeTable({ variables: { name, description: '', entries: [{ weekday: 1, start_time: clockIn, end_time: clockOut, entry_type: 'IN', position: 0 }] } });
            showSuccess('Timetable created');
            setOpen(false);
            setName('');
            setClockIn('09:00');
            setClockOut('17:00');
            onCreated?.();
        } catch (e) {
            showError('Failed to create timetable');
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>Add Timetable</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create Timetable</DialogTitle>
                </DialogHeader>
                <div className="grid gap-2">
                    <div>
                        <Label className="mb-1">Name</Label>
                        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Timetable name" />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <Label className="mb-1">Clock In</Label>
                            <Input value={clockIn} onChange={(e) => setClockIn(e.target.value)} />
                        </div>
                        <div>
                            <Label className="mb-1">Clock Out</Label>
                            <Input value={clockOut} onChange={(e) => setClockOut(e.target.value)} />
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                    <Button onClick={handleCreate}>Create</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default TimeTableForm;
