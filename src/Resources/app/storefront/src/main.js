const PluginManager = window.PluginManager;

PluginManager.register(
    'StickyAddToCart',
    () => import('./plugin/product-detail/sticky-add-to-cart.plugin'),
    '[data-sticky-add-to-cart]'
);
