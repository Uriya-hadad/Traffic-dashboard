import {useState, useMemo, useEffect} from "react";
import {
    Box,
    Card,
    CardContent,
    FormControl,
    Button,
    InputLabel,
    Select,
    MenuItem,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TablePagination,
    TableHead,
    TableRow,
    Paper
} from "@mui/material";
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {AdapterDateFns} from '@mui/x-date-pickers/AdapterDateFns';
import {DatePicker} from '@mui/x-date-pickers/DatePicker';
import SyncIcon from '@mui/icons-material/Sync';
import {LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer} from "recharts";
import {format, startOfWeek, startOfMonth} from 'date-fns';
import {deleteTraffic, getTrafficsPaginated, saveTraffic, updateTraffic} from "../lib/serviceApis.ts";
import type {TrafficType, TrafficWithoutIdType} from "../types/types.ts";
import {SnackbarAlert, TrafficDate, type SnackbarAlertProps, Spinner} from "../components";
import CreateTrafficForm from "./CreateTrafficForm.tsx";
import UpdateTrafficForm from "./UpdateTrafficForm.tsx";
import DeleteTrafficForm from "./DeleteTrafficForm.tsx";
import {
    ERROR_MESSAGE,
    SUCCESSFUL_CREATE_MESSAGE,
    SUCCESSFUL_DELETE_MESSAGE,
    SUCCESSFUL_UPDATE_MESSAGE
} from "../lib/globals.ts";

type SortType = "date" | "visits";
type viewModeType = "weekly" | "monthly" | "daily";

export default function Dashboard() {
    const [data, setData] = useState<null | TrafficType[]>(null);
    const [viewMode, setViewMode] = useState<viewModeType>("daily");
    const [createFromData, setCreateFromData] = useState<TrafficWithoutIdType | null>(null);
    const [updateFromData, setUpdateFromData] = useState<TrafficType | null>(null);
    const [deleteFromData, setDeleteFromData] = useState<TrafficType | null>(null);
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [snackbar, setSnackbar] = useState<Partial<SnackbarAlertProps>>({
        open: false,
        message: '',
        severity: 'success'
    });
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [sortBy, setSortBy] = useState<SortType>("date");
    const [sortOrder, setSortOrder] = useState("asc");

    // pagination states
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [totalCount, setTotalCount] = useState(0);
    const [refresh, setRefresh] = useState(true);


    useEffect(() => {
        setData(null);
        getTrafficsPaginated(page,rowsPerPage, sortBy, sortOrder, viewMode).then((res) => {
            setData(res.data);
            setTotalCount(res.totalCount);
        }).catch(() => {
            setSnackbar({open: true, message: ERROR_MESSAGE, severity: "error"});
            setData([]);
        });
    }, [page, rowsPerPage, sortBy, sortOrder, viewMode, refresh]);

    const handleAdd = () => {
        setCreateFromData({
            date: '',
            visits: 0
        });
    }


    const handleDelete = (traffic: TrafficType) => {
        deleteTraffic(traffic.id).then(() => {
            setData((prev) => {
                if (!prev) return [];
                return prev.filter((item) => item.id !== traffic.id);
            });
            setSnackbar({open: true, message: SUCCESSFUL_DELETE_MESSAGE, severity: "success"});
        }).catch(() => {
            setSnackbar({open: true, message: ERROR_MESSAGE, severity: "error"});
        });
    };

    const handleUpdate = (data: TrafficType) => updateTraffic({
        date: data.date,
        visits: data.visits
    }, data.id).then(() => {
        setData((prev) => {
            if (!prev) return [];
            return prev.map((item) => item.id === data.id ? {
                ...item,
                date: data.date,
                visits: data.visits
            } : item);
        });
        setSnackbar({open: true, message: SUCCESSFUL_UPDATE_MESSAGE, severity: "success"});
    }).catch(() => {
        setSnackbar({open: true, message: ERROR_MESSAGE, severity: "error"});
    });

    const handleSave = (data: TrafficWithoutIdType) => {
        saveTraffic(data).then((res) => {
            setTotalCount((prev) => prev + 1);
            setData((prev) => {
                if (!prev) return [];
                return [...prev, {...data, id: res.id}];
            });
            setCreateFromData(null);
            setSnackbar({open: true, message: SUCCESSFUL_CREATE_MESSAGE, severity: "success"});
        }).catch(() => {
            setSnackbar({open: true, message: ERROR_MESSAGE, severity: "error"});
        });
    };

    const handleChangePage = (_event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const aggregateDataForChart = useMemo(() => {
        if (!data) return [];

        const grouped: { [key: string]: { id: string, visits: number } } = {};

        data.forEach((entry) => {
            const date = new Date(entry.date);
            let key: string;

            if (viewMode === "weekly") {
                key = format(startOfWeek(date, {weekStartsOn: 1}), "yyyy-MM-dd");
            } else if (viewMode === "monthly") {
                key = format(startOfMonth(date), "yyyy-MM");
            } else {
                key = entry.date;
            }

            if (key && !grouped[key]) {
                grouped[key] = {id: entry.id, visits: 0};
            }
            grouped[key].visits += entry.visits;
        });

        return Object.entries(grouped).map((traffic) => ({
            date: traffic[0],
            visits: traffic[1].visits,
            id: traffic[1].id
        }));
    }, [data, viewMode]);

    const filteredData = useMemo(() => {
        let filtered = [...aggregateDataForChart];
        if (startDate && endDate) {
            filtered = filtered.filter((entry) => {
                const date = new Date(entry.date);
                return date >= startDate && date <= endDate;
            });
        }
        filtered.sort((a, b) => {
            const key = sortBy;
            if (sortOrder === "asc") return a[key] > b[key] ? 1 : -1;
            return a[key] < b[key] ? 1 : -1;
        });
        return filtered;
    }, [aggregateDataForChart, startDate, endDate, sortBy, sortOrder]);



    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Box sx={{p: 4, display: 'flex', flexDirection: 'column', gap: 4}}>
                <Card>
                    <CardContent sx={{display: 'flex', flexWrap: 'wrap', gap: 2}}>
                        <DatePicker
                            label="Start Date"
                            value={startDate}
                            onChange={(newDate) => setStartDate(newDate)}
                            // renderInput={(params) => <TextField {...params} />}
                        />
                        <DatePicker
                            label="End Date"
                            value={endDate}
                            onChange={(newDate) => setEndDate(newDate)}
                            // renderInput={(params) => <TextField {...params} />}
                        />
                        <FormControl>
                            <InputLabel>Sort By</InputLabel>
                            <Select value={sortBy} onChange={(e) => setSortBy(e.target.value)} label="Sort By">
                                <MenuItem value="date">Date</MenuItem>
                                <MenuItem value="visits">Visits</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl>
                            <InputLabel>Order</InputLabel>
                            <Select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} label="Order">
                                <MenuItem value="asc">Ascending</MenuItem>
                                <MenuItem value="desc">Descending</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl>
                            <InputLabel>View</InputLabel>
                            <Select value={viewMode} onChange={(e) => setViewMode(e.target.value)} label="View">
                                <MenuItem value="daily">Daily</MenuItem>
                                <MenuItem value="weekly">Weekly</MenuItem>
                                <MenuItem value="monthly">Monthly</MenuItem>
                            </Select>
                        </FormControl>
                        <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                            <Button variant="contained" onClick={handleAdd}>Add Entry</Button>
                            <Button>
                                <SyncIcon onClick={() => setRefresh(!refresh)}/>
                            </Button>
                        </Box>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent sx={{height: 300}}>
                        <ResponsiveContainer width="100%" height="100%"
                                             style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
                            {!data ? <Spinner/> :
                                <LineChart data={filteredData}>
                                    <XAxis dataKey="date"/>
                                    <YAxis/>
                                    <Tooltip
                                        formatter={(value) => [`${value} visits`, '']}
                                        labelFormatter={(label) => {
                                            if (viewMode === 'weekly') {
                                                return `Week of ${label}`;
                                            }
                                            if (viewMode === 'monthly') {
                                                return `Month: ${label}`;
                                            }
                                            return `${label}`;
                                        }}
                                    />
                                    <Line type="monotone" dataKey="visits" stroke="#8884d8"/>
                                </LineChart>}
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
                        {!data ? <Spinner/> :
                            <TableContainer component={Paper}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Date</TableCell>
                                            <TableCell align="center">Visits</TableCell>
                                            <TableCell align="right">Actions</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {filteredData.map((entry, index) => (
                                            <TableRow key={index}>
                                                <TrafficDate key={entry.id} traffic={entry} onEdit={setUpdateFromData}
                                                             onDelete={setDeleteFromData}/>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                                <TablePagination
                                    rowsPerPageOptions={[5, 10, 30, 60]}
                                    component="div"
                                    count={totalCount}
                                    rowsPerPage={rowsPerPage}
                                    page={page}
                                    onPageChange={handleChangePage}
                                    onRowsPerPageChange={handleChangeRowsPerPage}/>
                            </TableContainer>
                        }
                    </CardContent>
                </Card>

                <CreateTrafficForm open={!!createFromData} initialData={createFromData!} onSave={handleSave}
                                   onClose={() => setCreateFromData(null)}/>

                <DeleteTrafficForm open={!!deleteFromData} onDelete={handleDelete} entry={deleteFromData!}
                                   onClose={() => setDeleteFromData(null)}/>

                <UpdateTrafficForm open={!!updateFromData} initialData={updateFromData!} onSave={handleUpdate}
                                   onClose={() => setUpdateFromData(null)}/>

                <SnackbarAlert open={snackbar.open!} onClose={() => setSnackbar({...snackbar, open: false})}
                               message={snackbar.message!} severity={snackbar.severity!}/>
            </Box>
        </LocalizationProvider>
    )
        ;
}
