<template>
  <!-- 页面主容器 -->
  <div class="page-container">
    <!-- 主要内容容器 -->
    <div class="content-container">
      <div class="form">
        <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="110px" class="demo-ruleForm">
          <div class="rule-row">
            <el-form-item label="供应商全称" prop="name">
              <el-input v-model="ruleForm.name" />
            </el-form-item>
            <el-form-item label="简称" prop="shortName">
              <el-input v-model="ruleForm.shortName" />
            </el-form-item>
          </div>
          <div class="rule-row">
            <el-form-item label="选择地区" prop="area">
              <el-cascader
                v-model="ruleForm.area"
                style="width: 260px"
                :options="options"
                :props="props"
                filterable
                @change="selArea"
              />
            </el-form-item>
            <el-form-item label="详细地址" prop="address">
              <el-input v-model="ruleForm.address" placeholder="请您输入详细地址" />
            </el-form-item>
          </div>
          <div class="rule-row">
            <el-form-item label="社会统一代码" prop="socialCode">
              <el-input v-model="ruleForm.socialCode" />
            </el-form-item>
            <el-form-item label="成立日期" prop="registrationDate">
              <el-date-picker
                v-model="ruleForm.registrationDate"
                type="date"
                value-format="timestamp"
                placeholder="选择日期"
              />
            </el-form-item>
            <el-form-item label="营业期限" prop="businessTerm">
              <el-input v-model="ruleForm.businessTerm" placeholder="请输入营业期限" />
            </el-form-item>
          </div>
          <div class="rule-row">
            <el-form-item label="法定代表人" prop="legalRepresentative">
              <el-input v-model="ruleForm.legalRepresentative" />
            </el-form-item>
            <el-form-item label="注册资本" prop="registeredCapital">
              <el-input v-model="ruleForm.registeredCapital" />
            </el-form-item>
            <el-form-item label="企业类型" prop="enterpriseType">
              <el-select v-model="ruleForm.enterpriseType" @change="enterpriseChange">
                <el-option
                  v-for="item in enterpriseList"
                  :key="item.value"
                  :label="item.name"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </div>
          <div class="rule-row">
            <el-form-item label="开户行名称" prop="firstBankName">
              <el-input v-model="ruleForm.firstBankName" placeholder="请输入开户行名称" />
            </el-form-item>
            <el-form-item label="银行账户" prop="firstBankAccount">
              <el-input v-model="ruleForm.firstBankAccount" />
            </el-form-item>
          </div>
          <div class="rule-row">
            <el-form-item label="公司官网" prop="website">
              <el-input v-model="ruleForm.website" placeholder="请输入公司官网" />
            </el-form-item>
            <el-form-item label="单位邮箱" prop="companyEmail">
              <el-input v-model="ruleForm.companyEmail" placeholder="请输入单位邮箱" />
            </el-form-item>
            <el-form-item label="电话" prop="companyPhone">
              <el-input v-model="ruleForm.companyPhone" placeholder="请输入电话" />
            </el-form-item>
          </div>
          <div class="rule-row">
            <el-form-item label="联系人1" prop="firstContact">
              <el-input v-model="ruleForm.firstContact" placeholder="请输入联系人1" />
            </el-form-item>
            <el-form-item label="联系电话" prop="firstContactPhone">
              <el-input v-model="ruleForm.firstContactPhone" placeholder="请输入联系电话" />
            </el-form-item>
            <el-form-item label="个人邮箱" prop="firstContactEmail">
              <el-input v-model="ruleForm.firstContactEmail" placeholder="请输入个人邮箱" />
            </el-form-item>
          </div>
          <div class="rule-row">
            <el-form-item label="联系人2" prop="secondContact">
              <el-input v-model="ruleForm.secondContact" placeholder="请输入联系人2" />
            </el-form-item>
            <el-form-item label="联系电话" prop="secondContactPhone">
              <el-input v-model="ruleForm.secondContactPhone" placeholder="请输入联系电话" />
            </el-form-item>
            <el-form-item label="个人邮箱" prop="secondContactEmail">
              <el-input v-model="ruleForm.secondContactEmail" placeholder="请输入个人邮箱" />
            </el-form-item>
          </div>
          <div class="rule-row">
            <el-form-item label="主营业务" prop="mainBusiness">
              <el-input v-model="ruleForm.mainBusiness" placeholder="请输入主营业务" />
            </el-form-item>
            <el-form-item label="供应商分类" prop="supplierClassification">
              <el-select v-model="ruleForm.supplierClassification" multiple style="width: 390px">
                <el-option
                  v-for="item in supplierList"
                  :key="item.value"
                  :label="item.name"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </div>
          <div class="rule-row">
            <el-form-item label="相关资料">
              <el-upload
                ref="upload"
                class="upload-demo"
                :http-request="httpUpLoadRquest"
                :before-upload="beforeUpLoad"
                action="111"
              >
                <el-button size="small" type="primary">上传附件</el-button>
                <span slot="tip" class="el-upload__tip">可上传PDF文件和图片文件</span>
              </el-upload>
            </el-form-item>
          </div>

          <div class="btn">
            <div class="file">
              导入表格
              <input type="file" class="file-export" @change="choseFile($event)">
            </div>
            <el-button type="primary" class="el-icon-circle-plus-outline" @click="submitForm('ruleForm')">&nbsp; 添加供应商</el-button>
            <el-button type="warning" icon="el-icon-refresh" @click="resetForm('ruleForm')">&nbsp; 重置表单</el-button>
            <el-button type="success" icon="el-icon-back" @click="goBack">&nbsp; 返回</el-button>
          </div>

        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
import { formatExcelDate } from '@/utils'
import { validatorEmail, validatorTel, validatorBankAcount } from '@/utils/validatePattern'
import { getProvice, save, exportAnnex } from '@/api/supplier'
import { fetchEnterpriseTypeList, fetchSupplierTypeList } from '@/api/dictionary'
import XLSX from 'xlsx'
export default {
  name: 'SupplierManagementList',
  data() {
    return {
      supplierList: [], // 供应商类型
      enterpriseList: [], // 企业类型
      ruleForm: {
        name: '',
        shortName: '',
        area: [],
        state: '',
        city: '',
        region: '',
        address: '',
        socialCode: '',
        registrationDate: '',
        businessTerm: '',
        legalRepresentative: '',
        registeredCapital: '',
        enterpriseType: '',
        enterpriseTypeName: '',
        firstBankName: '',
        firstBankAccount: '',
        website: '',
        companyEmail: '',
        companyPhone: '',
        firstContact: '',
        firstContactPhone: '',
        firstContactEmail: '',
        secondContact: '',
        secondContactPhone: '',
        secondContactEmail: '',
        mainBusiness: '',
        supplierClassification: []
      },
      rules: {
        name: [
          { required: true, message: '请输入供应商全称', trigger: 'blur' }
        ],
        shortName: [
          { required: true, message: '请输入简称', trigger: 'blur' }
        ],
        area: [
          { required: true, message: '请选择地区', trigger: 'change' }
        ],
        address: [
          { required: true, message: '请输入详细地址', trigger: 'blur' }
        ],
        socialCode: [
          { required: true, message: '请输入社会统一代码', trigger: 'blur' }
        ],
        registrationDate: [
          { required: true, message: '请选择成立日期', trigger: 'change' }
        ],
        registeredCapital: [
          { required: true, message: '请输入注册资本', trigger: 'blur' }
        ],
        enterpriseType: [
          { required: true, message: '请选择企业类型', trigger: 'change' }
        ],
        firstBankName: [
          { required: true, message: '请输入开户行名称', trigger: 'blur' }
        ],
        firstBankAccount: [
          { required: true, message: '请输入银行账户', trigger: 'blur' },
          { pattern: validatorBankAcount, message: '请输入正确的银行账户', trigger: 'blur' }
        ],
        companyEmail: [
          { pattern: validatorEmail, message: '请输入正确的邮箱号码', trigger: 'blur' }
        ],
        companyPhone: [
          { pattern: validatorTel, message: '请输入正确的电话号码', trigger: 'blur' }
        ],
        firstContact: [
          { required: true, message: '请输入联系人1', trigger: 'blur' }
        ],
        firstContactPhone: [
          { required: true, message: '请输入联系电话', trigger: 'blur' },
          { pattern: validatorTel, message: '请输入正确的电话号码', trigger: 'blur' }
        ],
        secondContactPhone: [
          { pattern: validatorTel, message: '请输入正确的电话号码', trigger: 'blur' }
        ],
        firstContactEmail: [
          { required: true, message: '请输入个人邮箱', trigger: 'blur' },
          { pattern: validatorEmail, message: '请输入正确的邮箱号码', trigger: 'blur' }
        ],
        secondContactEmail: [
          { pattern: validatorEmail, message: '请输入正确的邮箱号码', trigger: 'blur' }
        ],
        supplierClassification: [
          { required: true, message: '请选择供应商类型', trigger: 'change' }
        ]
      },
      options: [],
      props: {
        label: 'name',
        value: 'id',
        children: 'cityList'
      },
      excelData: {},
      fileList: []
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    goBack() {
      this.$router.go(-1)
    },
    getList() {
      getProvice().then(res => {
        this.options = res.data
        this.options.forEach(v => {
          v.cityList.forEach(item => {
            if (item.cityList.length < 1) {
              item.cityList = undefined
            }
          })
        })
      }).catch(e => { })
      fetchEnterpriseTypeList().then(res => {
        if (res.code === 200) {
          this.enterpriseList = res.data
        }
      })
      fetchSupplierTypeList().then(res => {
        if (res.code === 200) {
          this.supplierList = res.data
        }
      })
    },
    selArea(val) {
      this.ruleForm.state = val[0] || ''
      this.ruleForm.city = val[1] || ''
      this.ruleForm.region = val[2] || ''
      this.options.forEach((v, index) => {
        if (v.id === val[0]) {
          this.ruleForm.stateName = v.name
        }
        v.cityList && v.cityList.forEach(c => {
          if (c.id === val[1]) {
            this.ruleForm.cityName = c.name
          }
          if (val[2]) {
            c.cityList && c.cityList.forEach(r => {
              if (r.id === val[2]) {
                this.ruleForm.regionName = r.name
              }
            })
          } else {
            this.ruleForm.regionName = ''
          }
        })
      })
    },
    beforeUpLoad(file) {
      if (file.name.length > 50) {
        this.$message({
          message: '文件名非法，请修改文件名后再次上传',
          type: 'warning'
        })
        return false
      }
    },
    httpUpLoadRquest(params) { // 自定义上传
      if (params.file.name.length > 50) {
        this.$message({
          message: '文件名非法，请修改文件名后再次上传',
          type: 'warning'
        })
        this.$refs.upload.abort(params.file)
        return false
      }
      const formData = new FormData()
      formData.append('file', params.file)
      formData.append('fileType', 1)
      exportAnnex(formData).then((res) => {
        if (res.status === 200) {
          this.$message.success('文件上传成功')
          this.$refs.upload.clearFiles()
        } else {
          this.$message.error(res.message)
          this.$refs.upload.clearFiles()
        }
      }).catch(e => {
        this.$message.error(e)
      })
    },
    handleChange(file, fileList) {
      // const formData = new FormData()
      // formData.append('upload_files', params.file)
    },
    submitForm(formName) {
      console.log(this.ruleForm)
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log(this.ruleForm)
          save(this.ruleForm).then(res => {
            if (res.data && res.code === 200) {
              this.$message.success('创建成功！')
              this.$refs[formName].resetFields()
              this.$router.go(-1)
            } else {
              this.$message.error('创建失败!')
            }
          }).catch(e => {
            this.$message.error('接口失败')
          })
        } else {
          return false
        }
      })
    },
    enterpriseChange(val) {
      this.enterpriseList.filter(v => {
        if (Number(v.value) === Number(this.ruleForm.enterpriseType)) {
          this.ruleForm.enterpriseTypeName = v.name
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    choseFile(file) {
      var reader = new FileReader()
      reader.readAsArrayBuffer(file.target.files[0]) // type array
      reader.onload = res => {
        var zzexcel = XLSX.read(res.target.result, {
          type: 'array' // binary
        })
        const sheet = XLSX.utils.sheet_to_json(zzexcel.Sheets[zzexcel.SheetNames[0]])
        sheet.forEach(v => {
          if (v.供应商入库登记表 === '供应商全称*') {
            this.ruleForm.name = v.__EMPTY
            this.ruleForm.shortName = v.__EMPTY_2
          } else if (v.供应商入库登记表 === '详细地址*') {
            this.ruleForm.state = v.__EMPTY
            this.ruleForm.city = v.__EMPTY_1
            this.ruleForm.region = v.__EMPTY_2
            this.ruleForm.address = v.__EMPTY_4
            const addressArr = []
            const state = v.__EMPTY.split('省')[0]
            const city = v.__EMPTY_1.split('市')[0]
            this.options.forEach((v, index) => {
              if (v.name === state) {
                addressArr.push(v.id)
              }
              v.cityList && v.cityList.forEach(c => {
                if (c.name === city) {
                  addressArr.push(c.id)
                }
                c.cityList && c.cityList.forEach(r => {
                  if (r.name === this.ruleForm.region) {
                    addressArr.push(r.id)
                  }
                })
              })
            })
            this.ruleForm.state = addressArr[0] ? addressArr[0] : ''
            this.ruleForm.city = addressArr[1] ? addressArr[1] : ''
            this.ruleForm.region = addressArr[2] ? addressArr[2] : ''
            this.ruleForm.area = addressArr
          } else if (v.供应商入库登记表 === '社会统一代码*') {
            this.ruleForm.socialCode = v.__EMPTY
            this.ruleForm.registrationDate = formatExcelDate(v.__EMPTY_2)
            this.ruleForm.businessTerm = v.__EMPTY_4
          } else if (v.供应商入库登记表 === '法定代表人') {
            this.ruleForm.legalRepresentative = v.__EMPTY
            this.ruleForm.registeredCapital = v.__EMPTY_2
            this.ruleForm.enterpriseType = v.__EMPTY_4
            this.enterpriseList.forEach(item => {
              if (item.name === v.__EMPTY_4) this.ruleForm.enterpriseType = item.value
            })
          } else if (v.供应商入库登记表 === '开户行名称*') {
            this.ruleForm.firstBankName = v.__EMPTY
            this.ruleForm.firstBankAccount = v.__EMPTY_2
          } else if (v.供应商入库登记表 === '公司官方网站') {
            this.ruleForm.website = v.__EMPTY
            this.ruleForm.companyEmail = v.__EMPTY_2
            this.ruleForm.companyPhone = v.__EMPTY_4
          } else if (v.供应商入库登记表 === '联系人1*') {
            this.ruleForm.firstContact = v.__EMPTY
            this.ruleForm.firstContactPhone = v.__EMPTY_2
            this.ruleForm.firstContactEmail = v.__EMPTY_4
          } else if (v.供应商入库登记表 === '联系人2') {
            this.ruleForm.secondContact = v.__EMPTY
            this.ruleForm.secondContactPhone = v.__EMPTY_2
            this.ruleForm.secondContactEmail = v.__EMPTY_4
          } else {
            this.ruleForm.mainBusiness = v.__EMPTY
            v.__EMPTY_4 = v.__EMPTY_4.split('、')
            v.__EMPTY_4.forEach(item => {
              this.supplierList.forEach(itemChild => {
                if (itemChild.name === item) this.ruleForm.supplierClassification.push(itemChild.value)
              })
            })
          }
        })
      }
    }
  }
}
</script>

<style scoped>
.form {
  padding:  45px 60px 35px 35px;
}
.demo-ruleForm .rule-row {
  display: flex;
  margin-bottom: 20px;
}
.demo-ruleForm .rule-row:last-child {
  margin-bottom: 0px;
}
.form .el-form-item {
  width: 30%;
  margin-right: 30px;
}
.form .el-upload__tip {
  padding-left: 15px;
}
.btn {
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
}
.file {
  position: relative;
  display: inline-block;
  background: #1890ff;
  border-radius: 4px;
  padding: 8px 24px;
  overflow: hidden;
  color: #ffffff;
  font-size: 14px;
  line-height: 20px;
  margin: 10px 10px;
}
.file .file-export {
  position: absolute;
  font-size: 100px;
  right: 0;
  top: 0;
  opacity: 0;
  cursor: pointer;
}
.file:hover {
  background: #46a6ff;
  border-color: #46a6ff;
  color: #fff;
}
</style>
