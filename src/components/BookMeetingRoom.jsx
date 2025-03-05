import React, { useState } from 'react';
import { 
    Box, 
    Button, 
    Typography, 
    Modal,
    TextField,
    Paper,
    Fade,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Card,
    CardContent
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { format, setHours, setMinutes } from 'date-fns';
import Login from '../pages/Login';
import bookMeetingRoomImg from '../assets/damir-kopezhanov-VM1Voswbs0A-unsplash.jpg';
// Add import for logo at the top
import logo from '../assets/BoldTribe Logo-3.png'; // Make sure you have the logo in your assets folder

const BookMeetingRoom = ({ isLoggedIn }) => {
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [showTimeSlotModal, setShowTimeSlotModal] = useState(false);
    const [showRoomSelectionModal, setShowRoomSelectionModal] = useState(false);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [bookingType, setBookingType] = useState('');  // Add this line
    const [memberType, setMemberType] = useState('');    // Add this line
    
    const rooms = [
        { id: '307', name: 'Room 307' },
        { id: '630', name: 'Room 630' },
        { id: '730', name: 'Room 730' },
        { id: '420', name: 'Room 420' },
        { id: '170', name: 'Room 170' }
    ];

    // Mock data for booked rooms (in real app, this would come from backend)
    const [bookedRooms, setBookedRooms] = useState({
        // Today's bookings
        [`${format(new Date(), 'yyyy-MM-dd')}-09:00`]: ['307'],
        [`${format(new Date(), 'yyyy-MM-dd')}-10:00`]: ['420', '170'],
        [`${format(new Date(), 'yyyy-MM-dd')}-11:00`]: ['730'],
        [`${format(new Date(), 'yyyy-MM-dd')}-14:00`]: ['307'],
        [`${format(new Date(), 'yyyy-MM-dd')}-15:30`]: ['630'],

        // Tomorrow's bookings
        [`${format(new Date(new Date().setDate(new Date().getDate() + 1)), 'yyyy-MM-dd')}-09:30`]: ['170'],
        [`${format(new Date(new Date().setDate(new Date().getDate() + 1)), 'yyyy-MM-dd')}-11:00`]: ['307', '420'],
        [`${format(new Date(new Date().setDate(new Date().getDate() + 1)), 'yyyy-MM-dd')}-13:30`]: ['730'],
        [`${format(new Date(new Date().setDate(new Date().getDate() + 1)), 'yyyy-MM-dd')}-15:00`]: ['170'],

        // Day after tomorrow's bookings
        [`${format(new Date(new Date().setDate(new Date().getDate() + 2)), 'yyyy-MM-dd')}-10:00`]: ['420'],
        [`${format(new Date(new Date().setDate(new Date().getDate() + 2)), 'yyyy-MM-dd')}-12:30`]: ['730', '170'],
        [`${format(new Date(new Date().setDate(new Date().getDate() + 2)), 'yyyy-MM-dd')}-14:00`]: ['307'],
        [`${format(new Date(new Date().setDate(new Date().getDate() + 2)), 'yyyy-MM-dd')}-16:00`]: ['420'],
    });

    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState('');
    const [selectedEndTime, setSelectedEndTime] = useState('');
    const [calculatedPrice, setCalculatedPrice] = useState({ subtotal: 0, gst: 0, total: 0, duration: 0 });

    // Update timeSlots to include 30-minute intervals
    const timeSlots = Array.from({ length: 19 }, (_, i) => {
        const hour = Math.floor(i / 2) + 9;
        const minutes = (i % 2) * 30;
        const time = `${hour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
        return {
            display: `${time}${hour < 12 ? 'AM' : 'PM'}`,
            value: time
        };
    });

    // Get available end times based on start time
    const getEndTimeSlots = (startTime) => {
        if (!startTime) return [];
        const startIndex = timeSlots.findIndex(slot => slot.value === startTime);
        return timeSlots.slice(startIndex + 1);
    };

    // Calculate next 3 days
    const getAvailableDates = () => {
        const dates = [];
        const today = new Date();
        for (let i = 0; i < 3; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() + i);
            dates.push(date);
        }
        return dates;
    };

    // Update price calculation
    const calculatePrice = (start, end) => {
        if (!start || !end) return 0;
        const [startHour, startMinute] = start.split(':').map(Number);
        const [endHour, endMinute] = end.split(':').map(Number);
        const duration = (endHour - startHour) + (endMinute - startMinute) / 60;
        const basePrice = memberType === 'member' ? 400 : 500;
        const subtotal = Math.ceil(duration * basePrice);
        const gst = subtotal * 0.18;
        return {
            subtotal,
            gst,
            total: subtotal + gst,
            duration
        };
    };


    // Update time slot selection modal content
    const TimeSlotContent = () => (
        <>
            <Typography variant="h6" gutterBottom>
                Select Date and Time
            </Typography>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                    label="Select Date"
                    value={selectedDate}
                    onChange={setSelectedDate}
                    renderInput={(params) => <TextField {...params} fullWidth sx={{ mb: 2 }} />}
                    minDate={new Date()}
                    maxDate={getAvailableDates()[2]}
                    shouldDisableDate={(date) => !getAvailableDates().some(d => 
                        d.getDate() === date.getDate() && 
                        d.getMonth() === date.getMonth() && 
                        d.getYear() === date.getYear()
                    )}
                />
            </LocalizationProvider>
            
            {selectedDate && (
                <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>Start Time</InputLabel>
                    <Select
                        value={selectedTime}
                        onChange={(e) => {
                            setSelectedTime(e.target.value);
                            setSelectedEndTime('');
                        }}
                        label="Start Time"
                    >
                        {timeSlots.map((slot) => (
                            <MenuItem key={slot.value} value={slot.value}>
                                {slot.display}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            )}

            {selectedTime && (
                <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>End Time</InputLabel>
                    <Select
                        value={selectedEndTime}
                        onChange={(e) => {
                            setSelectedEndTime(e.target.value);
                            setCalculatedPrice(calculatePrice(selectedTime, e.target.value));
                        }}
                        label="End Time"
                    >
                        {getEndTimeSlots(selectedTime).map((slot) => (
                            <MenuItem key={slot.value} value={slot.value}>
                                {slot.display}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            )}

            {selectedEndTime && (
                <Box sx={{ mt: 2, color: 'primary.main' }}>
                    <Typography variant="h6">
                        Price Details ({Math.floor(calculatedPrice.duration)} hours {calculatedPrice.duration % 1 ? '30 mins' : ''})
                    </Typography>
                    <Typography variant="body1">
                        Base Price: ₹{calculatedPrice.subtotal}/-
                    </Typography>
                    <Typography variant="body1">
                        GST (18%): ₹{Math.ceil(calculatedPrice.gst)}/-
                    </Typography>
                    <Typography variant="h6" sx={{ mt: 1 }}>
                        Total: ₹{Math.ceil(calculatedPrice.total)}/-
                    </Typography>
                </Box>
            )}

            <Button
                fullWidth
                variant="contained"
                onClick={handleBookingSubmit}
                disabled={!selectedDate || !selectedTime || !selectedEndTime}
                sx={{
                    mt: 2,
                    background: 'linear-gradient(135deg, #7B68EE 0%, #6A5ACD 100%)',
                    '&:hover': {
                        background: 'linear-gradient(135deg, #6A5ACD 0%, #5B4ACE 100%)'
                    }
                }}
            >
                View Available Rooms
            </Button>
        </>
    );

    // Update room availability check
    const isRoomAvailable = (roomId, date, startTime, endTime) => {
        if (!date || !startTime || !endTime) return true;
        
        // Mock availability check (replace with your backend logic)
        const timeKey = `${format(date, 'yyyy-MM-dd')}-${startTime}-${endTime}`;
        return !bookedRooms[timeKey]?.includes(roomId);
    };

    // Update handleFinalBooking
    // Add this function after the bookedRooms state declaration
    const addNewBooking = (date, startTime, roomId) => {
        const timeKey = `${format(date, 'yyyy-MM-dd')}-${startTime}`;
        setBookedRooms(prevBookings => ({
            ...prevBookings,
            [timeKey]: [...(prevBookings[timeKey] || []), roomId]
        }));
    };

    // Update handleFinalBooking to include the new booking
    const handleFinalBooking = () => {
        if (selectedDate && selectedTime && selectedEndTime && selectedRoom) {
            // Add the new booking
            addNewBooking(selectedDate, selectedTime, selectedRoom);

            const formattedDate = format(selectedDate, "MMM dd, yyyy");
            const userData = JSON.parse(localStorage.getItem('userData') || '{}');
            const userName = userData.fullName || 'User';
            const message = encodeURIComponent(
                `Hi, I am ${userName}. I want to book the meeting room ${selectedRoom} as a ${memberType} from ${formattedDate} ${selectedTime} to ${selectedEndTime}. Price: INR ${Math.ceil(calculatedPrice.total)}/- (Including GST)`
            );
            window.location.href = `https://wa.me/+917684836139?text=${message}`;
        }
    };

    const getPricing = () => {
        if (bookingType === 'whole_day') {
            return memberType === 'member' ? 2500 : 3000;
        }
        return memberType === 'member' ? 400 : 500;
    };

    const handleBookNowClick = () => {
        if (!isLoggedIn) {
            setShowLoginModal(true);
        } else {
            setShowBookingModal(true);
        }
    };

    const handleBookingSubmit = () => {
        if (selectedDate && selectedTime) {
            setShowRoomSelectionModal(true);
        }
    };

    const handleBookingTypeChange = (e) => {
        const newBookingType = e.target.value;
        setBookingType(newBookingType);
        
        // Set member type based on booking type
        if (newBookingType !== 'whole_day') {
            setMemberType(newBookingType);
        } else {
            setMemberType(''); // Reset member type for whole day booking
        }
    };

    return (
        <>
            <Box
                sx={{
                    minHeight: '100vh',  // Changed from 90vh to 100vh
                    position: 'relative',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',  // Add this to stack items vertically
                    alignItems: 'center',
                    justifyContent: 'center',
                    my: 8,
                    pt: 4,
                    pb: 4,
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
                    '&::after': {
                        content: '""',
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '300px',
                        height: '300px',
                        backgroundImage: `url(${logo})`,
                        backgroundSize: 'contain',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                        opacity: 0.3,
                        animation: 'zoomInOut 20s infinite alternate',
                        zIndex: 1
                    },
                    '@keyframes zoomInOut': {
                        '0%': { transform: 'scale(1)' },
                        '100%': { transform: 'scale(1.1)' },
                    },
                }}
            >
                <Box
                    sx={{
                        mb: 4,
                        position: 'relative',
                        zIndex: 2,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: '100%',
                        marginTop: '-100px',  // Added to adjust logo position
                        '& img': {
                            width: '150px',
                            height: 'auto',
                            animation: 'zoomInOut 20s infinite alternate',
                        },
                        '@keyframes zoomInOut': {
                            '0%': { transform: 'scale(1)' },
                            '100%': { transform: 'scale(1.1)' },
                        },
                    }}
                >
                    <img style={{
                        height: "150px",
                        width: "150px",
                        marginBottom: "-90px"  // Adjusted from 550px
                    }} src={logo} alt="Logo" />
                </Box>

                <Paper
                    elevation={6}
                    sx={{
                        position: 'relative',
                        p: 4,
                        maxWidth: 400,
                        textAlign: 'center',
                        background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(240,240,255,0.9) 100%)',
                        borderRadius: 2,
                        animation: 'fadeIn 1s ease-out',
                        '@keyframes fadeIn': {
                            from: { opacity: 0, transform: 'translateY(20px)' },
                            to: { opacity: 1, transform: 'translateY(0)' }
                        },
                        position: 'absolute',
                        top: '75%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        marginTop: '4rem',
                        marginBottom: '-8rem',  // Changed from -6rem to -8rem to move it up more
                        zIndex: 2
                    }}
                >
                    {/* Removed the Box with logo here */}
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

            {/* Booking Type Modal */}
            <Modal open={showBookingModal} onClose={() => setShowBookingModal(false)} closeAfterTransition>
                <Fade in={showBookingModal}>
                    <Box sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 400,
                        bgcolor: 'background.paper',
                        borderRadius: 2,
                        boxShadow: 24,
                        p: 4,
                        background: 'linear-gradient(135deg, #ffffff 0%, #f0f0ff 100%)'
                    }}>
                        <Box
                            sx={{
                                width: '100%',
                                display: 'flex',
                                justifyContent: 'center',
                                mb: 3,
                                '& img': {
                                    width: '150px',
                                    height: 'auto',
                                    animation: 'zoomInOut 20s infinite alternate',
                                },
                                '@keyframes zoomInOut': {
                                    '0%': { transform: 'scale(1)' },
                                    '100%': { transform: 'scale(1.1)' },
                                },
                            }}
                        >
                            <img src={logo} alt="Logo" />
                        </Box>

                        <FormControl fullWidth sx={{ mb: 2 }}>
                            <InputLabel>Booking Type</InputLabel>
                            <Select
                                value={bookingType}
                                onChange={handleBookingTypeChange}
                                label="Booking Type"
                            >
                                <MenuItem value="member">Members</MenuItem>
                                <MenuItem value="non_member">Non-Members</MenuItem>
                                <MenuItem value="whole_day">Whole Day</MenuItem>
                            </Select>
                        </FormControl>

                        {bookingType === 'whole_day' && (
                            <FormControl fullWidth sx={{ mb: 2 }}>
                                <InputLabel>Member Type</InputLabel>
                                <Select
                                    value={memberType}
                                    onChange={(e) => setMemberType(e.target.value)}
                                    label="Member Type"
                                >
                                    <MenuItem value="member">Member</MenuItem>
                                    <MenuItem value="non_member">Non-Member</MenuItem>
                                </Select>
                            </FormControl>
                        )}

                        {((bookingType && bookingType !== 'whole_day') || (bookingType === 'whole_day' && memberType)) && (
                            <Card sx={{
                                mt: 2,
                                background: 'linear-gradient(135deg, #000000 0%, #00B2B2 100%)',
                                color: 'white',
                                transform: 'scale(1)',
                                transition: 'transform 0.3s ease',
                                '&:hover': {
                                    transform: 'scale(1.02)'
                                }
                            }}>
                                <CardContent sx={{ textAlign: 'center' }}>
                                    <Box sx={{ mb: 2 }}>
                                        <img 
                                            src={logo} 
                                            alt="Logo" 
                                            style={{ 
                                                width: '120px', 
                                                height: 'auto',
                                                marginBottom: '1.5rem',
                                                filter: 'brightness(1.1)'
                                            }} 
                                        />
                                    </Box>
                                    <Typography variant="h5" gutterBottom>
                                        ₹{getPricing()}/- + GST {bookingType === 'whole_day' ? 'per day' : 'per hour'}
                                    </Typography>
                                    <Typography variant="body1" sx={{ mb: 3 }}>
                                        09:00 AM to 06:00 PM
                                    </Typography>
                                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                        <Button
                                            variant="contained"
                                            onClick={() => setShowTimeSlotModal(true)}
                                            sx={{
                                                bgcolor: 'white',
                                                color: '#000000',
                                                px: 4,
                                                py: 1,
                                                fontWeight: 'bold',
                                                '&:hover': {
                                                    bgcolor: 'rgba(255,255,255,0.9)'
                                                }
                                            }}
                                        >
                                            Book Now
                                        </Button>
                                    </Box>
                                </CardContent>
                            </Card>
                        )}
                    </Box>
                </Fade>
            </Modal>

            {/* Time Slot Selection Modal */}
            <Modal
                open={showTimeSlotModal}
                onClose={() => setShowTimeSlotModal(false)}
                closeAfterTransition
            >
                <Fade in={showTimeSlotModal}>
                    <Box sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 400,
                        bgcolor: 'background.paper',
                        borderRadius: 2,
                        boxShadow: 24,
                        p: 4,
                        background: 'linear-gradient(135deg, #ffffff 0%, #f0f0ff 100%)'
                    }}>
                        <Typography variant="h6" gutterBottom>
                            Select Date and Time
                        </Typography>
                        <FormControl fullWidth sx={{ mb: 2 }}>
                            <InputLabel>Select Date</InputLabel>
                            <Select
                                value={selectedDate ? format(selectedDate, 'yyyy-MM-dd') : ''}
                                onChange={(e) => {
                                    const selectedDateStr = e.target.value;
                                    const [year, month, day] = selectedDateStr.split('-').map(Number);
                                    const date = new Date(year, month - 1, day);
                                    setSelectedDate(date);
                                }}
                                label="Select Date"
                            >
                                {getAvailableDates().map((date) => (
                                    <MenuItem 
                                        key={format(date, 'yyyy-MM-dd')} 
                                        value={format(date, 'yyyy-MM-dd')}
                                    >
                                        {format(date, 'dd MMM yyyy')}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                
                        {selectedDate && (
                            <FormControl fullWidth sx={{ mb: 2 }}>
                                <InputLabel>Start Time</InputLabel>
                                <Select
                                    value={selectedTime}
                                    onChange={(e) => {
                                        setSelectedTime(e.target.value);
                                        setSelectedEndTime('');
                                    }}
                                    label="Start Time"
                                >
                                    {timeSlots.map((slot) => (
                                        <MenuItem key={slot.value} value={slot.value}>
                                            {slot.display}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        )}
                
                        {selectedTime && (
                            <FormControl fullWidth sx={{ mb: 2 }}>
                                <InputLabel>End Time</InputLabel>
                                <Select
                                    value={selectedEndTime}
                                    onChange={(e) => {
                                        setSelectedEndTime(e.target.value);
                                        setCalculatedPrice(calculatePrice(selectedTime, e.target.value));
                                    }}
                                    label="End Time"
                                >
                                    {getEndTimeSlots(selectedTime).map((slot) => (
                                        <MenuItem key={slot.value} value={slot.value}>
                                            {slot.display}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        )}

                        {selectedEndTime && (
                            <Typography variant="h6" sx={{ mt: 2, color: 'primary.main' }}>
                                Estimated Price: ₹{calculatedPrice.subtotal}/- (GST: ₹{Math.ceil(calculatedPrice.gst)}/-)<br />
                                Total: ₹{Math.ceil(calculatedPrice.total)}/- <br />
                                Duration: {Math.floor(calculatedPrice.duration)} hours {calculatedPrice.duration % 1 ? '30 mins' : ''}
                            </Typography>
                        )}

                        <Button
                            fullWidth
                            variant="contained"
                            onClick={handleBookingSubmit}
                            disabled={!selectedDate || !selectedTime}
                            sx={{
                                background: 'linear-gradient(135deg, #7B68EE 0%, #6A5ACD 100%)',
                                '&:hover': {
                                    background: 'linear-gradient(135deg, #6A5ACD 0%, #5B4ACE 100%)'
                                }
                            }}
                        >
                            Confirm Booking
                        </Button>
                    </Box>
                </Fade>
            </Modal>

            {/* Room Selection Modal */}
            <Modal
                open={showRoomSelectionModal}
                onClose={() => setShowRoomSelectionModal(false)}
                closeAfterTransition
            >
                <Fade in={showRoomSelectionModal}>
                    <Box sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 600,
                        bgcolor: 'background.paper',
                        borderRadius: 2,
                        boxShadow: 24,
                        p: 4,
                        background: 'linear-gradient(135deg, #ffffff 0%, #f0f0ff 100%)'
                    }}>
                        <Typography variant="h6" gutterBottom>
                            Select Meeting Room
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 3 }}>
                            Selected Date: {selectedDate ? format(selectedDate, 'dd MMM yyyy') : ''}<br />
                            Time Slot: {selectedTime}
                        </Typography>
                        
                        <Box sx={{ 
                            display: 'grid', 
                            gridTemplateColumns: 'repeat(3, 1fr)',
                            gap: 2,
                            mb: 3
                        }}>
                            {rooms.map((room) => (
                                <Button
                                    key={room.id}
                                    variant="contained"
                                    onClick={() => {
                                        if (!isRoomAvailable(room.id, selectedDate, selectedTime)) {
                                            alert(`Room ${room.name} is already booked for this time slot. Please select another room.`);
                                            return;
                                        }
                                        setSelectedRoom(room.id);
                                    }}
                                    sx={{
                                        bgcolor: isRoomAvailable(room.id, selectedDate, selectedTime) 
                                            ? '#4CAF50'  // Green color for available rooms
                                            : '#FF0000', // Red color for booked rooms
                                        '&:hover': {
                                            bgcolor: isRoomAvailable(room.id, selectedDate, selectedTime)
                                                ? '#45a049'  // Darker green on hover
                                                : '#cc0000'  // Darker red on hover
                                        },
                                        color: 'white',
                                        p: 2,
                                        fontWeight: 'bold'  // Added bold font weight for all room numbers
                                    }}
                                    disabled={!isRoomAvailable(room.id, selectedDate, selectedTime)}
                                >
                                    {room.name}
                                </Button>
                            ))}
                        </Box>

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                            <Button
                                variant="outlined"
                                onClick={() => setShowRoomSelectionModal(false)}
                            >
                                Back
                            </Button>
                            <Button
                                variant="contained"
                                onClick={handleFinalBooking}
                                disabled={!selectedRoom}
                                sx={{
                                    background: 'linear-gradient(135deg, #7B68EE 0%, #6A5ACD 100%)',
                                    '&:hover': {
                                        background: 'linear-gradient(135deg, #6A5ACD 0%, #5B4ACE 100%)'
                                    }
                                }}
                            >
                                Confirm Booking
                            </Button>
                        </Box>
                    </Box>
                </Fade>
            </Modal>

            <Login
                open={showLoginModal}
                onClose={() => setShowLoginModal(false)}
                onLogin={() => {
                    setShowLoginModal(false);
                    setShowBookingModal(true);
                }}
            />
        </>
    );
};

export default BookMeetingRoom;