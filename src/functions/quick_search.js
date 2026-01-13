import axios from "@/api/axios";
import {DateString} from "@/functions/time_function"

export function createAwemeSearcher(vm) {
    let timeout = null
    return function findAweme(queryString) {
        if (timeout) {
            clearTimeout(timeout)
        }
        timeout = setTimeout(() => {
            if (!queryString) {
                vm.awemeList = []
                return
            }
            vm.awemeLoading = true
            axios.post(
                'http://47.107.244.209:8967/common/dy/aweme/search/',
                {
                    dict_value: 'aweme_show_id',
                    dict_label: 'aweme_name',
                    aweme_keyword: queryString
                }
            ).then(res => {
                vm.awemeList = res.data || []
                vm.awemeLoading = false
            }).catch(() => {
                vm.awemeList = []
                vm.awemeLoading = false
            })
        }, 100)
    }
}

export function createAdvertiserSearcher(vm) {
    let timeout = null
    return function findAdvertiser(queryString) {
        if (timeout) {
            clearTimeout(timeout)
        }
        timeout = setTimeout(() => {
            if (!queryString) {
                vm.advertiserList = []
                return
            }
            vm.advertiserLoading = true
            axios.post(
                'http://47.107.244.209:8967/common/dy/advertiser/search/',
                {
                    dict_value: 'advertiser_id',
                    dict_label: 'advertiser_name',
                    advertiser_keyword: queryString,
                }
            ).then(res => {
                vm.advertiserList = res.data || []
                vm.advertiserLoading = false
            }).catch(() => {
                vm.advertiserList = []
                vm.advertiserLoading = false
            })
        }, 100)
    }
}

export function createAdSearcher(vm) {
    let timeout = null
    return function findAd(queryString) {
        if (timeout) {
            clearTimeout(timeout)
        }
        timeout = setTimeout(() => {
            if (!queryString) {
                vm.adList = []
                return
            }
            vm.adLoading = true
            axios.post(
                'http://47.107.244.209:8967/common/dy/ad/search/',
                {
                    dict_value: 'ad_id',
                    dict_label: 'ad_id',
                    ad_keyword: queryString,
                    aweme_list: vm.awemeCheckedList,
                    advertiser_list: vm.advertiserCheckedList
                }
            ).then(res => {
                vm.adList = res.data || []
                vm.adLoading = false
            }).catch(() => {
                vm.adList = []
                vm.adLoading = false
            })
        }, 100)
    }
}


export function createScriptNameSearcher(vm) {
    let timeout = null
    return function findScriptName(queryString) {
        if (timeout) {
            clearTimeout(timeout)
        }
        timeout = setTimeout(() => {
            if (!queryString) {
                vm.scriptNameList = []
                return
            }
            axios.post(
                'http://47.107.244.209:8967/common/dy/material/script_name/search/',
                {
                    dict_value: 'script_name_id',
                    dict_label: 'script_name',
                    script_name_keyword: queryString
                }
            ).then(res => {
                vm.scriptNameList = res.data || []
            }).catch(() => {
                vm.scriptNameList = []
            })
        }, 100)
    }
}


export function createShootVersionSearcher(vm) {
    let timeout = null
    return function findShootVersion(queryString) {
        if (timeout) {
            clearTimeout(timeout)
        }
        timeout = setTimeout(() => {
            let shoot_date_start = ''
            let shoot_date_end = ''
            if (vm.shootDateRange.length > 0) {
                shoot_date_start = DateString(new Date(vm.shootDateRange[0]))
                shoot_date_end = DateString(new Date(vm.shootDateRange[1]))
            }
            if (!queryString) {
                vm.shootVersionList = []
                return
            }
            axios.post(
                'http://47.107.244.209:8967/common/dy/material/shoot_version/search/',
                {
                    dict_value: 'shoot_version_id',
                    dict_label: 'shoot_version',
                    shoot_version_keyword: queryString,
                    script_name_list: vm.scriptNameCheckedList,
                    shoot_date_start: shoot_date_start,
                    shoot_date_end: shoot_date_end
                }
            ).then(res => {
                vm.shootVersionList = res.data || []
            }).catch(() => {
                vm.shootVersionList = []
            })
        }, 100)
    }
}


export function createEditVersionSearcher(vm) {
    let timeout = null
    return function findEditVersion(queryString) {
        if (timeout) {
            clearTimeout(timeout)
        }
        timeout = setTimeout(() => {
            let shoot_date_start = ''
            let shoot_date_end = ''
            if (vm.shootDateRange.length > 0) {
                shoot_date_start = DateString(new Date(vm.shootDateRange[0]))
                shoot_date_end = DateString(new Date(vm.shootDateRange[1]))
            }
            let edit_date_start = ''
            let edit_date_end = ''
            if (vm.editDateRange.length > 0) {
                edit_date_start = DateString(new Date(vm.editDateRange[0]))
                edit_date_end = DateString(new Date(vm.editDateRange[1]))
            }
            if (!queryString) {
                vm.editVersionList = []
                return
            }
            axios.post(
                'http://47.107.244.209:8967/common/dy/material/edit_version/search/',
                {
                    dict_value: 'edit_version_id',
                    dict_label: 'edit_version',
                    edit_version_keyword: queryString,
                    script_name_list: vm.scriptNameCheckedList,
                    shoot_version_list: vm.shootVersionCheckedList,
                    shoot_date_start: shoot_date_start,
                    shoot_date_end: shoot_date_end,
                    edit_date_start: edit_date_start,
                    edit_date_end: edit_date_end
                }
            ).then(res => {
                vm.editVersionList = res.data || []
            }).catch(() => {
                vm.editVersionList = []
            })
        }, 100)
    }
}

export function createFileTitleSearcher(vm) {
    let timeout = null
    return function findFileTitle(queryString) {
        if (timeout) {
            clearTimeout(timeout)
        }
        timeout = setTimeout(() => {
            let shoot_date_start = ''
            let shoot_date_end = ''
            if (vm.shootDateRange.length > 0) {
                shoot_date_start = DateString(new Date(vm.shootDateRange[0]))
                shoot_date_end = DateString(new Date(vm.shootDateRange[1]))
            }
            let edit_date_start = ''
            let edit_date_end = ''
            if (vm.editDateRange.length > 0) {
                edit_date_start = DateString(new Date(vm.editDateRange[0]))
                edit_date_end = DateString(new Date(vm.editDateRange[1]))
            }
            if (!queryString) {
                vm.fileTitleList = []
                return
            }
            axios.post(
                'http://47.107.244.209:8967/common/dy/material/file_title/search/',
                {
                    dict_value: 'material_id',
                    dict_label: 'file_title',
                    file_title_keyword: queryString,
                    script_name_list: vm.scriptNameCheckedList,
                    shoot_version_list: vm.shootVersionCheckedList,
                    edit_version_list: vm.editVersionCheckedList,
                    shoot_date_start: shoot_date_start,
                    shoot_date_end: shoot_date_end,
                    edit_date_start: edit_date_start,
                    edit_date_end: edit_date_end
                }
            ).then(res => {
                vm.fileTitleList = res.data || []
            }).catch(() => {
                vm.fileTitleList = []
            })
        }, 100)
    }
}


