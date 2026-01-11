interface Dialog_Ayarlar_ {
    backdrop?: boolean | 'static'; // true: tıklayınca kapanır, 'static': kapanmaz, false: backdrop yok
    keyboard?: boolean; // ESC ile kapanır mı
    focus?: boolean; // Açılınca focus alır mı
    size?: 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | 'fullscreen'; // Modal boyutu
    centered?: boolean; // Dikey ortala
}

export class Dialog_ {
    private element: HTMLElement;
    private backdrop?: HTMLElement;
    private options: Dialog_Ayarlar_;
    private isOpen = false;

    constructor(element: HTMLElement, options: Dialog_Ayarlar_ = {}) {
        this.element = element;
        
        // Varsayılan ayarlar
        this.options = {
            backdrop: true,
            keyboard: true,
            focus: true,
            size: 'md',
            centered: true,
            ...options
        };

        this.init();
    }

    private init(): void {
        // Stil ekle
        this.injectStyles();

        // Modal'a sınıf ekle
        this.element.classList.add('hazirkod-ts-dialog-stil');
        this.element.setAttribute('role', 'dialog');
        this.element.setAttribute('aria-hidden', 'true');

        // Kapat butonlarını dinle
        const closeButtons = this.element.querySelectorAll('[data-hazirkod-ts-dialog-buton-kapat="modal"]');
        closeButtons.forEach(btn => {
            btn.addEventListener('click', () => this.Gizle());
        });

        // ESC tuşu
        if (this.options.keyboard) {
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && this.isOpen) {
                    this.Gizle();
                }
            });
        }
    }

    private injectStyles(): void {
        if (document.getElementById('hazirkod-ts-dialog-stiller')) return;

        const style = document.createElement('style');
        style.id = 'hazirkod-ts-dialog-stiller';
        style.textContent = `
      .hazirkod-ts-dialog-stil {
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 1050;
        overflow-x: hidden;
        overflow-y: auto;
        outline: 0;
      }

      .hazirkod-ts-dialog-stil.show {
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .hazirkod-ts-dialog {
        position: relative;
        width: 100%;
        margin: 1.75rem;
        pointer-events: none;
      }

      /* Boyut seçenekleri */
      .hazirkod-ts-dialog.modal-sm { max-width: 300px; }
      .hazirkod-ts-dialog.modal-md { max-width: 500px; }
      .hazirkod-ts-dialog.modal-lg { max-width: 800px; }
      .hazirkod-ts-dialog.modal-xl { max-width: 1140px; }
      .hazirkod-ts-dialog.modal-xxl { max-width: 90vw; }
      .hazirkod-ts-dialog.modal-fullscreen { 
        max-width: 100%; 
        margin: 0;
        width: 100vw;
        height: 100vh;
      }

      /* Ortalama */
      .hazirkod-ts-dialog.modal-centered {
        display: flex;
        align-items: center;
        min-height: calc(100% - 3.5rem);
      }

      .hazirkod-ts-dialog-stil.show .hazirkod-ts-dialog {
        animation: modalSlideIn 0.3s ease-out;
      }

      @keyframes modalSlideIn {
        from {
          transform: translateY(-50px);
          opacity: 0;
        }
        to {
          transform: translateY(0);
          opacity: 1;
        }
      }

      @keyframes modalSlideOut {
        from {
          transform: translateY(0);
          opacity: 1;
        }
        to {
          transform: translateY(-50px);
          opacity: 0;
        }
      }

      .hazirkod-ts-dialog-icerik {
        position: relative;
        display: flex;
        flex-direction: column;
        width: 100%;
        pointer-events: auto;
        background-color: #fff;
        background-clip: padding-box;
        border: 1px solid rgba(0, 0, 0, 0.2);
        border-radius: 0.5rem;
        outline: 0;
        box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
      }

      .hazirkod-ts-dialog.modal-fullscreen .hazirkod-ts-dialog-icerik {
        height: 100%;
        border-radius: 0;
        border: none;
      }

      .hazirkod-ts-dialog-baslik {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 1rem;
        border-bottom: 1px solid #dee2e6;
        border-top-left-radius: 0.5rem;
        border-top-right-radius: 0.5rem;
      }

      .hazirkod-ts-dialog-baslik-sol {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        flex: 1;
      }

      .hazirkod-ts-dialog-ust-bilgi {
        margin: 0;
        font-size: 1.25rem;
        font-weight: 500;
        line-height: 1.5;
      }

      .hazirkod-ts-dialog-buton-kapat {
        background: none;
        border: none;
        font-size: 1.5rem;
        font-weight: 700;
        line-height: 1;
        color: #000;
        opacity: 0.5;
        cursor: pointer;
        padding: 0;
        width: 1.5rem;
        height: 1.5rem;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-left: 0.5rem;
      }

      .hazirkod-ts-dialog-buton-kapat:hover {
        opacity: 0.75;
      }

      .hazirkod-ts-dialog-alt-bilgi {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: flex-end;
        padding: 0.75rem;
        border-top: 1px solid #dee2e6;
        border-bottom-right-radius: 0.5rem;
        border-bottom-left-radius: 0.5rem;
        gap: 0.5rem;
      }

      .Dialog_Iskelet {
        position: relative;
        flex: 1 1 auto;
        padding: 1rem;
        overflow-y: auto;
      }

      .hazirkod-ts-dialog-arka-plan {
        position: fixed;
        top: 0;
        left: 0;
        z-index: 1040;
        width: 100vw;
        height: 100vh;
        background-color: rgba(128, 128, 128, 0.5);
        opacity: 0;
        transition: opacity 0.15s linear;
      }

      .hazirkod-ts-dialog-arka-plan.show {
        opacity: 1;
      }

      @media (max-width: 576px) {
        .hazirkod-ts-dialog:not(.modal-fullscreen) {
          margin: 0.5rem;
          max-width: calc(100% - 1rem);
        }
      }
    `;
        document.head.appendChild(style);
    }

    private createBackdrop(): void {
        if (!this.options.backdrop) return;

        this.backdrop = document.createElement('div');
        this.backdrop.className = 'hazirkod-ts-dialog-arka-plan';
        document.body.appendChild(this.backdrop);

        // Backdrop'a tıklama (backdrop'a tıklandığında kapatmak için)
        if (this.options.backdrop === true) {
            this.backdrop.addEventListener('click', () => this.Gizle());
        }

        // Animasyon için kısa gecikme
        setTimeout(() => {
            this.backdrop?.classList.add('show');
        }, 10);
    }

    private removeBackdrop(): void {
        if (this.backdrop) {
            this.backdrop.classList.remove('show');
            setTimeout(() => {
                this.backdrop?.remove();
                this.backdrop = undefined;
            }, 150);
        }
    }

    Goster(): void {
        if (this.isOpen) return;

        this.isOpen = true;
        this.createBackdrop();

        // Body'ye overflow hidden ekle
        document.body.style.overflow = 'hidden';

        // Dialog elementini bul ve sınıfları ekle
        const dialog = this.element.querySelector('.hazirkod-ts-dialog') as HTMLElement;
        if (dialog) {
            // Boyut sınıfı ekle
            dialog.classList.add(`modal-${this.options.size}`);

            // Ortalama sınıfı ekle
            if (this.options.centered) {
                dialog.classList.add('modal-centered');
            }
        }

        // Modal'ı göster
        this.element.style.display = 'flex';
        this.element.setAttribute('aria-hidden', 'false');
        this.element.classList.add('show');

        setTimeout(() => {
            //   this.element.classList.add('show');

            // Focus
            if (this.options.focus) {
                this.element.focus();
            }
        }, 10);

        // Modal'a tıklanınca kapatma için event (backdrop click için)
        this.element.addEventListener('click', this.handleModalClick);

        // Event dispatch
        this.element.dispatchEvent(new Event('shown.modal'));
    }

    private handleModalClick = (e: MouseEvent): void => {
        // Sadece modal'ın kendisine tıklandıysa kapat (içerik değil)
        if (this.options.backdrop === true && e.target === this.element) {
            this.Gizle();
        }
    };

    Gizle(): void {
        if (!this.isOpen) return;

        this.element.classList.remove('show');

        // Event listener'ı kaldır
        this.element.removeEventListener('click', this.handleModalClick);

        this.element.style.display = 'none';
        this.element.setAttribute('aria-hidden', 'true');

        // Body overflow'u geri al
        document.body.style.overflow = '';

        this.removeBackdrop();
        this.isOpen = false;

        // Event dispatch
        this.element.dispatchEvent(new Event('hidden.modal'));
    }

    YokEt(): void {
        this.Gizle();
        this.element.remove();
        if (this.backdrop) {
            this.backdrop.remove();
        }
    }

    GorunuyorMu(): boolean {
        return this.isOpen;
    }
}

/* 
KULLANIM ÖRNEKLERİ:

// HTML Yapısı:
<div id="Dialog">
    <div class="hazirkod-ts-dialog">
        <div class="hazirkod-ts-dialog-icerik">
            <div class="hazirkod-ts-dialog-baslik">
                <div class="hazirkod-ts-dialog-baslik-sol">
                    <h5 id="Dialog_Baslik" class="hazirkod-ts-dialog-ust-bilgi">Dialog başlığını buraya yaz</h5>
                </div>
                <button class="hazirkod-ts-dialog-buton-kapat" data-hazirkod-ts-dialog-buton-kapat="modal">×</button>
            </div>

            <iframe id="Dialog_IFrame" style="height: 80vh; border: none;" src="/Syf/Kullanici/Kullanici.html"></iframe>
            veya
            <div class="Dialog_Iskelet">
                <p>Modal içeriği buraya gelir...</p>
            </div>

            <div class="hazirkod-ts-dialog-alt-bilgi">
                <button data-hazirkod-ts-dialog-buton-kapat="modal">Kapat</button>
                <button>Kaydet</button>
            </div>
        </div>
    </div>
</div>

// JavaScript/TypeScript:
import { Dialog_ } from './Dialog';

const Dialog = 
    new Dialog_(Eleman.Div('Dialog'));                         // Varsayılan (orta boy, ortalı)
    new Dialog_(Eleman.Div('Dialog'), { size: 'fullscreen' }); // Tam ekran
Dialog.Goster();

// Boyut seçenekleri: 'sm', 'md', 'lg', 'xl', 'xxl', 'fullscreen'
// centered: true (dikey/yatay ortala)
*/