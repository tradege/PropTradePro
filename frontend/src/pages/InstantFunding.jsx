import { useState } from 'react';
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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  AppBar,
  Toolbar,
} from '@mui/material';
import {
  CheckCircle,
  TrendingUp,
  ArrowBack,
  ShoppingCart,
} from '@mui/icons-material';

const accountSizes = [
  { size: '$5,000', price: '$99', profitTarget: '$500', maxDailyLoss: '$250', maxTotalLoss: '$500' },
  { size: '$10,000', price: '$149', profitTarget: '$1,000', maxDailyLoss: '$500', maxTotalLoss: '$1,000' },
  { size: '$25,000', price: '$249', profitTarget: '$2,500', maxDailyLoss: '$1,250', maxTotalLoss: '$2,500' },
  { size: '$50,000', price: '$399', profitTarget: '$5,000', maxDailyLoss: '$2,500', maxTotalLoss: '$5,000' },
  { size: '$100,000', price: '$549', profitTarget: '$10,000', maxDailyLoss: '$5,000', maxTotalLoss: '$10,000' },
];

const features = [
  'Single evaluation phase',
  '10% profit target',
  '75% profit split',
  'Unlimited trading days',
  'No time limit',
  'Trade all instruments',
  'News trading allowed',
  'Weekend holding allowed',
  'Scale up to $2M',
  'Free retake on funded account',
  'Bi-weekly payouts',
  '24/7 support',
];

export default function OnePhaseChallenge() {
  const navigate = useNavigate();
  const [selectedSize, setSelectedSize] = useState(null);

  const handlePurchase = (account) => {
    // TODO: Implement purchase logic
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#0f1419' }}>
      {/* Navbar */}
      <AppBar position="static" sx={{ bgcolor: '#1a1f2e', boxShadow: 'none', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <Toolbar>
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate('/programs')}
            sx={{ color: 'white', mr: 2 }}
          >
            Back to Programs
          </Button>
          <Typography variant="h6" sx={{ flexGrow: 1, color: 'white' }}>
            MarketEdgePros
          </Typography>
          <Button onClick={() => navigate('/login')} sx={{ color: 'white' }}>
            Login
          </Button>
          <Button
            variant="contained"
            onClick={() => navigate('/register')}
            sx={{
              ml: 2,
              background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
              color: 'white',
            }}
          >
            Sign Up
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 8 }}>
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Chip
            icon={<TrendingUp />}
            label="FAST TRACK TO FUNDING"
            sx={{
              mb: 2,
              background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
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
            One Phase Challenge
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: 'rgba(255,255,255,0.6)',
              maxWidth: 700,
              margin: '0 auto',
            }}
          >
            Fast-track to funded account with single evaluation. Prove your skills once and start earning.
          </Typography>
        </Box>

        {/* Features Grid */}
        <Grid container spacing={4} sx={{ mb: 6 }}>
          <Grid item xs={12} md={6}>
            <Card sx={{ bgcolor: '#1a1f2e', borderRadius: 3, border: '1px solid rgba(67, 233, 123, 0.3)', height: '100%' }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h5" sx={{ color: 'white', fontWeight: 700, mb: 3 }}>
                  Program Features
                </Typography>
                <List>
                  {features.map((feature, index) => (
                    <ListItem key={index} sx={{ px: 0, py: 0.5 }}>
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        <CheckCircle sx={{ fontSize: 20, color: '#43e97b' }} />
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
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card sx={{ bgcolor: '#1a1f2e', borderRadius: 3, border: '1px solid rgba(67, 233, 123, 0.3)', height: '100%' }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h5" sx={{ color: 'white', fontWeight: 700, mb: 3 }}>
                  Trading Rules
                </Typography>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" sx={{ color: '#43e97b', mb: 1 }}>
                    Profit Target
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                    Achieve 10% profit to pass the evaluation and get funded
                  </Typography>
                </Box>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" sx={{ color: '#43e97b', mb: 1 }}>
                    Max Daily Loss
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                    5% maximum daily loss limit (based on previous day balance)
                  </Typography>
                </Box>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" sx={{ color: '#43e97b', mb: 1 }}>
                    Max Total Loss
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                    10% maximum total loss limit (based on initial balance)
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" sx={{ color: '#43e97b', mb: 1 }}>
                    Profit Split
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                    Keep 75% of your profits, scale up to 90%
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Pricing Table */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h4" sx={{ color: 'white', fontWeight: 700, mb: 4, textAlign: 'center' }}>
            Choose Your Account Size
          </Typography>
          <TableContainer component={Paper} sx={{ bgcolor: '#1a1f2e', borderRadius: 3 }}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: 'rgba(67, 233, 123, 0.1)' }}>
                  <TableCell sx={{ color: 'white', fontWeight: 700 }}>Account Size</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 700 }}>Price</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 700 }}>Profit Target</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 700 }}>Max Daily Loss</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 700 }}>Max Total Loss</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 700 }} align="center">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {accountSizes.map((account, index) => (
                  <TableRow
                    key={index}
                    sx={{
                      '&:hover': { bgcolor: 'rgba(67, 233, 123, 0.05)' },
                      bgcolor: selectedSize === index ? 'rgba(67, 233, 123, 0.1)' : 'transparent',
                    }}
                  >
                    <TableCell sx={{ color: 'white', fontWeight: 600 }}>{account.size}</TableCell>
                    <TableCell sx={{ color: '#43e97b', fontWeight: 700 }}>{account.price}</TableCell>
                    <TableCell sx={{ color: 'rgba(255,255,255,0.8)' }}>{account.profitTarget}</TableCell>
                    <TableCell sx={{ color: 'rgba(255,255,255,0.8)' }}>{account.maxDailyLoss}</TableCell>
                    <TableCell sx={{ color: 'rgba(255,255,255,0.8)' }}>{account.maxTotalLoss}</TableCell>
                    <TableCell align="center">
                      <Button
                        variant="contained"
                        startIcon={<ShoppingCart />}
                        onClick={() => handlePurchase(account)}
                        sx={{
                          background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                          color: 'white',
                          fontWeight: 600,
                          '&:hover': {
                            background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                            opacity: 0.9,
                          },
                        }}
                      >
                        Purchase
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        {/* CTA */}
        <Box sx={{ textAlign: 'center', p: 6, bgcolor: '#1a1f2e', borderRadius: 3, border: '1px solid rgba(67, 233, 123, 0.3)' }}>
          <Typography variant="h5" sx={{ color: 'white', fontWeight: 700, mb: 2 }}>
            Ready to Get Funded?
          </Typography>
          <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.6)', mb: 3 }}>
            Join thousands of successful traders who have passed our evaluation
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/register')}
            sx={{
              background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
              color: 'white',
              fontWeight: 600,
              px: 6,
              py: 2,
            }}
          >
            Get Started Now
          </Button>
        </Box>
      </Container>
    </Box>
  );
}

