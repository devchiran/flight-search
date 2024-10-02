import axios from 'axios';
import { createClient } from 'redis';

//create redis client to connect to redis server
const client = await createClient()
  .on('error', (err) => console.log('Redis Client Error', err))
  .connect();

export const getSearchFlight = async (req, res) => {
  try {
    const {
      departure,
      arrival,
      duration: reqDuration,
      carrier: reqCarrier,
    } = req.query;

    // Generate a unique cache key
    const cacheKey = `flights:${departure}:${arrival}:${reqDuration}:${reqCarrier}`;

    console.log('Cached value :====', cacheKey);
    // Check if cache is present
    const cachedResult = await client.get(cacheKey);

    if (cachedResult != null) {
      console.log('Cached value :', cachedResult);
      return res.send(JSON.parse(cachedResult));
    }

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

    const flightsSortedByScore = filterFlights.sort(
      (a, b) => a.score - b.score,
    );

    // Cache the result 15 minutes
    await client.set(cacheKey, JSON.stringify(flightsSortedByScore), {
      EX: 900,
    });

    return res.send(flightsSortedByScore);
  } catch (err) {
    return res.status(500).send('Search failed! Please try again.');
  }
};

const getDistanceBetweenAirports = (code1, code2) => {
  // Tried to use the https://openflights.org/ endpoint, but not able to ge the response.
  // URL used: https://openflights.org/php/apsearch.php?iata=YYZ&country=ALL&dst=U&db=airports&iatafilter=true&action=SEARCH&offset=0

  // Plan for this sectioon of code
  /*
  1. Use the origin code (code1) and desination code (code2) to get the latitude and 
     longitude for each [Using a PROMISE, so that the next step is process only after both the calls are resolved]
  2. Use the "Haversine" npm package to calculate the distance passing the received 
     latitude and longitude of both - origin and destination
  3. Return the real distance (instead of fixed 200)
  */
  return 200;
};
