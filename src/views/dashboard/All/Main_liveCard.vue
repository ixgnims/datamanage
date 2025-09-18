<template>
  <!--直播卡片-->
  <div class="cards-container-pc" v-if="parentLiveList.length>0">
    <el-card v-for="(card) in parentLiveList"
             :key="card.room_data.room_id"
             shadow="hover"
             :body-style="{padding: '8px'}"
             :class="{'active-live': activeIndex === card.room_data.room_id, 'live-card': true}"
             @click.native="handleLiveCardClick(card)">
      <el-row type="flex" align="stretch">
        <!-- 左侧状态条 -->
        <div
            class="status-bar"
            :class="{'status-living': card.room_data.room_status === 'LIVING',
                           'status-ended': card.room_data.room_status !== 'LIVING'}">
        </div>
        <!-- 直播信息 -->
        <el-col :span="4">
          <div class="card-info-title">{{card.room_data.aweme_nickname}}</div>
          <div class="card-info-content">{{"RoomId："+card.room_data.room_id}}</div>
          <div class="card-info-content">{{"直播时间："+card.room_data.start_time}}</div>
          <div class="card-info-content">{{"直播时长："+card.room_data.live_duration}}</div>
        </el-col>
        <!-- 数据信息 -->
        <el-col :span="20">
          <el-col :span="3">
            <div class="card-data-title" style="visibility: hidden">数据归属</div>
            <div class="card-data-room" style="visibility: hidden">直播间</div>
            <div class="card-data-advertiser" v-for="(adv) in card.advertiser_data" :key="adv.advertiser_id">{{adv.advertiser_name}}</div>
          </el-col>
          <el-col :span="3">
            <div class="card-data-title">当前消耗</div>
            <div class="card-data-room">{{card.room_data.live_stat_cost}}</div>
            <div class="card-data-advertiser" v-for="(adv) in card.advertiser_data" :key="adv.advertiser_id">{{adv.stat_cost}}</div>
          </el-col>
          <el-col :span="3">
            <div class="card-data-title">当前GMV</div>
            <div class="card-data-room">{{card.room_data.live_pay_order_gmv_alias}}</div>
            <div class="card-data-advertiser" v-for="(adv) in card.advertiser_data" :key="adv.advertiser_id">{{adv.luban_live_pay_order_gmv}}</div>
          </el-col>
          <el-col :span="3">
            <div class="card-data-title">当前单量</div>
            <div class="card-data-room">{{card.room_data.live_pay_order_count_unit}}</div>
            <div class="card-data-advertiser" v-for="(adv) in card.advertiser_data" :key="adv.advertiser_id">{{adv.luban_live_pay_order_count_unit}}</div>
          </el-col>
          <el-col :span="3">
            <div class="card-data-title">当前ROI</div>
            <div class="card-data-room"
                 :style="{color: card.room_data.live_pay_order_gmv_roi > card.room_data.roi_goal
                                ? '#67C23A'   // 绿色
                                : '#5489eb'}">
              {{card.room_data.live_pay_order_gmv_roi}}</div>
            <div class="card-data-advertiser" v-for="(adv) in card.advertiser_data" :key="adv.advertiser_id">{{adv.advertiser_roi}}</div>
          </el-col>
          <el-col :span="3">
            <div class="card-data-title">目标ROI</div>
            <div v-if="!roiEditMap[card.room_data.room_id]" class="card-data-room" @dblclick="enableROIMode(card)">{{ roiGoalDict[card.room_data.room_id] || defaultROIGoal}}</div>
            <div v-else class="card-data-room">
              <el-input v-model="roiGoalDict[card.room_data.room_id]" size="mini" @keyup.enter.native="submitROIGoal(card)" style="width: 50px;" />
            </div>
          </el-col>
          <el-col :span="3">
            <div class="card-data-title">目标单量</div>
            <div class="card-data-room">{{card.room_data.order_goal}}</div>
            <div class="card-data-advertiser" v-for="(adv) in card.advertiser_data" :key="adv.advertiser_id">{{adv.advertiser_order_goal}}</div>
          </el-col>
          <el-col :span="3">
            <div class="card-data-title">单量差额</div>
            <div class="card-data-room"
                 :style="{color: card.room_data.order_gap >= 0
                                ? '#67C23A'
                                : '#fb6666'}">{{card.room_data.order_gap}}</div>
            <div class="card-data-advertiser" v-for="(adv) in card.advertiser_data" :key="adv.advertiser_id">{{adv.advertiser_order_gap}}</div>
          </el-col>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "Main_liveCard",
  components: {},
  props: {
    parentLiveList: {
      type: Array,
      required: false
    },
    defaultROIGoal: {
      type: Number,
      required: false
    }
  },
  data() {
    return {
      editingROI: true,
      roiInput: this.defaultROIGoal,
      roiEditMap: {}, // 每个room_id是否正在编辑
      roiGoalDict: {},
      activeIndex: "",
      selectLive: "",
    }
  },
  methods: {
    enableROIMode(card) {
      const roomId = card.room_data.room_id
      this.$set(this.roiEditMap, roomId, true)
      this.$set(this.roiGoalDict, roomId, this.defaultROIGoal)
      console.log(this.roiEditMap)
      console.log(this.roiGoalDict)
    },
    submitROIGoal(card) {
      // 父组件传参
      const roomId = card.room_data.room_id
      this.roiEditMap[roomId] = false
      this.$emit('submit-RoiGoal', this.roiGoalDict)
    },
    handleLiveCardClick(live_data) {
      // 父组件传参
      console.log('点击测试')
      console.log(live_data.room_data.aweme_nickname)
      this.$emit('submit-RoiGoal', this.roiGoalDict)
      this.selectLive = live_data.room_data.room_id
      this.$emit('change-selectLive', live_data)
    },
  }
}
</script>

<style>
.cards-container-pc {
  margin-top: 10px;
  margin-bottom: 5px;
  padding-left: 5px;
  padding-right: 5px
}

.status-bar {
  width: 6px;
  height: auto;
  border-radius: 3px;
  margin-right: 10px;
}

.status-living {
  background-color: #9ad294; /* 绿色 */
}

.status-ended {
  background-color: #dde6f6; /* 灰色 */
}

.card-info-title {
  font-size: 14px;
}

.card-info-content{
  font-size: 10px;
  color: #8a96a6;
}

.card-data-title {
  font-size: 12px;
}

.card-data-room {
  font-size: 16px;
  font-weight: 550;
  color: #333333;
}

.card-data-advertiser {
  font-size: 10px
}

/* 基础卡片样式 */
.live-card {
  margin-bottom: 3px;
  padding: 3px;
  cursor: pointer;
}

/* 激活状态卡片样式 */
.active-live {
  background-color: #eaf3ff;
}

</style>