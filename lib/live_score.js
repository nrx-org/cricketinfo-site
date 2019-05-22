import fetch from "isomorphic-fetch";
import { parse, isToday } from "date-fns";

const BASE_URL = "https://rest.cricketapi.com/rest/v2";
const SEASON_KEY = "icc_wc_2019";
const ACCESS_TOKEN_KEY = "cricketApiAccessToken";

const API_ACCESS_KEY = "840bad1986e671bd04f60ac50c696e93";
const API_SECRET_KEY = "35f708d3621d546141846747b0d659cf";
const API_APP_ID = "io.cricketinfo.www";
const API_DEVICE_ID = "browser";

const getAuthUrl = () => `${BASE_URL}/auth/`;
const getSeasonScheduleUrl = accessToken =>
  `${BASE_URL}/season/${SEASON_KEY}/?access_token=${accessToken}`;
const getMatchUrl = (matchKey, accessToken) =>
  `${BASE_URL}/match/${matchKey}/?access_token=${accessToken}`;

const getCachedAccessToken = () => {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
};

const refreshAccessToken = async () => {
  let auth = null;

  const formData = new FormData();
  formData.append("access_key", API_ACCESS_KEY);
  formData.append("secret_key", API_SECRET_KEY);
  formData.append("app_id", API_APP_ID);
  formData.append("device_id", API_DEVICE_ID);

  try {
    const authResponse = await fetch(getAuthUrl(), {
      method: "POST",
      body: formData
    });
    auth = await authResponse.json();
  } catch (e) {
    return null;
  }

  if (auth.status_code !== 200) {
    return null;
  }

  localStorage.setItem(ACCESS_TOKEN_KEY, auth.auth.access_token);

  return auth.auth.access_token;
};

const fetchSeasonScheduleFromServer = async accessToken => {
  const seasonScheduleResponse = await fetch(getSeasonScheduleUrl(accessToken));
  return seasonScheduleResponse.json();
};

const getSeasonSchedule = async () => {
  let accessToken = getCachedAccessToken();

  let seasonSchedule = null;

  // The server will return invalid headers if our access token is invalid.
  // This ends up raising an exception. Accounting for this situation here
  // by trying again with a refreshed access token.
  try {
    seasonSchedule = await fetchSeasonScheduleFromServer(accessToken);
  } catch (e) {
    accessToken = await refreshAccessToken();
    seasonSchedule = await fetchSeasonScheduleFromServer(accessToken);
  }

  // If the server returns the correct headers, but our access token is still
  // invalid for some reason, try once more.
  if (
    seasonSchedule &&
    seasonSchedule.status_code === 403 &&
    seasonSchedule.status_msg === "Invalid Access Token"
  ) {
    accessToken = await refreshAccessToken();
    seasonSchedule = await fetchSeasonScheduleFromServer(accessToken);
  }

  if (seasonSchedule.status_code === 200) {
    return seasonSchedule;
  }

  return null;
};

const getTodayMatches = seasonSchedule => {
  if (
    !seasonSchedule ||
    !seasonSchedule.data ||
    !seasonSchedule.data.season ||
    !seasonSchedule.data.season.matches
  ) {
    return null;
  }

  const { matches } = seasonSchedule.data.season;

  matches.dev_season_2014_q9 = {
    key: "dev_season_2014_q9",
    start_date: {
      iso: "2019-05-22T13:11+00:00"
    },
    status: "started"
  };

  matches.dev_season_2014_q7 = {
    key: "dev_season_2014_q7",
    start_date: {
      iso: "2019-05-22T13:11+00:00"
    },
    status: "notstarted"
  };

  matches.dev_season_2014_q3 = {
    key: "dev_season_2014_q3",
    start_date: {
      iso: "2019-05-22T13:11+00:00"
    },
    status: "completed"
  };

  return Object.keys(matches)
    .map(matchKey => matches[matchKey])
    .filter(match => {
      const date = parse(match.start_date.iso);
      return isToday(date);
    })
    .filter(match => match.status !== "notstarted");
};

const fetchAllMatchScoresFromServer = async (matches, accessToken) => {
  const matchScorePromises = matches.map(match =>
    fetch(getMatchUrl(match.key, accessToken))
  );

  const matchScoreResponses = await Promise.all(matchScorePromises);

  return Promise.all(matchScoreResponses.map(response => response.json()));
};

const getTodayMatchScores = async todayMatches => {
  let accessToken = getCachedAccessToken();

  let matchScores = null;

  // If we fail to fetch match scores the first time, we try again with a new
  // access token.
  try {
    matchScores = await fetchAllMatchScoresFromServer(
      todayMatches,
      accessToken
    );
  } catch (e) {
    accessToken = await refreshAccessToken();
    matchScores = await fetchAllMatchScoresFromServer(
      todayMatches,
      accessToken
    );
  }

  // If we got a response, but the JSON had a 403 status, we try again
  // with a new token.
  if (
    matchScores[0] &&
    matchScores[0].status_code === 403 &&
    matchScores[0].status_msg === "Invalid Access Token"
  ) {
    accessToken = await refreshAccessToken();
    matchScores = await fetchAllMatchScoresFromServer(
      todayMatches,
      accessToken
    );
  }

  if (matchScores.every(score => score.status_code === 200)) {
    return matchScores;
  }

  return null;
};

export const getLiveScore = async () => {
  const seasonSchedule = await getSeasonSchedule();
  const todayMatches = getTodayMatches(seasonSchedule);

  // Get scores for all today's matches.
  const todayMatchScores = await getTodayMatchScores(todayMatches);

  // Massage them into the shape we want and return them.
  return todayMatchScores.map(match => {
    const matchData = match.data.card;

    let scoreA = null;
    if (matchData && matchData.innings && matchData.innings.a_1) {
      scoreA = {
        runs: matchData.innings.a_1.runs,
        wickets: matchData.innings.a_1.wickets
      };
    }

    let scoreB = null;
    if (matchData && matchData.innings && matchData.innings.b_1) {
      scoreB = {
        runs: matchData.innings.b_1.runs,
        wickets: matchData.innings.b_1.wickets
      };
    }

    return {
      key: matchData.key,
      teamA: {
        name: matchData.teams.a.name,
        label: matchData.teams.a.key,
        score: scoreA
      },
      teamB: {
        name: matchData.teams.b.name,
        label: matchData.teams.b.key,
        score: scoreB
      },
      status: matchData.status,
      resultMessage: matchData.msgs.completed
    };
  });
};
