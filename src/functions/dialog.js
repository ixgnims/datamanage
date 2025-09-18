// 确认弹窗
export function confirmWithLoading({
                                       vm,             // Vue 实例 (this)
                                       title = "确认操作",
                                       message = "",
                                       onConfirm,      // 必须是 async 函数，执行接口调用
                                       timeout = 60000 // 默认超时 60 秒
                                   }) {
    return new Promise((resolve, reject) => {
        vm.$msgbox({
            title,
            message,
            showCancelButton: true,
            confirmButtonText: "确认",
            cancelButtonText: "取消",
            beforeClose: async (action, instance, done) => {
                if (action === "confirm") {
                    instance.confirmButtonLoading = true;
                    instance.confirmButtonText = "执行中...";

                    try {
                        const timeoutPromise = new Promise((_, reject) =>
                            setTimeout(() => reject(new Error("TIMEOUT")), timeout)
                        );

                        const result = await Promise.race([
                            onConfirm(), // 调用你传进来的接口函数
                            timeoutPromise
                        ]);

                        resolve(result);
                    } catch (error) {
                        reject(error);
                    } finally {
                        instance.confirmButtonLoading = false;
                        done();
                    }
                } else {
                    reject(new Error("CANCEL"));
                    done();
                }
            }
        }).catch(() => {
            reject(new Error("CANCEL"));
        });
    });
}