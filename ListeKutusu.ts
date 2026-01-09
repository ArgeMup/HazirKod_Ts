import { Perde } from "./Perdeleme";

export enum IslemTipi_ {
    Sec_Oncesinde = 1,                  //Mevcut Öge,   YeniSecimSonucu
    Sec_Sonrasinda = 2,                 //Mevcut Öge,   YeniSecimSonucu
    Ekle_Oncesinde = 3,                 //null,         yeniOgeAdi
    Ekle_Sonrasinda = 4,                //yeniOge,      yeniOgeAdi
    AdiniDegistir_Oncesinde = 5,        //Mevcut Öge,   yeniOgeAdi
    AdiniDegistir_Sonrasinda = 6,       //Mevcut Öge,   yeniOgeAdi
    GosterGizle_Oncesinde = 7,          //Mevcut Öge,   YeniGorunum 
    GosterGizle_Sonrasinda = 8,         //Mevcut Öge,   YeniGorunum 
    Sil_Oncesinde = 9,                  //Mevcut Öge
    Sil_Sonrasinda = 10,                //Mevcut Öge

    //Kullanan nesnenin urettigi olay
    Kaydet = 15                         //Mevcut Öge
}

export interface IListeOgesi_ {
    Ad: string;
    Gizli?: boolean;
    Sabit?: boolean;
    __Golgesi__?: string;

    //Firma
    tar_ab?: Date;
}

interface IListeKutusuPrm {
    Eklenebilir: boolean;
    Degistirilebilir: boolean;
    Silinebilir: boolean;
    GizliOlanlariGoster: boolean;
    BircokElemanSecilebilir: boolean;
    DegisiklikKontroluYapilacakEleman: HTMLElement | Document;
}

export class ListeKutusu_ {
    private liste: IListeOgesi_[] = [];
    private seciliOgeAdlari: Set<string> = new Set();
    private prm: IListeKutusuPrm;

    // UI Elemanları
    private listeDiv!: HTMLDivElement;
    private aramaInput!: HTMLInputElement;
    private yeniElemanInput!: HTMLInputElement;
    private ekleButton!: HTMLButtonElement;
    private degistirButton!: HTMLButtonElement;
    private silButton!: HTMLButtonElement;
    private gizleGosterButton!: HTMLButtonElement;

    constructor(
        private Hedef: HTMLElement,
        private GeriBildirimIslemi: (IslemTipi: IslemTipi_, Oge: IListeOgesi_, Nesne: any) => Promise<boolean | void>,
        Elemanlar: IListeOgesi_[] | null = null,
        Eklenebilir: boolean = false,
        Degistirilebilir: boolean = false,
        Silinebilir: boolean = false,
        GizliOlanlariGoster: boolean = false,
        BircokElemanSecilebilir: boolean = false,
        DegisiklikKontroluYapilacakEleman: HTMLElement | Document | null = null
    ) {
        if (!GeriBildirimIslemi) throw new Error("GeriBildirimIslemi == null");

        this.prm = {
            Eklenebilir,
            Degistirilebilir,
            Silinebilir,
            GizliOlanlariGoster,
            BircokElemanSecilebilir,
            DegisiklikKontroluYapilacakEleman: DegisiklikKontroluYapilacakEleman || document
        };

        this.InitUI();
        this.Guncelle(Elemanlar, Eklenebilir, Degistirilebilir, Silinebilir, GizliOlanlariGoster, BircokElemanSecilebilir, DegisiklikKontroluYapilacakEleman);
    }

    private InitUI(): void {
        const listeKutusuDiv = document.createElement("div");
        listeKutusuDiv.className = "liste-kutusu";

        // Üst Kısım (Arama ve Göster/Gizle)
        const ustDiv = document.createElement("div");
        ustDiv.className = "yeni-eleman-girisi";

        this.aramaInput = document.createElement("input");
        this.aramaInput.type = "text";
        this.aramaInput.className = "arama-cubugu";
        this.aramaInput.placeholder = "Ara...";
        this.aramaInput.oninput = () => this.listeYenile();

        this.gizleGosterButton = document.createElement("button");
        this.gizleGosterButton.textContent = "Göster / Gizle";
        this.gizleGosterButton.onclick = () => this.gizleGoster();

        ustDiv.append(this.aramaInput, this.gizleGosterButton);

        // Liste Alanı
        this.listeDiv = document.createElement("div");
        this.listeDiv.className = "liste";

        // Alt Kısım (Yeni Ekleme ve İşlemler)
        const altDiv = document.createElement("div");
        altDiv.className = "yeni-eleman-girisi";

        this.yeniElemanInput = document.createElement("input");
        this.yeniElemanInput.type = "text";
        this.yeniElemanInput.className = "arama-cubugu";
        this.yeniElemanInput.placeholder = "Yeni öğe adı";
        this.yeniElemanInput.oninput = () => this.TuslariDuzenle();

        this.ekleButton = document.createElement("button");
        this.ekleButton.textContent = "Ekle";
        this.ekleButton.onclick = () => this.ekle();

        this.degistirButton = document.createElement("button");
        this.degistirButton.textContent = "Değiştir";
        this.degistirButton.onclick = () => this.adiDegistir();

        this.silButton = document.createElement("button");
        this.silButton.textContent = "Sil";
        this.silButton.onclick = () => this.sil();

        altDiv.append(this.yeniElemanInput, this.ekleButton, this.degistirButton, this.silButton);
        listeKutusuDiv.append(ustDiv, this.listeDiv, altDiv);
        this.Hedef.appendChild(listeKutusuDiv);
    }

    private checkChanges(): boolean {
        if (this.prm.DegisiklikKontroluYapilacakEleman instanceof HTMLElement || this.prm.DegisiklikKontroluYapilacakEleman instanceof Document) {
            if (this.prm.DegisiklikKontroluYapilacakEleman.getElementsByClassName("degisti").length > 0) {
                return confirm("Değişiklikleri kaydetmeden devam etmek istiyor musunuz?");
            }
        }
        return true;
    }

    private async secildi(oge: IListeOgesi_, ctrlKey: boolean): Promise<void> {
        if (!this.checkChanges()) return;

        this.yeniElemanInput.value = oge.Ad;

        if (this.seciliOgeAdlari.has(oge.Ad)) {
            if (await this.GeriBildirimIslemi(IslemTipi_.Sec_Oncesinde, oge, false) === false) return;
            this.seciliOgeAdlari.delete(oge.Ad);
            await this.GeriBildirimIslemi(IslemTipi_.Sec_Sonrasinda, oge, false);
        } else {
            if (await this.GeriBildirimIslemi(IslemTipi_.Sec_Oncesinde, oge, true) === false) return;
            if (!ctrlKey || !this.prm.BircokElemanSecilebilir) {
                this.seciliOgeAdlari.clear();
            }
            this.seciliOgeAdlari.add(oge.Ad);
            await this.GeriBildirimIslemi(IslemTipi_.Sec_Sonrasinda, oge, true);
        }

        this.listeYenile(false);
    }

    private listeYenile(sirala: boolean = false): void {
        if (sirala) this.liste.sort((a, b) => a.Ad?.localeCompare(b.Ad));

        const aramaMetni = this.aramaInput.value.trim().toLowerCase();
        const arananKelimeler = aramaMetni.split(/\s+/);
        
        const filtrelenmisListe = this.liste.filter(oge =>
            arananKelimeler.every(aranan => oge.Ad?.toLowerCase().includes(aranan) ?? false)
        );

        this.listeDiv.innerHTML = "";
        filtrelenmisListe.forEach((oge) => {
            const ogeDiv = document.createElement("div");
            ogeDiv.textContent = oge.Ad;
            if (oge.Gizli) ogeDiv.classList.add("Gizli");
            if (oge.Sabit) ogeDiv.classList.add("Sabit");
            if (this.seciliOgeAdlari.has(oge.Ad)) ogeDiv.classList.add("secildi");
            
            ogeDiv.onclick = (e) => this.secildi(oge, e.ctrlKey);
            this.listeDiv.appendChild(ogeDiv);
        });

        this.TuslariDuzenle();
        
        const klsyn = this.prm.DegisiklikKontroluYapilacakEleman.getElementsByClassName("degisti");
        for (let i = klsyn.length - 1; i >= 0; i--) {
            klsyn[i].classList.remove('degisti');
        }
        Perde.Kapat();
    }

    private TuslariDuzenle(): void {
        const aranan = this.yeniElemanInput.value;
        const seciliOge = this.liste.find(o => o.Ad === [...this.seciliOgeAdlari][0]);
        const varmi = this.liste.some(o => o.Ad === aranan);

        this.ekleButton.style.display = varmi || !this.prm.Eklenebilir ? "none" : "block";

        if (this.seciliOgeAdlari.size === 1 && seciliOge) {
            this.degistirButton.style.display = (this.prm.Degistirilebilir && !seciliOge.Sabit) ? "block" : "none";
            this.silButton.style.display = (this.prm.Silinebilir && !seciliOge.Sabit) ? "block" : "none";
            
            if (this.prm.Degistirilebilir && this.prm.GizliOlanlariGoster) {
                this.gizleGosterButton.textContent = seciliOge.Gizli ? "Göster" : "Gizle";
                this.gizleGosterButton.style.display = "block";
            } else {
                this.gizleGosterButton.style.display = "none";
            }
        } else {
            this.degistirButton.style.display = "none";
            this.silButton.style.display = "none";
            this.gizleGosterButton.style.display = "none";
        }
    }

    public async ekle(): Promise<void> {
        const yeniOgeAdi = this.yeniElemanInput.value.trim();
        if (!yeniOgeAdi) {
            (window.top as any).Uyari?.("Lütfen geçerli bir öğe adı girin.");
            return;
        }
        if (this.liste.some(o => o.Ad === yeniOgeAdi)) {
            (window.top as any).Uyari?.("Bu öğe zaten listede var.");
            return;
        }
        if (!this.checkChanges()) return;

        Perde.Ac();
        const yeniOge: IListeOgesi_ = { Ad: yeniOgeAdi };
        
        if (await this.GeriBildirimIslemi(IslemTipi_.Ekle_Oncesinde, yeniOge, yeniOgeAdi) === false) return;

        this.liste.push(yeniOge);

        await this.GeriBildirimIslemi(IslemTipi_.Ekle_Sonrasinda, yeniOge, yeniOgeAdi);

        this.yeniElemanInput.value = "";
        this.aramaInput.value = "";
        this.listeYenile(true);
    }

    public async adiDegistir(): Promise<void> {
        if (this.seciliOgeAdlari.size !== 1) {
            (window.top as any).Uyari?.("Lütfen tek bir öğe seçin.");
            return;
        }

        const oge = this.liste.find(o => o.Ad === [...this.seciliOgeAdlari][0]);
        if (!oge || oge.Sabit) {
            (window.top as any).Uyari?.("Seçilen öge üzerinde işlem yapılamamaktadır.");
            return;
        }

        if (!this.checkChanges()) return;

        const yeniOgeAdi = prompt("Yeni Ad:", oge.Ad);
        if (yeniOgeAdi && yeniOgeAdi !== oge.Ad) {
            if (confirm(`Eski Ad: ${oge.Ad}\nYeni Ad: ${yeniOgeAdi}\n\nEmin misiniz?`)) {
                Perde.Ac();
                if (await this.GeriBildirimIslemi(IslemTipi_.AdiniDegistir_Oncesinde, oge, yeniOgeAdi) === false) return;

                this.seciliOgeAdlari.clear();
                this.seciliOgeAdlari.add(yeniOgeAdi);
                oge.Ad = yeniOgeAdi;

                await this.GeriBildirimIslemi(IslemTipi_.AdiniDegistir_Sonrasinda, oge, yeniOgeAdi);
                this.listeYenile(true);
            }
        }
    }

    public async gizleGoster(): Promise<void> {
        if (this.seciliOgeAdlari.size !== 1) {
            (window.top as any).Uyari?.("Lütfen bir öğe seçin.");
            return;
        }
        if (!this.checkChanges()) return;

        const oge = this.liste.find(o => o.Ad === [...this.seciliOgeAdlari][0]);
        if (!oge) return;

        Perde.Ac();
        if (await this.GeriBildirimIslemi(IslemTipi_.GosterGizle_Oncesinde, oge, !oge.Gizli) === false) return;

        oge.Gizli = !oge.Gizli;
        await this.GeriBildirimIslemi(IslemTipi_.GosterGizle_Sonrasinda, oge, oge.Gizli);
        this.listeYenile();
    }

    public async sil(): Promise<void> {
        if (this.seciliOgeAdlari.size !== 1) {
            (window.top as any).Uyari?.("Lütfen tek bir öğe seçin.");
            return;
        }

        const oge = this.liste.find(o => o.Ad === [...this.seciliOgeAdlari][0]);
        if (!oge || oge.Sabit) {
            (window.top as any).Uyari?.("Seçilen öge üzerinde işlem yapılamamaktadır.");
            return;
        }

        if (!this.checkChanges()) return;

        if (confirm("Seçili öğeyi silmek istediğinizden emin misiniz?")) {
            Perde.Ac();
            if (await this.GeriBildirimIslemi(IslemTipi_.Sil_Oncesinde, oge, null) === false) return;

            const index = this.liste.findIndex(l => l.Ad === oge.Ad);
            this.liste.splice(index, 1);
            this.seciliOgeAdlari.clear();

            await this.GeriBildirimIslemi(IslemTipi_.Sil_Sonrasinda, oge, null);
            this.listeYenile();
            await this.GeriBildirimIslemi(IslemTipi_.Sec_Sonrasinda, oge, false);
        }
    }

    public Odaklan(Arama_0_Liste_1_Yeni_2: number): void {
        switch (Arama_0_Liste_1_Yeni_2) {
            case 0: this.aramaInput.focus(); break;
            case 1: this.listeDiv.focus(); break;
            case 2: this.yeniElemanInput.focus(); break;
        }
    }

    public Guncelle(
        Elemanlar: IListeOgesi_[] | null = null,
        Eklenebilir: boolean = false,
        Degistirilebilir: boolean = false,
        Silinebilir: boolean = false,
        GizliOlanlariGoster: boolean = false,
        BircokElemanSecilebilir: boolean = false,
        DegisiklikKontroluYapilacakEleman: HTMLElement | Document | null = null
    ): void {
        Perde.Ac();
        this.prm.Eklenebilir = Eklenebilir;
        this.prm.Degistirilebilir = Degistirilebilir;
        this.prm.Silinebilir = Silinebilir;
        this.prm.GizliOlanlariGoster = GizliOlanlariGoster;
        this.prm.BircokElemanSecilebilir = BircokElemanSecilebilir;
        this.prm.DegisiklikKontroluYapilacakEleman = DegisiklikKontroluYapilacakEleman || document;

        const hamListe = Elemanlar || [];
        this.liste = this.prm.GizliOlanlariGoster ? hamListe : hamListe.filter(o => !o.Gizli);
        this.yeniElemanInput.style.display = Eklenebilir ? "" : "none";
        this.seciliOgeAdlari = new Set();
        this.listeYenile(true);
    }

    // Getters
    public get TumElemanlar(): IListeOgesi_[] { return this.liste; }
    public get SecilenEleman(): IListeOgesi_ | null {
        return this.seciliOgeAdlari.size === 1 ? this.liste.find(o => o.Ad === [...this.seciliOgeAdlari][0]) || null : null;
    }
    public get SecilenEleman_Sayisi(): number { return this.seciliOgeAdlari.size; }
    public get SecilenEleman_Adi(): string | null {
        return this.seciliOgeAdlari.size === 1 ? [...this.seciliOgeAdlari][0] : null;
    }
    public get SecilenElemanlar(): IListeOgesi_[] {
        return Array.from(this.seciliOgeAdlari).map(ad => this.liste.find(o => o.Ad === ad)!).filter(Boolean);
    }
    public get AramaCubuguIcerigi(): string { return this.aramaInput.value; }

    public Tazele(): void { this.listeYenile(true); }
}