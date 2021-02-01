export const token = (data) =>{
	return new Promise((r, rej) => {
		// type=customer
		wx.request({
			url: 'https://wx.liantuofu.com/api/cp/accessToken.do',
			data: {
				corpId: "wx69516bc462dd79e0",
				suiteId: "1000128",
				...data
			},
			success: (res) => {
				console.log('33333333333',res)
				r(res.data.result)
			},
			fail: (err) => {
				console.log('44444444444',err)
				rej(err)
			}
		})
	})
}