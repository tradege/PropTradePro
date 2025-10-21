import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  CheckCircle,
  TrendingUp,
  Layers,
  Bolt,
  ArrowForward,
} from '@mui/icons-material';

const programs = [
  {
    id: 1,
    type: 'two_phase',
    name: 'Two Phase Challenge',
    description: 'Perfect for traders who want a structured evaluation process',
    icon: Layers,
    color: '#667eea',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    accountSizes: ['$5K', '$10K', '$25K', '$50K', '$100K', '$200K'],
    features: [
      'Two evaluation phases',
      '8% profit target Phase 1',
      '5% profit target Phase 2',
      '80% profit split',
      'Unlimited trading days',
      'Free retake on funded account',
    ],
    path: '/programs/two-phase',
  },
  {
    id: 2,
    type: 'one_phase',
    name: 'One Phase Challenge',
    description: 'Fast-track to funded account with single evaluation',
    icon: TrendingUp,
    color: '#43e97b',
    gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    accountSizes: ['$5K', '$10K', '$25K', '$50K', '$100K'],
    features: [
      'Single evaluation phase',
      '10% profit target',
      '75% profit split',
      'Unlimited trading days',
      'Faster path to funding',
      'Scale up to $2M',
    ],
    path: '/programs/one-phase',
  },
  {
    id: 3,
    type: 'instant_funding',
    name: 'Instant Funding',
    description: 'Start trading with real capital immediately',
    icon: Bolt,
    color: '#fa709a',
    gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    accountSizes: ['$25K', '$50K', '$100K', '$200K'],
    features: [
      'No evaluation needed',
      'Trade immediately',
      '90% profit split',
      'One-time fee',
      'Keep 100% first $10K profit',
      'Premium support',
    ],
    path: '/programs/instant-funding',
  },
];

export default function Programs() {
  const navigate = useNavigate();

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#0f1419', py: 8 }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Chip
            label="CHOOSE YOUR PATH"
            sx={{
              mb: 2,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              fontWeight: 600,
            }}
          />
          <Typography
            variant="h2"
            sx={{
              color: 'white',
              fontWeight: 700,
              mb: 2,
              fontSize: { xs: '2rem', md: '3rem' },
            }}
          >
            Trading Programs
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: 'rgba(255,255,255,0.6)',
              maxWidth: 600,
              margin: '0 auto',
            }}
          >
            Choose the program that fits your trading style and get funded
          </Typography>
        </Box>

        {/* Programs Grid */}
        <Grid container spacing={4}>
          {programs.map((program) => {
            const IconComponent = program.icon;
            return (
              <Grid item xs={12} md={4} key={program.id}>
                <Card
                  sx={{
                    height: '100%',
                    bgcolor: '#1a1f2e',
                    borderRadius: 3,
                    border: '1px solid rgba(255,255,255,0.1)',
                    transition: 'all 0.3s',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: `0 20px 40px ${program.color}40`,
                      borderColor: program.color,
                    },
                  }}
                >
                  <CardContent sx={{ p: 4 }}>
                    {/* Icon */}
                    <Box
                      sx={{
                        width: 64,
                        height: 64,
                        borderRadius: 2,
                        background: program.gradient,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 3,
                      }}
                    >
                      <IconComponent sx={{ fontSize: 32, color: 'white' }} />
                    </Box>

                    {/* Title */}
                    <Typography
                      variant="h5"
                      sx={{ color: 'white', fontWeight: 700, mb: 1 }}
                    >
                      {program.name}
                    </Typography>

                    {/* Description */}
                    <Typography
                      variant="body2"
                      sx={{ color: 'rgba(255,255,255,0.6)', mb: 3 }}
                    >
                      {program.description}
                    </Typography>

                    {/* Account Sizes */}
                    <Box sx={{ mb: 3 }}>
                      <Typography
                        variant="caption"
                        sx={{ color: 'rgba(255,255,255,0.5)', mb: 1, display: 'block' }}
                      >
                        ACCOUNT SIZES
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {program.accountSizes.map((size, index) => (
                          <Chip
                            key={index}
                            label={size}
                            size="small"
                            sx={{
                              bgcolor: 'rgba(255,255,255,0.05)',
                              color: program.color,
                              border: `1px solid ${program.color}40`,
                              fontWeight: 600,
                            }}
                          />
                        ))}
                      </Box>
                    </Box>

                    {/* Features */}
                    <List dense sx={{ mb: 3 }}>
                      {program.features.map((feature, index) => (
                        <ListItem key={index} sx={{ px: 0, py: 0.5 }}>
                          <ListItemIcon sx={{ minWidth: 32 }}>
                            <CheckCircle sx={{ fontSize: 20, color: program.color }} />
                          </ListItemIcon>
                          <ListItemText
                            primary={feature}
                            primaryTypographyProps={{
                              variant: 'body2',
                              sx: { color: 'rgba(255,255,255,0.8)' },
                            }}
                          />
                        </ListItem>
                      ))}
                    </List>

                    {/* Button */}
                    <Button
                      fullWidth
                      variant="contained"
                      endIcon={<ArrowForward />}
                      onClick={() => navigate(program.path)}
                      sx={{
                        background: program.gradient,
                        color: 'white',
                        fontWeight: 600,
                        py: 1.5,
                        '&:hover': {
                          background: program.gradient,
                          opacity: 0.9,
                        },
                      }}
                    >
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>

        {/* Comparison Section */}
        <Box sx={{ mt: 8, textAlign: 'center' }}>
          <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.6)', mb: 2 }}>
            Not sure which program is right for you?
          </Typography>
          <Button
            variant="outlined"
            size="large"
            onClick={() => navigate('/programs/compare')}
            sx={{
              borderColor: '#667eea',
              color: '#667eea',
              '&:hover': {
                borderColor: '#667eea',
                bgcolor: 'rgba(102, 126, 234, 0.1)',
              },
            }}
          >
            Compare Programs
          </Button>
        </Box>
      </Container>
    </Box>
  );
}

