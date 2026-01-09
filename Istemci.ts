import { Yazi } from './Yazi'
import { BaytDizisi } from './BaytDizisi'

export class Istemci {
    public static async GonderAl(
        Metod: "GET" | "POST" | "PUT" | "DELETE" | "PATCH",
        Adres: string,
        JsonVeyaForm: any = null,
        Firma: string | null = null
    ): Promise<[boolean, any?]> {
        const encodedUrl = Adres.split('/').map(encodeURIComponent).join('/');

        const headers: Record<string, string> = {
            'pi': await this.Parmak_izi()
        };

        const options: RequestInit = {
            headers,
            credentials: 'include',
            method: Metod,
            cache: 'no-store'
        };

        if (Metod !== "GET" && JsonVeyaForm !== null) {
            if (JsonVeyaForm instanceof FormData) {
                options.body = JsonVeyaForm;
            } else {
                headers['Content-Type'] = 'application/json';
                this.Temizle(JsonVeyaForm);
                options.body = JSON.stringify(JsonVeyaForm);
            }
        }

        if (Firma !== null) headers['Firma'] = Firma;

        // Retry mantığı (3 deneme)
        for (let i = 0; i < 3; i++) {
            try {
                const response = await fetch(encodedUrl, options);
                let jsn: any = null;
                const r_ok = response.ok;

                if (r_ok) {
                    const contentType = response.headers.get("content-type");
                    if (contentType) {
                        if (contentType.includes("application/json")) {
                            jsn = await response.json();
                        } else {
                            const textData = await response.text();
                            jsn = { __Gelen__: textData };
                        }
                    }
                }

                // Header kontrolleri
                const win = (window.top as any);
                const ynlr = response.headers.get("Yonlendir");
                if (ynlr) win.location.href = ynlr;

                let blg = response.headers.get("Bilgi");
                if (blg) {
                    let mesaj = decodeURIComponent(blg);
                    if (!r_ok) mesaj += "\nİşlem tamamlanamadı, tekrar deneyiniz";

                    if (typeof win.Uyari === "function") {
                        win.Uyari(mesaj, !r_ok);
                    } else {
                        alert(mesaj);
                    }
                }

                return [r_ok, jsn];

            } catch (error) {
                console.error(`Deneme ${i + 1} başarısız:`, error);
            }

            await new Promise(resolve => setTimeout(resolve, 1000));
        }

        alert("İşlem tamamlanamadı, tekrar deneyiniz");
        return [false];
    }

    private static Temizle(jsn: any): void {
        if (jsn !== null && typeof jsn === 'object') {
            for (const key in jsn) {
                if (Object.prototype.hasOwnProperty.call(jsn, key)) {
                    if (/^__.*__$/.test(key)) {
                        delete jsn[key];
                    } else {
                        this.Temizle(jsn[key]);
                    }
                }
            }
        }
    }

    private static _Parmak_izi: string = "";
    private static async Parmak_izi(): Promise<string> {
        if (this._Parmak_izi.length > 5) return this._Parmak_izi;

        let cikti: string = `${window.screen.width}x${window.screen.height} ` +
            `${screen.availWidth}x${screen.availHeight} ` +
            `${screen.colorDepth} ` +
            `${(screen as any).deviceXDPI}x${(screen as any).deviceYDPI}`;

        cikti += ` ${Intl.DateTimeFormat().resolvedOptions().timeZone} ${navigator.language}`;

        // Canvas çizimi ile cihazın render kapasitesini ölç (Fingerprinting)
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error();

        // Arka plan çizimleri
        ctx.fillStyle = "#555555";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#E30A17";
        ctx.fillRect(10, 10, canvas.width - 20, canvas.height - 20);

        // Ay (Beyaz daire)
        ctx.beginPath();
        ctx.arc(125, 100, 80, 0, Math.PI * 2);
        ctx.fillStyle = "white";
        ctx.fill();
        ctx.closePath();

        // İç kırmızı daire
        ctx.beginPath();
        ctx.arc(155, 100, 60, 0, Math.PI * 2);
        ctx.fillStyle = "#E30A17";
        ctx.fill();
        ctx.closePath();

        // Yıldız Çizim Fonksiyonu
        const Yildiz = (cx: number, cy: number, spikes: number, outerRadius: number, innerRadius: number): void => {
            let rot = (Math.PI / 2) * 3;
            let x = cx;
            let y = cy;
            const step = Math.PI / spikes;

            ctx.beginPath();
            ctx.moveTo(cx, cy - outerRadius);
            for (let i = 0; i < spikes; i++) {
                x = cx + Math.cos(rot) * outerRadius;
                y = cy + Math.sin(rot) * outerRadius;
                ctx.lineTo(x, y);
                rot += step;

                x = cx + Math.cos(rot) * innerRadius;
                y = cy + Math.sin(rot) * innerRadius;
                ctx.lineTo(x, y);
                rot += step;
            }
            ctx.lineTo(cx, cy - outerRadius);
            ctx.closePath();
            ctx.fillStyle = "white";
            ctx.fill();
        };

        Yildiz(195, 100, 5, 40, 15);

        // ArGeMuP tedavitakip.com yazısı
        ctx.fillStyle = "white";
        ctx.textBaseline = "top";
        ctx.font = "15px 'Arial'";
        ctx.fillText("ArGeMuP tedavitakip.com", 5, 5);
        ctx.fillText("ArGeMuP tedavitakip.com", 41, 48);
        ctx.fillText("ArGeMuP tedavitakip.com", 77, 91);
        ctx.fillText("ArGeMuP tedavitakip.com", 113, 134);
        ctx.fillText("ArGeMuP tedavitakip.com", 150, 177);

        // Veriyi string'e çevir ve hash'le
        cikti += canvas.toDataURL();

        const c1 = Yazi.BaytDizisine(cikti);
        const c2 = await BaytDizisi.SHA256(c1);
        this._Parmak_izi = BaytDizisi.HexYaziya(c2);

        return this._Parmak_izi;
    }
}