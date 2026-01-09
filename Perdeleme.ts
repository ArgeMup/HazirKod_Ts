export class Perde {
    private static element: HTMLDivElement | null = null;
    private static bar: HTMLDivElement | null = null;
    private static mesajEl: HTMLDivElement | null = null;

    private static StilEkle() {
        if (document.getElementById("perde-stil")) return;
        const style = document.createElement("style");
        style.id = "perde-stil";
        style.innerHTML = `
            .perde-container {
                position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                background: rgba(255, 255, 255, 0.7); backdrop-filter: blur(3px);
                display: none; flex-direction: column; justify-content: center;
                align-items: center; z-index: 999999; font-family: 'Segoe UI', Tahoma, sans-serif;
            }
            .progress-box {
                width: 60%; max-width: 400px; height: 12px;
                background: #eee; border-radius: 6px; overflow: hidden;
                border: 1px solid #ddd; margin-top: 20px;
            }
            .progress-fill {
                width: 0%; height: 100%;
                background: linear-gradient(90deg, #3498db, #2ecc71);
                transition: width 0.3s ease;
            }
            .mesaj-text { color: #2c3e50; font-size: 16px; font-weight: 500; }
        `;
        document.head.appendChild(style);
    }

    public static Ac(ilkMesaj: string = "İşlem yapılıyor...") {
        this.StilEkle();
        if (!this.element) {
            this.element = document.createElement("div");
            this.element.className = "perde-container";
            this.element.innerHTML = `
                <div class="mesaj-text" id="p-mesaj"></div>
                <div class="progress-box">
                    <div class="progress-fill" id="p-bar"></div>
                </div>
            `;
            document.body.appendChild(this.element);
            this.bar = this.element.querySelector("#p-bar");
            this.mesajEl = this.element.querySelector("#p-mesaj");
        }
        
        if (this.mesajEl) this.mesajEl.textContent = ilkMesaj;
        if (this.bar) this.bar.style.width = "0%";
        
        this.element.style.display = "flex";
    }

    public static Yenile(Asama:number, ToplamAsamaSayisi:number, mesaj: string = 'Bekleyiniz') {
        const yuzde = Asama / ToplamAsamaSayisi * 100; 
        if (this.bar) this.bar.style.width = `${yuzde}%`;
        if (mesaj && this.mesajEl) this.mesajEl.textContent = mesaj;
    }

    public static Kapat() {
        if (this.element) this.element.style.display = "none";
    }
}