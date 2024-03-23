import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { getAllNotificationsByTeam, getUnseenNotifications, updateLastseen } from '../APIs/NotificationApi';
import { toast } from 'react-toastify';

const Notifications = () => {
    const { teamID } = useParams();
    const [notifications, setNotifications] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                let response;
                if (teamID) {
                    response = await getAllNotificationsByTeam(teamID);
                } else {
                    response = await getUnseenNotifications();
                }
                setNotifications(response.data);
                await updateLastseen();
                setIsLoading(false);
            } catch (error) {
                toast.error(error.response.data.message);
                setIsLoading(false);
                // Handle error
            }
        };

        fetchData();
    }, [teamID]);

    return (
        <div>
            <h1>Notifications</h1>
            {isLoading ? (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
                    <CircularProgress />
                </div>
            ) : (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Team ID</TableCell>
                                <TableCell>Team Name</TableCell>
                                <TableCell>Message</TableCell>
                            
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {notifications.map(notification => (
                                <TableRow key={notification.teamID}>
                                    <TableCell>{notification.teamID}</TableCell>
                                    <TableCell>{notification.teamName}</TableCell>
                                    <TableCell>{notification.message}</TableCell>
                               
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </div>
    );
};

export default Notifications;
