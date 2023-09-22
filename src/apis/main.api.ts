import axios from "axios";

const prefix = `/hzh`;

export const getCities = async () => {
  const {
    data,
  } = await axios.get(`${prefix}/get-city`);

  return data;
};

export const searchHotel = async (cityName, keyword) => {
  const {
    data,
  } = await axios.get(`${prefix}/search-hotel`, {
    params: {
      cityName, keyword
    }
  });

  return data;
};

export const getDetail = async (params) => {
  const {
    data,
  } = await axios.get(`${prefix}/hotel-detail`, { params });

  return data;
};

export const getBooked = async (params) => {
  const {
    data,
  } = await axios.get(`${prefix}/hotel-detail`, { params });

  return data;
};