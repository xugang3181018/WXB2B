// components/Tab/Tab.js
Component({
  properties: {
    list: {
      type: Array,
      value: [1, 2]
    },
    current: {
      type: String,
      value: '0'
    }
  },
	externalClasses: ['tabs'],
  data: {
    current: '0'
  },
	options: {
		addGlobalClass: true,
	},
  methods: {
    toggleTab({ target }) {
      const id = target.dataset.id
      this.setData({
        current: id
      })
      this.triggerEvent('change', id)
    }
  }
})
