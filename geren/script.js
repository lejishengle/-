// 生成日历
function generateCalendar() {
    const calendar = document.querySelector('.calendar');
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    
    // 清空日历
    calendar.innerHTML = '';
    
    // 添加星期标题
    const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
    weekdays.forEach(day => {
        const dayElement = document.createElement('div');
        dayElement.textContent = day;
        dayElement.style.fontWeight = 'bold';
        calendar.appendChild(dayElement);
    });
    
    // 添加空白格子
    for (let i = 0; i < firstDayOfMonth; i++) {
        const emptyDay = document.createElement('div');
        calendar.appendChild(emptyDay);
    }
    
    // 添加日期
    for (let i = 1; i <= daysInMonth; i++) {
        const dayElement = document.createElement('div');
        dayElement.textContent = i;
        if (i === today.getDate()) {
            dayElement.style.background = 'rgba(0, 0, 0, 0.2)';
            dayElement.style.fontWeight = 'bold';
        }
        calendar.appendChild(dayElement);
    }
}

// 表单提交处理
function handleFormSubmit() {
    const form = document.querySelector('.weird-form form');
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const name = this.querySelector('input[type="text"]').value;
        const message = this.querySelectorAll('input[type="text"]')[1].value;
        if (name && message) {
            alert(`谢谢你，${name}！你的想法已收到。`);
            this.reset();
        } else {
            alert('请填写完整信息！');
        }
    });
}

// 卡片悬停效果
function addCardHoverEffects() {
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.02)';
        });
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// 保存数据到本地存储
function saveData() {
    const data = {
        header: {
            title: document.querySelector('header h1').textContent,
            subtitle: document.querySelector('header p').textContent
        },
        avatar: document.querySelector('.avatar').src,
        photos: Array.from(document.querySelectorAll('.photo-item img')).map(img => img.src),
        blogs: Array.from(document.querySelectorAll('.blog-posts .post')).map(post => ({
            title: post.querySelector('h3').textContent,
            content: post.querySelector('p').textContent
        })),
        diaries: Array.from(document.querySelectorAll('.diary-entry .diary-item')).map(item => item.querySelector('p').textContent),
        background: {
            image: document.querySelector('.noise-background').style.backgroundImage,
            color: document.querySelector('.noise-background').style.backgroundColor
        }
    };
    localStorage.setItem('personalPageData', JSON.stringify(data));
}

// 从本地存储加载数据
function loadData() {
    const savedData = localStorage.getItem('personalPageData');
    if (savedData) {
        const data = JSON.parse(savedData);
        
        // 加载header内容
        if (data.header) {
            document.querySelector('header h1').textContent = data.header.title;
            document.querySelector('header p').textContent = data.header.subtitle;
        }
        
        // 加载头像
        if (data.avatar) {
            document.querySelector('.avatar').src = data.avatar;
        }
        
        // 加载摄影图片
        if (data.photos) {
            const photoGrid = document.querySelector('.photo-grid');
            photoGrid.innerHTML = '';
            data.photos.forEach((src, index) => {
                const photoItem = document.createElement('div');
                photoItem.className = 'photo-item';
                photoItem.innerHTML = `
                    <img src="${src}" alt="摄影作品">
                    <input type="file" class="photo-upload" accept="image/*" style="display: none;">
                `;
                photoGrid.appendChild(photoItem);
            });
        }
        
        // 加载博客
        if (data.blogs) {
            const blogPosts = document.querySelector('.blog-posts');
            blogPosts.innerHTML = '';
            data.blogs.forEach(blog => {
                const post = document.createElement('div');
                post.className = 'post';
                post.innerHTML = `
                    <h3 contenteditable="false">${blog.title}</h3>
                    <p contenteditable="false">${blog.content}</p>
                    <button class="delete-post-btn" style="display: none;">删除</button>
                `;
                blogPosts.appendChild(post);
            });
        }
        
        // 加载日记
        if (data.diaries) {
            const diaryEntry = document.querySelector('.diary-entry');
            diaryEntry.innerHTML = '';
            data.diaries.forEach(content => {
                const diaryItem = document.createElement('div');
                diaryItem.className = 'diary-item';
                diaryItem.innerHTML = `
                    <p contenteditable="false">${content}</p>
                    <button class="delete-diary-btn" style="display: none;">删除</button>
                `;
                diaryEntry.appendChild(diaryItem);
            });
        }
        
        // 加载背景
        if (data.background) {
            const noiseBackground = document.querySelector('.noise-background');
            if (data.background.image) {
                noiseBackground.style.backgroundImage = data.background.image;
                noiseBackground.style.backgroundSize = 'cover';
                noiseBackground.style.backgroundPosition = 'center';
            }
            if (data.background.color) {
                noiseBackground.style.backgroundColor = data.background.color;
            }
        }
    }
}

// 编辑功能
function addEditFunctionality() {
    const editableElements = document.querySelectorAll('[contenteditable]');
    const allContent = document.querySelector('.container');
    const avatar = document.querySelector('.avatar');
    const avatarUpload = document.getElementById('avatar-upload');
    const noiseBackground = document.querySelector('.noise-background');
    const photoItems = document.querySelectorAll('.photo-item');
    const addBlogBtn = document.querySelector('.add-blog-btn');
    const blogEditor = document.querySelector('.blog-editor');
    const publishBtn = document.querySelector('.publish-btn');
    const cancelBtn = document.querySelector('.cancel-btn');
    const blogTitle = document.querySelector('.blog-title');
    const blogContent = document.querySelector('.blog-content');
    const blogPosts = document.querySelector('.blog-posts');
    const addDiaryBtn = document.querySelector('.add-diary-btn');
    const diaryEditor = document.querySelector('.diary-editor');
    const saveDiaryBtn = document.querySelector('.save-diary-btn');
    const cancelDiaryBtn = document.querySelector('.cancel-diary-btn');
    const diaryContent = document.querySelector('.diary-content');
    const diaryEntry = document.querySelector('.diary-entry');
    const photoControls = document.querySelector('.photo-controls');
    const photoCountSelect = document.getElementById('photo-count');
    const applyPhotoCountBtn = document.querySelector('.apply-photo-count');
    const photoGrid = document.querySelector('.photo-grid');
    const backgroundUpload = document.getElementById('background-upload');
    
    // 检查是否为主页制作人（这里使用一个简单的本地存储标记）
    const isCreator = localStorage.getItem('isCreator') === 'true';
    
    // 确保所有可编辑元素默认不可编辑
    editableElements.forEach(element => {
        element.contentEditable = 'false';
    });
    
    // 确保所有编辑按钮默认隐藏
    if (addBlogBtn) addBlogBtn.style.display = 'none';
    if (addDiaryBtn) addDiaryBtn.style.display = 'none';
    if (photoControls) photoControls.style.display = 'none';
    
    // 确保所有删除按钮默认隐藏
    const deletePostBtns = document.querySelectorAll('.delete-post-btn');
    const deleteDiaryBtns = document.querySelectorAll('.delete-diary-btn');
    deletePostBtns.forEach(btn => {
        btn.style.display = 'none';
    });
    deleteDiaryBtns.forEach(btn => {
        btn.style.display = 'none';
    });
    
    if (isCreator) {
        // 显示添加博客按钮、写日记按钮和摄影控制区域
        if (addBlogBtn) addBlogBtn.style.display = 'block';
        if (addDiaryBtn) addDiaryBtn.style.display = 'block';
        if (photoControls) photoControls.style.display = 'flex';
        
        // 显示删除按钮
        deletePostBtns.forEach(btn => {
            btn.style.display = 'inline-block';
        });
        deleteDiaryBtns.forEach(btn => {
            btn.style.display = 'inline-block';
        });
        
        // 点击任何内容区域进入编辑模式
        allContent.addEventListener('click', function(e) {
            // 只在点击可编辑元素时进入编辑模式
            if (e.target.isContentEditable || e.target.closest('[contenteditable]') || e.target === avatar || e.target.closest('.photo-item')) {
                editableElements.forEach(element => {
                    element.contentEditable = 'true';
                });
                
                // 为头像添加点击更换功能
                if (e.target === avatar) {
                    // 弹出选择对话框
                    const choice = confirm('是否从本地图库选择图片？点击确定从本地选择，点击取消输入URL。');
                    if (choice) {
                        // 触发文件输入
                        avatarUpload.click();
                    } else {
                        // 输入URL
                        const newAvatarUrl = prompt('请输入新的头像URL：');
                        if (newAvatarUrl) {
                            avatar.src = newAvatarUrl;
                            saveData(); // 保存数据
                        }
                    }
                }
                
                // 为摄影模块的图片添加点击更换功能
                if (e.target.closest('.photo-item')) {
                    const photoItem = e.target.closest('.photo-item');
                    const photoImg = photoItem.querySelector('img');
                    const photoUpload = photoItem.querySelector('.photo-upload');
                    
                    // 弹出选择对话框
                    const choice = confirm('是否从本地图库选择图片？点击确定从本地选择，点击取消输入URL。');
                    if (choice) {
                        // 触发文件输入
                        photoUpload.click();
                    } else {
                        // 输入URL
                        const newPhotoUrl = prompt('请输入新的图片URL：');
                        if (newPhotoUrl) {
                            photoImg.src = newPhotoUrl;
                            saveData(); // 保存数据
                        }
                    }
                }
            }
        });
        
        // 处理头像上传
        avatarUpload.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    avatar.src = e.target.result;
                    saveData(); // 保存数据
                };
                reader.readAsDataURL(file);
            }
        });
        
        // 处理摄影模块的图片上传
        photoItems.forEach(item => {
            const photoUpload = item.querySelector('.photo-upload');
            const photoImg = item.querySelector('img');
            
            photoUpload.addEventListener('change', function(e) {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        photoImg.src = e.target.result;
                        saveData(); // 保存数据
                    };
                    reader.readAsDataURL(file);
                }
            });
        });
        
        // 处理图片数量选择
        if (applyPhotoCountBtn) {
            applyPhotoCountBtn.addEventListener('click', function() {
                const count = parseInt(photoCountSelect.value);
                
                // 移除所有现有的图片项
                photoGrid.innerHTML = '';
                
                // 根据选择的数量添加新的图片项
                for (let i = 1; i <= count; i++) {
                    const photoItem = document.createElement('div');
                    photoItem.className = 'photo-item';
                    photoItem.innerHTML = `
                        <img src="https://picsum.photos/300/200?random=${i + 10}" alt="摄影作品">
                        <input type="file" class="photo-upload" accept="image/*" style="display: none;">
                    `;
                    photoGrid.appendChild(photoItem);
                }
                
                // 更新网格布局类
                photoGrid.className = `photo-grid count-${count}`;
                
                // 为新添加的图片添加上传功能
                const newPhotoItems = document.querySelectorAll('.photo-item');
                newPhotoItems.forEach(item => {
                    const photoUpload = item.querySelector('.photo-upload');
                    const photoImg = item.querySelector('img');
                    
                    photoUpload.addEventListener('change', function(e) {
                        const file = e.target.files[0];
                        if (file) {
                            const reader = new FileReader();
                            reader.onload = function(e) {
                                photoImg.src = e.target.result;
                                saveData(); // 保存数据
                            };
                            reader.readAsDataURL(file);
                        }
                    });
                });
                
                saveData(); // 保存数据
            });
        }
        
        // 博客删除功能
        function addPostDeleteFunctionality() {
            const deletePostBtns = document.querySelectorAll('.delete-post-btn');
            deletePostBtns.forEach(btn => {
                btn.addEventListener('click', function() {
                    if (confirm('确定要删除这篇博客吗？')) {
                        this.parentElement.remove();
                        saveData(); // 保存数据
                    }
                });
            });
        }
        
        // 日记删除功能
        function addDiaryDeleteFunctionality() {
            const deleteDiaryBtns = document.querySelectorAll('.delete-diary-btn');
            deleteDiaryBtns.forEach(btn => {
                btn.addEventListener('click', function() {
                    if (confirm('确定要删除这篇日记吗？')) {
                        this.parentElement.remove();
                        saveData(); // 保存数据
                    }
                });
            });
        }
        
        // 初始化删除功能
        addPostDeleteFunctionality();
        addDiaryDeleteFunctionality();
        
        // 博客编辑功能
        if (addBlogBtn) {
            addBlogBtn.addEventListener('click', function() {
                blogEditor.style.display = 'block';
            });
            
            cancelBtn.addEventListener('click', function() {
                blogEditor.style.display = 'none';
                blogTitle.value = '';
                blogContent.value = '';
            });
            
            publishBtn.addEventListener('click', function() {
                const title = blogTitle.value;
                const content = blogContent.value;
                
                if (title && content) {
                    // 创建新的博客文章
                    const newPost = document.createElement('div');
                    newPost.className = 'post';
                    newPost.innerHTML = `
                        <h3 contenteditable="false">${title}</h3>
                        <p contenteditable="false">${content}</p>
                        <button class="delete-post-btn" style="display: inline-block;">删除</button>
                    `;
                    
                    // 添加到博客列表
                    blogPosts.appendChild(newPost);
                    
                    // 为新添加的博客添加删除功能
                    addPostDeleteFunctionality();
                    
                    // 隐藏编辑器并清空表单
                    blogEditor.style.display = 'none';
                    blogTitle.value = '';
                    blogContent.value = '';
                    
                    saveData(); // 保存数据
                    alert('博客发布成功！');
                } else {
                    alert('请填写完整的博客信息！');
                }
            });
        }
        
        // 日记编辑功能
        if (addDiaryBtn) {
            addDiaryBtn.addEventListener('click', function() {
                diaryEditor.style.display = 'block';
            });
            
            cancelDiaryBtn.addEventListener('click', function() {
                diaryEditor.style.display = 'none';
                diaryContent.value = '';
            });
            
            saveDiaryBtn.addEventListener('click', function() {
                const content = diaryContent.value;
                
                if (content) {
                    // 创建新的日记条目
                    const newDiaryItem = document.createElement('div');
                    newDiaryItem.className = 'diary-item';
                    newDiaryItem.innerHTML = `
                        <p contenteditable="false">${content}</p>
                        <button class="delete-diary-btn" style="display: inline-block;">删除</button>
                    `;
                    
                    // 添加到日记列表
                    diaryEntry.appendChild(newDiaryItem);
                    
                    // 为新添加的日记添加删除功能
                    addDiaryDeleteFunctionality();
                    
                    // 隐藏编辑器并清空表单
                    diaryEditor.style.display = 'none';
                    diaryContent.value = '';
                    
                    saveData(); // 保存数据
                    alert('日记保存成功！');
                } else {
                    alert('请填写日记内容！');
                }
            });
        }
        
        // 点击背景更换功能
        noiseBackground.addEventListener('click', function() {
            // 弹出选择对话框
            const choice = confirm('是否从本地图库选择背景图片？点击确定从本地选择，点击取消输入颜色或URL。');
            if (choice) {
                // 触发文件输入
                backgroundUpload.click();
            } else {
                const newBackground = prompt('请输入新的背景颜色（如 #f0f0f0）或背景图片URL：');
                if (newBackground) {
                    if (newBackground.startsWith('http')) {
                        // 如果是URL，设置为背景图片
                        noiseBackground.style.backgroundImage = `url(${newBackground})`;
                        noiseBackground.style.backgroundSize = 'cover';
                        noiseBackground.style.backgroundPosition = 'center';
                        noiseBackground.style.backgroundColor = 'transparent';
                    } else {
                        // 如果是颜色，设置为背景颜色
                        noiseBackground.style.backgroundColor = newBackground;
                        noiseBackground.style.backgroundImage = 'none';
                    }
                    saveData(); // 保存数据
                }
            }
        });
        
        // 处理背景图片上传
        backgroundUpload.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    noiseBackground.style.backgroundImage = `url(${e.target.result})`;
                    noiseBackground.style.backgroundSize = 'cover';
                    noiseBackground.style.backgroundPosition = 'center';
                    noiseBackground.style.backgroundColor = 'transparent';
                    saveData(); // 保存数据
                };
                reader.readAsDataURL(file);
            }
        });
        
        // 点击页面其他位置保存编辑
        document.addEventListener('click', function(e) {
            if (!allContent.contains(e.target) && e.target !== noiseBackground) {
                editableElements.forEach(element => {
                    element.contentEditable = 'false';
                });
                saveData(); // 保存数据
            }
        });
    }
}

// 管理员登录功能
function addAdminLogin() {
    // 按Ctrl+Shift+Z组合键打开管理员登录
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.shiftKey && e.key === 'Z') {
            // 阻止浏览器默认行为
            e.preventDefault();
            e.stopPropagation();
            
            const password = prompt('请输入管理员密码：');
            if (password === 'admin123') {
                localStorage.setItem('isCreator', 'true');
                alert('登录成功！你现在可以编辑header内容了。');
                // 重新初始化编辑功能
                addEditFunctionality();
            } else if (password !== null) {
                alert('密码错误！');
            }
        }
    });
}

// 初始化
function init() {
    generateCalendar();
    handleFormSubmit();
    addCardHoverEffects();
    addAdminLogin();
    loadData(); // 加载保存的数据
    addEditFunctionality();
}

// 页面加载完成后初始化
window.addEventListener('load', init);