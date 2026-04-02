import Plugin from 'src/plugin-system/plugin.class';
import ViewportDetection from 'src/helper/viewport-detection.helper';

export default class StickyAddToCart extends Plugin {

    static options = {
        pdpBuyFormSelector: 'form.buy-widget[data-add-to-cart="true"]',
        pdpBuyButtonSelector: 'button.btn-buy[type="submit"], button[type="submit"]',
        stickyButtonSelector: '[data-sticky-add-to-cart-button]',
    };

    // Instance variable declaration (for more readability)
    _pdpBuyForm = null;
    _stickyButton = null;
    _onScroll = null;
    _onResize = null;

    init() {
        this._pdpBuyForm = document.querySelector(this.options.pdpBuyFormSelector);
        this._stickyButton = this.el.querySelector(this.options.stickyButtonSelector);

        if (null !== this._stickyButton) {
            this._stickyButton.addEventListener('click', () => this._triggerAddToCart());
        }

        this._onScroll = () => this._syncVisibility();
        this._onResize = () => this._syncVisibility();

        // When the window is scrolled / resized, we need to sync the visibility again.
        window.addEventListener('scroll', this._onScroll, {passive: true});
        window.addEventListener('resize', this._onResize, {passive: true});

        // Initial state
        this._syncVisibility();
    }

    update() {
        this._pdpBuyForm = document.querySelector(this.options.pdpBuyFormSelector);
        this._syncVisibility();
    }

    _isMobileViewport() {
        return true === ViewportDetection.isXS() || true === ViewportDetection.isSM();
    }

    _syncVisibility() {
        // Re-query to avoid stale references after DOM updates.
        this._pdpBuyForm = document.querySelector(this.options.pdpBuyFormSelector);

        if (null === this._pdpBuyForm) {
            this.el.classList.remove('is-visible');
            return;
        }

        const rect = this._pdpBuyForm.getBoundingClientRect();
        const isBuyFormOutOfView = rect.bottom <= 0;

        const isMobile = this._isMobileViewport();

        // Show only on mobile AND only after the original buy form scrolled out.
        if (true === isMobile && true === isBuyFormOutOfView) {
            this.el.classList.add('is-visible');
        } else {
            this.el.classList.remove('is-visible');
        }
    }

    _triggerAddToCart() {
        if (null === this._pdpBuyForm) {
            return;
        }

        const pdpBuyButton = this._pdpBuyForm.querySelector(this.options.pdpBuyButtonSelector);
        if (null === pdpBuyButton || true === pdpBuyButton.disabled) {
            return;
        }

        if (typeof this._pdpBuyForm.requestSubmit === 'function') {
            try {
                this._pdpBuyForm.requestSubmit(pdpBuyButton);
                return;
            } catch (_e) {
                /*
                   The requestSubmit() can fail in edge cases (e.g., invalid DOM state).
                   In real projects, you could:
                    - In Dev/Debug: Log the error (e.g., console.error(_e)) to understand why it failed.
                    - In Prod: Send it to your monitoring tool.

                   We intentionally ignore it here because the fallback below guarantees the action.
                 */
            }
        }

        pdpBuyButton.click();
    }
}
