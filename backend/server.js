const express = require('express');
const cors = require('cors');
const connection = require('./db');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.get('/',(req, res) => {
    res.send('Railway API is running');
});

app.get('/api/routes', (req, res) => {
    connection.query('SELECT * FROM route', (err, result) => {
        if (err) {
            res.status(500).send(err);
            return;
        }
        res.json(result);
    });
});

app.get('/api/route/:trainNumber', (req, res) => {
    const trainNumber = req.params.trainNumber;

    const query = `
    SELECT s.station_name, s.latitude, s.longitude, r.stop_number, r.station_arriving_time, r.station_departure_time
    FROM route r
    JOIN station s on r.station_id = s.station_id
    where r.train_id =(
    SELECT train_id FROM train
    where train_number = ?
    )
    ORDER BY r.stop_number  
    `;
    connection.query(query, [trainNumber], (err, results) => {
        if(err) {
            res.status(500).send(err);
            return;
        }
        res.json(results);
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

