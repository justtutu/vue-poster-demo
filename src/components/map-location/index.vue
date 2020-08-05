
<template>
  <div :label="label">
    <!--    搜索框-->
    <el-input v-model="lnglat">
      <el-button
        slot="append"
        type="primary"
        icon="el-icon-map-location"
        @click="isShow=true"
      />
    </el-input>
    <el-dialog :visible.sync="isShow" title="地图定位" append-to-body @opened="initMap">
      <div class="map-container">
        <!--      地图-->
        <div id="container" class="map" tabindex="0">
          <input id="pickerInput" placeholder="查找地点" class="search">
        </div>
        <!--      定位结果-->
        <el-form label-width="100px" style="width: 100%">
          <el-form-item label="当前经纬度">
            <el-input v-model="lnglat" readonly />
          </el-form-item>
          <el-form-item label="当前地址">
            <el-input v-model="address" readonly />
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isShow = false">取 消</el-button>
        <el-button type="primary" @click="choosePosition">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'MapLocation',
  props: {
    label: {
      type: String,
      default: '经纬度'
    },
    companyAddr: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      // 经纬度
      lnglat: '',
      // 地址
      address: '',
      geoCode: null,
      isShow: false,
      // 首次加载
      isFirstInit: true
    }
  },
  watch: {
    companyAddr(newValue, oldValue) {
      this.address = newValue
      // this.geoCode()
    }
  },
  mounted() {
  },
  methods: {
    // 初始化高德地图
    initMap() {
      if (this.isFirstInit) {
        const _this = this
        const AMap = window.AMap
        const AMapUI = window.AMapUI
        AMapUI.loadUI(['misc/PositionPicker', 'misc/PoiPicker'], function(
          PositionPicker,
          PoiPicker
        ) {
          const map = new AMap.Map('container', {
            zoom: 16,
            scrollWheel: false
          })
          const poiPicker = new PoiPicker({
            input: 'pickerInput' // 输入框的id
          })

          const positionPicker = new PositionPicker({
            mode: 'dragMap',
            map: map
          })

          positionPicker.on('success', (positionResult) => {
            const {
              address,
              position: { lat, lng }
            } = positionResult
            _this.lnglat = `${lat},${lng}`
            _this.address = address
          })
          positionPicker.on('fail', function(positionResult) {
            _this.lnglat = ''
            _this.address = ''
          })
          positionPicker.start()
          map.panBy(0, 1)
          map.addControl(
            new AMap.ToolBar({
              liteStyle: true
            })
          )
          const clickHandler = function(e) {
            positionPicker.start(e.lnglat)
          }
          // 绑定事件
          map.on('click', clickHandler)
          // 初始化poiPicker
          poiPickerReady(poiPicker)
          // 搜索框
          const marker = new AMap.Marker()
          function poiPickerReady(poiPicker) {
            window.poiPicker = poiPicker
            // 选取了某个POI
            poiPicker.on('poiPicked', function(poiResult) {
              const poi = poiResult.item
              marker.setPosition(poi.location)
              map.setCenter(marker.getPosition())
            })
          }

          // 地理编码服务
          const geocoder = new AMap.Geocoder({})
          _this.geoCode = function geoCode() {
            geocoder.getLocation(this.address, function(status, result) {
              if (status === 'complete' && result.geocodes.length) {
                const {
                  formattedAddress,
                  location: { lat, lng }
                } = result.geocodes[0]
                _this.lnglat = `${lat},${lng}`
                _this.address = formattedAddress
                marker.setPosition(result.geocodes[0].location)
                map.setCenter(marker.getPosition())
                _this.choosePositon()
              } else {
                console.error('根据地址查询位置失败')
              }
            })
          }
        })
        this.isFirstInit = false
      }
    },
    // 选择坐标
    choosePosition() {
      if (!this.lnglat) {
        this.$message.info('请选择商户坐标！')
        return
      }
      this.isShow = false
      this.$emit('changeAddress', { lnglat: this.lnglat, address: this.address })
    }
  }
}
</script>

<style lang="scss" scoped>
.map-container {
  height: 90%;
  width: 90%;
  position: relative;
  .search {
    position: absolute;
    z-index: 9999;
    top: 50px;
    right: 30px;
    width: 300px;
    height: 36px;
    line-height: 36px;
    border: 1px solid #606266;
  }
}
.map {
  height: 40vh;
  width: 100%;
}
.tool {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  z-index: 1;
}
.search-wrap {
  width: 100%;
  display: -webkit-flex;
  display: flex;
  -webkit-box-align: center;
  -webkit-align-items: center;
  align-items: center;
  box-sizing: border-box;
  padding: 10px 12px;

}
</style>
