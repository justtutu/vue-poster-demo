<template>
  <el-dialog :visible="isShow">
    <el-form ref="form" :model="form" label-width="80px" inline>
      <el-form-item label="经纬度">
        <map-location :company-addr="form.address" @changeAddress="changeAddress" />
      </el-form-item>
      <el-form-item label="地址">
        <el-input v-model="form.address" />
      </el-form-item>
      <el-form-item label="活动名称2" />
      <el-form-item>
        <el-button type="primary" @click="onSubmit">立即创建</el-button>
        <el-button>取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>

</template>
<script>
import MapLocation from '@/components/map-location/index'
export default {
  name: 'Index',
  components: {
    MapLocation
  },
  data() {
    return {
      isShow: true,
      form: {
        address: '大学生家园普通公寓'
      }
    }
  },
  methods: {
    onSubmit() {
      console.log(this.form.name)
    },
    changeAddress({ lnglat, address }) {
      this.$set(this.form, 'lnglat', lnglat)
      this.$set(this.form, 'address', address)
      console.log(this.form)
    }
  }
}
</script>

<style scoped>

</style>
