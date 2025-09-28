import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'hello',
  },
  {
    path: '/login', //登录页
    name: 'login',
    component: () => import('../views/login/userLogin.vue')
  },
  {
    path: '/home', //布局页
    name: 'home',
    component: () => import('../views/home/homeIndex.vue'),
    children:[
      {
        path: '/index', //首页
        name: 'index',
        component: () => import('../views/home/index/main_index.vue')
      },
      {
        path: '/today', //今日数据
        name: 'today',
        component: () => import('../views/home/today/todayHome.vue'),
        children:[
          {
            path: '/today/general', //总览
            name: 'today_general',
            component: () => import('../views/home/today/general/todayGeneralHome.vue'),
            children:[
              {
                path: '/today/general/All',
                name: 'today_general_All',
                component: () => import('../views/home/today/general/ALL/ALL.vue')
              },
              {
                path: '/today/general/ALiu', //ALiu今日数据总览
                name: 'today_general_ALiu',
                component: () => import('../views/home/today/general/ALiu/ALiu.vue'),
              },
              {
                path: '/today/general/DaiJie', //戴洁今日数据总览
                name: 'today_general_DaiJie',
                component: () => import('@/views/home/today/general/DaiJie/DaiJie.vue'),
              },
              {
                path: '/today/general/XiaoMing', //小铭今日数据总览
                name: 'today_general_XiaoMing',
                component: () => import('@/views/home/today/general/XiaoMing/XiaoMing.vue'),
              },
              {
                path: '/today/general/REME', //REME今日数据总览
                name: 'today_general_REME',
                component: () => import('@/views/home/today/general/REME/REME.vue'),
              },
              {
                path: '/today/general/YiFei', //奕霏今日数据总览
                name: 'today_general_YiFei',
                component: () => import('@/views/home/today/general/YiFei/YiFei.vue'),
              },
              {
                path: '/today/general/NanJie', //楠姐今日数据总览
                name: 'today_general_NanJie',
                component: () => import('@/views/home/today/general/NanJie/NanJie.vue'),
              },
            ]
          }
        ]
      },
      {
        path: '/analysis', // 往期分析
        name: 'analysis',
        component: () => import('@/views/home/analysis/analysisHome.vue'),
        children: [
          {
            path: '/analysis/live', // 直播分析
            name: 'analysis_live',
            component: () => import('@/views/home/analysis/live/analysisLiveHome.vue'),
            children: [
              {
                path: '/analysis/live/ALiu', // ALiu直播分析
                name: 'analysis_live_ALiu',
                component: () => import('@/views/home/analysis/live/ALiu/ALiu.vue'),
              },
              {
                path: '/analysis/live/DaiJie', // DaiJie直播分析
                name: 'analysis_live_DaiJie',
                component: () => import('@/views/home/analysis/live/DaiJie/DaiJie.vue'),
              },
              {
                path: '/analysis/live/XiaoMing', // XiaoMing直播分析
                name: 'analysis_live_XiaoMing',
                component: () => import('@/views/home/analysis/live/XiaoMing/XiaoMing.vue'),
              },
              {
                path: '/analysis/live/REME', // REME直播分析
                name: 'analysis_live_REME',
                component: () => import('@/views/home/analysis/live/REME/REME.vue'),
              },
              {
                path: '/analysis/live/NanJie', // NanJie直播分析
                name: 'analysis_live_NanJie',
                component: () => import('@/views/home/analysis/live/NanJie/NanJie.vue'),
              }
            ]
          }
        ]
      },
      {
        path: '/report', // 报表
        name: 'report',
        component: () => import('../views/home/report/marketing_report/marketingReportHome.vue'),
        children:[
          {
            path: '/report/marketing', // 投流数据报表，默认ALiu
            name: 'report_marketing',
            component: () => import('../views/home/report/marketing_report/marketingReportHome.vue'),
            children: [
              {
                path: '/report/marketing/ALiu',
                name: 'report_marketing_ALiu',
                component: ()=> import('../views/home/report/marketing_report/ALiu/ALiu.vue'),
              }
            ]
          },
          {
            path: '/report/video', // 视频数据报表
            name: 'report_video',
            component: () => import('../views/home/report/videoReport/videoReportHome.vue'),
            children: [
              {
                path: '/report/video/ALiu',
                name: 'report_video_ALiu',
                component: () => import('../views/home/report/videoReport/ALiu/ALiuDyVideo.vue')
              },
              {
                path: '/report/video/DaiJie',
                name: 'report_video_DaiJie',
                component: () => import('../views/home/report/videoReport/DaiJie/DaiJieDyVideo.vue')
              },
              {
                path: 'report/video/XiaoMing',
                name: 'report_video_XiaoMing',
                component: () => import('../views/home/report/videoReport/XiaoMing/XiaoMingDyVideo.vue'),
              },
              {
                path: '/report/video/REME',
                name: 'report_video_REME',
                component: () => import('../views/home/report/videoReport/REME/RemeDyVideo.vue'),
              },
              {
                path: '/report/video/YiFei',
                name: 'report_video_YiFei',
                component: () => import('../views/home/report/videoReport/YiFei/YiFeiDyVideo.vue'),
              }
            ]
          }
        ]
      },
    ]
  },
  {
    path: '/admin', // 后台管理
    name: 'admin',
    component: () => import('../views/admin/adminIndex.vue'),
    children: [
      {
        path: '/admin/index',
        name: 'admin_index',
        component: () => import('../views/admin/index/mainIndex.vue'),
      },
      {
        path: '/admin/marketing',
        name: 'admin_marketing',
        component: () => import('../views/admin/manageMarketing/manageMarketing.vue'),
      }
    ]
  },
    //测试用
  {
    path: '/report/test',
    name: 'report_test',
    component: () => import('../views/home/verticalnavTEST.vue'),
  },
  {
    path: '/report/test2',
    name: 'report_test2',
    component: () => import('../views/home/Test-2.vue'),
  },
  {
    path: '/report/test3',
    name: 'report_test3',
    component: () => import('../views/home/Test-3.vue'),
  },
  {
    path: '/report/test4',
    name: 'report_test4',
    component: () => import('../views/home/Test-4.vue'),
  },
  {
    path: '/dashboard/main',
    name: 'dashboard_main',
    component: () => import('../views/dashboard/All/Main_dashboard.vue'),
    meta: { title: '投流数据看板'}
  },
  {
    path: '/dashboard/Aliu99_Estimate',
    name: 'aliu99_Estimate',
    component: () => import('../views/dashboard/Aliu99/Aliu99_Estimate.vue'),
    meta: { title: '阿留数据看板'}
  },
  {
    path: '/dashboard/shuangyu',
    name: 'shuangyu',
    component: () => import('../views/dashboard/Shuangyu49/Shuangyu49_Estimate.vue'),
    meta: { title: '双语投流看板'}
  },

  {
    path: '/AdVideo/update',
    name: 'qianchuan_videoInfoUpdate',
    component: () => import('../views/advideo/qianchuan_videoInfoUpdate.vue'),
    meta: { title: '视频管理'}
  },
  // 管理员总看板
  {
    path: '/heshu_admin/dashboard',
    name: 'adminMain',
  },
  // 计划与视频
  {
    path: '/AdVideo',
    name: 'qianchuan_AdVideoMain',
    redirect: '/AdVideo/qianchuan_video',
    component: () => import('../views/advideo/qianchuan_AdVideoMain.vue'),
    meta: { title: '千川视频与计划'},
    children: [
      {
        path: '/AdVideo/qianchuan_video',
        name: 'qianchuan_video',
        component: () => import('../views/advideo/qianchuan_video.vue'),
        meta: { title: '千川视频看板'}
      },
      {
        path: '/AdVideo/qianchuan_comment',
        name: 'qianchuan_comment',
        component: () => import('../views/advideo/qianchuan_comment/qianchuan_comment.vue'),
        meta: { title: '千川评论管理'}
      },
    ]
  },
  // 小红书
  {
    path: '/xhs/dashboard',
    name: 'xhsMain',
    redirect: '/xhs/dashboard/advertiser',
    component: () => import('../views/xhsDashboard/xhsMain.vue'),
    meta: { title: '小红书看板' },
    children: [
      {
        path: '/xhs/dashboard/advertiser',
        name: 'xhsAdvertiser',
        meta: { title: '小红书账户看板' },
        component: () => import('../views/xhsDashboard/xhsAdvertiser.vue'),
      },
      {
        path: '/xhs/dashboard/note',
        name: 'xhsNote',
        meta: { title: '小红书笔记看板' },
        component: () => import('../views/xhsDashboard/xhsNote.vue'),
      }
    ]
  },
  // 百度看板
  {
    path: '/baidu/dashboard',
    name: 'baiduMain',
    redirect: '/baidu/dashboard/live',
    component: () => import('../views/baiduDashboard/baiduMain.vue'),
    meta: { title: '百度看板' },
    children: [
      {
        path: '/baidu/dashboard/live',
        name: 'baiduLive',
        meta: { title: '百度直播看板' },
        component: () => import('../views/baiduDashboard/baiduLive.vue'),
      },
      {
        path: '/baidu/dashboard/video',
        name: 'baiduVideo',
        meta: {title: '百度视频看板'},
        component: () => import('../views/baiduDashboard/baiduVideo.vue'),
      },
      {
        path: '/baidu/dashboard/advertiser',
        name: 'baiduAdvertiser',
        meta: {title: '百度账户看板'},
        component: () => import('../views/baiduDashboard/baiduAdvertiser.vue'),
      },
    ]
  },
  // 快手视频看板
  {
    path: '/kuaishou/dashboard',
    name: 'kuaishouMain',
    meta: {title: '快手看板'},
    component: () => import('../views/kuaishouDashboard/kuaishouMain.vue'),
  },
  // 主页视频看板
  {
    path: '/homepageVideo',
    name: 'homepageMain',
    redirect: '/homepageVideo/dy',
    component: () => import('@/views/homepageVideo/homepageMain.vue'),
    meta: { title: '阿留主页视频' },
    children: [
      {
        path: '/homepageVideo/dy',
        name: 'homepageDy',
        meta: { title: '抖音主页视频' },
        component: () => import('../views/homepageVideo/homepageDy.vue'),
      },
      {
        path: '/homepageVideo/xhs',
        name: 'homepageXhs',
        meta: { title: '小红书主页视频' },
        component: () => import('../views/homepageVideo/homepageXhs.vue'),
      },
    ]
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title;
  }
  next();
});

export default router
