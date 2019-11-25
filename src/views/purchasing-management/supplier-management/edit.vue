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
                ref="caseArea"
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
            <el-form-item label="企业类型" prop="enterpriseType" @change="enterpriseChange">
              <el-select v-model="ruleForm.enterpriseType">
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
                action="https://jsonplaceholder.typicode.com/posts/"
                :on-change="handleChange"
                :auto-upload="false"
              >
                <el-button size="small" type="primary">上传附件</el-button>
                <span slot="tip" class="el-upload__tip">可上传PDF文件和图片文件</span>
              </el-upload>
            </el-form-item>
          </div>
          <div class="center">
            <el-button class="el-icon-edit" type="primary" @click="submitForm('ruleForm')"> 修改</el-button>
            <el-button class="el-icon-error" @click="cancelHandle"> 取消</el-button>
          </div>

        </el-form>
      </div>
    </div>
    <!-- 其他模块（例如弹窗等） -->

  </div>
</template>
<script>
import { validatorEmail, validatorTel, validatorBankAcount } from '@/utils/validatePattern'
import { getProvice, detail, update } from '@/api/supplier'
import { fetchEnterpriseTypeList, fetchSupplierTypeList } from '@/api/dictionary'
export default {
  name: 'SupplierManagementEdit',
  data() {
    return {
      supplierList: [], // 供应商类型
      enterpriseList: [], // 企业类型
      id: '',
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
      fileList: [{ name: 'food.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100' }, { name: 'food2.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100' }]
    }
  },
  mounted() {
    this.id = this.$route.params.id
    this.getList()
  },
  methods: {
    getList() {
      if (this.id) {
        detail({ id: this.id }).then(res => {
          if (res.data && res.code === 200) {
            this.ruleForm = res.data
            if (Number(this.ruleForm.regionId) === 0) {
              const areaArr = [this.ruleForm.stateId, this.ruleForm.cityId]
              this.ruleForm.area = [...areaArr]
            } else {
              const areaArr = [this.ruleForm.stateId, this.ruleForm.cityId, this.ruleForm.regionId]
              this.ruleForm.area = [...areaArr]
            }

            const arr = []
            this.ruleForm.state = this.ruleForm.stateId
            this.ruleForm.city = this.ruleForm.cityId
            this.ruleForm.region = this.ruleForm.regionId
            // delete this.ruleForm.stateId
            // delete this.ruleForm.cityId
            // delete this.ruleForm.regionId
            this.ruleForm.enterpriseType = this.ruleForm.enterpriseType.toString()
            const supplierArr = this.ruleForm.supplierClassification.split('"')

            supplierArr.forEach((v, index) => {
              if (index % 2 !== 0) arr.push(v)
            })
            this.ruleForm.supplierClassification = arr
            console.log(this.ruleForm)
          }
        })
      }
      getProvice().then(res => {
        this.options = res.data
        this.options.forEach(v => {
          v.cityList.forEach(item => {
            if (item.cityList.length < 1) {
              item.cityList = undefined
            }
          })
        })
      })
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
      this.ruleForm.stateId = val[0] || ''
      this.ruleForm.cityId = val[1] || ''
      this.ruleForm.regionId = val[2] || ''
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
    enterpriseChange(val) {
      this.enterpriseList.filter(v => {
        if (Number(v.value) === Number(this.ruleForm.enterpriseType)) {
          this.ruleForm.enterpriseTypeName = v.name
        }
      })
    },
    handleChange(file, fileList) {
      console.log(file)
    },
    submitForm(formName) {
      console.log(this.ruleForm)
      this.$refs[formName].validate((valid) => {
        if (valid) {
          update(this.ruleForm).then(res => {
            if (res.code === 200) {
              this.$message.success('更新成功！')
              this.$router.go(-1)
            } else {
              this.$message.error(res.message)
            }
          }).catch(e => {
            this.$message.error(e)
          })
        } else {
          return false
        }
      })
    },
    cancelHandle() {
      this.$router.go(-1)
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
.form .el-form-item {
  width: 30%;
  margin-right: 30px;
}
.form .el-upload__tip {
  padding-left: 15px;
}
.center {
  text-align: center;
}
</style>
