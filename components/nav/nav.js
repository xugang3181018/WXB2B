Component({
  mixins: [],
  data: {
    statusBarHeight:0,
    titleBarHeight:0
  },
  props: {},
  onInit() {
    my.getSystemInfo({
      success:(res) => {
        console.log("状态栏高度"+res.statusBarHeight+"标题栏高度"+ res.titleBarHeight)
      }
    });
  },
  didMount() {},
  didUpdate() {},
  didUnmount() {},
  methods: {
    onReturn() {
      console.log(this.props)
      this.props.onOut()
    }
  },
});
