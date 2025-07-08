import React from 'react';
import { 
  Container, 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Alert,
  Fade,
  IconButton,
  InputAdornment,
  CircularProgress
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import type { LoginPageUIProps } from './type.ts';

export const LoginPageUI: React.FC<LoginPageUIProps> = ({
  handleSubmit,
  loginError,
  login,
  setLogin,
  showPassword,
  password,
  setPassword,
  setShowPassword,
  isLoading
}) => {
  return (
    <Container maxWidth="sm" sx={{
        background:'background.primary',
        color: 'background.paper',
      display: 'flex', 
      flexDirection: 'column',
      alignContent: 'center',
      minHeight: '100vh',
      justifyContent: 'center',
      py: 8 
    }}>
      <Box 
        component="form" 
        onSubmit={handleSubmit}
        sx={{ 
          p: 4, 
          borderRadius: 2, 
          boxShadow: 3,
          backgroundColor: 'background.paper',
          display: 'flex',
          flexDirection: 'column',
          gap: 2
        }}
      >
        <Box textAlign="center" mb={3}>
          <Typography color="text.secondary" variant="h4" component="h1" fontWeight="bold" gutterBottom>
            Добро пожаловать
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Введите свои данные для входа в систему
          </Typography>
        </Box>
        
        {loginError && (
          <Fade in={!!loginError}>
            <Alert severity="error" sx={{ mb: 2 }}>
              {loginError}
            </Alert>
          </Fade>
        )}
        
        <TextField
          fullWidth
          label="Login"
          variant="outlined"
          margin="normal"
          value={login}
          onChange={(e) => setLogin(e.target.value)}
          autoComplete="login"
          disabled={isLoading}
        />
        
        <TextField
          fullWidth
          label="Пароль"
          variant="outlined"
          margin="normal"
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isLoading}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                  disabled={isLoading}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            )
          }}
        />
        
        <Button
          fullWidth
          variant="contained"
          color="primary"
          size="large"
          type="submit"
          disabled={isLoading}
          sx={{ mt: 2, py: 1.5 }}
        >
          {isLoading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            'Войти'
          )}
        </Button>
      </Box>
    </Container>
  );
};