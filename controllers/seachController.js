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
      const score =
        receivedDuration * (reqCarrier === curr.carrier ? 0.9 : 1) +
        getDistanceBetweenAirports();
      prev = [...prev, { ...curr, duration: receivedDuration, score }];
    }
    return prev;
  }, []);

  const sortedByScore = filterFlights.sort((a, b) => a.score - b.score);

  return res.send(sortedByScore);
};

const getDistanceBetweenAirports = (code1, code2) => {
  return 200;
};
