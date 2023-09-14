import express from 'express'
import axios from 'axios'

const app = express()

const headers = {
  Cookie:
    '_hudVID=51280303-8e08-01ae-3d12-667a260427f4; _hudSource=; _hudSID=1692839072641_4; _HZ_I_SessionId=5581db4d-da60-4f9f-bbed-2d3ba9f2fafd; userToken=487644794fd0448d87b440f0861b3671262571721; hud_refer=hrewards.huazhu.com/|10001,hpassport.huazhu.com/|10018,hrewards.huazhu.com/hotel|10013; _hudPVID=31; _hudSID_TS=1692839094344'
}

const port = 3660 // 可以设置自定义的端口

// 城市列表
app.get('/get-city', async (req, res) => {
  try {
    const response = await axios.get('https://hweb-hotel.huazhu.com/hotels/city/getCityList', {
      headers
    })
    const cities = response.data.content.cityList.map((item) => ({
      label: item.cityName,
      value: item.cityName
    }))
    const hotCityList = response.data.content.hotCityList.map((item) => ({
      label: item.cityName,
      value: item.cityName
    }))
    res.json({ cities, hotCityList })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'An error occurred while processing the request' })
  }
})

// ?cityName=%E5%8C%97%E4%BA%AC&keyword=dayue
app.get('/search-hotel', async (req, res) => {
  try {
    const response = await axios.get('https://hweb-hotel.huazhu.com/hotels/search/search', {
      params: req.query,
      headers
    })
    const data = response.data.content.map((item) => ({
      label: item.displayName,
      value: item.searchValue
    }))
    res.json(data)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'An error occurred while processing the request' })
  }
})

// hotelId checkInDate checkOutDate
app.get('/hotel-detail', async (req, res) => {
  try {
    const response = await axios.get('https://hweb-hotel.huazhu.com/hotels/hotel/detail', {
      params: req.query,
      headers
    })
    const data = response.data.content.roomPriceList.roomList.map((item) => {
      let amount = 0
      for (const price_item of item.ratePlanCodeList[0].dailyPrice) {
        amount += price_item.prices[0].amount
      }

      const orgPrice = Math.ceil(amount / item.ratePlanCodeList[0].dailyPrice.length)
      const price = orgPrice < 330 ? Math.ceil(orgPrice + 10) : Math.ceil(orgPrice * 1.038)

      return {
        typeRoomName: item.typeRoomName,
        price,
        hasWindow: item.hasWindow,
        bedSize: item.bedSize
      }
    })
    res.json(data)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'An error occurred while processing the request' })
  }
})

// 启动服务器
app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
