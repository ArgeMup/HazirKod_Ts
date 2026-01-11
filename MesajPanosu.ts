type MesajPanosu_MesajTipi_ = 'Bilgi' | 'Uyari' | 'Hata';

interface MesajPanosu_Ayarlar_ {
    Mesaj: string;
    Tipi: MesajPanosu_MesajTipi_;
    Baslik?: string;
    Gorunme_msn?: number;
}

export class MesajPanosu_ {
    private UstDiv: HTMLElement;

    constructor(Sahibi: HTMLElement = document.body) {
        this.UstDiv = this.UstDiv_Olustur();
        this.Yukle_css();
        Sahibi.appendChild(this.UstDiv);
    }

    private UstDiv_Olustur(): HTMLElement {
        const UstDiv = document.createElement('div');
        UstDiv.className = 'MesajPanosu_Tutucu';
        UstDiv.setAttribute('aria-live', 'polite');
        UstDiv.setAttribute('aria-atomic', 'true');
        return UstDiv;
    }

    private Yukle_css(): void {
        if (document.getElementById('MesajPanosu_css')) return;

        const style = document.createElement('style');
        style.id = 'MesajPanosu_css';
        style.textContent = `
      .MesajPanosu_Tutucu {
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 9999;
        display: flex; 
        flex-direction: column;
        gap: 12px;
        max-width: 380px;
        width: calc(100vw - 40px);
      }

      .MesajPanosu_Detay {
        background: white;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        overflow: hidden;
        animation: slideIn 0.3s ease-out;
        transform-origin: bottom right;
      }

      @keyframes slideIn {
        from {
          transform: translateX(120%) translateY(20px) scale(0.9);
          opacity: 0;
        }
        to {
          transform: translateX(0) translateY(0) scale(1);
          opacity: 1;
        }
      }

      @keyframes slideOut {
        from {
          transform: translateX(0) translateY(0) scale(1);
          opacity: 1;
        }
        to {
          transform: translateX(120%) translateY(20px) scale(0.9);
          opacity: 0;
        }
      }

      .MesajPanosu_Detay.removing {
        animation: slideOut 0.3s ease-in forwards;
      }

      .MesajPanosu_Baslik {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 12px 16px;
        border-bottom: 1px solid rgba(0, 0, 0, 0.1);
      }

      .MesajPanosu_Baslik_Icerik {
        display: flex;
        align-items: center;
        gap: 10px;
        flex: 1;
      }

      .MesajPanosu_ikon {
        width: 20px;
        height: 20px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        font-size: 14px;
        flex-shrink: 0;
      }

      .MesajPanosu_Baslik_Aciklama {
        font-weight: 600;
        font-size: 15px;
        color: #212529;
        margin: 0;
      }

      .MesajPanosu_Saat {
        font-size: 12px;
        color: #6c757d;
        white-space: nowrap;
      }

      .MesajPanosu_Kapat {
        background: none;
        border: none;
        color: #6c757d;
        font-size: 20px;
        cursor: pointer;
        padding: 0;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 4px;
        transition: background-color 0.2s;
        flex-shrink: 0;
      }

      .MesajPanosu_Kapat:hover {
        background-color: rgba(0, 0, 0, 0.05);
      }

      .MesajPanosu_Iskelet {
        padding: 12px 16px;
        font-size: 14px;
        color: #495057;
        line-height: 1.5;
      }

      .MesajPanosu-Bilgi .MesajPanosu_Baslik {
        background-color: #d1e7dd;
      }

      .MesajPanosu-Bilgi .MesajPanosu_ikon {
        background-color: #198754;
        color: white;
      }

      .MesajPanosu-Uyari .MesajPanosu_Baslik {
        background-color: #fff3cd;
      }

      .MesajPanosu-Uyari .MesajPanosu_ikon {
        background-color: #ffc107;
        color: #000;
      }

      .MesajPanosu-Hata .MesajPanosu_Baslik {
        background-color: #f8d7da;
      }

      .MesajPanosu-Hata .MesajPanosu_ikon {
        background-color: #dc3545;
        color: white;
      }

      @media (max-width: 576px) {
        .MesajPanosu_Tutucu {
          bottom: 16px;
          right: 16px;
          width: calc(100vw - 32px);
          max-width: none;
        }

        .MesajPanosu_Baslik_Aciklama {
          font-size: 14px;
        }

        .MesajPanosu_Iskelet {
          font-size: 13px;
        }
      }
    `;
        document.head.appendChild(style);
    }

    private Al_ikon(Tipi: MesajPanosu_MesajTipi_): string {
        const _lar = {
            Bilgi: '✓',
            Uyari: '⚠',
            Hata: '✕'
        };
        return _lar[Tipi];
    }

    private Al_Baslik(Tipi: MesajPanosu_MesajTipi_, Baslik?: string): string {
        if (Baslik) return Baslik;

        const _lar = {
            Bilgi: 'Bilgi',
            Uyari: 'Uyarı',
            Hata: 'Hata'
        };
        return _lar[Tipi];
    }

    private Msg_Olustur(Ayarlar: MesajPanosu_Ayarlar_): HTMLElement {
        const msg_div = document.createElement('div');
        msg_div.className = `MesajPanosu_Detay MesajPanosu-${Ayarlar.Tipi}`;

        const simdi = new Date().toLocaleTimeString();
        const iko = this.Al_ikon(Ayarlar.Tipi);
        const baslik = this.Al_Baslik(Ayarlar.Tipi, Ayarlar.Baslik);

        msg_div.innerHTML = `
      <div class="MesajPanosu_Baslik">
        <div class="MesajPanosu_Baslik_Icerik">
          <div class="MesajPanosu_ikon">${iko}</div>
          <strong class="MesajPanosu_Baslik_Aciklama">${baslik}</strong>
        </div>
        <small class="MesajPanosu_Saat">${simdi}</small>
        <button type="button" class="MesajPanosu_Kapat" aria-label="Kapat">×</button>
      </div>
      <div class="MesajPanosu_Iskelet">${Ayarlar.Mesaj}</div>
    `;

        const closeBtn = msg_div.querySelector('.MesajPanosu_Kapat') as HTMLElement;
        closeBtn.addEventListener('click', () => this.Msg_Sil(msg_div));

        return msg_div;
    }

    private Msg_Sil(msg_div: HTMLElement): void {
        msg_div.classList.add('removing');
        setTimeout(() => {
            if (msg_div.parentElement) {
                msg_div.remove();
            }
        }, 300);
    }

    /**Alt satira geçmek için \n*/
    public YeniMesaj(Ayarlar: MesajPanosu_Ayarlar_): void {
        if (Ayarlar.Baslik) Ayarlar.Baslik = Ayarlar.Baslik.replaceAll('\n', '<br>');
        Ayarlar.Mesaj = Ayarlar.Mesaj.replaceAll('\n', '<br>');

        const msg_div = this.Msg_Olustur(Ayarlar);
        this.UstDiv.appendChild(msg_div);

        if (Ayarlar.Tipi !== 'Hata') {
            const Gorunme_msn = Ayarlar.Gorunme_msn || 5000;
            setTimeout(() => {
                this.Msg_Sil(msg_div);
            }, Gorunme_msn);
        }
    }
}