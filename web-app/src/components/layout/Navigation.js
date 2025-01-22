const Navigation = () => {
    let anchorElNav = null;
    let anchorElUser = null;
    
    // TODO: Replace with actual auth state
    const isAuthenticated = false;
    const isAdmin = false;

    const pages = [
        { title: 'Products', path: '/products' },
        { title: 'About', path: '/about' },
        { title: 'Contact', path: '/contact' }
    ];

    const userMenuItems = isAuthenticated
        ? [
            { title: 'Profile', path: '/profile' },
            { title: 'My Orders', path: '/orders' },
            { title: 'Logout', path: '/logout' }
        ]
        : [{ title: 'Login', path: '/login' }];

    if (isAdmin) {
        userMenuItems.unshift({ title: 'Dashboard', path: '/admin' });
    }

    const handleOpenNavMenu = (event) => {
        anchorElNav = event.currentTarget;
    };

    const handleOpenUserMenu = (event) => {
        anchorElUser = event.currentTarget;
    };

    const handleCloseNavMenu = () => {
        anchorElNav = null;
    };

    const handleCloseUserMenu = () => {
        anchorElUser = null;
    };

    const renderMenu = () => {
        return `
            <nav class="navbar">
                <div class="navbar-brand">
                    <a href="/" class="navbar-item">FastFood</a>
                    <button class="navbar-burger" onclick="handleOpenNavMenu(event)">
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>
                </div>

                <div class="navbar-menu ${anchorElNav ? 'is-active' : ''}">
                    <div class="navbar-start">
                        ${pages.map(page => `
                            <a href="${page.path}" class="navbar-item">${page.title}</a>
                        `).join('')}
                    </div>

                    <div class="navbar-end">
                        ${isAuthenticated ? `
                            <a href="/cart" class="navbar-item">
                                <span class="icon">
                                    <i class="fas fa-shopping-cart"></i>
                                </span>
                            </a>
                        ` : ''}
                        
                        <div class="navbar-item has-dropdown ${anchorElUser ? 'is-active' : ''}">
                            <a class="navbar-link" onclick="handleOpenUserMenu(event)">
                                <span class="icon">
                                    <i class="fas fa-user"></i>
                                </span>
                            </a>

                            <div class="navbar-dropdown">
                                ${userMenuItems.map(item => `
                                    <a href="${item.path}" class="navbar-item">${item.title}</a>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        `;
    };

    return {
        renderMenu,
        handleOpenNavMenu,
        handleOpenUserMenu,
        handleCloseNavMenu,
        handleCloseUserMenu
    };
};

export default Navigation;
