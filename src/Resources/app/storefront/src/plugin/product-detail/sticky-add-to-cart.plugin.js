import Plugin from 'src/plugin-system/plugin.class';
import ViewportDetection from 'src/helper/viewport-detection.helper';

export default class StickyAddToCart extends Plugin {

    static options = {
        buyFormSelector: 'form.buy-widget[data-add-to-cart="true"]',
        stickyButtonSelector: 'button',
        buyButtonSelector: '.btn-buy[type="submit"]',
    };

    // Instance variable declaration (for more readability)
    _buyForm = null;
    _stickyButton = null;
    _onScroll = null;
    _onResize = null;

    init() {
        this._buyForm = document.querySelector(this.options.buyFormSelector);
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
        this._buyForm = document.querySelector(this.options.buyFormSelector);
        this._syncVisibility();
    }

    _isMobileViewport() {
        return true === ViewportDetection.isXS() || true === ViewportDetection.isSM();
    }

    _syncVisibility() {
        // Re-query to avoid stale references after DOM updates.
        this._buyForm = document.querySelector(this.options.buyFormSelector);

        if (null === this._buyForm) {
            this.el.classList.remove('is-visible');
            return;
        }

        const rect = this._buyForm.getBoundingClientRect();
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
        if (null === this._buyForm) {
            return;
        }

        const buyButton = this._buyForm.querySelector(this.options.buyButtonSelector);
        if (null === buyButton || true === buyButton.disabled) {
            return;
        }

        if (typeof this._buyForm.requestSubmit === 'function') {
            try {
                this._buyForm.requestSubmit(buyButton);
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

        buyButton.click();
    }
}
