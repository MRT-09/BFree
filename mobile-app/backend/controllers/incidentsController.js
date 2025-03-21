const supabase = require('../config/supabase');
const { format, startOfWeek, addDays } = require('date-fns');

exports.getDailyIncidents = async (req, res) => {
  try {
    console.log('Request query:', req.body);
    const { date } = req.body;

    if (!date) {
      return res.status(400).json({ message: 'Date is required' });
    }

    const ndate = format(new Date(date), 'yyyy-MM-dd');
    console.log('Formatted date:', ndate);

    const { data, error } = await supabase.rpc('dailyIncidents', { ndate });

    if (error) {
      console.error('Supabase error:', error.message);
      return res.status(400).json({ message: error.message });
    }

    res.status(200).json({ incidents: data.length });
  } catch (error) {
    console.error('Server error:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getWeeklyIncidents = async (req, res) => {
    try {
        const { date } = req.body;

        if (!date)
            return res.status(400).json({ message: 'Date is required' });

        const Ndate = format(new Date(date), 'yyyy-MM-dd');

        const start = format(startOfWeek(Ndate), { weekStartsOn: 1 });

        let returnData = [];
        for (let i = 0; i < 7; i++) {
            const currentDate = addDays(start, i);
            const ndate = format(currentDate, 'yyyy-MM-dd');

            const { dataI, errorI } = await supabase
            .rpc('dailyIncidents', { ndate });

            if (errorI)
                return res.status(400).json({ message: errorI.message });

            returnData.push({
                date: format(currentDate, 'yyyy-MM-dd'),
                incidents: dataI.length
            });
        }

        res.status(200).json({ incidents: returnData });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.getIncidentsCount = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('incidents')
            .select('*');

        if (error)
            return res.status(400).json({ message: error.message });

        res.status(200).json({ incidentsCount: data.length });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.getThreeHourlyIncidents = async (req, res) => {
    try {
        const { date, hour } = req.body;

        if (!hour || !date)
            return res.status(400).json({ message: 'Hour and date are required' });

        const ndate = format(new Date(date), 'yyyy-MM-dd');

        let prc = hour % 3;
        let start = hour - prc;
        let returnData = [];
        for (let i = 0; i < 3; i++) {
            const hour = start + i;

            const { dataI, errorI } = await supabase
                .rpc('hourlyIncidents', { ndate, hour });

            if (errorI)
                return res.status(400).json({ message: errorI.message });

            returnData.push({
                hour: hour,
                incidents: dataI.length
            });
        }

        return res.status(200).json({ incidents: returnData.length });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};