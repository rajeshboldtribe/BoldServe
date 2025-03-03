import React, { useState } from 'react';
import { 
    Box, 
    Button, 
    Typography, 
    Modal,
    TextField,
    Paper,
    Fade
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { format } from 'date-fns';
import Login from '../pages/Login';
import bookMeetingRoomImg from '../assets/empty-business-meeting-conference-room-with-graphs-diagrams-tv-background.jpg';

const BookMeetingRoom = ({ isLoggedIn }) => {
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showTimeSlotModal, setShowTimeSlotModal] = useState(false);
    const [selectedDateTime, setSelectedDateTime] = useState(null);

    const handleBookNowClick = () => {
        if (!isLoggedIn) {
            setShowLoginModal(true);
        } else {
            setShowTimeSlotModal(true);
        }
    };

    const handleLoginSuccess = () => {
        setShowLoginModal(false);
        setShowTimeSlotModal(true);
    };

    const handleTimeSlotSubmit = () => {
        if (selectedDateTime) {
            const formattedDateTime = format(selectedDateTime, "MMM dd, yyyy 'at' hh:mm a");
            const userData = JSON.parse(localStorage.getItem('userData') || '{}');
            const userName = userData.fullName || 'User';
            const message = encodeURIComponent(`Hi, I am ${userName}. I want to book the meeting room for meeting from ${formattedDateTime}`);
            window.location.href = `https://wa.me/+917684836139?text=${message}`;
        }
    };

    return (
        <>
            <Box
                sx={{
                    minHeight: '90vh',
                    position: 'relative',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    my: 8, // Add margin top and bottom
                    pt: 4, // Add padding top for navbar gap
                    pb: 4, // Add padding bottom for footer gap
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundImage: `url(${bookMeetingRoomImg})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        filter: 'brightness(0.7)',
                        animation: 'zoomInOut 20s infinite alternate',
                    },
                    '@keyframes zoomInOut': {
                        '0%': { transform: 'scale(1)' },
                        '100%': { transform: 'scale(1.1)' },
                    },
                }}
            >
                <Paper
                    elevation={6}
                    sx={{
                        position: 'relative',
                        p: 4,
                        maxWidth: 400,
                        textAlign: 'center',
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        borderRadius: 2,
                        animation: 'fadeIn 1s ease-out',
                        '@keyframes fadeIn': {
                            from: {
                                opacity: 0,
                                transform: 'translateY(20px)',
                            },
                            to: {
                                opacity: 1,
                                transform: 'translateY(0)',
                            },
                        },
                    }}
                >
                    <Typography 
                        variant="h4" 
                        component="h1" 
                        gutterBottom
                        sx={{ 
                            color: '#7B68EE',
                            fontWeight: 'bold',
                            mb: 3
                        }}
                    >
                        Book Meeting Room
                    </Typography>
                    <Typography 
                        variant="body1" 
                        sx={{ mb: 4 }}
                    >
                        Book our professional meeting room for your important discussions and presentations.
                    </Typography>
                    <Button
                        variant="contained"
                        size="large"
                        onClick={handleBookNowClick}
                        sx={{
                            bgcolor: '#7B68EE',
                            '&:hover': { bgcolor: '#6A5ACD' },
                            animation: 'pulse 2s infinite',
                            '@keyframes pulse': {
                                '0%': { transform: 'scale(1)' },
                                '50%': { transform: 'scale(1.05)' },
                                '100%': { transform: 'scale(1)' },
                            },
                        }}
                    >
                        Book Now
                    </Button>
                </Paper>
            </Box>

            {/* Login Modal */}
            <Login
                open={showLoginModal}
                onClose={() => setShowLoginModal(false)}
                onLogin={handleLoginSuccess}
            />

            {/* Time Slot Selection Modal */}
            <Modal
                open={showTimeSlotModal}
                onClose={() => setShowTimeSlotModal(false)}
                closeAfterTransition
            >
                <Fade in={showTimeSlotModal}>
                    <Box
                        sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: 400,
                            bgcolor: 'background.paper',
                            borderRadius: 2,
                            boxShadow: 24,
                            p: 4,
                        }}
                    >
                        <Typography variant="h6" component="h2" gutterBottom>
                            Select Meeting Time
                        </Typography>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DateTimePicker
                                label="Date & Time"
                                value={selectedDateTime}
                                onChange={(newValue) => setSelectedDateTime(newValue)}
                                renderInput={(params) => <TextField {...params} fullWidth />}
                                minDateTime={new Date()}
                            />
                        </LocalizationProvider>
                        <Button
                            fullWidth
                            variant="contained"
                            onClick={handleTimeSlotSubmit}
                            disabled={!selectedDateTime}
                            sx={{
                                mt: 3,
                                bgcolor: '#7B68EE',
                                '&:hover': { bgcolor: '#6A5ACD' },
                            }}
                        >
                            Proceed to Book
                        </Button>
                    </Box>
                </Fade>
            </Modal>
        </>
    );
};

export default BookMeetingRoom;