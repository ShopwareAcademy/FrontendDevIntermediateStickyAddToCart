# FrontendDevIntermediateStickyAddToCart

This plugin is part of the **Frontend Development Intermediate** learning path of the Shopware Academy.

It demonstrates how to:

- Add a mobile-only sticky add-to-cart bar on the product detail page (PDP).
- Extend a storefront Twig template in an upgrade-safe way (`sw_extends` + block override).
- Register and implement a custom storefront JavaScript plugin and connect it via a `data-*` hook.
- Use the Shopware core helper `ViewportDetection` to implement mobile-only behavior.
- Trigger the original buy form submission (no duplicated cart logic) using `requestSubmit()` with a safe fallback.
- Implement a smooth show/hide transition with SCSS (CSS transitions) and a single JS state class (`is-visible`).

Tested for **Shopware 6.7**

## Install

Run the following commands to install the plugin:

```bash
bin/console plugin:refresh
bin/console plugin:install FrontendDevIntermediateStickyAddToCart --activate --clearCache
```

Then build the storefront and clear the cache:

```bash
bin/build-storefront.sh
bin/console cache:clear
```

## License

MIT License.

You may use this plugin in commercial and professional projects.
It is provided as an educational example and comes without warranty and without support.

## Contributing

This plugin is part of the Shopware Academy curriculum.
