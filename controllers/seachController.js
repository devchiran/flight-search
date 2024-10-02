import axios from 'axios';
export const getSearchFlight = async (req, res) => {
  const {
    departure,
    arrival,
    duration: reqDuration,
    carrier: reqCarrier,
  } = req.query;
  const { data: flights } = await axios.get(
    'https://gist.githubusercontent.com/bgdavidx/132a9e3b9c70897bc07cfa5ca25747be/raw/8dbbe1db38087fad4a8c8ade48e741d6fad8c872/gistfile1.txt',
  );

  const reqDepart = new Date(departure).getTime();
  const reqArrival = new Date(arrival).getTime();

  console.log('1----- : ', flights.length);
  const filterFlights = flights.reduce((prev, curr) => {
    const receivedDepart = new Date(curr.departureTime).getTime();
    const receivedArrival = new Date(curr.arrivalTime).getTime();

    const receivedDuration = Math.floor(
      (receivedArrival - receivedDepart) / (1000 * 60 * 60),
    );

    if (
      receivedDepart >= reqDepart &&
      receivedDepart <= reqArrival &&
      (!reqDuration || reqDuration >= receivedDuration)
    ) {
      // console.log("3 --- : ", receivedDuration);
      const score =
        receivedDuration * (reqCarrier ? 1 : 0.9) +
        getDistanceBetweenAirports();
      prev = [...prev, { ...curr, duration: receivedDuration, score }];
    }
    return prev;
  }, []);

  const filterFlightsByCarrier = filterFlights.filter(
    (flight) => flight.carrier === reqCarrier,
  );

  console.log('2----- : ', filterFlightsByCarrier.length);
  const sortedByScore = filterFlightsByCarrier.sort(
    (a, b) => a.score - b.score,
  );

  return res.send(sortedByScore);
};

const getDistanceBetweenAirports = (code1, code2) => {
  return 200;
};
