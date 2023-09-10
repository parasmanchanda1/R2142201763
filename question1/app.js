const { DateTime, Duration } = require('luxon');
const express = require('express');
const app = express();
const port = 5000;

// Sample train data (you can replace this with real data or fetch it from a database)
const trains = [{"trainName":"Cochin Exp","trainNumber":"2348","departureTime":{"Hours":15,"Minutes":55,"Seconds":0},"seatsAvailable":{"sleeper":1,"AC":0},"price":{"sleeper":647,"AC":934},"delayedBy":11},{"trainName":"Chennai Exp","trainNumber":"2344","departureTime":{"Hours":21,"Minutes":35,"Seconds":0},"seatsAvailable":{"sleeper":3,"AC":1},"price":{"sleeper":482,"AC":590},"delayedBy":15},{"trainName":"Hyderabad Exp","trainNumber":"2341","departureTime":{"Hours":23,"Minutes":55,"Seconds":0},"seatsAvailable":{"sleeper":6,"AC":7},"price":{"sleeper":554,"AC":1854},"delayedBy":5},{"trainName":"Aizawl Exp","trainNumber":"2342","departureTime":{"Hours":8,"Minutes":30,"Seconds":0},"seatsAvailable":{"sleeper":18,"AC":7},"price":{"sleeper":1172,"AC":1803},"delayedBy":2},{"trainName":"Jodhpur Exp","trainNumber":"2344","departureTime":{"Hours":11,"Minutes":0,"Seconds":0},"seatsAvailable":{"sleeper":33,"AC":13},"price":{"sleeper":603,"AC":714},"delayedBy":4},{"trainName":"Cuttack Exp","trainNumber":"2346","departureTime":{"Hours":12,"Minutes":3,"Seconds":0},"seatsAvailable":{"sleeper":10,"AC":1},"price":{"sleeper":440,"AC":583},"delayedBy":6},{"trainName":"Srinagar Exp","trainNumber":"2349","departureTime":{"Hours":14,"Minutes":55,"Seconds":0},"seatsAvailable":{"sleeper":1,"AC":0},"price":{"sleeper":927,"AC":1014},"delayedBy":10},{"trainName":"Gandhinagar Exp","trainNumber":"2341","departureTime":{"Hours":7,"Minutes":15,"Seconds":0},"seatsAvailable":{"sleeper":15,"AC":5},"price":{"sleeper":442,"AC":675},"delayedBy":1},{"trainName":"Lucknow Exp","trainNumber":"2347","departureTime":{"Hours":17,"Minutes":33,"Seconds":0},"seatsAvailable":{"sleeper":5,"AC":1},"price":{"sleeper":270,"AC":393},"delayedBy":12},{"trainName":"Amritsar Exp","trainNumber":"2346","departureTime":{"Hours":19,"Minutes":0,"Seconds":0},"seatsAvailable":{"sleeper":15,"AC":10},"price":{"sleeper":510,"AC":710},"delayedBy":13},{"trainName":"Pune Exp","trainNumber":"2342","departureTime":{"Hours":23,"Minutes":0,"Seconds":0},"seatsAvailable":{"sleeper":6,"AC":7},"price":{"sleeper":824,"AC":1824},"delayedBy":17},{"trainName":"Delhi Exp","trainNumber":"2343","departureTime":{"Hours":9,"Minutes":45,"Seconds":0},"seatsAvailable":{"sleeper":32,"AC":1},"price":{"sleeper":385,"AC":1383},"delayedBy":3},{"trainName":"Mysore Exp","trainNumber":"2347","departureTime":{"Hours":13,"Minutes":32,"Seconds":0},"seatsAvailable":{"sleeper":2,"AC":2},"price":{"sleeper":480,"AC":613},"delayedBy":8},{"trainName":"Panjim Exp","trainNumber":"2349","departureTime":{"Hours":13,"Minutes":32,"Seconds":0},"seatsAvailable":{"sleeper":2,"AC":1},"price":{"sleeper":270,"AC":437},"delayedBy":9},{"trainName":"Sikkim Exp","trainNumber":"2345","departureTime":{"Hours":11,"Minutes":23,"Seconds":0},"seatsAvailable":{"sleeper":4,"AC":4},"price":{"sleeper":651,"AC":1427},"delayedBy":5},{"trainName":"Bokaro Exp","trainNumber":"2347","departureTime":{"Hours":13,"Minutes":32,"Seconds":0},"seatsAvailable":{"sleeper":55,"AC":0},"price":{"sleeper":223,"AC":413},"delayedBy":7},{"trainName":"Kolkata Exp","trainNumber":"2345","departureTime":{"Hours":20,"Minutes":15,"Seconds":0},"seatsAvailable":{"sleeper":16,"AC":70},"price":{"sleeper":570,"AC":670},"delayedBy":14},{"trainName":"Mumbai Exp","trainNumber":"2343","departureTime":{"Hours":22,"Minutes":37,"Seconds":0},"seatsAvailable":{"sleeper":8,"AC":15},"price":{"sleeper":520,"AC":620},"delayedBy":16}];

function get_next_12_hours_schedule() {
    const current_time = DateTime.now();
    const twelve_hours_later = current_time.plus(Duration.fromObject({ hours: 12 }));

    // Filter and sort trains based on the specified criteria
    const filtered_trains = trains.filter(train => {
        const departure_time = get_train_departure_datetime(train, current_time);
        return (
            current_time <= departure_time &&
            departure_time <= twelve_hours_later &&
            train.delayedBy <= 30
        );
    });

    const sorted_trains = filtered_trains.sort((a, b) => {
        const priceA = a.price.sleeper;
        const priceB = b.price.sleeper;
        const seatsAvailableA = -a.seatsAvailable.sleeper;
        const seatsAvailableB = -b.seatsAvailable.sleeper;
        const departureMinutesA = -get_train_departure_minutes(a);
        const departureMinutesB = -get_train_departure_minutes(b);

        return priceA - priceB || seatsAvailableA - seatsAvailableB || departureMinutesA - departureMinutesB;
    });

    return sorted_trains;
}

function get_train_departure_datetime(train, current_time) {
    const departure_time = train.departureTime;
    return current_time.set({
        hour: departure_time.Hours,
        minute: departure_time.Minutes,
        second: departure_time.Seconds,
    });
}

function get_train_departure_minutes(train) {
    const departure_time = train.departureTime;
    return departure_time.Hours * 60 + departure_time.Minutes;
}

const current_time = DateTime.now();
const train_schedule = get_next_12_hours_schedule();

const storedTrainSchedule = train_schedule.map(train => ({
    trainName: train.trainName,
    trainNumber: train.trainNumber,
    departureTime: get_train_departure_datetime(train, current_time).toString(),
    seatsAvailable: `${train.seatsAvailable.sleeper}/${train.seatsAvailable.AC}`,
    price: `${train.price.sleeper}/${train.price.AC}`,
    delay: train.delayedBy,
}));

console.log(storedTrainSchedule);
app.get('/api/trains', (req, res) => {
    res.json(storedTrainSchedule);
});


app.listen(8000,()=>
{
    console.log("server created successfully");
})

