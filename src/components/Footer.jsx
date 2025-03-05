import { Box, Container, Typography, Grid } from '@mui/material';
import boldtribeLogo from '../assets/BoldTribe_Logo-removebg-preview.png';
import logo from '../assets/BoldTribe_Logo-2-removebg-preview.png';

const Footer = () => {
    return (
        <Box
            component="footer"
            sx={{
                backgroundColor: '#ECECFF',
                py: 4,
                borderTop: '1px solid #e0e0e0',
                width: '100%',
                position: 'relative',
                bottom: 0,
                left: 0,
                zIndex: 1000,
            }}
        >
            <Container maxWidth="xl">
                <Grid container spacing={4} sx={{ mb: 4 }}>
                    {/* Left Section - Logo and Address */}
                    <Grid item xs={12} md={4}>
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 2,
                            alignItems: 'flex-start',
                            position: 'relative',
                            paddingTop: '20px'
                        }}>
                            <img
                                src={boldtribeLogo}
                                alt="BoldServe Logo"
                                style={{
                                    height: '180px',
                                    width: 'auto',
                                    objectFit: 'contain',
                                    marginLeft: '-6px'
                                }}
                            />

                            <Box sx={{ textAlign: 'left', marginTop: '-40px' }}>
                                <Typography
                                    variant="subtitle1"
                                    sx={{ fontWeight: 'bold', color: '#333', mb: 1, marginLeft: '8px' }}
                                >
                                    Contact Us:-
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#666', mb: 1, marginLeft: '8px' }}>
                                    DLF Cybercity, IDCO Tech park,
                                    <br />
                                    Patia, Bhubaneswar
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#666', marginLeft: '8px' }}>
                                    Mobile: +91 9876543210
                                </Typography>
                            </Box>
                        </Box>
                    </Grid>

                    {/* Middle Section - Terms and Conditions */}
                    <Grid item xs={12} md={4}>
                        <Typography variant="h6" sx={{ mb: 2, color: '#333', mt: 2 }}>
                            Terms & Conditions
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            <Typography variant="body2" sx={{ color: '#666', cursor: 'pointer', '&:hover': { color: '#7B68EE' } }}>
                                Terms of Use
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#666', cursor: 'pointer', '&:hover': { color: '#7B68EE' } }}>
                                Return Policy
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#666', cursor: 'pointer', '&:hover': { color: '#7B68EE' } }}>
                                Shipping Policy
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#666', cursor: 'pointer', '&:hover': { color: '#7B68EE' } }}>
                                Cancellation Policy
                            </Typography>
                        </Box>
                    </Grid>

                    {/* Right Section - Privacy Policy */}
                    <Grid item xs={12} md={4}>
                        <Typography variant="h6" sx={{ mb: 2, color: '#333', mt: 2 }}>
                            Privacy & Policy
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            <Typography variant="body2" sx={{ color: '#666', cursor: 'pointer', '&:hover': { color: '#7B68EE' } }}>
                                Privacy Policy
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#666', cursor: 'pointer', '&:hover': { color: '#7B68EE' } }}>
                                Cookie Policy
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#666', cursor: 'pointer', '&:hover': { color: '#7B68EE' } }}>
                                Data Protection
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#666', cursor: 'pointer', '&:hover': { color: '#7B68EE' } }}>
                                Security Policy
                            </Typography>
                        </Box>
                    </Grid>
                </Grid>

                {/* Copyright Section */}
                <Box
                    sx={{
                        borderTop: '1px solid #e0e0e0',
                        pt: 2,
                        mt: 2,
                        textAlign: 'center'
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 1
                        }}
                    >
                        <Box
                            component="img"
                            src={logo}
                            alt="BoldTribe Logo"
                            sx={{
                                height: '50px',
                                width: 'auto',
                                objectFit: 'contain'
                            }}
                        />
                        <Typography variant="body2" sx={{ color: '#666' }}>
                            © {new Date().getFullYear()} All Rights Reserved by BoldTribe Innovations Private Limited
                        </Typography>
                    </Box>
                </Box>
            </Container>
        </Box>
    );
};

export default Footer;