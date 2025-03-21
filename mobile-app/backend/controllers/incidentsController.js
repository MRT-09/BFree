const supabase = require('../config/supabase');
const { format, startOfWeek, addDays } = require('date-fns');

exports.getDailyIncidents = async (req, res) => {
  try {
    const { date } = req.query;

    if (!date)
      return res.status(400).json({ message: 'Date is required' });

    const Ndate = format(new Date(date), 'yyyy-MM-dd');
    const { data, error } = await supabase
      .rpc('dailyIncidents', { Ndate });

    if (error)
      return res.status(400).json({ message: error.message });

    res.status(200).json({ incidents: data.length });
  } catch (error) {
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

            const { dataI, errorI } = await supabase
                .rpc('dailyIncidents', { date: format(currentDate, 'yyyy-MM-dd') });

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

        const Ndate = format(new Date(date), 'yyyy-MM-dd');

        let prc = hour % 3;
        let start = hour - prc;
        let returnData = [ { hour: start } ];
        for (let i = 0; i < 3; i++) {
            const currentHour = start + i;

            const { dataI, errorI } = await supabase
                .rpc('hourlyIncidents', { date: Ndate, hour: currentHour });

            if (errorI)
                return res.status(400).json({ message: errorI.message });

            returnData.push({
                hour: currentHour,
                incidents: dataI.length
            });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};