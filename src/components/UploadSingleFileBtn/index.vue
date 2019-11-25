<template>
  <el-upload
    ref="upload"
    class="upload-demo"
    :action="action"
    :headers="{Authorization:`cat ${token}`}"
    :on-success="uploadSuccess"
    :on-progress="uploadProgress"
    :on-error="uploadError"
    :limit="1"
    :on-exceed="handleExceed"
    :file-list="fileList"
    :show-file-list="false"
  >
    <el-button :loading="uploadLoading" size="small" type="primary">{{ btnName }}</el-button>
  </el-upload>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'UploadSingleFileBtn',
  props: {
    action: {
      type: String,
      default: ''
    },
    btnName: {
      type: String,
      default: '点击上传'
    }
  },
  data() {
    return {
      uploadLoading: false,
      fileList: []
    }
  },
  computed: {
    ...mapGetters([
      'token'
    ])
  },
  methods: {
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    },
    uploadSuccess(response) {
      this.$refs.upload.clearFiles()
      this.uploadLoading = false
      if (response && response.code === 200) {
        this.$message({
          message: '上传成功',
          type: 'success'
        })
      } else {
        this.$message({
          message: response && response.message ? response.message : '上传失败',
          type: 'error'
        })
      }
    },
    uploadError() {
      this.$refs.upload.clearFiles()
      this.uploadLoading = false
      this.$message({
        message: '上传失败',
        type: 'error'
      })
    },
    uploadProgress() {
      this.uploadLoading = true
    }
  }
}
</script>
