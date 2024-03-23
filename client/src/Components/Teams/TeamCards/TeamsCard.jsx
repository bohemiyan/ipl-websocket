import React, { useState } from 'react';
import { Card, CardContent, Typography, IconButton, Badge, CardMedia, Box, TextField, Button, Grid } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import EditIcon from '@mui/icons-material/Edit';
import SubscribeIcon from '@mui/icons-material/Notifications';
import UnsubscribeIcon from '@mui/icons-material/NotificationsOff';
import { TeamBanner } from './ImageProvider';
import { SubscribeTeam, UpdateTeamById } from '../../APIs/TeamsApi';
import { toast } from 'react-toastify';
import { useLocation, useNavigate } from 'react-router-dom';

const TeamCard = ({ data, userLevel }) => {
    const location = useLocation();
    const navigate = useNavigate();

    const { teamID, teamName, runs, overs, wickets, target, isSubscribed, newNotificationCount } = data;
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [updatedTeamName, setUpdatedTeamName] = useState(teamName);
    const [updatedRuns, setUpdatedRuns] = useState(runs);
    const [updatedOvers, setUpdatedOvers] = useState(overs);
    const [updatedWickets, setUpdatedWickets] = useState(wickets);
    const [updatedTarget, setUpdatedTarget] = useState(target);

    const handleEditClick = () => {
        setIsEditOpen(!isEditOpen);
    };

    const handleUpdateClick = async () => {
        const updatedTeamData = {
            teamID: teamID,
            teamName: updatedTeamName,
            runs: updatedRuns,
            overs: updatedOvers,
            wickets: updatedWickets,
            target: updatedTarget,
        };
        // onUpdate(updatedTeamData);
        try {
            await UpdateTeamById(updatedTeamData);
            toast.success('Team data updated successfully');
            setIsEditOpen(false);
            window.location.reload();
        } catch (error) {
            toast.error(error.response.data.message);
        }

    };

    const handleSubscribeClick = async () => {
        try {
            await SubscribeTeam(teamID, "in")
            toast.info("Subscribed to " + teamName);
            window.location.reload();
        } catch (error) {
            toast.error(error.response.data.message);
        }
    };

    const handleUnsubscribeClick = async () => {
        try {
            await SubscribeTeam(teamID, "un")
            toast.info("un-Subscribed from " + teamName);
            window.location.reload();
        } catch (error) {
            toast.error(error.response.data.message);
        }
    };

    return (
        <Card sx={{ width: 360, height: 'auto', borderRadius: '10px', margin: '20px', backgroundImage: 'linear-gradient(to right, #b3e0ff, #99ccff)', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <CardMedia
                    component="img"
                    image={TeamBanner(teamID)}
                    alt={TeamBanner(teamID)}
                    sx={{ width: '250px', height: '250px', objectFit: 'contain', borderRadius: '10px 10px 0 0' }}
                />
            </Box>
            <CardContent sx={{ flex: '1 0 auto', padding: '20px', display: 'flex', flexDirection: 'column' }}>
                <Typography variant="h5" component="h2" sx={{ mb: 1 }}>
                    {teamName}
                </Typography>
                <Typography color="textSecondary" gutterBottom>
                    runs: {runs} | overs: {overs} | wickets: {wickets} | Target: {target}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    {userLevel === 1 ? (
                        <IconButton aria-label="edit" onClick={handleEditClick}>
                            <EditIcon />
                        </IconButton>
                    ) : (
                        location.pathname === "/" ? (
                            <IconButton aria-label="notifications" onClick={() => { navigate(`/notifications/${teamID}`) }}>
                                <Badge badgeContent={newNotificationCount} color="secondary">
                                    <NotificationsIcon />
                                </Badge>
                            </IconButton>
                        ) : (isSubscribed ? (
                            <IconButton aria-label="unsubscribe" onClick={handleUnsubscribeClick}>
                                <UnsubscribeIcon /> <h6>click to unsubscribe</h6>
                            </IconButton>
                        ) : (
                            <IconButton aria-label="subscribe" onClick={handleSubscribeClick}>
                                <SubscribeIcon /><h6>click to subscribe</h6>
                            </IconButton>
                        ))
                    )}
                </Box>
            </CardContent>
            {isEditOpen && (
                <Box sx={{ padding: '20px', borderTop: '1px solid #ccc' }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                label="Team Name"
                                variant="outlined"
                                fullWidth
                                value={updatedTeamName}
                                onChange={(e) => setUpdatedTeamName(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Runs"
                                variant="outlined"
                                fullWidth
                                value={updatedRuns}
                                onChange={(e) => setUpdatedRuns(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Overs"
                                variant="outlined"
                                fullWidth
                                value={updatedOvers}
                                onChange={(e) => setUpdatedOvers(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Wickets"
                                variant="outlined"
                                fullWidth
                                value={updatedWickets}
                                onChange={(e) => setUpdatedWickets(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Target"
                                variant="outlined"
                                fullWidth
                                value={updatedTarget}
                                onChange={(e) => setUpdatedTarget(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Button variant="contained" color="primary" onClick={handleUpdateClick}>
                                Update
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            )}
        </Card>
    );
};

export default TeamCard;
