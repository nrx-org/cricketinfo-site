/* eslint-disable no-console */

import fetch from "isomorphic-fetch";

const BASE_URL = "https://rest.cricketapi.com/rest/v2";
const SEASON_KEY = "icc_wc_2019";
const ACCESS_TOKEN_KEY = "cricketApiAccessToken";

const getAuthUrl = () => `${BASE_URL}/auth/`;
const getSeasonScheduleUrl = accessToken =>
  `${BASE_URL}/season/${SEASON_KEY}/?access_token=${accessToken}`;

const getCachedAccessToken = () => {
  console.log("Getting cached access token");
  return localStorage.getItem(ACCESS_TOKEN_KEY);
};

const refreshAccessToken = async () => {
  let auth = null;

  try {
    const authResponse = await fetch(getAuthUrl());
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

const getSeasonSchedule = async () => {
  let accessToken = getCachedAccessToken();

  let seasonScheduleResponse = await fetch(getSeasonScheduleUrl(accessToken));
  let seasonSchedule = seasonScheduleResponse.json();

  if (
    seasonSchedule.status_code === 403 &&
    seasonSchedule.status_msg === "Invalid Access Token"
  ) {
    console.log("We need to renew the access token and try again");
    accessToken = await refreshAccessToken();
    seasonScheduleResponse = await fetch(getSeasonScheduleUrl(accessToken));
    seasonSchedule = seasonScheduleResponse.json();
  }

  return seasonSchedule;
};

export const getLiveScore = async () => {
  const seasonSchedule = await getSeasonSchedule();
  console.log(seasonSchedule);
  return seasonSchedule;
};
