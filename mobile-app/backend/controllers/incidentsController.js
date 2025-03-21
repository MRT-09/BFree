const supabase = require('../config/supabase');
const { format, startOfWeek, addDays } = require('date-fns');

exports.getDailyIncidents = async (req, res) => {
    try {
        console.log('Request body:', req.body);
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

        console.log({incidents: data.length})

        return res.status(200).json({ incidents: data.length });
    } catch (error) {
        console.error('Server error:', error.message);
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.getWeeklyIncidents = async (req, res) => {
    try {
        console.log('Request body:', req.body);
        const { date } = req.body;

        if (!date)
            return res.status(400).json({ message: 'Date is required' });

        const Ndate = format(new Date(date), 'yyyy-MM-dd');
        console.log('Formatted date:', Ndate);
        const start = startOfWeek(Ndate);

        let returnData = [];
        for (let i = 0; i < 7; i++) {
            const currentDate = addDays(start, i);
            const ndate = format(currentDate, 'yyyy-MM-dd');

            const { data, error } = await supabase.rpc('dailyIncidents', { ndate });

            if (error)
                return res.status(400).json({ message: error.message });

            returnData.push({
                date: format(currentDate, 'yyyy-MM-dd'),
                incidents: data.length
            });
        }

        console.log(returnData);

        return res.status(200).json({ incidents: returnData });
    } catch (error) {
        console.error('Server error: ', error.message)
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.getPreviousWeeklyIncidents = async (req, res) => {
    try {
        console.log('Request body:', req.body);
        const { date } = req.body;
        const date1= addDays(date, -7);
        if (!date1)
            return res.status(400).json({ message: 'Date is required' });
        
        const Ndate = format(new Date(date1), 'yyyy-MM-dd');
        console.log('Formatted date:', Ndate);
        const start = startOfWeek(Ndate);

        let returnData = [];
        for (let i = 0; i < 7; i++) {
            const currentDate = addDays(start, i);
            const ndate = format(currentDate, 'yyyy-MM-dd');

            const { data, error } = await supabase.rpc('dailyIncidents', { ndate });

            if (error)
                return res.status(400).json({ message: errorI.message });

            returnData.push({
                date: format(currentDate, 'yyyy-MM-dd'),
                incidents: data.length
            });
        }

        console.log(returnData);

        return res.status(200).json({ incidents: returnData });
    } catch (error) {
        console.error('Server error: ', error.message)
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.getIncidentsCount = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('incidents')
            .select('*');

        if (error)
            return res.status(400).json({ message: error.message });

        return res.status(200).json({ incidentsCount: data.length });
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.getThreeHourlyIncidents = async (req, res) => {
    try {
        const { date, hour } = req.body;
        console.log('Request body:', req.body);

        if (!hour || !date)
            return res.status(400).json({ message: 'Hour and date are required' });

        const ndate = format(new Date(date), 'yyyy-MM-dd');

        let prc = hour % 3;
        let start = hour - prc;
        let returnData = [];
        for (let i = 0; i < 3; i++) {
            const currentHour = start + i;
            const currHour = `${currentHour.toString().padStart(2, '0')}:00:00`;

            console.log(`Calling Supabase RPC with ndate: ${ndate}, hour: ${currHour}`);

            // Explicitly cast the hour parameter to TIME
            const { data, error } = await supabase
                .rpc('hourlyIncidents', { ndate, currHour:hour })
                .select('*');

            console.log(`Supabase response for hour ${currHour}:`, { data, error });

            if (error)
                return res.status(400).json({ message: error.message });

            if (!data || data.length === 0) {
                console.warn(`No data found for hour ${currHour}`);
                returnData.push({
                    hour: currentHour,
                    incidents: 0
                });
                continue;
            }

            returnData.push({
                hour: currHour,
                incidents: data.length
            });
        }

        console.log('3-hourly data:', returnData);

        return res.status(200).json({ incidents: returnData });
    } catch (error) {
        console.error('Server error:', error.message);
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};