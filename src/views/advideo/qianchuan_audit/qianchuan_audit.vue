<template>
  <div ref="auditGridWrapper">
    <!--筛选器-->
    <el-row>
      <el-card>
        <!--第一组：直播信息-->
        <el-row class="filter-group">
          <!--输入后远程获取建议-->
          <el-row class="filter-header">直播信息</el-row>
          <el-row :gutter="10">
            <el-col :span="8">
              <div class="select-with-label">
                <span class="select-label">直播账号：</span>
                <el-select placeholder="输入查找" multiple filterable clearable
                           remote :remote-method="findAweme" :loading="awemeLoading"
                           v-model="awemeCheckedList" size="mini" popper-class="aweme-select"
                           @visible-change="awemeVisibleChange">
                  <el-option
                      v-for="item in awemeList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    <div class="option-label-group">
                      <span class="left">{{ item.aweme_name }}</span>
                      <span class="center">{{ item.aweme_nickname }}</span>
                      <span class="right">{{ item.aweme_show_id }}</span>
                    </div>
                  </el-option>
                </el-select>
              </div>
            </el-col>
            <el-col :span="16">
              <div class="select-with-label">
                <el-checkbox v-model="this.showOnlive">正在直播</el-checkbox>
              </div>
            </el-col>
          </el-row>
        </el-row>
        <!--第二组：投流信息-->
        <el-row class="filter-group">
          <el-row class="filter-header">投流信息</el-row>
          <el-row :gutter="10">
            <el-col :span="8">
              <div class="select-with-label">
                <span class="select-label">广告账户：</span>
                <el-select placeholder="输入查找" multiple filterable clearable reserve-keyword
                           remote :remote-method="findAdvertiser" :loading="advertiserLoading"
                           v-model="advertiserCheckedList" size="mini" popper-class="advertiser-select"
                           @visible-change="advertiserVisibleChange">
                  <el-option
                      v-for="item in advertiserList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    <div class="option-label-group">
                      <span class="left">{{ item.advertiser_name }}</span>
                      <span class="right">{{ item.advertiser_id }}</span>
                    </div>
                  </el-option>
                </el-select>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="select-with-label">
                <span class="select-label">计划id：</span>
                <el-select placeholder="输入查找" multiple filterable clearable
                           remote :remote-method="findAd" :loading="adLoading"
                           v-model="adCheckedList" size="mini" popper-class="ad-select"
                           @visible-change="adVisibleChange">
                  <el-option
                      v-for="item in adList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    <div class="option-label-group">
                      <span class="left">{{ item.advertiser_name }}</span>
                      <span class="center">{{ item.ad_id }}</span>
                      <span class="center">{{ item.aweme_name }}</span>
                      <span class="right">
                        <el-tag v-if="item.promo_type==='全域'" size="mini" type="warning">{{ item.promo_type }}</el-tag>
                        <el-tag v-else-if="item.promo_type==='标准'" size="mini" type="primary">{{ item.promotype }}</el-tag>
                        <el-tag v-else size="mini" type="info">{{ item.promotype }}</el-tag>
                      </span>
                    </div>
                  </el-option>
                </el-select>
              </div>
            </el-col>
          </el-row>
        </el-row>
        <!--第三组：审核信息-->
        <el-row class="filter-group">
          <el-row class="filter-header">审核信息</el-row>
          <el-row :gutter="10">
            <el-col :span="6">
              <div class="select-with-label">
                <span class="select-label">审核平台：</span>
                <el-select placeholder="输入查找"
                           v-model="auditPlatformChecked"
                           filterable clearable
                           size="mini">
                  <el-option v-for="item in auditPlatformList"
                             :key="item.value"
                             :label="item.label"
                             :value="item.value">
                  </el-option>
                </el-select>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="select-with-label">
                <span class="select-label">拒审类别：</span>
                <el-select placeholder="输入查找" filterable clearable
                           remote :remote-method="findAuditReasonCategory" :loading="auditReasonCategoryLoading"
                           v-model="auditReasonCategoryChecked" size="mini" popper-class="audit-reason-category-select"
                           @visible-change="auditReasonCategoryVisibleChange">
                  <el-option v-for="item in auditReasonCategoryList"
                             :key="item.value"
                             :label="item.label"
                             :value="item.value">
                  </el-option>
                </el-select>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="select-with-label">
                <span class="select-label">拒审原因：</span>
                <el-input placeholder="输入关键词"
                          clearable
                          prefix-icon="el-icon-search"
                          v-model="auditReasonKeyword"
                          size="mini" />
              </div>
            </el-col>
            <el-col :span="4">
              <div class="select-with-label">
                <el-checkbox v-model="showLatest">获取最新</el-checkbox>
              </div>
            </el-col>
          </el-row>
        </el-row>
        <!--第四组：素材信息-->
        <el-row class="filter-group">
          <el-row class="filter-header">素材信息</el-row>
          <el-row :gutter="10">
            <el-col :span="8">
              <div class="select-with-label">
                <span class="select-label">选题：</span>
                <el-select placeholder="输入查找" multiple filterable clearable
                           remote :remote-method="findScriptName" :loading="scriptNameLoading"
                           v-model="scriptNameCheckedList" size="mini" popper-class="script-name-select"
                           @visible-change="scriptNameVisibleChange">
                  <el-option v-for="item in scriptNameList"
                             :key="item.value"
                             :label="item.label"
                             :value="item.value">
                  </el-option>
                </el-select>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="select-with-label">
                <span class="select-label">拍摄版本：</span>
                <el-select placeholder="输入查找" multiple filterable clearable reserve-keyword
                           remote :remote-method="findShootVersion" :loading="shootVersionLoading"
                           v-model="shootVersionCheckedList" size="mini" popper-class="shoot-version-select"
                           @visible-change="shootVersionVisibleChange">
                  <el-option v-for="item in shootVersionList"
                             :key="String(item.value)"
                             :label="String(item.label)"
                             :value="String(item.value)">
                    <div class="option-label-group">
                      <span class="left">{{ item.shoot_version }}</span>
                      <span class="right">{{ item.script_name }}</span>
                    </div>
                  </el-option>
                </el-select>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="select-with-label">
                <span class="select-label">拍摄日期：</span>
                <el-date-picker
                    v-model="shootDateRange"
                    type="daterange"
                    range-separator="~"
                    :editable="false"
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd"
                    size="mini"/>
              </div>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="8">
              <div class="select-with-label">
                <span class="select-label">剪辑人：</span>
                <el-select placeholder="输入查找" multiple filterable clearable
                           remote :remote-method="findEditor" :loading="editorLoading"
                           v-model="editorCheckedList" size="mini" popper-class="editor-select">
                  <el-option v-for="item in editorList"
                             :key="item.value"
                             :label="item.label"
                             :value="item.value">
                    <div class="option-label-group">
                      <span class="left">{{ item.editor }}</span>
                      <span class="right">{{ item.editor_code }}</span>
                    </div>
                  </el-option>
                </el-select>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="select-with-label">
                <span class="select-label">剪辑版本：</span>
                <el-select placeholder="输入查找" multiple filterable clearable reserve-keyword
                           remote :remote-method="findEditVersion" :loading="editVersionLoading"
                           v-model="editVersionCheckedList" size="mini" popper-class="edit-version-select"
                           @visible-change="editVersionVisibleChange">
                  <el-option v-for="item in editVersionList"
                             :key="item.value"
                             :label="item.label"
                             :value="item.value">
                    <div class="option-label-group">
                      <span class="left">{{ item.edit_version }}</span>
                      <span class="right">{{ item.script_name }}</span>
                    </div>
                  </el-option>
                </el-select>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="select-with-label">
                <span class="select-label">剪辑日期：</span>
                <el-date-picker
                    v-model="editDateRange"
                    type="daterange"
                    range-separator="~"
                    :editable="false"
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd"
                    size="mini"/>
              </div>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="8">
              <div class="select-with-label">
                <span class="select-label">素材id/文件名：</span>
                <el-select placeholder="输入查找" multiple filterable clearable
                           remote :remote-method="findFileTitle" :loading="fileTitleLoading"
                           v-model="fileTitleCheckedList" size="mini" popper-class="file-title-select"
                           @visible-change="fileTitleVisibleChange">
                  <el-option v-for="item in fileTitleList"
                             :key="String(item.value)"
                             :label="String(item.label)"
                             :value="String(item.value)">
                    <div class="option-label-group">
                      <span class="left">{{ item.material_id }}</span>
                      <span class="right">{{ item.file_title }}</span>
                    </div>
                  </el-option>
                </el-select>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="select-with-label">
                <span class="select-label">IP：</span>
                <el-select placeholder="输入查找" multiple filterable clearable
                           remote :remote-method="findIP" :loading="ipLoading"
                           v-model="ipCheckedList" size="mini" popper-class="ip-select">
                  <el-option v-for="item in ipList"
                             :key="item.value"
                             :label="item.label"
                             :value="item.value">
                  </el-option>
                </el-select>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="select-with-label">
                <span class="select-label">产品：</span>
                <el-select placeholder="输入查找" multiple filterable clearable
                           remote :remote-method="findProduct" :loading="productLoading"
                           v-model="productCheckedList" size="mini" popper-class="product-select">
                  <el-option v-for="item in productList"
                             :key="item.value"
                             :label="item.label"
                             :value="item.value">
                  </el-option>
                </el-select>
              </div>
            </el-col>
          </el-row>
        </el-row>
        <!--按钮-->
        <el-row>
          <span>
            <el-button @click="clearAuditParams" size="small">重 置</el-button>
            <el-button type="primary" @click="sendAuditQuery" :loading="fetchResultLoading" size="small">查 询</el-button>
          </span>
        </el-row>
      </el-card>
    </el-row>
    <!--审核列表-->
    <el-row>
      <el-card style="margin-top:10px">
        <el-row></el-row>
        <el-row>
          <div>
            <vxe-grid ref="auditGridRef" v-bind="auditGridOptions">

            </vxe-grid>
          </div>
        </el-row>
      </el-card>
    </el-row>
  </div>
</template>

<script>
import axios from "@/api/axios";
import { createAwemeSearcher, createAdvertiserSearcher, createAdSearcher, createScriptNameSearcher, createShootVersionSearcher, createEditVersionSearcher, createFileTitleSearcher } from "@/functions/quick_search";

export default {
  name: "qianchuan_audit",
  data() {
    const auditGridOptions = {
      border: true,
      loading: false,
      size: "mini",
      rowConfig: {
        isHover: true,
        keyField: 'material_id'
      },
      columnConfig: {
        resizable: true,
      },
      columns: [
        {title: '视频信息', width: 150, showOverFlow: 'tooltip', slots: {default: "video_info_default"}},
        {title: '审核建议', field: 'audit_reason', width: 300, showOverFlow: true},
        {title: '优先级', field: 'priority', width: 100, showOverFlow: true},
        {title: '剪辑人', field: 'editor', width: 100, showOverFlow: true},
      ],
      data: []
    }
    return {
      auditGridOptions,
      // 直播信息
      awemeSearchTimeOut: null,
      awemeLoading: false,
      awemeList: [],
      awemeCheckedList: [],
      showOnlive: false,
      // 投流信息
      advertiserSearchTimeOut: null,
      advertiserLoading: false,
      advertiserList: [],
      advertiserCheckedList: [],
      adSearchTimeOut: null,
      adLoading: false,
      adList: [],
      adCheckedList: [],
      // 审核信息
      auditPlatformList: [
        {label: "不限", value: "all"},
        {label: "广告审核", value: "AD"},
        {label: "内容审核", value: "CONTENT"},
        {label: "未知", value: "UNKNOWN"}
      ],
      auditPlatformChecked: "all",
      auditReasonCategorySearchTimeOut: null,
      auditReasonCategoryLoading: false,
      auditReasonCategoryList: [],
      auditReasonCategoryChecked: "不限",
      auditReasonKeyword: "",
      showLatest: true,
      // 素材信息
      scriptNameSearchTimeOut: null,
      scriptNameLoading: false,
      scriptNameList: [],
      scriptNameCheckedList: [],
      shootVersionSearchTimeOut: null,
      shootVersionLoading: false,
      shootVersionList: [],
      shootVersionCheckedList: [],
      shootDateRange: [],
      editorSearchTimeOut: null,
      editorLoading: false,
      editorList: [],
      editorCheckedList: [],
      editVersionSearchTimeOut: null,
      editVersionLoading: false,
      editVersionList: [],
      editVersionCheckedList: [],
      editDateRange: [],
      fileTitleSearchTimeOut: null,
      fileTitleLoading: false,
      fileTitleList: [],
      fileTitleCheckedList: [],
      ipSearchTimeOut: null,
      ipLoading: false,
      ipList: [],
      ipCheckedList: [],
      productSearchTimeOut: null,
      productLoading: false,
      productList: [],
      productCheckedList: [],
      audit_params: {
        // 直播信息
        aweme_show_id: [],
        show_onlive: false,
        // 投流相关
        advertiser_id: [],
        ad_id: [],
        // 审核信息
        audit_reason_category: [],
        audit_platform: [],
        audit_reason_keyword: '',
        show_latest: true,
        // 素材信息
        material_id: [],
        script_name: '',
        shoot_version: '',
        shoot_date_start: '',
        shoot_date_end: '',
        edit_version: '',
        edit_date_start: '',
        edit_date_end: '',
        file_title: '',
        editor: [],
        editor_code: [],
        ip: [],
        product: []
      },
      fetchResultLoading: false
    }
  },
  methods: {
    findAuditReasonCategory(queryString) {
      if (this.auditReasonCategorySearchTimeOut) {
        clearTimeout(this.auditReasonCategorySearchTimeOut);
      }
      this.auditReasonCategorySearchTimeOut = setTimeout(() => {
        if (!queryString) {
          this.auditReasonCategoryList = []
        }
        // 向接口发送searchType+queryString
        axios.post(`http://47.107.244.209:8967/common/dy/audit_reason_category/search/`,{dict_value: 'audit_reason_category', dict_label: 'audit_reason_category', audit_reason_category_keyword: queryString})
            .then(response => {
              if (response.data.length > 0) {
                this.auditReasonCategoryList = response.data
              }
            }).catch(error => {
          console.log(error);
          this.auditReasonCategoryList = [];
        });
      }, 100)
    },
    findEditor(queryString) {
      if (this.editorSearchTimeOut) {
        clearTimeout(this.editorSearchTimeOut);
      }
      this.editorSearchTimeOut = setTimeout(() => {
        if (!queryString) {
          this.editorList = []
        }
        axios.post(`http://47.107.244.209:8967/common/dy/material/editor/search/`,
            {
              dict_value: 'editor_code',
              dict_label: 'editor',
              editor_keyword: queryString
            }).then(response => {
              if (response.data.length > 0) {
                this.editorList = response.data
              }
            }).catch(error => {
          console.log(error);
          this.editorList = [];
        });
      }, 100)
    },
    findIP(queryString) {
      if (this.ipSearchTimeOut) {
        clearTimeout(this.ipSearchTimeOut);
      }
      this.ipSearchTimeOut = setTimeout(() => {
        if (!queryString) {
          this.ipList = []
        }
        axios.post(`http://47.107.244.209:8967/common/dy/material/ip/search/`,
            {
              dict_value: 'ip',
              dict_label: 'ip',
              ip_keyword: queryString
            }).then(response => {
          if (response.data.length > 0) {
            this.ipList = response.data
          }
        }).catch(error => {
          console.log(error);
          this.ipList = [];
        });
      }, 100)
    },
    findProduct(queryString) {
      if (this.productSearchTimeOut) {
        clearTimeout(this.productSearchTimeOut);
      }
      this.productSearchTimeOut = setTimeout(() => {
        if (!queryString) {
          this.productList = []
        }
        axios.post(`http://47.107.244.209:8967/common/dy/material/product/search/`,
            {
              dict_value: 'product',
              dict_label: 'product',
              product_keyword: queryString
            }).then(response => {
          if (response.data.length > 0) {
            this.productList = response.data
          }
        }).catch(error => {
          console.log(error);
          this.productList = [];
        });
      }, 100)
    },
    awemeVisibleChange(visible) {
      if (!visible) {
        this.awemeLoading = false
        this.awemeList = []
        if (this.awemeSearchTimeOut) {
          clearTimeout(this.awemeSearchTimeOut)
        }
      }
    },
    advertiserVisibleChange(visible) {
      if (!visible) {
        this.advertiserLoading = false
        this.advertiserList = []
        if (this.advertiserSearchTimeOut) {
          clearTimeout(this.advertiserSearchTimeOut)
        }
      }
    },
    adVisibleChange(visible) {
      if (!visible) {
        this.adLoading = false
        this.adList = []
        if (this.adSearchTimeOut) {
          clearTimeout(this.adSearchTimeOut)
        }
      }
    },
    auditReasonCategoryVisibleChange(visible) {
      if (!visible) {
        this.auditReasonCategoryLoading = false
        this.auditReasonCategoryList = []
        if (this.auditReasonCategorySearchTimeOut) {
          clearTimeout(this.auditReasonCategorySearchTimeOut)
        }
      }
    },
    scriptNameVisibleChange(visible) {
      if (!visible) {
        this.scriptNameLoading = false
        this.scriptNameList = []
        if (this.scriptNameSearchTimeOut) {
          clearTimeout(this.scriptNameSearchTimeOut)
        }
      }
    },
    shootVersionVisibleChange(visible) {
      if (!visible) {
        this.shootVersionLoading = false
        this.shootVersionList = []
        if (this.shootVersionSearchTimeOut) {
          clearTimeout(this.shootVersionSearchTimeOut)
        }
      }
    },
    editVersionVisibleChange(visible) {
      if (!visible) {
        this.editVersionLoading = false
        this.editVersionList = []
        if (this.editVersionSearchTimeOut) {
          clearTimeout(this.editVersionSearchTimeOut)
        }
      }
    },
    fileTitleVisibleChange(visible) {
      if (!visible) {
        this.fileTitleLoading = false
        this.fileTitleList = []
        if (this.fileTitleSearchTimeOut) {
          clearTimeout(this.fileTitleSearchTimeOut)
        }
      }
    },
    clearAuditParams() {

    },
    sendAuditQuery() {

    },
  },
  created() {
    this.findAweme = createAwemeSearcher(this)
    this.findAdvertiser = createAdvertiserSearcher(this)
    this.findAd = createAdSearcher(this)
    this.findScriptName = createScriptNameSearcher(this)
    this.findShootVersion = createShootVersionSearcher(this)
    this.findEditVersion = createEditVersionSearcher(this)
    this.findFileTitle = createFileTitleSearcher(this)
  },
  mounted() {
    this.findAuditReasonCategory()
    this.findEditor()
    this.findIP()
    this.findProduct()
  },
  watch: {


  }

}
</script>

<style>
.filter-header {
  color: #606266;
  font-size: 14px;
  font-weight: 550
}

filter-group {
  margin-bottom: 10px
}

.select-with-label {
  display: flex;
  align-items: center;
  padding: 5px 10px;
  border-radius: 6px;
}

.select-label {
  white-space: nowrap;
  margin-right: 5px;
  font-size: 13px;
  color: #606266;
}

.option-label-group {
  display: flex;
  align-items: center;
  width: 100%;
}

.option-label-group .left {
  flex: 1;
  text-align: left;
}

.option-label-group  .center {
  flex: 1;
  text-align: center;
  color: #8492a6;
  font-size: 12px;
}

.option-label-group  .right {
  flex: 1;
  text-align: right;
  color: #8492a6;
  font-size: 12px;
}

.aweme-select {
  width: 400px !important;
}

.advertiser-select {
  width: 350px !important;
}

.ad-select {
  width: 450px !important;
}

.shoot-version-select {
  width: 600px !important;
}

.edit-version-select {
  width: 600px !important;
}

.file-title-select {
  width: 800px !important;
}
</style>