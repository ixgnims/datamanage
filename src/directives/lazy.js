export default {
    inserted(el, binding) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    el.src = binding.value  // 设置真实图片地址
                    observer.unobserve(el)  // 加载后取消观察
                }
            })
        }, { rootMargin: '0px', threshold: 0.1 })

        observer.observe(el)
    }
}