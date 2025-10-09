// import { CredentialResponse, GoogleLogin } from '@react-oauth/google';
// import { Box, Card, CardContent, Typography, Alert, Button } from '@mui/material';
// import { useState, useEffect } from 'react';
// import { ROUTES } from '@/constants/Routes';
//
// // Mock these for the artifact - replace with your actual imports
// const useAuth = () => ({
//   user: null,
//   loginWithGoogle: async (token: string) => {
//     console.log('Login called with token:', token);
//   },
// });
// const useNavigate = () => (path: string) => console.log('Navigate to:', path);
// const Navigate = ({ to }: { to: string }) => <div>Redirecting to {to}</div>;
// const vaultImage = 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=1200';
//
// const LoginPage = () => {
//   const { user, loginWithGoogle } = useAuth();
//   const navigate = useNavigate();
//   const [logs, setLogs] = useState<string[]>([]);
//   const [showLogs, setShowLogs] = useState(false);
//
//   const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
//
//   const addLog = (message: string) => {
//     const timestamp = new Date().toLocaleTimeString();
//     const logMessage = `[${timestamp}] ${message}`;
//     setLogs(prev => [logMessage, ...prev]);
//     console.log(logMessage);
//   };
//
//   useEffect(() => {
//     addLog('🔍 Page loaded');
//     addLog(`📱 Device: ${isMobile ? 'MOBILE' : 'DESKTOP'}`);
//     addLog(`🌐 URL: ${window.location.href}`);
//     addLog(`👤 User Agent: ${navigator.userAgent.substring(0, 80)}...`);
//   }, [isMobile]);
//
//   const handleSuccess = async (credentialResponse: CredentialResponse) => {
//     addLog('✅ SUCCESS! onSuccess callback fired!');
//     addLog(`📝 Has credential: ${!!credentialResponse.credential}`);
//
//     if (credentialResponse.credential) {
//       addLog(`📏 Credential length: ${credentialResponse.credential.length}`);
//       addLog(`🔑 First 30 chars: ${credentialResponse.credential.substring(0, 30)}...`);
//
//       try {
//         addLog('📤 Sending credential to backend...');
//         await loginWithGoogle(credentialResponse.credential);
//         addLog('✅ Backend login successful!');
//
//         // navigate(ROUTES.DASHBOARD_URL);
//         // window.location.href = ROUTES.DASHBOARD_URL;
//       } catch (err) {
//         addLog(`❌ Backend login failed: ${err}`);
//         console.error('Google login failed:', err);
//       }
//     } else {
//       addLog('⚠️ No credential in response!');
//     }
//   };
//
//   const handleError = () => {
//     addLog('❌ ERROR! onError callback fired!');
//   };
//
//   if (user) {
//     return <Navigate to={ROUTES.DASHBOARD_URL} />;
//   }
//
//   return (
//     <Box
//       display="flex"
//       flexDirection="column"
//       justifyContent="center"
//       alignItems="center"
//       minHeight="100vh"
//       sx={{
//         backgroundImage: `url(${vaultImage})`,
//         backgroundSize: 'cover',
//         backgroundPosition: 'center',
//         backgroundRepeat: 'no-repeat',
//         padding: 2,
//       }}
//     >
//       {/* Debug Toggle Button - Fixed position */}
//       <Button
//         onClick={() => setShowLogs(!showLogs)}
//         sx={{
//           position: 'fixed',
//           top: 10,
//           right: 10,
//           zIndex: 9999,
//           backgroundColor: 'rgba(255, 0, 0, 0.8)',
//           color: 'white',
//           '&:hover': {
//             backgroundColor: 'rgba(255, 0, 0, 1)',
//           },
//           fontSize: '12px',
//           padding: '8px 16px',
//         }}
//       >
//         {showLogs ? '❌ Hide Debug' : '🐛 Show Debug'}
//       </Button>
//
//       {/* Debug Logs Panel */}
//       {showLogs && (
//         <Card
//           sx={{
//             position: 'fixed',
//             top: 60,
//             right: 10,
//             width: '90%',
//             maxWidth: 400,
//             maxHeight: '70vh',
//             overflowY: 'auto',
//             zIndex: 9998,
//             backgroundColor: 'rgba(0, 0, 0, 0.95)',
//             border: '2px solid red',
//           }}
//         >
//           <CardContent>
//             <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
//               <Typography variant="h6" color="error">
//                 🐛 Debug Logs
//               </Typography>
//               <Button
//                 size="small"
//                 onClick={() => setLogs([])}
//                 sx={{ color: 'white', fontSize: '10px' }}
//               >
//                 Clear
//               </Button>
//             </Box>
//
//             <Box
//               sx={{
//                 fontFamily: 'monospace',
//                 fontSize: '11px',
//                 color: 'white',
//               }}
//             >
//               {logs.length === 0 ? (
//                 <Typography color="gray" fontSize="12px">
//                   No logs yet. Click Google button to test.
//                 </Typography>
//               ) : (
//                 logs.map((log, index) => (
//                   <Box
//                     key={index}
//                     sx={{
//                       padding: '6px',
//                       borderBottom: '1px solid #333',
//                       backgroundColor: log.includes('✅')
//                         ? 'rgba(0, 255, 0, 0.1)'
//                         : log.includes('❌')
//                           ? 'rgba(255, 0, 0, 0.1)'
//                           : 'transparent',
//                       color: log.includes('✅')
//                         ? '#4caf50'
//                         : log.includes('❌')
//                           ? '#f44336'
//                           : 'white',
//                     }}
//                   >
//                     {log}
//                   </Box>
//                 ))
//               )}
//             </Box>
//
//             <Alert severity="info" sx={{ mt: 2, fontSize: '11px' }}>
//               <strong>Mobile Instructions:</strong>
//               <br />
//               1. Click Google button
//               <br />
//               2. Select account
//               <br />
//               3. Come back to this page
//               <br />
//               4. Check if SUCCESS appears above
//             </Alert>
//           </CardContent>
//         </Card>
//       )}
//
//       {/* Main Login Card */}
//       <Card
//         sx={{
//           maxWidth: 400,
//           width: '100%',
//           borderRadius: 4,
//           boxShadow: '0px 8px 20px rgba(0,0,0,0.5)',
//           textAlign: 'center',
//           background: 'rgba(255, 255, 255, 0.05)',
//           backdropFilter: 'blur(10px)',
//         }}
//       >
//         <CardContent>
//           <Typography variant="h4" fontWeight={700} mb={2} color="white">
//             Welcome to FinSight
//           </Typography>
//           <Typography variant="body1" mb={2} color="gray.300">
//             Your personal finance dashboard
//           </Typography>
//
//           {/* Device Indicator */}
//           <Alert severity={isMobile ? 'warning' : 'info'} sx={{ mb: 3, fontSize: '12px' }}>
//             {isMobile ? '📱 Mobile Device Detected' : '🖥️ Desktop Device Detected'}
//           </Alert>
//
//           <Box display="flex" justifyContent="center">
//             <GoogleLogin onSuccess={handleSuccess} onError={handleError} shape="circle" />
//           </Box>
//
//           <Typography variant="caption" color="gray.500" sx={{ display: 'block', mt: 2 }}>
//             Click Show Debug button above to see logs
//           </Typography>
//         </CardContent>
//       </Card>
//     </Box>
//   );
// };
//
// export default LoginPage;
import { CredentialResponse, GoogleLogin } from '@react-oauth/google';
import { Box, Card, CardContent, Typography } from '@mui/material';
import { useAuth } from '@/providers/AuthProvider';
import vaultImage from '@/assets/vault2.png';
import { ROUTES } from '@/constants/Routes';
import { Navigate, useNavigate } from 'react-router-dom';
import FinSightIcon from '@/pages/Login/FinSightIcon';

const LoginPage = () => {
  const { user, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleSuccess = async (credentialResponse: CredentialResponse) => {
    if (credentialResponse.credential) {
      try {
        await loginWithGoogle(credentialResponse.credential);
        navigate(ROUTES.DASHBOARD_URL);
      } catch (err) {
        console.error('Google login failed:', err);
      }
    }
  };

  if (user) {
    return <Navigate to={ROUTES.DASHBOARD_URL} replace />;
  }

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      sx={{
        backgroundImage: `url(${vaultImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <Card
        sx={{
          maxWidth: 400,
          width: '100%',
          textAlign: 'center',
          borderRadius: 6,
          boxShadow: '0px 20px 60px rgba(0,0,0,0.6)',
          background: 'rgba(17, 25, 40, 0.75)',
          backdropFilter: 'blur(16px) saturate(180%)',
          border: '1px solid rgba(255, 255, 255, 0.125)',
        }}
      >
        <CardContent sx={{ py: 5, px: 4 }}>
          <FinSightIcon />
          <Typography
            variant="h4"
            fontWeight={700}
            mb={1.5}
            sx={{
              background: 'linear-gradient(135deg, #ffffff 0%, #e0e7ff 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '-0.02em',
            }}
          >
            Welcome to FinSight
          </Typography>
          <Typography
            variant="body1"
            mb={4}
            sx={{
              color: 'rgba(255, 255, 255, 0.7)',
              fontSize: '1.1rem',
              fontWeight: 400,
            }}
          >
            Your personal finance dashboard
          </Typography>
          <Box
            display="flex"
            justifyContent="center"
            sx={{
              '& button': {
                transition: 'all 0.2s ease',
                '&:hover': {
                  transform: 'scale(1.05)',
                  boxShadow: '0 8px 24px rgba(66, 133, 244, 0.3)',
                },
              },
            }}
          >
            <GoogleLogin
              onSuccess={handleSuccess}
              onError={() => console.log('Error with login')}
              shape="pill"
              useOneTap={false}
            />
          </Box>
          <Typography
            variant="caption"
            sx={{
              display: 'block',
              mt: 3,
              color: 'rgba(255, 255, 255, 0.4)',
              fontSize: '0.875rem',
            }}
          >
            Sign in securely with your Google account
          </Typography>
        </CardContent>
      </Card>
      {/*<Card*/}
      {/*  sx={{*/}
      {/*    maxWidth: 400,*/}
      {/*    width: '100%',*/}
      {/*    textAlign: 'center',*/}
      {/*    borderRadius: 6,*/}
      {/*    boxShadow: '0px 20px 60px rgba(0,0,0,0.6)',*/}
      {/*    background: 'rgba(17, 25, 40, 0.75)',*/}
      {/*    backdropFilter: 'blur(16px) saturate(180%)',*/}
      {/*    border: '1px solid rgba(255, 255, 255, 0.125)',*/}
      {/*    overflow: 'visible',*/}
      {/*    position: 'relative',*/}
      {/*  }}*/}
      {/*>*/}
      {/*  <CardContent>*/}
      {/*    <img src={finSightIcon} alt="App Logo" width={100} height={100} />*/}
      {/*    <Typography variant="h4" fontWeight={700} mb={2} color="white">*/}
      {/*      Welcome to FinSight*/}
      {/*    </Typography>*/}
      {/*    <Typography variant="body1" mb={4} color="gray.300">*/}
      {/*      Your personal finance dashboard*/}
      {/*    </Typography>*/}
      {/*    <Box display="flex" justifyContent="center">*/}
      {/*      <GoogleLogin*/}
      {/*        onSuccess={handleSuccess}*/}
      {/*        onError={() => console.log('Error with login')}*/}
      {/*        shape={'circle'}*/}
      {/*        useOneTap={false}*/}
      {/*        // useOneTap={!isMobile}*/}
      {/*        // ux_mode={'redirect'}*/}
      {/*        // red={window.location.origin}*/}
      {/*      />*/}
      {/*    </Box>*/}
      {/*  </CardContent>*/}
      {/*</Card>*/}
    </Box>
  );
};

export default LoginPage;
