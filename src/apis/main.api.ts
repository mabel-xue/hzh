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

/** 查询渠道基本接入信息 */
export const channelBaseInfo = async (id) => {
  const {
    data: { data },
  } = await axios.get(`${prefix}/baseInfo/${id}`);

  return data;
};

/** 渠道项新建 */
export const channelAdd = async (params) => {
  const {
    data: { data },
  } = await axios.post(`${prefix}/add`, params);

  return data;
};

/** 查询渠道通知地址 */
export const addrDetail = async (id) => {
  const {
    data: { data },
  } = await axios.get(`${prefix}/addr/${id}`);

  return data;
};

/** 渠道修改启用状态 */
export const modifyStatus = async (params) => {
  const {
    data: { data },
  } = await axios.post(`${prefix}/modify-status`, params);

  return data;
};
