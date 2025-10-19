import { Box, Typography, Grid, Card, CardContent, LinearProgress, Chip } from '@mui/material';
import { TrendingUp, AttachMoney, EmojiEvents, Schedule } from '@mui/icons-material';
import StatsCard from '../../components/mui/StatsCard';

const userStats = [
  { title: 'Active Challenges', value: '2', subtitle: 'In progress', icon: Schedule, color: 'primary' },
  { title: 'Total Profit', value: '$12,450', subtitle: '+15.2% this month', icon: AttachMoney, color: 'success', trend: '+15.2%' },
  { title: 'Success Rate', value: '78%', subtitle: 'Above average', icon: TrendingUp, color: 'info' },
  { title: 'Funded Accounts', value: '1', subtitle: 'Congratulations!', icon: EmojiEvents, color: 'warning' },
];

const challenges = [
  {
    id: 1,
    name: 'Two Phase $100K',
    phase: 'Phase 1',
    progress: 65,
    profit: 6500,
    target: 8000,
    daysLeft: 12,
    status: 'active',
  },
  {
    id: 2,
    name: 'One Phase $50K',
    phase: 'Evaluation',
    progress: 85,
    profit: 4250,
    target: 5000,
    daysLeft: 5,
    status: 'active',
  },
];

export default function UserDashboard() {
  return (
    <Box>
      <Box mb={4}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
          Welcome back, Trader! 👋
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Here's your trading overview
        </Typography>
      </Box>

      <Grid container spacing={3} mb={4}>
        {userStats.map((stat, i) => (
          <Grid item xs={12} sm={6} lg={3} key={i}>
            <StatsCard {...stat} />
          </Grid>
        ))}
      </Grid>

      <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, mb: 3 }}>
        My Challenges
      </Typography>

      <Grid container spacing={3}>
        {challenges.map((challenge) => (
          <Grid item xs={12} md={6} key={challenge.id}>
            <Card>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {challenge.name}
                  </Typography>
                  <Chip
                    label={challenge.phase}
                    size="small"
                    sx={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white',
                      fontWeight: 600,
                    }}
                  />
                </Box>

                <Box mb={3}>
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography variant="body2" color="text.secondary">
                      Progress
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {challenge.progress}%
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={challenge.progress}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: 'rgba(103, 126, 234, 0.1)',
                      '& .MuiLinearProgress-bar': {
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      },
                    }}
                  />
                </Box>

                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Current Profit
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: 'success.main' }}>
                      ${challenge.profit.toLocaleString()}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Target
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      ${challenge.target.toLocaleString()}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary">
                      Days Remaining
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: 'warning.main' }}>
                      {challenge.daysLeft} days
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

