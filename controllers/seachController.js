import axios from 'axios';
export const getSearchFlight = async (req, res) => {
  const { departure, arrival, duration, carrier: reqCarrier } = req.query;
  const { data: flights } = await axios.get(
    'https://gist.githubusercontent.com/bgdavidx/132a9e3b9c70897bc07cfa5ca25747be/raw/8dbbe1db38087fad4a8c8ade48e741d6fad8c872/gistfile1.txt',
  );

  const filterFlightsByTime = flights.reduce((prev, curr) => {
    const searchDepart = new Date(curr.departureTime).getMilliseconds();
    const resArrival = new Date(curr.arrivalTime).getMilliseconds();
    const reqDepart = new Date(departure).getMilliseconds();
    const reqArrival = new Date(arrival).getMilliseconds();

    const resDurationtion = (resArrival - searchDepart) / 1000 / 60 / 60;
    const score =
      resDurationtion * (reqCarrier ? 1 : 0.9) + getDistanceBetweenAirports;

    if (
      searchDepart >= reqDepart &&
      resArrival <= reqArrival &&
      duration >= resDurationtion
    ) {
      prev = [...prev, { ...curr, resDurationtion, score }];
    }
    return prev;
  }, []);

  const filterFlightsByCarrier = filterFlightsByTime.filter(
    (flight) => flight.carrier === carrier,
  );

  const sortedByScore = filterFlightsByCarrier.sort(
    (a, b) => a.score < b.score,
  );

  return res.send(sortedByScore);
};

const getDistanceBetweenAirports = async (code1, code2) => {
  return 200;
};
